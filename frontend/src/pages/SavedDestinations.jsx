import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const SavedDestinations = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [savedDestinations, setSavedDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchSaved = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setSavedDestinations(data.savedDestinations || []);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, [user, navigate]);

    if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Saved Destinations...</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6 text-eco-dark text-center">Your Saved Destinations</h1>

            {savedDestinations.length === 0 ? (
                <div className="text-center bg-white p-8 rounded-lg shadow">
                    <p className="text-lg text-gray-600">You haven't saved any destinations yet.</p>
                    <Link to="/" className="text-eco-accent underline mt-4 inline-block">Discover Places</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedDestinations.map(dest => (
                        <div key={dest._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300">
                            <img src={dest.image} alt={dest.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{dest.description}</p>

                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span className="bg-eco-light text-eco-green px-2 py-1 rounded-full font-semibold">
                                        Score: {dest.sustainabilityScore}/100
                                    </span>
                                    <span className="text-gray-500 font-semibold">{dest.country}</span>
                                </div>
                                
                                <Link
                                    to={`/destination/${dest._id}`}
                                    state={{ destinationData: dest }}
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

export default SavedDestinations;
