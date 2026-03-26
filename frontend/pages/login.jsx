import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { userApi } from '../lib/axios';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await userApi.post('/api/users/login', form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('userId', res.data.id);
            setSuccess(true);
            setTimeout(() => {
                if (res.data.role === 'CUSTOMER') router.push('/customer/dashboard');
                else if (res.data.role === 'VENDOR') router.push('/vendor/dashboard');
                else if (res.data.role === 'ADMIN') router.push('/admin/dashboard');
            }, 800);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-blue-700">Event</span>
                        <span className="text-sky-500">Zen</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">Welcome back!</h2>
                    <p className="text-gray-400 mt-1 text-sm">Sign in to your EventZen account</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm font-medium">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-5 text-sm font-medium">
                            ✅ Login successful! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input type="email" required placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <input type="password" required placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <button type="submit" disabled={loading || success}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-200 disabled:opacity-60 mt-2">
                            {loading ? '⏳ Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}