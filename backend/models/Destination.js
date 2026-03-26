import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        country: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        
        // Matchable Attributes
        budget: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
        climate: { type: String, enum: ['Tropical', 'Temperate', 'Arid', 'Cold'], required: true },
        interests: [{ type: String }], // E.g. ['Adventure', 'Wildlife', 'Relaxation']
        
        // Sustainability metrics
        sustainabilityScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        carbonFootprint: {
            type: String, // e.g., 'Low', 'Moderate', 'High'
            required: true,
        },
        ecoCertifications: [{ type: String }],
        
        // Coordinates for mock real-time weather integration
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        }
    },
    { timestamps: true }
);

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
