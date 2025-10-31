'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function CategoryViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || '');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiUrl}/categories/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load category');
        const data = await res.json();
        setCategory(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-10 bg-gray-200"></div>
            <div className="h-20 bg-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Details</h1>
            <p className="text-gray-600">View category info</p>
          </div>
        </div>
        <button onClick={() => router.push(`/categories/${id}/edit`)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <div className="text-sm text-gray-500">ID</div>
          <div className="text-gray-900">{category?._id || category?.id}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Name</div>
          <div className="text-gray-900">{category?.name}</div>
        </div>
      </div>
    </div>
  );
}
