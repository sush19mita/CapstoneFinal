import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userApi, eventApi, bookingApi } from '../../lib/axios';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [summary, setSummary] = useState({});
    const [tab, setTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'ADMIN') { router.push('/login'); return; }

        Promise.all([
            userApi.get('/api/users/all').catch(() => ({ data: [] })),
            eventApi.get('/api/events/admin/all').catch(() => ({ data: [] })),
            bookingApi.get('/api/bookings/admin/all').catch(() => ({ data: [] })),
            bookingApi.get('/api/budget/admin/summary').catch(() => ({ data: {} }))
        ]).then(([u, e, b, s]) => {
            setUsers(u.data || []);
            setEvents(e.data || []);
            setBookings(b.data || []);
            setSummary(s.data || {});
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-400 text-lg">Loading admin data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Full platform overview</p>
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        {[
                            { label: 'Total Users', value: users.length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', icon: '👥' },
                            { label: 'Total Events', value: events.length, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100', icon: '🎪' },
                            { label: 'Total Bookings', value: bookings.length, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', icon: '🎟️' },
                            { label: 'Total Revenue', value: `₹${(summary.totalRevenue || 0).toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50 border-green-100', icon: '💰' },
                        ].map(({ label, value, color, bg, icon }) => (
                            <div key={label} className={`${bg} border rounded-2xl p-5`}>
                                <p className="text-xs text-gray-400 font-medium">{icon} {label}</p>
                                <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-3 mb-6">
                    {['overview', 'users', 'events', 'bookings'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-6 py-2.5 rounded-xl font-semibold capitalize transition-all ${
                                tab === t
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                            }`}>
                            {t} {t === 'users' ? `(${users.length})` : t === 'events' ? `(${events.length})` : t === 'bookings' ? `(${bookings.length})` : ''}
                        </button>
                    ))}
                </div>

                {tab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4 text-lg">Budget Summary</h3>
                            {[
                                { label: 'Total Budget', value: `₹${(summary.totalBudget || 0).toLocaleString()}`, color: 'text-blue-700' },
                                { label: 'Total Spent', value: `₹${(summary.totalSpent || 0).toLocaleString()}`, color: 'text-red-600' },
                                { label: 'Total Revenue', value: `₹${(summary.totalRevenue || 0).toLocaleString()}`, color: 'text-green-600' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                    <span className="text-gray-500">{label}</span>
                                    <span className={`font-bold text-lg ${color}`}>{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4 text-lg">User Breakdown</h3>
                            {['CUSTOMER', 'VENDOR'].map(r => (
                                <div key={r} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                    <span className="text-gray-500">{r}s</span>
                                    <span className="font-bold text-blue-700 text-lg">
                                        {users.filter(u => u.role === r).length}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {users.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No users found</div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-blue-50">
                                    <tr>
                                        {['Name', 'Email', 'Role', 'ID'].map(h => (
                                            <th key={h} className="text-left px-6 py-4 text-blue-700 font-semibold">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u.id || i} className="border-t border-gray-50 hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-800">{u.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    u.role === 'CUSTOMER' ? 'bg-blue-100 text-blue-700' :
                                                    u.role === 'VENDOR' ? 'bg-sky-100 text-sky-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">{u.id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {tab === 'events' && (
                    <div className="space-y-3">
                        {events.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                                No events found
                            </div>
                        ) : events.map((ev, i) => (
                            <div key={ev.id || ev.Id || i}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
                                <div>
                                    <p className="font-bold text-gray-800">{ev.title || ev.Title}</p>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        📍 {ev.venue || ev.Venue} · 🗓 {new Date(ev.eventDate || ev.EventDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Hosted by: {ev.vendorName || ev.VendorName}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-700 text-lg">
                                        ₹{ev.ticketPrice || ev.TicketPrice}
                                    </p>
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                        (ev.isActive || ev.IsActive)
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-600'
                                    }`}>
                                        {(ev.isActive || ev.IsActive) ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'bookings' && (
                    <div className="space-y-3">
                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                                No bookings found
                            </div>
                        ) : bookings.map((b, i) => (
                            <div key={b._id || i}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-700">
                                        {b.customerName?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{b.customerName}</p>
                                        <p className="text-sm text-gray-400">
                                            {b.eventTitle} · {b.ticketCount} ticket(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-700 text-lg">₹{b.totalAmount}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                        b.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-600'
                                    }`}>
                                        {b.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}