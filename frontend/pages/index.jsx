import Link from 'next/link';
import { useEffect, useState } from 'react';
import { eventApi } from '../lib/axios';

export default function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        eventApi.get('/api/events')
            .then(r => setEvents(r.data.slice(0, 3)))
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-white py-28 px-6">
                <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold mb-8">
                        🎉 India's #1 Event Management Platform
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-blue-900 mb-6 leading-tight">
                        Plan. Manage.<br />
                        <span className="text-sky-500">Experience.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                        EventZen connects vendors and customers — discover events,
                        manage bookings, and track budgets all in one place.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mb-24">
                        <Link href="/explore"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-1">
                            Explore Events
                        </Link>
                        <Link href="/register"
                            className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1">
                            Get Started
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
                        {[
                            { icon: '🎪', title: 'For Vendors', desc: 'List events, track bookings, manage budgets', color: 'from-blue-50 to-blue-100 border-blue-200' },
                            { icon: '🎟️', title: 'For Customers', desc: 'Browse, book & manage your registrations', color: 'from-sky-50 to-sky-100 border-sky-200' },
                            { icon: '📊', title: 'Smart Analytics', desc: 'Real-time budgets and financial reports', color: 'from-indigo-50 to-indigo-100 border-indigo-200' },
                        ].map((item) => (
                            <div key={item.title}
                                className={`bg-gradient-to-br ${item.color} border rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-default`}>
                                <div className="text-5xl mb-5 flex justify-center">{item.icon}</div>
                                <h3 className="font-bold text-gray-900 text-xl mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-blue-600 py-20 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
                    {[
                        { num: '500+', label: 'Events Listed' },
                        { num: '10K+', label: 'Happy Customers' },
                        { num: '200+', label: 'Trusted Vendors' },
                    ].map(s => (
                        <div key={s.label} className="flex flex-col items-center">
                            <p className="text-5xl md:text-6xl font-bold mb-2">{s.num}</p>
                            <p className="text-sky-200 text-lg font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Events */}
            {events.length > 0 && (
                <div className="py-24 px-6 bg-slate-50">
                    <div className="max-w-6xl mx-auto flex flex-col items-center">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-blue-900">Featured Events</h2>
                            <p className="text-gray-500 mt-4 text-lg">Discover what's happening near you</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            {events.map(ev => (
                                <div key={ev.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                                    {ev.imageUrl ? (
                                        <img src={ev.imageUrl} alt={ev.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-56 bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-6xl">🎪</div>
                                    )}
                                    <div className="p-8 flex flex-col flex-1 text-left">
                                        <div className="mb-3">
                                            <span className="text-xs bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-bold tracking-wide">
                                                {ev.category || 'General'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-blue-900 mt-2 text-xl">{ev.title}</h3>
                                        <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">📍 {ev.venue}</p>
                                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                                            <span className="text-blue-700 font-bold text-2xl">₹{ev.ticketPrice}</span>
                                            <Link href={`/events/${ev.id}`} className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-sm">
                                                Book →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center mt-16">
                            <Link href="/explore" className="bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all inline-block">
                                View All Events →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-700 to-sky-500 py-24 px-6 flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
                <p className="text-blue-100 mb-12 text-xl max-w-xl">Join thousands of vendors and customers experiencing the future of event management.</p>
                <Link href="/register" className="bg-white text-blue-700 font-bold text-lg px-12 py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all inline-block shadow-lg">
                    Create Free Account →
                </Link>
            </div>
        </div>
    );
}