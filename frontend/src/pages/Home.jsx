import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [budget, setBudget] = useState('Medium');
    const [climate, setClimate] = useState('Tropical');
    const [country, setCountry] = useState('');
    const [interests, setInterests] = useState([]);

    const handleInterestChange = (e) => {
        const value = e.target.value;
        setInterests(prev => 
            prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams({
            budget,
            climate,
            country,
            interests: interests.join(',')
        });
        navigate(`/results?${searchParams.toString()}`);
    };

    return (
        <div className="max-w-3xl mx-auto text-center mt-12">
            <h1 className="text-4xl font-extrabold text-eco-green mb-6">Discover Your Eco-Friendly Escape</h1>
            <p className="text-lg text-gray-700 mb-8">
                Explore destinations curated for sustainability, minimal carbon footprints, and your unique travel vibe.
            </p>
            
            <form onSubmit={handleSearch} className="bg-white p-8 rounded-xl shadow-lg text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-eco-dark">Budget</label>
                        <select 
                            value={budget} 
                            onChange={(e) => setBudget(e.target.value)} 
                            className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-eco-accent"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-eco-dark">Preferred Climate</label>
                        <select 
                            value={climate} 
                            onChange={(e) => setClimate(e.target.value)} 
                            className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-eco-accent"
                        >
                            <option value="Tropical">Tropical</option>
                            <option value="Temperate">Temperate</option>
                            <option value="Arid">Arid</option>
                            <option value="Cold">Cold</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-eco-dark">Specific Country (Optional)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Indonesia, USA, Switzerland"
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                            className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-eco-accent"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-semibold mb-2 text-eco-dark">Travel Interests</label>
                    <div className="flex space-x-4">
                        {['Adventure', 'Relaxation', 'Wildlife', 'Culture'].map(interest => (
                            <label key={interest} className="flex items-center space-x-2">
                                <input 
                                    type="checkbox" 
                                    value={interest} 
                                    checked={interests.includes(interest)}
                                    onChange={handleInterestChange}
                                    className="rounded text-eco-accent focus:ring-eco-accent line-height-none"
                                />
                                <span>{interest}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full mt-8 bg-eco-accent hover:bg-eco-green text-white font-bold py-3 px-4 rounded-lg transition"
                >
                    Find Destinations
                </button>
            </form>
        </div>
    );
};

export default Home;
