export const getOpenRouterRecommendations = async (preferences) => {
    const { budget, climate, interests, country } = preferences;
    
    if (!process.env.OPENROUTER_API_KEY) {
        console.warn("OPENROUTER_API_KEY is missing. AI functionality disabled.");
        return [];
    }

    const interestsText = Array.isArray(interests) ? interests.join(", ") : interests || "Any";

    const prompt = `You are a professional travel recommendation AI. Based on the user's following preferences:
- Budget: ${budget || 'Any'}
- Climate: ${climate || 'Any'}
- Interests: ${interestsText}
- Specific Location Search: ${country || 'Any'}

If a "Specific Location Search" is provided, ensure many recommendations are in or around that location, while keeping the user's budget, climate, and interests in mind.
If no specific location is provided, generate a diverse set of 10 highly suitable global travel destinations that match the criteria.

Return the results STRICTLY as a JSON array where each object represents a destination and has the exact following structure with NO additional fields outside this structure. Do NOT include markdown code formatting (like \`\`\`json). Just the raw JSON array.
[
    {
        "name": "City/Location Name",
        "country": "Country Name",
        "description": "Short compelling and authentic description highlighting why this fits the user's preferences (max 2 sentences)",
        "image": "https://images.unsplash.com/photo-1506744626753-eda8151a74a1?auto=format&fit=crop&w=1000&q=80",
        "budget": "Medium", // strictly one of: Low, Medium, High (adapt base on user budget)
        "climate": "Temperate", // strictly one of: Tropical, Temperate, Arid, Cold
        "interests": ["keyword1", "keyword2"], // array of 2-4 string keywords
        "sustainabilityScore": 85, // integer between 40 and 100
        "carbonFootprint": "Moderate", // strictly one of: Low, Moderate, High
        "ecoCertifications": ["Local Tourism"], // array of 1-3 strings
        "coordinates": { 
            "lat": 1.234, 
            "lng": 5.678 
        }
    }
]
`;

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "openai/gpt-4o-mini", // Changed to a different model
                    "messages": [
                        { "role": "user", "content": prompt }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw { status: response.status, details: errorData };
            }

            const data = await response.json();
            let text = data.choices[0].message.content;
            
            // Clean up formatting issues if the model wraps the output in code blocks
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const destinations = JSON.parse(text);
            
            // Map the generated destinations to include a mock _id and a generic weather object for consistency 
            return destinations.map((dest, index) => ({
                ...dest,
                _id: `openrouter_${index}_${Date.now()}`,
                image: `https://picsum.photos/seed/${encodeURIComponent(dest.name)}/1000/800`,
                weather: {
                    temperature: dest.climate === 'Cold' ? Math.floor(Math.random() * 10) + 0 : 
                                 dest.climate === 'Tropical' ? Math.floor(Math.random() * 10) + 26 :
                                 Math.floor(Math.random() * 10) + 15,
                    condition: ['Sunny', 'Cloudy', 'Clear', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
                    humidity: Math.floor(Math.random() * 50) + 40,
                }
            }));
        } catch (error) {
             if ((error?.status === 503 || error?.status === 429) && attempt < maxRetries - 1) {
                 attempt++;
                 const delay = Math.pow(2, attempt) * 1000;
                 console.warn(`OpenRouter API temporarily unavailable (${error.status}), retrying in ${delay / 1000}s... (Attempt ${attempt} of ${maxRetries - 1})`);
                 await new Promise(resolve => setTimeout(resolve, delay));
             } else {
                 console.error("Failed to generate recommendations from OpenRouter:", error);
                 return null;
             }
        }
    }
    
    return null;
};
