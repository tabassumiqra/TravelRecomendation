import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from '../models/Destination.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const destinations = [
    {
        name: 'Costa Rica Eco Lodge',
        country: 'Costa Rica',
        description: 'Experience pure nature in this 100% off-grid eco lodge nestled in the rainforest.',
        image: 'https://images.unsplash.com/photo-1518182170546-076616fdcbca?auto=format&fit=crop&q=80',
        budget: 'Medium',
        climate: 'Tropical',
        interests: ['Wildlife', 'Adventure'],
        sustainabilityScore: 95,
        carbonFootprint: 'Low',
        ecoCertifications: ['Rainforest Alliance', 'LEED Platinum'],
        coordinates: { lat: 9.7489, lng: -83.7534 }
    },
    {
        name: 'Swiss Alps Cabins',
        country: 'Switzerland',
        description: 'Sustainable luxury amidst the pristine snowy peaks of the Swiss Alps.',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80',
        budget: 'High',
        climate: 'Cold',
        interests: ['Relaxation', 'Adventure'],
        sustainabilityScore: 85,
        carbonFootprint: 'Low',
        ecoCertifications: ['EarthCheck Gold'],
        coordinates: { lat: 46.8182, lng: 8.2275 }
    },
    {
        name: 'Bali Bamboo Retreat',
        country: 'Indonesia',
        description: 'Disconnect from the world in entirely bamboo-built structures hidden in Bali.',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80',
        budget: 'Medium',
        climate: 'Tropical',
        interests: ['Relaxation'],
        sustainabilityScore: 88,
        carbonFootprint: 'Low',
        ecoCertifications: ['Green Globe'],
        coordinates: { lat: -8.4095, lng: 115.1889 }
    },
    {
        name: 'Patagonia Eco Domes',
        country: 'Chile',
        description: 'Geodesic domes powered by renewable energy, offering views of the Torres del Paine.',
        image: 'https://images.unsplash.com/photo-1549448834-df41bda20af8?auto=format&fit=crop&q=80',
        budget: 'High',
        climate: 'Cold',
        interests: ['Adventure', 'Wildlife'],
        sustainabilityScore: 92,
        carbonFootprint: 'Low',
        ecoCertifications: ['B Corp'],
        coordinates: { lat: -51.2530, lng: -72.3551 }
    },
    {
        name: 'Sahara Desert Camp',
        country: 'Morocco',
        description: 'A completely solar-powered camp blending traditional nomadic life and sustainability.',
        image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80',
        budget: 'Low',
        climate: 'Arid',
        interests: ['Adventure', 'Relaxation'],
        sustainabilityScore: 80,
        carbonFootprint: 'Low',
        ecoCertifications: [],
        coordinates: { lat: 31.7917, lng: -7.0926 }
    },
    {
        name: 'Kerala Backwaters Eco Houseboat',
        country: 'India',
        description: 'Glide peacefully through the lush backwaters of Kerala on a traditional, solar-powered houseboat.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
        budget: 'Medium',
        climate: 'Tropical',
        interests: ['Relaxation', 'Culture', 'Wildlife'],
        sustainabilityScore: 89,
        carbonFootprint: 'Low',
        ecoCertifications: ['Green Leaf'],
        coordinates: { lat: 9.4981, lng: 76.3388 }
    }
];

const importData = async () => {
    try {
        await Destination.deleteMany();
        
        await Destination.insertMany(destinations);
        console.log('Destinations Seeded Successfully!');
        
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
