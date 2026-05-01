'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import Link from 'next/link';

export default function ItemsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [form, setForm] = useState({
        name: '', code: '', quantity: 0, serial_number: '',
        description: '', place_id: '', status: 'in-store',
    });
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        fetchItems();
        fetchPlaces();
    }, [user]);

    const fetchItems = async () => {
        try {
            const res = await api.get('/items');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaces = async () => {
        try {
            const res = await api.get('/places');
            setPlaces(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openCreate = () => {
        setEditItem(null);
        setImageFile(null);
        setForm({ name: '', code: '', quantity: 0, serial_number: '', description: '', place_id: '', status: 'in-store' });
        setError('');
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setImageFile(null);
        setForm({
            name: item.name, code: item.code, quantity: item.quantity,
            serial_number: item.serial_number || '', description: item.description || '',
            place_id: item.place_id, status: item.status,
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key] !== null && form[key] !== undefined) {
                    formData.append(key, form[key]);
                }
            });
            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (editItem) {
                formData.append('_method', 'PUT');
                await api.post(`/items/${editItem.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/items', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowModal(false);
            fetchItems();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await api.delete(`/items/${id}`);
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuantity = async (item, type) => {
        try {
            await api.patch(`/items/${item.id}/quantity`, { type, amount: 1 });
            fetchItems();
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating quantity');
        }
    };

    const filtered = items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.code.toLowerCase().includes(search.toLowerCase())
    );

    const statusColor = (status) => {
        switch (status) {
            case 'in-store': return 'bg-green-100 text-green-800';
            case 'borrowed': return 'bg-yellow-100 text-yellow-800';
            case 'damaged': return 'bg-red-100 text-red-800';
            case 'missing': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Inventory System</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.name} ({user?.role})</span>
                    <Link href="/dashboard" className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Dashboard</Link>
                </div>
            </nav>

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Items</h2>
                    <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium">
                        + Add Item
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-gray-600">Image</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Name</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Code</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Quantity</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Status</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Place</th>
                                    <th className="text-left px-4 py-3 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">No items found</td>
                                    </tr>
                                ) : (
                                    filtered.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                {item.image ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="w-10 h-10 object-cover rounded border"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                        None
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium">{item.name}</td>
                                            <td className="px-4 py-3 text-gray-500">{item.code}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantity(item, 'decrement')}
                                                        className="bg-red-100 text-red-600 w-6 h-6 rounded hover:bg-red-200 font-bold"
                                                    >-</button>
                                                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantity(item, 'increment')}
                                                        className="bg-green-100 text-green-600 w-6 h-6 rounded hover:bg-green-200 font-bold"
                                                    >+</button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {item.place?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md my-auto">
                        <h3 className="text-lg font-bold mb-4">{editItem ? 'Edit Item' : 'Add New Item'}</h3>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                                <input type="text" value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                                />
                                {editItem && editItem.image && !imageFile && (
                                    <p className="text-xs text-gray-500 mt-1">Current image kept if no new image selected</p>
                                )}
                                {imageFile && (
                                    <p className="text-xs text-green-600 mt-1">New image: {imageFile.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Place *</label>
                                <select value={form.place_id} onChange={(e) => setForm({ ...form, place_id: e.target.value })}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select place</option>
                                    {places.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.cupboard?.name})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="in-store">In Store</option>
                                    <option value="borrowed">Borrowed</option>
                                    <option value="damaged">Damaged</option>
                                    <option value="missing">Missing</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={handleSubmit}
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium">
                                {editItem ? 'Update' : 'Create'}
                            </button>
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm font-medium">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
