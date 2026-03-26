import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { eventApi, bookingApi } from '../../lib/axios';

export default function VendorDashboard() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [tab, setTab] = useState('events');
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [form, setForm] = useState({
        title:'',description:'',venue:'',eventDate:'',
        ticketPrice:'',capacity:'',budget:'',imageUrl:'',category:''
    });
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'VENDOR') { router.push('/login'); return; }
        const n = localStorage.getItem('name') || '';
        const vid = localStorage.getItem('userId') || '';
        setName(n);
        setVendorId(vid);
        eventApi.get(`/api/events/vendor/${vid}`).then(r => setEvents(r.data));
        bookingApi.get(`/api/bookings/vendor/${vid}`).then(r => setBookings(r.data));
        bookingApi.get(`/api/budget/vendor/${vid}`).then(r => setBudgets(r.data));
    }, []);

    const createEvent = async (e) => {
        e.preventDefault();
        try {
            const res = await eventApi.post('/api/events', {
                ...form,
                vendorId: parseInt(vendorId),
                vendorName: name,
                ticketPrice: parseFloat(form.ticketPrice),
                capacity: parseInt(form.capacity),
                budget: parseFloat(form.budget)
            });
            setEvents([...events, res.data]);
            setShowForm(false);
            setForm({ title:'',description:'',venue:'',eventDate:'',ticketPrice:'',capacity:'',budget:'',imageUrl:'',category:'' });
        } catch (err) {
            alert('Failed: ' + err.message);
        }
    };

    const totalRevenue = budgets.reduce((s, b) => s + (b.revenue || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 px-6 py-8">
                <div className="max-w-7xl mx-auto flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900">Vendor Dashboard</h1>
                        <p className="text-gray-400 mt-1">Manage your events, {name.split(' ')[0]}</p>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            {[
                                { label: 'My Events', value: events.length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
                                { label: 'Total Bookings', value: bookings.length, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
                                { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                            ].map(({ label, value, color, bg }) => (
                                <div key={label} className={`${bg} border rounded-2xl p-5 min-w-36`}>
                                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                                    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-200 hover:scale-105">
                        + Add Event
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-screen">
                        <h2 className="text-2xl font-bold text-blue-900 mb-6">Create New Event</h2>
                        <form onSubmit={createEvent} className="grid grid-cols-2 gap-4">
                            {[
                                ['title','Event Title','text'],
                                ['venue','Venue','text'],
                                ['ticketPrice','Ticket Price (₹)','number'],
                                ['capacity','Capacity','number'],
                                ['budget','Total Budget (₹)','number'],
                                ['category','Category','text'],
                                ['imageUrl','Image URL (optional)','url'],
                            ].map(([key,label,type]) => (
                                <div key={key}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                                    <input type={type} required={key !== 'imageUrl'}
                                        value={form[key]}
                                        onChange={e => setForm({...form,[key]:e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date & Time</label>
                                <input type="datetime-local" required
                                    value={form.eventDate}
                                    onChange={e => setForm({...form, eventDate: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea rows={3} required
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none"
                                />
                            </div>
                            <div className="col-span-2 flex gap-3 mt-2">
                                <button type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg">
                                    Create Event
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-3 mb-6">
                    {['events','bookings','budget'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-6 py-2.5 rounded-xl font-semibold capitalize transition-all ${
                                tab === t
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                            }`}>
                            {t}
                        </button>
                    ))}
                </div>

                {tab === 'events' && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {events.length === 0 ? (
                            <div className="col-span-2 bg-white rounded-2xl p-16 text-center border border-gray-100">
                                <p className="text-5xl mb-3">🎪</p>
                                <p className="font-semibold text-gray-600 text-lg">No events yet</p>
                                <p className="text-gray-400">Click + Add Event to create your first event</p>
                            </div>
                        ) : events.map(ev => (
                            <div key={ev.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-lg">{ev.title}</h3>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                                        {ev.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">📍 {ev.venue}</p>
                                <p className="text-sm text-gray-400">🗓 {new Date(ev.eventDate).toLocaleString()}</p>
                                <div className="mt-3 flex gap-4 text-sm">
                                    <span className="text-blue-700 font-bold">₹{ev.ticketPrice}/ticket</span>
                                    <span className="text-gray-400">Cap: {ev.capacity}</span>
                                    <span className="text-green-600 font-medium">Budget: ₹{ev.budget?.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'bookings' && (
                    <div className="space-y-3">
                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                <p className="text-4xl mb-3">📋</p>
                                <p className="font-semibold text-gray-600">No bookings yet</p>
                            </div>
                        ) : bookings.map(b => (
                            <div key={b._id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-700 text-sm">
                                        {b.customerName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{b.customerName}</p>
                                        <p className="text-sm text-gray-400">{b.eventTitle} · {b.ticketCount} ticket(s)</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-700 text-lg">₹{b.totalAmount}</p>
                                    <p className="text-xs text-gray-400">{new Date(b.bookedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'budget' && (
                    <div className="space-y-4">
                        {budgets.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                <p className="text-4xl mb-3">💰</p>
                                <p className="font-semibold text-gray-600">No budget data yet</p>
                            </div>
                        ) : budgets.map(b => (
                            <div key={b._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">
                                    {b.eventTitle || 'Event Budget'}
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Budget', value: `₹${b.totalBudget?.toLocaleString()}`, bg: 'bg-blue-50 border-blue-100', color: 'text-blue-700' },
                                        { label: 'Spent', value: `₹${b.spent?.toLocaleString()}`, bg: 'bg-red-50 border-red-100', color: 'text-red-600' },
                                        { label: 'Revenue', value: `₹${b.revenue?.toLocaleString()}`, bg: 'bg-green-50 border-green-100', color: 'text-green-600' },
                                    ].map(({ label, value, bg, color }) => (
                                        <div key={label} className={`${bg} border rounded-2xl p-5 text-center`}>
                                            <p className="text-xs text-gray-400 font-medium">{label}</p>
                                            <p className={`font-bold text-2xl mt-1 ${color}`}>{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}