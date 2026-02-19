import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import { Button } from '../components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare, MapPin, Clock, Send, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedComments, setExpandedComments] = useState({}); // Map of complaintId -> boolean
    const [newComments, setNewComments] = useState({}); // Map of complaintId -> string
    const [user, setUser] = useState(null);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', address: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                // Assuming token is stored in localStorage
                const storedUser = localStorage.getItem('user');
                const token = storedUser ? JSON.parse(storedUser).token : null;

                console.log('Fetching complaints from API...');
                const response = await axios.get('http://localhost:5000/api/complaints');
                setComplaints(response.data);
            } catch (error) {
                console.error('Error fetching complaints:', error);
            } finally {
                setLoading(false);
            }
        };

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }

        fetchComplaints();
    }, []);

    const handleVote = async (id, voteType) => {
        try {
            const token = user ? user.token : null;
            if (!token) {
                alert('Please login to vote');
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`http://localhost:5000/api/complaints/${id}/vote`, { voteType }, config);

            // Update local state
            setComplaints(complaints.map(c => c._id === id ? response.data : c));
        } catch (error) {
            console.error('Error voting:', error);
            alert('Failed to vote');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = user ? user.token : null;
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.put(`http://localhost:5000/api/complaints/${id}`, { status: newStatus }, config);

            // Update local state - response might be the raw complaint, need to keep aggregated fields if possible
            // But usually put returns the doc. The UI might flicker if we replace full object without re-fetching aggregation.
            // For simplicity, we just update the status field locally or reload.
            setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;
        try {
            const token = user ? user.token : null;
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`http://localhost:5000/api/complaints/${id}`, config);
            setComplaints(complaints.filter(c => c._id !== id));
            alert('Complaint deleted successfully');
        } catch (error) {
            console.error('Error deleting complaint:', error);
            alert('Failed to delete complaint');
        }
    };

    const startEditing = (complaint) => {
        setEditingComplaint(complaint._id);
        setEditForm({
            title: complaint.title,
            description: complaint.description,
            address: complaint.address
        });
    };

    const cancelEditing = () => {
        setEditingComplaint(null);
        setEditForm({ title: '', description: '', address: '' });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user ? user.token : null;
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(`http://localhost:5000/api/complaints/${editingComplaint}`, editForm, config);

            // Update local state
            setComplaints(complaints.map(c => c._id === editingComplaint ? { ...c, ...editForm } : c));
            cancelEditing();
            alert('Complaint updated successfully');
        } catch (error) {
            console.error('Error updating complaint:', error);
            alert('Failed to update complaint');
        }
    };

    const toggleComments = (id) => {
        setExpandedComments(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCommentChange = (id, text) => {
        setNewComments(prev => ({
            ...prev,
            [id]: text
        }));
    };

    const submitComment = async (id) => {
        try {
            const token = user ? user.token : null;
            if (!token) {
                alert('Please login to comment');
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const text = newComments[id];
            if (!text) return;

            const response = await axios.post(`http://localhost:5000/api/complaints/${id}/comment`, { text }, config);

            // Update local state
            setComplaints(complaints.map(c => c._id === id ? response.data : c));

            // Clear input but keep comments expanded
            setNewComments(prev => ({ ...prev, [id]: '' }));
        } catch (error) {
            console.error('Error commenting:', error);
            alert('Failed to post comment');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200'; // received
        }
    };

    const timeAgo = (dateInfo) => {
        if (!dateInfo) return '';
        const date = new Date(dateInfo);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Voting buttons & Comment session</h1>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-800">Community Reports</h2>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                            </select>
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                                <option>All Types</option>
                                <option>Pothole</option>
                                <option>Garbage</option>
                                <option>Street Light</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">No community reports found yet.</p>
                        <Link to="/report-issue">
                            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                                Be the first to report!
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {complaints.map((complaint) => (
                            <div key={complaint._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md flex flex-col h-full">

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-3 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[20px]">
                                            {/* Icons specific to issue types */}
                                            {complaint.issueType === 'pothole' && <span className="text-xl" role="img" aria-label="pothole">🕳️</span>}
                                            {complaint.issueType === 'street_light' && <span className="text-xl" role="img" aria-label="light">💡</span>}
                                            {complaint.issueType === 'water_leakage' && <span className="text-xl" role="img" aria-label="water">💧</span>}
                                            {complaint.issueType === 'garbage' && <span className="text-xl" role="img" aria-label="garbage">🗑️</span>}
                                            {/* Default */}
                                            {!['pothole', 'street_light', 'water_leakage', 'garbage'].includes(complaint.issueType) && <span className="text-xl" role="img" aria-label="issue">📢</span>}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1">
                                                {complaint.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap capitalize ${getStatusColor(complaint.status)}`}>
                                            {complaint.status === 'received' ? 'Received' : complaint.status.replace('_', ' ')}
                                        </span>
                                        {complaint.assigned_to && complaint.assigned_to !== 'Unassigned' && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                Assigned: {complaint.assigned_to}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status Update for Admin/Volunteer */}
                                    {user && (user.role === 'admin' || user.role === 'volunteer') && (
                                        <div className="mt-2 flex justify-end">
                                            <select
                                                value={complaint.status}
                                                onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                                                className="text-xs border border-gray-300 rounded px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="received">Received</option>
                                                <option value="in_review">In Review</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Edit/Delete for Owner or Admin */}

                                    {user && (
                                        <div className="flex justify-end gap-2 mt-2">
                                            {/* Allow owner or admin to delete */}
                                            {/* Note: complaint.user is user object from aggregation, user_id is the ID field */}
                                            {(String(user._id) === String(complaint.user?._id || complaint.user_id) || user.role === 'admin') && (
                                                <button
                                                    onClick={() => handleDelete(complaint._id)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors"
                                                    title="Delete Complaint"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                            {/* Allow owner OR ADMIN to edit */}
                                            {(String(user._id) === String(complaint.user?._id || complaint.user_id) || user.role === 'admin') && (
                                                <button
                                                    onClick={() => startEditing(complaint)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Edit Form or Description */}
                                {editingComplaint === complaint._id ? (
                                    <form onSubmit={handleEditSubmit} className="mb-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Title</label>
                                                <input
                                                    type="text"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="w-full text-sm p-1 border rounded"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Description</label>
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full text-sm p-1 border rounded"
                                                    rows="3"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Address</label>
                                                <input
                                                    type="text"
                                                    value={editForm.address}
                                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                    className="w-full text-sm p-1 border rounded"
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-2 justify-end pt-2">
                                                <button type="button" onClick={cancelEditing} className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                                <button type="submit" className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 ml-8">
                                        {complaint.description}
                                    </p>
                                )}

                                {complaint.photo && (
                                    <div className="mb-4">
                                        <img src={complaint.photo} alt={complaint.title} className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                                    </div>
                                )}

                                {/* Meta Info */}
                                <div className="mt-auto ml-8">
                                    <div className="flex flex-col gap-1.5 mb-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-gray-400" />
                                            <span className="truncate">{complaint.address} {complaint.landmark && `& ${complaint.landmark}`}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-gray-400" />
                                            <span>in {timeAgo(complaint.createdAt)}</span>
                                            {/* "in X days" shown in screenshot, simplified to "ago" or similar logic */}
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 mb-3" />

                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleVote(complaint._id, 'upvote')}
                                                className={`flex items-center gap-1.5 text-sm transition-colors px-2 py-1 rounded hover:bg-gray-50 ${complaint.upvotes && user && complaint.upvotes.includes(user._id || user.id)
                                                    ? 'text-blue-600 font-medium'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <ThumbsUp size={16} fill={complaint.upvotes && user && complaint.upvotes.includes(user._id || user.id) ? "currentColor" : "none"} />
                                                <span>{complaint.upvotes ? complaint.upvotes.length : 0}</span>
                                            </button>

                                            <button
                                                onClick={() => handleVote(complaint._id, 'downvote')}
                                                className={`flex items-center gap-1.5 text-sm transition-colors px-2 py-1 rounded hover:bg-gray-50 ${complaint.downvotes && user && complaint.downvotes.includes(user._id || user.id)
                                                    ? 'text-red-600 font-medium'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <ThumbsDown size={16} fill={complaint.downvotes && user && complaint.downvotes.includes(user._id || user.id) ? "currentColor" : "none"} />
                                                <span>{complaint.downvotes ? complaint.downvotes.length : 0}</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => toggleComments(complaint._id)}
                                            className={`flex items-center gap-1.5 text-sm transition-colors px-2 py-1 rounded hover:bg-gray-50 ${expandedComments[complaint._id] ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <MessageSquare size={16} />
                                            <span>Comments ({complaint.comments ? complaint.comments.length : 0})</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {expandedComments[complaint._id] && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                Comments
                                            </h4>

                                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                                {complaint.comments && complaint.comments.length > 0 ? (
                                                    complaint.comments.map((comment, idx) => (
                                                        <div key={idx} className="bg-white p-3 rounded border border-gray-100 shadow-sm text-sm">
                                                            <p className="text-gray-800 break-words">{comment.text}</p>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                                                                {/* Could add user name if populated */}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-4 text-gray-400 text-sm italic">
                                                        No comments yet. Be the first to share your thoughts.
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newComments[complaint._id] || ''}
                                                    onChange={(e) => handleCommentChange(complaint._id, e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    onKeyDown={(e) => e.key === 'Enter' && submitComment(complaint._id)}
                                                />
                                                <Button
                                                    onClick={() => submitComment(complaint._id)}
                                                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex-shrink-0"
                                                    disabled={!newComments[complaint._id]}
                                                >
                                                    <Send size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ViewComplaints;
