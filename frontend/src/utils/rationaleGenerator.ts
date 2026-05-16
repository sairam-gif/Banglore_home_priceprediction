// frontend/src/utils/rationaleGenerator.ts

export const generatePropertyRationale = (property: any) => {
    const { Location, score, amenities, avg_price, factors, nearby } = property;
    
    // Determine the primary strength
    const primaryFactor = Object.keys(factors).reduce((a, b) => factors[a] > factors[b] ? a : b);
    
    return {
        title: Location,
        narrative: `Selected as a top tier property with a total algorithmic score of ${score}/10. 
        Our analysis shows that ${Location} excels primarily due to its ${primaryFactor} profile (rated ${factors[primaryFactor]}/10). 
        With essential amenities like ${amenities.join(', ')} and proximity to key landmarks including ${nearby.join(', ')}, 
        this property offers a balanced ${((avg_price / 1000000)).toFixed(1)}M valuation, making it a standout choice for high-yield investment.`,
        scoreBreakdown: factors
    };
};
