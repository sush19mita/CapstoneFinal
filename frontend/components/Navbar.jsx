import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        setRole(localStorage.getItem('role') || '');
        setName(localStorage.getItem('name') || '');
        setToken(localStorage.getItem('token') || '');
    }, [router.pathname]);

    const logout = () => {
        localStorage.clear();
        router.push('/');
    };

    const dashboardLink =
        role === 'CUSTOMER' ? '/customer/dashboard' :
        role === 'VENDOR' ? '/vendor/dashboard' :
        role === 'ADMIN' ? '/admin/dashboard' : null;

    const navLink = (href, label) => (
        <Link key={href} href={href}
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                router.pathname === href ? 'text-blue-700 font-semibold' : 'text-gray-500'
            }`}>
            {label}
        </Link>
    );

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    <span className="text-blue-700">Event</span>
                    <span className="text-sky-500">Zen</span>
                </Link>
                <div className="flex items-center gap-7">
                    {navLink('/', 'Home')}
                    {navLink('/explore', 'Explore')}
                    {navLink('/about', 'About Us')}
                    {dashboardLink && navLink(dashboardLink, 'Dashboard')}
                    {token && navLink('/profile', 'Profile')}
                </div>
                <div className="flex items-center gap-4">
                    {token ? (
                        <button onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all">
                            Log Out
                        </button>
                    ) : (
                        <>
                            {/* Login button is outlined as per screenshot */}
                            <Link href="/login"
                                className="text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors px-6 py-2 rounded-xl">
                                Login
                            </Link>
                            <Link href="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all shadow-sm hover:shadow">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}