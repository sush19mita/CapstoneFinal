import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userApi, eventApi, bookingApi } from '../../lib/axios';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [summary, setSummary] = useState({});
    const [tab, setTab] = useState('overview');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'ADMIN') { router.push('/login'); return; }
        userApi.get('/api/users/all').then(r => setUsers(r.data));
        eventApi.get('/api/events/admin/all').then(r => setEvents(r.data));
        bookingApi.get('/api/bookings/admin/all').then(r => setBookings(r.data));
        bookingApi.get('/api/budget/admin/summary').then(r => setSummary(r.data));
    }, []);

    return (
        <div className="min-h-screen pb-10">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1 mb-6">Full platform overview</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Users', value: users.length, color: 'text-blue-700', border: 'border-blue-200' },
                            { label: 'Total Events', value: events.length, color: 'text-sky-600', border: 'border-sky-200' },
                            { label: 'Total Bookings', value: bookings.length, color: 'text-purple-600', border: 'border-purple-200' },
                            { label: 'Total Revenue', value: `₹${((summary.totalRevenue || 0) / 100000).toFixed(1)}L`, color: 'text-green-600', border: 'border-green-200' },
                        ].map(({ label, value, color, border }) => (
                            <div key={label} className={`bg-white border ${border} rounded-2xl p-5 shadow-sm`}>
                                <p className="text-sm text-gray-400 font-medium">{label}</p>
                                <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 mb-6">
                        {['overview', 'users', 'events', 'bookings'].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-6 py-2 rounded-xl font-semibold capitalize transition-all border ${
                                    tab === t
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200'
                                }`}>
                                {t}
                            </button>
                        ))}
                    </div>

                    {tab === 'users' && (
                        <div className="overflow-hidden border border-gray-100 rounded-2xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white border-b border-gray-100">
                                    <tr>
                                        {['Name', 'Email', 'Role'].map(h => (
                                            <th key={h} className="px-6 py-4 text-gray-700 font-bold">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b border-gray-50 bg-white">
                                            <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                                    u.role === 'CUSTOMER' ? 'bg-blue-100 text-blue-700' :
                                                    u.role === 'VENDOR' ? 'bg-sky-100 text-sky-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {u.role.substring(0, 4)}
                                              </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Render other tabs (overview, events, bookings) identically to previous version, just within this white container wrapper */}
                </div>
            </div>
        </div>
    );
}
