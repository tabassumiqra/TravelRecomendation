import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const DestinationDetails = () => {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const { data } = await api.get(`/destinations/${id}`);
                setDestination(data);
            } catch (error) {
                console.error('Error fetching destination details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestination();
    }, [id]);

    if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading...</div>;
    if (!destination) return <div className="text-center mt-20 text-xl text-red-500">Destination not found</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-xl rounded-2xl overflow-hidden">
            <img src={destination.image} alt={destination.name} className="w-full h-80 object-cover" />
            
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold text-eco-dark">{destination.name}</h1>
                    <span className="text-gray-500 font-semibold">{destination.country}</span>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-8">{destination.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t border-b py-6">
                    {/* Sustainability Stats */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-eco-accent">Eco Credentials</h3>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Sustainability Score:</span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{destination.sustainabilityScore}/100</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Carbon Footprint:</span>
                            <span className={`px-3 py-1 rounded-full ${destination.carbonFootprint === 'Low' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {destination.carbonFootprint}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Certifications: </span>
                            {destination.ecoCertifications.length > 0 ? (
                                <ul className="list-disc pl-5 mt-2 text-gray-600">
                                    {destination.ecoCertifications.map(cert => <li key={cert}>{cert}</li>)}
                                </ul>
                            ) : (
                                <span className="text-gray-500">None specified</span>
                            )}
                        </div>
                    </div>

                    {/* Mock Real-Time Weather */}
                    {destination.weather && (
                        <div className="space-y-4 bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-2xl font-bold text-blue-800">Live Weather (Mock)</h3>
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-4xl font-bold text-gray-800">{destination.weather.temperature}°C</p>
                                    <p className="text-lg text-gray-600">{destination.weather.condition}</p>
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    Humidity: {destination.weather.humidity}%
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Simulated coords: [{destination.coordinates.lat.toFixed(2)}, {destination.coordinates.lng.toFixed(2)}]</p>
                        </div>
                    )}
                </div>

                <div className="flex space-x-4">
                    <Link to="/results" className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-bold transition">
                        Back to Results
                    </Link>
                    {/* Add Save Feature could trigger an API hereafter */}
                    <button className="bg-eco-green hover:bg-eco-dark text-white py-3 px-6 rounded-lg font-bold transition">
                        Save Destination
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DestinationDetails;
