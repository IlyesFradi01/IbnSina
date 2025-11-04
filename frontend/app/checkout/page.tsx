'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
};

type ShippingMethod = 'aramex';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState('');
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [country, setCountry] = useState('Tunisia');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [saveForNextTime, setSaveForNextTime] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('aramex');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  // Optional separate billing fields (rendered when not same as shipping)
  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingApartment, setBillingApartment] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingCity, setBillingCity] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {}
  }, []);

  const shippingCost = useMemo(() => {
    if (shippingMethod === 'aramex') return 8; // TND 8.000
    return 0;
  }, [shippingMethod]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  }, [items]);

  const taxes = useMemo(() => {
    // Back-of-envelope: infer a tax amount similar to provided example
    // In real app this should come from backend rates
    // Example shows 22.672 on 150 total (~15.1% on subtotal)
    return subtotal * 0.151;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + shippingCost; // example total excluded explicit tax addition in sum; tax is informative here
  }, [subtotal, shippingCost]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Minimal front-end validation
    if (!email || !lastName || !address || !city || !phone) {
      alert('Please complete the required fields.');
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const payload = {
      email,
      emailOptIn,
      shipping: { country, firstName, lastName, address, apartment, postalCode, city, phone },
      billingSameAsShipping,
      billing: billingSameAsShipping ? undefined : { firstName: billingFirstName, lastName: billingLastName, address: billingAddress, apartment: billingApartment, postalCode: billingPostalCode, city: billingCity },
      shippingMethod,
      paymentMethod: 'COD',
      items: items.map(it => ({ productId: it.id, name: it.name, price: it.price, quantity: it.quantity, image: it.image, size: it.size })),
      subtotal: Number(subtotal.toFixed(3)),
      shippingCost: Number(shippingCost.toFixed(3)),
      total: Number(total.toFixed(3)),
    };
    try {
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Failed to submit order');
      }
      const created = await res.json();
      // Clear cart on success
      localStorage.removeItem('cart');
      setItems([]);
      try { window.dispatchEvent(new Event('cartUpdated')); } catch {}
      try {
        const id = created?._id || created?.id;
        if (id) {
          router.push(`/order/${id}`);
          return;
        }
      } catch {}
      alert('Order submitted successfully. We will contact you to confirm.');
    } catch (err: any) {
      alert(err?.message || 'Could not submit order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-900">IBN SINA Checkout</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
               
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email or mobile phone number</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    placeholder="you@example.com"
                  />
                </div>
               
              </div>
            </section>

            {/* Delivery */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery</h2>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Country/Region</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900">
                    <option>Tunisia</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">First name (optional)</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Last name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Address</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" required />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                  <input value={apartment} onChange={e => setApartment(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Postal code (optional)</label>
                    <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" placeholder="TN" required />
                </div>


                {/* Shipping method */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-2">Shipping method</h3>
                  <label className="flex items-center justify-between gap-4 border border-gray-300 rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingMethod === 'aramex'} onChange={() => setShippingMethod('aramex')} />
                      <span className="text-gray-900">Delivery</span>
                    </div>
                    <span className="text-gray-900">TND 8.000</span>
                  </label>
                </div>

                {/* Payment */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-2">Payment</h3>
                  <p className="text-sm text-gray-600 mb-3">All transactions are secure and encrypted.</p>
                  <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3">
                    <input type="radio" name="payment" defaultChecked />
                    <div>
                      <div className="text-gray-900">الدفع عند التوصيل - Cash on delivery - Paiement à la livraison</div>
                      <p className="text-sm text-gray-600 mt-1">For international orders: Payment is completed via a secure link sent to your email, not in cash upon delivery.</p>
                    </div>
                  </label>
                </div>

                {/* Billing address */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Billing address</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="billing" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(true)} />
                      <span className="text-gray-900">Same as shipping address</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="billing" checked={!billingSameAsShipping} onChange={() => setBillingSameAsShipping(false)} />
                      <span className="text-gray-900">Use a different billing address</span>
                    </label>
                  </div>

                  {!billingSameAsShipping && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">First name</label>
                          <input value={billingFirstName} onChange={e => setBillingFirstName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Last name</label>
                          <input value={billingLastName} onChange={e => setBillingLastName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Address</label>
                        <input value={billingAddress} onChange={e => setBillingAddress(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                        <input value={billingApartment} onChange={e => setBillingApartment(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Postal code (optional)</label>
                          <input value={billingPostalCode} onChange={e => setBillingPostalCode(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm text-gray-700 mb-1">City</label>
                          <input value={billingCity} onChange={e => setBillingCity(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Submit</button>
              </form>
            </section>
          </div>

          {/* Right: order summary */}
          <aside className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
            {items.length === 0 ? (
              <div className="text-sm text-gray-600">Your cart is empty.</div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-black rounded overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-xl">🌿</span>}
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.size ? item.size : ''}</div>
                        <div className="text-sm text-gray-600">Quantity {item.quantity}</div>
                      </div>
                      <div className="text-gray-900">TND {(item.price * item.quantity).toFixed(3)}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900">TND {subtotal.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Shipping</span>
                    <span className="text-gray-900">TND {shippingCost.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-gray-900 pt-2">
                    <span>Total</span>
                    <span>TND {total.toFixed(3)}</span>
                  </div>
                  
                </div>

             
                
              </div>
            )}
          </aside>
        </div>

        <div className="sr-only">Opens external website in a new window.Opens in a new window.Opens external website.</div>
      </div>
    </div>
  );
}


