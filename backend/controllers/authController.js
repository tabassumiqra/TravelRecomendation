import User from '../models/User.js';
import Destination from '../models/Destination.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                savedDestinations: user.savedDestinations,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile/history
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedDestinations');
        
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                searchHistory: user.searchHistory,
                savedDestinations: user.savedDestinations,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle Save Destination (Add or Remove)
// @route   POST /api/auth/save-destination
// @access  Private
export const toggleSaveDestination = async (req, res) => {
    try {
        const { destination } = req.body;
        if (!destination) {
            return res.status(400).json({ message: 'Destination data is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let destId = destination._id;

        // If 'destination' is an AI/dynamic one that doesn't exist in MongoDB yet
        if (destId.startsWith('dynamic_') || destId.startsWith('openrouter_') || destId.startsWith('gemini_')) {
            // Check if we previously saved this by name and country
            let existingDest = await Destination.findOne({ name: destination.name, country: destination.country });
            
            if (!existingDest) {
                // Remove the fake _id so MongoDB can generate a real one
                const newDestData = { ...destination };
                delete newDestData._id;
                delete newDestData.weather; // optionally keep out volatile data like current weather
                
                existingDest = await Destination.create(newDestData);
            }
            destId = existingDest._id.toString();
        }

        // Check if destination is already in saved list
        const isSaved = user.savedDestinations.includes(destId);

        if (isSaved) {
            // Remove it
            user.savedDestinations = user.savedDestinations.filter((id) => id.toString() !== destId);
        } else {
            // Add it
            user.savedDestinations.push(destId);
        }

        await user.save();

        res.json({
            savedDestinations: user.savedDestinations,
            message: isSaved ? 'Destination removed' : 'Destination saved'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
