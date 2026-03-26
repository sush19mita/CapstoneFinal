import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { userApi } from '../lib/axios';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await userApi.post('/api/users/register', form);
            router.push('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[440px]">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 pt-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-900">Create Account</h2>
                        <p className="text-gray-400 mt-1 text-sm">Join EventZen today</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[
                            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma' },
                            { key: 'email', label: 'Email', type: 'email', placeholder: 'rahul@example.com' },
                            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                        ].map(({ key, label, type, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
                                <input type={type} required placeholder={placeholder}
                                    value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full border border-blue-100 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Register as</label>
                            <div className="flex gap-3">
                                {[
                                    { value: 'CUSTOMER', label: 'Customer' },
                                    { value: 'VENDOR', label: 'Vendor' },
                                ].map(r => (
                                    <button type="button" key={r.value}
                                        onClick={() => setForm({ ...form, role: r.value })}
                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
                                            form.role === r.value
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}>
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-60 mt-4">
                            {loading ? '⏳ Creating...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}