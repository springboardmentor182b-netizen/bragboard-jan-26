import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mail, Briefcase, Camera, Edit2, X, Save } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: '',
        job_title: '',
        department: ''
    });
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Hardcoded user ID = 1
    const userId = 1;

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/users/${userId}`);
            setUser(response.data);
            setEditForm({
                full_name: response.data.full_name,
                job_title: response.data.job_title || 'Team Member',
                department: response.data.department || 'General'
            });
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/users/${userId}`, editForm);
            setUser(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            await axios.post(`http://localhost:8000/users/${userId}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh user to get new image URL
            fetchUser();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    if (!user) return <div className="text-center p-8">Loading profile...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="h-48 bg-gradient-to-r from-brand-yellow to-brand-orange"></div>

                {/* Edit Button */}
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium border border-white/40"
                >
                    <Edit2 size={16} />
                    Edit Profile
                </button>

                <div className="px-8 pb-8 relative">
                    <div className="absolute -top-16 left-8 p-1.5 bg-white rounded-full group">
                        <div className="w-32 h-32 rounded-full bg-brand-orange text-white flex items-center justify-center text-4xl font-bold border-4 border-white overflow-hidden relative">
                            {user.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user.full_name?.charAt(0) || 'U'
                            )}

                            {/* Upload Overlay */}
                            <div
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <Camera className="text-white" size={24} />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    {/* Increased spacing to fix overlap issue - using padding-top to push content down relative to container */}
                    <div className="pt-24 mt-20">
                        <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
                        <p className="text-gray-500 font-medium">{user.department} • {user.job_title}</p>
                    </div>

                    <div className="mt-8 grid gap-4">
                        <div className="p-4 bg-brand-light-bg rounded-xl border border-orange-50 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-orange shadow-sm">
                                <Mail size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Work Email</div>
                                <div className="text-gray-900 font-medium">{user.email}</div>
                            </div>
                        </div>

                        <div className="p-4 bg-brand-light-bg rounded-xl border border-orange-50 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-orange shadow-sm">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Role</div>
                                <div className="text-gray-900 font-medium capitalize">{user.role}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={editForm.job_title}
                                    onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    value={editForm.department}
                                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-brand-orange text-white hover:bg-orange-600 font-bold">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
