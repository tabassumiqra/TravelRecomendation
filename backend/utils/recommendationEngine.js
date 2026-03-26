/**
 * Simple Rule-Based Recommendation Algorithm
 * 
 * Score calculation:
 * 1. Exact match on Budget: +10 points (or filter out if strict)
 * 2. Exact match on Climate: +10 points
 * 3. Match on Interests: +5 points per matched interest
 * 4. Sustainability Score: Adds to the weight (score / 10)
 * 5. Carbon Footprint: 'Low' (+10), 'Moderate' (+5), 'High' (0)
 */

export const getRecommendations = (destinations, userPrefs) => {
    const { budget, climate, interests } = userPrefs;
    let scoredDestinations = [];

    destinations.forEach(dest => {
        let score = 0;

        // Hard filter - Budget must match
        if (dest.budget !== budget) {
             // In a strict system we might return early, but let's just score it lower
             score -= 20; 
        } else {
             score += 15;
        }

        // Climate Match
        if (dest.climate === climate) score += 10;

        // Interests Match
        let matchedInterests = 0;
        if (interests && interests.length > 0) {
            dest.interests.forEach(interest => {
                if (interests.includes(interest)) {
                    matchedInterests++;
                }
            });
        }
        score += (matchedInterests * 5);

        // Sustainability Weight
        score += (dest.sustainabilityScore / 10); // max +10

        // Carbon Footprint Weight
        if (dest.carbonFootprint === 'Low') score += 10;
        else if (dest.carbonFootprint === 'Moderate') score += 5;

        // Only recommend destinations with a positive/acceptable score
        if (score > 0) {
            scoredDestinations.push({ destination: dest, matchScore: score });
        }
    });

    // Sort by descending score
    scoredDestinations.sort((a, b) => b.matchScore - a.matchScore);

    return scoredDestinations.map(item => item.destination);
};
