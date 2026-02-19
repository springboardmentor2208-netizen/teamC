import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ComplaintForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        issueType: '',
        priority: '',
        address: '',
        landmark: '',
        description: '',
        location: null,
        photo: ''
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const [position, setPosition] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            alert("Please login to report an issue.");
            navigate('/login');
        }
    }, [navigate]);

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setPosition(e.latlng);
                setFormData((prev) => ({ ...prev, location: e.latlng }));
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        return position === null ? null : (
            <Marker position={position}></Marker>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to submit a complaint.");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const response = await axios.post('http://localhost:5000/api/complaints', formData, config);

            console.log('Complaint Submitted:', response.data);
            alert('Complaint Submitted Successfully!');
            navigate('/dashboard');

        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert(error.response?.data?.message || 'Failed to submit complaint');
        }
    };

    return (
        <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Report a Civic Issue</h1>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-6 text-gray-700">Issue Details</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Brief description of the issue"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                            <select
                                name="issueType"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                value={formData.issueType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select issue type</option>
                                <option value="garbage">Garbage</option>
                                <option value="pothole">Pothole</option>
                                <option value="street_light">Street Light</option>
                                <option value="water_leakage">Water Leakage</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                            <select
                                name="priority"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter street address"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Landmark (Optional)</label>
                        <input
                            type="text"
                            name="landmark"
                            placeholder="e.g., Near City Hall"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            value={formData.landmark}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Describe the issue in detail..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                        />
                        {formData.photo && (
                            <div className="mt-2">
                                <img src={formData.photo} alt="Preview" className="h-32 w-auto object-cover rounded-md border border-gray-300" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location on Map</label>
                        <div className="h-64 w-full rounded-md overflow-hidden border border-gray-300 relative z-0">
                            <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Click on the map to mark the exact location</p>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition duration-300 shadow-md">
                            Submit Report
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintForm;
