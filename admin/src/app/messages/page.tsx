'use client';

import { useEffect, useState } from 'react';

type Message = {
  _id: string;
  name: string;
  email?: string;
  subject?: string;
  message: string;
  read?: boolean;
  createdAt?: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/messages`, { cache: 'no-store' });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Failed to load messages');
      }
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      setError(err?.message || 'Could not load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id: string, read: boolean) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/messages/${id}/read/${!read}`, { method: 'PATCH' });
      if (!res.ok) return;
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: !read } : m)));
    } catch {}
  };

  const deleteMessage = async (id: string) => {
    const confirmDelete = window.confirm('Delete this message? This cannot be undone.');
    if (!confirmDelete) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Failed to delete message');
      }
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      // Optionally surface error
    }
  };

  const openModal = (m: Message) => {
    setModalMessage(m);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <button onClick={fetchMessages} className="text-sm px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">Refresh</button>
      </div>
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">When</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {messages.map((m) => (
                  <tr key={m._id} className={m.read ? 'bg-white' : 'bg-green-50'}>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{m.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.email || ''}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{m.subject || ''}</td>
                    <td className="px-2 py-1 text-sm text-gray-700 align-top">
                      <div className="flex items-center gap-2">
                        {(m.message?.length ?? 0) > 160 ? (
                          <>
                            <span className="truncate inline-block max-w-[20rem]">{m.message}</span>
                            <button
                              onClick={() => openModal(m)}
                              className="text-xs text-green-700 hover:underline flex-shrink-0"
                            >
                              View
                            </button>
                          </>
                        ) : (
                          <span className="truncate inline-block max-w-[20rem]">{m.message}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right align-top">
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => toggleRead(m._id, !!m.read)}
                          className={`text-xs px-3 py-1 rounded ${m.read ? 'bg-gray-100 hover:bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                          {m.read ? 'Mark unread' : 'Mark read'}
                        </button>
                        <button
                          onClick={() => deleteMessage(m._id)}
                          className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {messages.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No messages yet.</div>
          ) : null}
        </div>
      )}
      {/* Modal */}
      {modalOpen && modalMessage ? (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/30" onClick={closeModal} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Message from {modalMessage.name}</h3>
                <button onClick={closeModal} className="text-gray-500 text-black">✕</button>
              </div>
              <div className="px-4 py-4 space-y-2 text-sm text-black">
                <div><span className="font-medium text-black">Email:</span> {modalMessage.email || '-'}</div>
                <div><span className="font-medium text-black">Subject:</span> {modalMessage.subject || '-'}</div>
                <div><span className="font-medium text-black">When:</span> {modalMessage.createdAt ? new Date(modalMessage.createdAt).toLocaleString() : ''}</div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded max-h-64 overflow-auto whitespace-pre-wrap break-words text-black">
                    {modalMessage.message}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-200 flex justify-end text-white ">
                <button onClick={closeModal} className="px-4 py-2 text-sm rounded bg-gray-100 bg-red-700">Close</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


