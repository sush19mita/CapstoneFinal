import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { eventApi, bookingApi } from '../../lib/axios';

export default function EventDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState(1);
    const [booked, setBooked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        setRole(localStorage.getItem('role') || '');
        setCustomerId(localStorage.getItem('userId') || '');
        setCustomerName(localStorage.getItem('name') || '');
    }, []);

    useEffect(() => {
        if (id) eventApi.get(`/api/events/${id}`).then(r => setEvent(r.data));
    }, [id]);

    const handleBook = async () => {
        if (!customerId) { router.push('/login'); return; }
        setLoading(true);
        try {
            await bookingApi.post('/api/bookings', {
                customerId: String(customerId),
                customerName: customerName || 'Customer',
                customerEmail: 'user@eventzen.com',
                eventId: String(id),
                eventTitle: event.title,
                vendorId: String(event.vendorId),
                ticketCount: tickets,
                totalAmount: tickets * event.ticketPrice
            });
            setBooked(true);
        } catch (err) {
            alert('Booking failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!event) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">
            <div className="text-center">
                <p className="text-5xl mb-3 animate-pulse">🎪</p>
                <p>Loading event...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-10">
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title}
                        className="w-full h-72 object-cover rounded-3xl mb-6 shadow-lg" />
                ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-blue-500 to-sky-400 rounded-3xl mb-6 flex items-center justify-center text-7xl shadow-lg">
                        🎪
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                                {event.category}
                            </span>
                            <h1 className="text-3xl font-bold text-blue-900 mt-3">{event.title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-blue-700">₹{event.ticketPrice}</p>
                            <p className="text-sm text-gray-400">per ticket</p>
                        </div>
                    </div>

                    <p className="text-gray-500 leading-relaxed mb-6 border-l-4 border-blue-200 pl-4">
                        {event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            { icon: '📍', label: 'Venue', value: event.venue },
                            { icon: '🗓', label: 'Date & Time', value: new Date(event.eventDate).toLocaleString() },
                            { icon: '👥', label: 'Capacity', value: `${event.capacity} people` },
                            { icon: '🎤', label: 'Hosted by', value: event.vendorName },
                        ].map(({ icon, label, value }) => (
                            <div key={label}
                                className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                <p className="text-xs text-blue-400 font-medium">{icon} {label}</p>
                                <p className="font-semibold text-gray-700 mt-1">{value}</p>
                            </div>
                        ))}
                    </div>

                    {role === 'CUSTOMER' && !booked && (
                        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 border border-blue-100">
                            <h3 className="font-bold text-gray-700 mb-4">Book Your Tickets</h3>
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="text-sm text-gray-500 block mb-1 font-medium">
                                        Number of tickets
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setTickets(Math.max(1, tickets - 1))}
                                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 font-bold hover:bg-blue-50 transition-colors">
                                            -
                                        </button>
                                        <span className="w-10 text-center font-bold text-gray-800">{tickets}</span>
                                        <button onClick={() => setTickets(Math.min(10, tickets + 1))}
                                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 font-bold hover:bg-blue-50 transition-colors">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Total: <span className="font-bold text-blue-700 text-xl">₹{tickets * event.ticketPrice}</span>
                                    </p>
                                    <button onClick={handleBook} disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg disabled:opacity-50">
                                        {loading ? '⏳ Booking...' : '🎟️ Book Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {booked && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-2xl text-center font-semibold">
                            ✅ Booking confirmed! Check your dashboard.
                        </div>
                    )}

                    {!role && (
                        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl text-center">
                            <p className="text-gray-600 font-medium">Want to book this event?</p>
                            <button onClick={() => router.push('/login')}
                                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
                                Login to Book
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}