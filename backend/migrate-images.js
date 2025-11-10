const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
} else {
  console.error('❌ Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/SECRET');
  process.exit(1);
}

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI not set');
  process.exit(1);
}

// Product schema (simplified)
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function migrate() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    console.log('📁 Database in use:', mongoose.connection.name);

    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.error(`❌ Uploads directory not found: ${uploadsDir}`);
      process.exit(1);
    }

    console.log('📦 Fetching products...');
    const products = await Product.find({}).exec();
    console.log(`📦 Found ${products.length} products`);

    const results = [];
    let totalMigrated = 0;

    for (const product of products) {
      const raw = typeof product.images === 'string' ? product.images : '';
      if (!raw) {
        results.push({ id: String(product._id), updated: false, count: 0, errors: 0 });
        continue;
      }

      const names = raw.split(',').map(s => s.trim()).filter(Boolean);
      if (names.length === 0) {
        results.push({ id: String(product._id), updated: false, count: 0, errors: 0 });
        continue;
      }

      const newUrls = [];
      let errors = 0;

      for (const name of names) {
        // Skip if already a Cloudinary URL
        if (/^https?:\/\/res\.cloudinary\.com/i.test(name)) {
          newUrls.push(name);
          continue;
        }

        // Extract filename from localhost URL or plain filename
        let filename = name;
        if (name.includes('localhost:3002/uploads/') || name.includes('127.0.0.1:3002/uploads/')) {
          filename = name.split('/uploads/')[1];
        } else if (name.startsWith('/uploads/')) {
          filename = name.replace(/^\/+uploads\/+/, '');
        } else if (name.includes('uploads/')) {
          filename = name.split('uploads/')[1];
        } else if (/^https?:\/\//i.test(name)) {
          // Skip other http URLs (like external images)
          newUrls.push(name);
          continue;
        }

        const filePath = path.join(uploadsDir, filename);

        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  File not found: ${filename}`);
          errors++;
          continue;
        }

        try {
          console.log(`📤 Uploading ${filename} to Cloudinary...`);
          const uploaded = await cloudinary.uploader.upload(filePath, {
            folder: 'ibnsina/products',
            use_filename: true,
            unique_filename: true,
            resource_type: 'image',
          });

          if (uploaded?.secure_url) {
            newUrls.push(uploaded.secure_url);
            totalMigrated++;
            console.log(`✅ Uploaded: ${uploaded.secure_url}`);
          } else {
            errors++;
          }
        } catch (err) {
          console.error(`❌ Error uploading ${filename}:`, err.message);
          errors++;
        }
      }

      // Update product if we have new URLs
      if (newUrls.length > 0 && newUrls.join(',') !== raw) {
        const nextImages = newUrls.join(',');
        await Product.updateOne({ _id: product._id }, { images: nextImages });
        const verify = await Product.findById(product._id).lean();
        results.push({ id: String(product._id), updated: true, count: newUrls.length, errors, savedImages: verify?.images });
        console.log(`✅ Updated product ${product._id} with ${newUrls.length} image(s)`);
        console.log(`   ↪ Saved images: ${verify?.images}`);
      } else {
        results.push({ id: String(product._id), updated: false, count: newUrls.length, errors });
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`Total products processed: ${results.length}`);
    console.log(`Total images migrated: ${totalMigrated}`);
    const updated = results.filter(r => r.updated).length;
    console.log(`Products updated: ${updated}`);
    console.log(`Products unchanged: ${results.length - updated}`);

    await mongoose.disconnect();
    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrate();

