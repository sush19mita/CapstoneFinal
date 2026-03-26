import { useState, useEffect } from 'react';
import { userApi } from '../lib/axios';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        userApi.get('/api/users/profile')
            .then(r => { setUser(r.data); setImageUrl(r.data.imageUrl || ''); });
    }, []);

    const updateImage = async () => {
        const res = await userApi.put('/api/users/profile/image', { imageUrl });
        setUser(res.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gray-50">
            Loading profile...
        </div>
    );

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border border-gray-100 text-center">
                <div className="mb-6">
                    {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mx-auto shadow-md" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto border-4 border-blue-200 shadow-md">
                            {initials}
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-bold text-blue-900">{user.name}</h2>
                <p className="text-gray-400 mt-1">{user.email}</p>
                <span className="mt-3 inline-block bg-blue-100 text-blue-700 text-xs px-4 py-1.5 rounded-full font-bold">
                    {user.role}
                </span>

                <div className="mt-8 text-left">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Profile Image URL
                    </label>
                    <input type="url" placeholder="https://your-image-url.com"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                    />
                    <button onClick={updateImage}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg">
                        {saved ? '✅ Saved!' : 'Update Photo'}
                    </button>
                </div>
            </div>
        </div>
    );
}