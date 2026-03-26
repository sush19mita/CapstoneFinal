import { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventApi } from '../lib/axios';

export default function Explore() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventApi.get('/api/events')
            .then(r => setEvents(r.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-gray-100 px-6 py-16">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">Explore Events</h1>
                    <p className="text-gray-500 mb-10 text-lg">Discover amazing events happening around you</p>
                    <div className="w-full max-w-2xl">
                        <input type="text"
                            placeholder="🔍  Search by name, category, venue..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50 text-gray-800 text-lg transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                        <p className="text-6xl mb-6 animate-bounce">🎪</p>
                        <p className="text-xl font-medium">Loading incredible events...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filtered.map(event => (
                            <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover" />
                                ) : (
                                    <div className="w-full h-56 bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-6xl">🎪</div>
                                )}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <span className="text-xs bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                            {event.category || 'Event'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-blue-900 mt-2 text-2xl">{event.title}</h3>
                                    <p className="text-gray-500 mt-3 line-clamp-2 leading-relaxed">{event.description}</p>
                                    <p className="text-sm text-gray-400 mt-4 flex items-center gap-2">📍 {event.venue}</p>
                                    
                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Price</p>
                                            <p className="text-blue-700 font-bold text-2xl">₹{event.ticketPrice}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-1">Date</p>
                                            <p className="text-sm font-semibold text-gray-700">{new Date(event.eventDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <Link href={`/events/${event.id}`}
                                        className="mt-8 block text-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl transition-all text-base font-bold shadow-md hover:shadow-lg">
                                        View Details & Book
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && !loading && (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-400">
                                <p className="text-7xl mb-6">🔍</p>
                                <p className="text-2xl font-medium text-gray-600">No events found</p>
                                <p className="mt-2 text-gray-400">Try adjusting your search terms</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}