import Destination from '../models/Destination.js';
import User from '../models/User.js';
import { getRecommendations } from '../utils/recommendationEngine.js';

// @desc    Get all destinations or get recommended ones
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res) => {
    try {
        const { budget, climate, interests } = req.query;

        const allDestinations = await Destination.find({});

        if (budget || climate || interests) {
            // Assume interests come as comma separated
            const parsedInterests = interests ? interests.split(',') : [];

            // Run recommendation engine
            const recommended = getRecommendations(allDestinations, {
                budget,
                climate,
                interests: parsedInterests,
            });

            // Save to user history if logged in (optional tracking)
            if (req.user) {
                const user = await User.findById(req.user._id);
                user.searchHistory.push({
                    budget,
                    climate,
                    interests: parsedInterests,
                });
                await user.save();
            }

            return res.json(recommended);
        }

        res.json(allDestinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (destination) {
            let weatherData = null;
            
            // Try fetching real weather data if key exists
            if (process.env.WEATHER_API_KEY && destination.coordinates) {
                try {
                    const { lat, lng } = destination.coordinates;
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        weatherData = {
                            temperature: Math.round(data.main.temp),
                            condition: data.weather[0].main,
                            humidity: data.main.humidity,
                        };
                    } else {
                        console.error('Weather API response error. Check the key. Falling back to mock data.');
                    }
                } catch (err) {
                    console.error('Failed to fetch real weather:', err.message);
                }
            }

            // Fallback mock real-time weather integration
            if (!weatherData) {
                weatherData = {
                    temperature: Math.floor(Math.random() * 15) + 20, // 20-35 C
                    condition: ['Sunny', 'Cloudy', 'Clear', 'Rainy'][
                        Math.floor(Math.random() * 4)
                    ],
                    humidity: Math.floor(Math.random() * 50) + 40, // 40-90%
                };
            }

            res.json({ ...destination.toObject(), weather: weatherData });
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
