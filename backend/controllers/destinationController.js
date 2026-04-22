import Destination from '../models/Destination.js';
import User from '../models/User.js';
import { getRecommendations } from '../utils/recommendationEngine.js';
import { getOpenRouterRecommendations } from '../utils/openRouterService.js';

// @desc    Get all destinations or get recommended ones
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res) => {
    try {
        const { budget, climate, interests, country } = req.query;

        let queryFilter = {};

        const allDestinations = await Destination.find(queryFilter);

        if (budget || climate || interests || country) {
            // Assume interests come as comma separated
            const parsedInterests = interests ? interests.split(',') : [];

            // Try to get AI powered recommendations via OpenRouter
            if (process.env.OPENROUTER_API_KEY) {
                try {
                    const aiResults = await getOpenRouterRecommendations({
                        budget,
                        climate,
                        interests: parsedInterests,
                        country
                    });

                    if (aiResults && aiResults.length > 0) {
                        if (req.user) {
                            const user = await User.findById(req.user._id);
                            if (user) {
                                user.searchHistory.push({
                                    budget,
                                    climate,
                                    interests: parsedInterests,
                                });
                                await user.save();
                            }
                        }
                        return res.json(aiResults);
                    }
                } catch (aiErr) {
                    console.error("OpenRouter AI check failed, falling back to local datastore.", aiErr);
                }
            }

            // If OpenRouter AI failed or isn't configured, and user searched for a country, use OpenWeather API directly
            if (country && process.env.WEATHER_API_KEY) {
                try {
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Synthesize a generic DB-like destination object from the weather data
                        const dynamicDestination = {
                            _id: 'dynamic_' + data.id,
                            name: data.name,
                            country: data.sys.country,
                            description: `A dynamic destination based purely on your search. The current weather here is ${data.main.temp}°C with ${data.weather[0].description}.`,
                            image: `https://picsum.photos/seed/${encodeURIComponent(data.name)}/1000/800`,
                            budget: budget || 'Medium',
                            climate: climate || 'Temperate',
                            interests: ['Exploration', 'Nature'],
                            sustainabilityScore: Math.floor(Math.random() * 20) + 80,
                            carbonFootprint: 'Moderate',
                            ecoCertifications: ['Dynamic OpenWeather Discovery'],
                            weather: {
                                temperature: Math.round(data.main.temp),
                                condition: data.weather[0].main,
                                humidity: data.main.humidity,
                            }
                        };

                        // For the sake of saving history
                        if (req.user) {
                            const user = await User.findById(req.user._id);
                            if (user) {
                                user.searchHistory.push({ budget, climate, interests: [] });
                                await user.save();
                            }
                        }

                        // Return solely this freshly synthesized location
                        return res.json([dynamicDestination]);
                    }
                } catch (err) {
                    console.error('Failed dynamic OpenWeather search:', err.message);
                }
            }

            // Fetch live weather data for all destinations
            const destinationsWithWeather = await Promise.all(
                allDestinations.map(async (dest) => {
                    let weatherData = null;
                    if (process.env.WEATHER_API_KEY && dest.coordinates) {
                        try {
                            const { lat, lng } = dest.coordinates;
                            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
                            if (response.ok) {
                                const data = await response.json();
                                weatherData = {
                                    temperature: Math.round(data.main.temp),
                                    condition: data.weather[0].main,
                                    humidity: data.main.humidity,
                                };
                            }
                        } catch (err) {
                            console.error('Failed to fetch real weather:', err.message);
                        }
                    }
                    
                    // Fallback to static climate temp range if API fails
                    if (!weatherData) {
                        weatherData = {
                            temperature: dest.climate === 'Cold' ? Math.floor(Math.random() * 10) + 0 : 
                                         dest.climate === 'Tropical' ? Math.floor(Math.random() * 10) + 26 :
                                         Math.floor(Math.random() * 10) + 15,
                            condition: ['Sunny', 'Cloudy', 'Clear', 'Rainy'][Math.floor(Math.random() * 4)],
                            humidity: Math.floor(Math.random() * 50) + 40,
                        };
                    }

                    const destObj = dest.toObject();
                    destObj.weather = weatherData;
                    return destObj;
                })
            );

            // Run recommendation engine
            const recommended = getRecommendations(destinationsWithWeather, {
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
        console.error("GET DESTINATIONS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req, res) => {
    try {
        const { id } = req.params;

        // Handle dynamically synthesized OpenWeather locations
        if (id.startsWith('dynamic_')) {
            const openWeatherCityId = id.split('_')[1];
            if (process.env.WEATHER_API_KEY) {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${openWeatherCityId}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
                if (response.ok) {
                    const data = await response.json();
                    return res.json({
                        _id: id,
                        name: data.name,
                        country: data.sys.country,
                        description: `A dynamic destination identified by OpenWeather. Enjoy exploring this location currently experiencing ${data.weather[0].description}.`,
                        image: `https://picsum.photos/seed/${encodeURIComponent(data.name)}/1000/800`,
                        budget: 'Varies',
                        climate: 'Varies',
                        interests: ['Exploration', 'Nature'],
                        sustainabilityScore: Math.floor(Math.random() * 20) + 80,
                        carbonFootprint: 'Moderate',
                        ecoCertifications: ['Dynamic Discovery'],
                        coordinates: { lat: data.coord.lat, lng: data.coord.lon },
                        weather: {
                            temperature: Math.round(data.main.temp),
                            condition: data.weather[0].main,
                            humidity: data.main.humidity,
                        }
                    });
                }
            }
            return res.status(404).json({ message: 'Dynamic destination weather data unavailable' });
        }

        const destination = await Destination.findById(id);

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
