import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { eventApi, bookingApi } from '../../lib/axios';

export default function CustomerDashboard() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [tab, setTab] = useState('events');
    const [name, setName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'CUSTOMER') { router.push('/login'); return; }

        const n = localStorage.getItem('name') || '';
        const uid = localStorage.getItem('userId');
        setName(n);

        eventApi.get('/api/events')
            .then(r => setEvents(r.data))
            .catch(err => console.error('Events error:', err));

        if (uid) {
            bookingApi.get(`/api/bookings/customer/${uid}`)
                .then(r => setBookings(r.data))
                .catch(err => console.error('Bookings error:', err));
        }
    }, []);

    return (
        <div className="min-h-screen pb-10">
            <div className="px-6 py-10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-blue-900">
                        Welcome, {name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-400 mt-1 mb-8">
                        Discover and book amazing events
                    </p>

                    <div className="grid grid-cols-2 gap-6 max-w-xl mb-10">
                        {[
                            { label: 'Events Available', value: events.length, color: 'text-blue-700' },
                            { label: 'My Bookings', value: bookings.length, color: 'text-sky-600' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                                <p className="text-sm text-gray-400 font-medium">{label}</p>
                                <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 mb-8">
                        {['events', 'bookings'].map(t => (
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

                    {/* EVENTS TAB */}
                    {tab === 'events' && (
                        <div className="grid md:grid-cols-3 gap-6">
                            {events.length === 0 ? (
                                <div className="col-span-3 text-center py-16 text-gray-400">
                                    <p className="text-4xl mb-3">🎪</p>
                                    <p>No events available right now</p>
                                </div>
                            ) : events.map(event => (
                                <div key={event.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all">
                                    {event.imageUrl ? (
                                        <img src={event.imageUrl} alt={event.title}
                                            className="w-full h-40 object-cover" />
                                    ) : (
                                        <div className={`w-full h-40 bg-gradient-to-r ${
                                            event.category === 'Tech' ? 'from-teal-600 to-cyan-500' :
                                            event.category === 'Food' ? 'from-indigo-500 to-purple-500' :
                                            event.category === 'Music' ? 'from-blue-600 to-sky-400' :
                                            'from-blue-500 to-indigo-500'
                                        }`} />
                                    )}
                                    <div className="p-5 flex flex-col flex-1">
                                        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold w-fit">
                                            {event.category || 'General'}
                                        </span>
                                        <h3 className="font-bold text-gray-900 mt-2 text-lg">{event.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1">📍 {event.venue}</p>
                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <span className="text-blue-700 font-bold text-lg">₹{event.ticketPrice}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(event.eventDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Link href={`/events/${event.id}`}
                                            className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors text-sm font-bold">
                                            View & Book
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* BOOKINGS TAB — this was completely missing! */}
                    {tab === 'bookings' && (
                        <div className="space-y-4">
                            {bookings.length === 0 ? (
                                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                                    <p className="text-5xl mb-3">🎟️</p>
                                    <p className="font-semibold text-gray-600 text-lg">No bookings yet</p>
                                    <p className="text-gray-400 mt-1 text-sm">
                                        Go explore and book your first event!
                                    </p>
                                    <Link href="/explore"
                                        className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                                        Explore Events
                                    </Link>
                                </div>
                            ) : bookings.map(b => (
                                <div key={b._id}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                                            🎟️
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{b.eventTitle}</h3>
                                            <p className="text-sm text-gray-400 mt-0.5">
                                                {new Date(b.bookedAt).toLocaleDateString()} · {b.ticketCount} ticket(s)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-700 text-xl">₹{b.totalAmount}</p>
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold mt-1 inline-block ${
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
        </div>
    );
}
