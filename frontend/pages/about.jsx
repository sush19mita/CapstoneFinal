export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-gradient-to-br from-blue-700 to-sky-500 py-28 px-6 flex flex-col items-center text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">About EventZen</h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                    A full-stack microservices platform built to simplify
                    how events are planned, managed, and attended.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {[
                        { tech: 'Spring Boot', role: 'User Auth & JWT', color: 'bg-green-50 border-green-200 text-green-700', icon: '☕' },
                        { tech: '.NET Core', role: 'Event Management', color: 'bg-purple-50 border-purple-200 text-purple-700', icon: '💜' },
                        { tech: 'Node.js', role: 'Bookings & Budget', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', icon: '🟨' },
                    ].map(({ tech, role, color, icon }) => (
                        <div key={tech} className={`${color} border rounded-3xl p-10 text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition-all`}>
                            <p className="text-6xl mb-6">{icon}</p>
                            <p className="font-bold text-gray-900 text-2xl mb-2">{tech}</p>
                            <p className="text-base font-medium opacity-80">{role}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-sm max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Mission</h2>
                    <p className="text-gray-500 leading-relaxed text-xl">
                        EventZen was built as a capstone project demonstrating
                        real-world microservices architecture. Three independent
                        backend services handle users, events, and bookings —
                        all seamlessly connected through a modern Next.js frontend.
                    </p>
                </div>
            </div>
        </div>
    );
}