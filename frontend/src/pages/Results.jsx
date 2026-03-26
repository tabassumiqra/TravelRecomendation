import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';

const Results = () => {
    const { search } = useLocation();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await api.get(`/destinations${search}`);
                setDestinations(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [search]);

    if (loading) return <div className="text-center mt-20 text-xl font-bold">Finding Eco-Friendly Matches...</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6 text-eco-dark text-center">Your Recommended Destinations</h1>
            
            {destinations.length === 0 ? (
                <div className="text-center bg-white p-8 rounded-lg shadow">
                    <p className="text-lg text-gray-600">No exact matches found. Try adjusting your preferences.</p>
                    <Link to="/" className="text-eco-accent underline mt-4 inline-block">Go Back</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map(dest => (
                        <div key={dest._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300">
                            <img src={dest.image} alt={dest.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{dest.description}</p>
                                
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span className="bg-eco-light text-eco-green px-2 py-1 rounded-full font-semibold">
                                        Score: {dest.sustainabilityScore}/100
                                    </span>
                                    <span className="text-gray-500">{dest.country}</span>
                                </div>
                                
                                <Link 
                                    to={`/destination/${dest._id}`} 
                                    className="block text-center bg-eco-dark hover:bg-black text-white py-2 rounded transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results;
