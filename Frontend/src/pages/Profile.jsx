import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import { Button } from '../components/ui/button';
import { Lock, Shield, X, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        location: '',
        role: '',
        profilePhoto: '',
        privacySettings: {
            profileVisibility: 'public',
            showEmail: true
        }
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Modals State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Privacy Form State
    const [privacyData, setPrivacyData] = useState({
        profileVisibility: 'public',
        showEmail: true
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (!storedUser || !storedUser.token) {
                    window.location.href = '/login';
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${storedUser.token}`
                    }
                };

                const response = await axios.get('http://localhost:5000/api/users/me', config);
                console.log('User Profile Data:', response.data);
                setUser({
                    ...response.data,
                    role: response.data.role || 'user',
                    privacySettings: response.data.privacySettings || { profileVisibility: 'public', showEmail: true }
                });
                setFormData(response.data);
                setPrivacyData(response.data.privacySettings || { profileVisibility: 'public', showEmail: true });
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePrivacyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPrivacyData({
            ...privacyData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${storedUser.token}`
                }
            };

            const response = await axios.put('http://localhost:5000/api/users/profile', formData, config);

            // Update local storage
            const updatedUser = { ...storedUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setUser({
                ...response.data,
                role: response.data.role || user.role,
            });
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${storedUser.token}`
                }
            };

            await axios.put('http://localhost:5000/api/users/profile', {
                currentPassword: passwordData.currentPassword,
                password: passwordData.newPassword
            }, config);

            alert('Password changed successfully!');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError(error.response?.data?.message || 'Failed to change password');
        }
    };

    const submitPrivacySettings = async (e) => {
        e.preventDefault();
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    Authorization: `Bearer ${storedUser.token}`
                }
            };

            const response = await axios.put('http://localhost:5000/api/users/profile', {
                privacySettings: privacyData
            }, config);

            // Update local storage
            const updatedUser = { ...storedUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setUser({
                ...user,
                privacySettings: response.data.privacySettings
            });

            alert('Privacy settings updated!');
            setShowPrivacyModal(false);
        } catch (error) {
            console.error('Error updating privacy:', error);
            alert('Failed to update privacy settings');
        }
    };


    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePhoto: reader.result });
                // Update preview
                setUser({ ...user, profilePhoto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
                <p className="text-gray-500 mb-8">Manage your account information and preferences</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - User Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center h-fit">
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden">
                                {user.profilePhoto ? (
                                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 text-xs cursor-pointer hover:bg-gray-100 transition-colors">
                                📷
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={!isEditing && false} />
                            </label>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4 capitalize">
                            {user.role}
                        </span>

                        <p className="text-gray-400 text-xs mt-4">
                            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    {/* Right Column - Edit Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        👤 Account Information
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">Update your personal details</p>
                                </div>
                                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? 'Cancel' : '✎ Edit Profile'}
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={isEditing ? formData.name : user.name}
                                            onChange={handleChange}
                                            className={`w-full p-2.5 border rounded-lg transition-colors ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                            readOnly={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={isEditing ? formData.email : user.email}
                                            onChange={handleChange}
                                            className={`w-full p-2.5 border rounded-lg transition-colors ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                            readOnly={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        {isEditing ? (
                                            <select
                                                name="role"
                                                value={formData.role ? formData.role.toLowerCase() : 'user'}
                                                onChange={handleChange}
                                                className="w-full p-2.5 border border-blue-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={user.role}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 capitalize cursor-not-allowed"
                                                readOnly
                                            />
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={isEditing ? formData.location : (user.location || '')}
                                            onChange={handleChange}
                                            placeholder={isEditing ? "Enter your city or area" : "Not specified"}
                                            className={`w-full p-2.5 border rounded-lg transition-colors ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                            readOnly={!isEditing}
                                        />
                                    </div>

                                    {isEditing && (
                                        <div className="md:col-span-2 flex justify-end mt-4">
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">Save Changes</Button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="p-2 bg-red-50 text-red-500 rounded-full"><Shield size={20} /></span>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Security & Privacy</h3>
                                    <p className="text-gray-500 text-sm">Manage your password and visibility settings</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="h-auto py-4 justify-start px-4 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700">
                                    <Lock className="mr-3 h-5 w-5 text-gray-400" />
                                    <div className="text-left">
                                        <div className="font-semibold">Change Password</div>
                                        <div className="text-xs text-gray-400 font-normal">Update your login password</div>
                                    </div>
                                </Button>
                                <Button variant="outline" onClick={() => setShowPrivacyModal(true)} className="h-auto py-4 justify-start px-4 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700">
                                    <Eye className="mr-3 h-5 w-5 text-gray-400" />
                                    <div className="text-left">
                                        <div className="font-semibold">Privacy Settings</div>
                                        <div className="text-xs text-gray-400 font-normal">Manage profile visibility</div>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitPasswordChange} className="p-6 space-y-4">
                            {passwordError && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {passwordError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Privacy Settings Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Privacy Settings</h3>
                            <button onClick={() => setShowPrivacyModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitPrivacySettings} className="p-6 space-y-6">

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-800">Profile Visibility</div>
                                        <div className="text-xs text-gray-500">Control who can see your profile details</div>
                                    </div>
                                    <select
                                        name="profileVisibility"
                                        value={privacyData.profileVisibility}
                                        onChange={handlePrivacyChange}
                                        className="p-2 border border-gray-300 rounded-lg text-sm bg-white"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div>
                                        <div className="font-medium text-gray-800">Show Email Address</div>
                                        <div className="text-xs text-gray-500">Display your email on your public profile</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="showEmail"
                                            checked={privacyData.showEmail}
                                            onChange={handlePrivacyChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowPrivacyModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                    Save Verification
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
