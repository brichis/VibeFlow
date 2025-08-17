// VibeFlow Matching Engine
// Calculates user compatibility based on verified interests and other factors

const cosineSimilarity = require('cosine-similarity');
const { getDistance } = require('geolib');

class MatchingEngine {
  constructor(options = {}) {
    this.weights = {
      interests: options.interestWeight || 0.6,
      geography: options.geographyWeight || 0.2,
      eventHistory: options.eventHistoryWeight || 0.15,
      recency: options.recencyWeight || 0.05
    };
    
    this.maxDistance = options.maxDistance || 2000; // meters
    this.cache = new Map();
  }

  // Main compatibility calculation
  calculateCompatibility(user1, user2, options = {}) {
    const cacheKey = `${user1.id}-${user2.id}`;
    if (this.cache.has(cacheKey) && !options.skipCache) {
      return this.cache.get(cacheKey);
    }

    // Calculate individual scores
    const interestScore = this.calculateInterestSimilarity(user1, user2);
    const geographyScore = this.calculateGeographySimilarity(user1, user2);
    const eventHistoryScore = this.calculateEventHistorySimilarity(user1, user2);
    const recencyScore = this.calculateRecencyScore(user1, user2);

    // Weighted final score
    const finalScore = (
      interestScore * this.weights.interests +
      geographyScore * this.weights.geography +
      eventHistoryScore * this.weights.eventHistory +
      recencyScore * this.weights.recency
    );

    const result = {
      overallScore: Math.round(finalScore * 100) / 100,
      breakdown: {
        interests: Math.round(interestScore * 100) / 100,
        geography: Math.round(geographyScore * 100) / 100,
        eventHistory: Math.round(eventHistoryScore * 100) / 100,
        recency: Math.round(recencyScore * 100) / 100
      },
      sharedInterests: this.getSharedInterests(user1, user2),
      metadata: {
        calculatedAt: new Date().toISOString(),
        user1Events: user1.verification?.totalVerifiedEvents || 0,
        user2Events: user2.verification?.totalVerifiedEvents || 0
      }
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  // Interest similarity using cosine similarity
  calculateInterestSimilarity(user1, user2) {
    try {
      const vector1 = this.createInterestVector(user1.verifiedInterests);
      const vector2 = this.createInterestVector(user2.verifiedInterests);
      
      // Handle edge cases
      if (this.isEmptyVector(vector1) || this.isEmptyVector(vector2)) {
        return 0;
      }

      const similarity = cosineSimilarity(vector1, vector2);
      return isNaN(similarity) ? 0 : Math.max(0, Math.min(1, similarity));
    } catch (error) {
      console.error('Interest similarity calculation error:', error);
      return 0;
    }
  }

  // Geographic similarity based on event locations
  calculateGeographySimilarity(user1, user2) {
    const locations1 = new Set(user1.locationHistory || []);
    const locations2 = new Set(user2.locationHistory || []);
    
    if (locations1.size === 0 || locations2.size === 0) {
      return 0.5; // Neutral score when no location data
    }

    // Jaccard similarity for shared locations
    const intersection = new Set([...locations1].filter(x => locations2.has(x)));
    const union = new Set([...locations1, ...locations2]);
    
    const jaccardSimilarity = intersection.size / union.size;
    
    // Bonus for international travel patterns
    const internationalBonus = this.hasInternationalOverlap(locations1, locations2) ? 0.1 : 0;
    
    return Math.min(1.0, jaccardSimilarity + internationalBonus);
  }

  // Event history similarity (shared event types/organizers)
  calculateEventHistorySimilarity(user1, user2) {
    const organizers1 = this.extractOrganizers(user1.eventHistory?.eventbrite || []);
    const organizers2 = this.extractOrganizers(user2.eventHistory?.eventbrite || []);
    
    if (organizers1.size === 0 || organizers2.size === 0) {
      return 0.3; // Low baseline when no event data
    }

    // Shared organizers indicate similar event preferences
    const sharedOrganizers = new Set([...organizers1].filter(x => organizers2.has(x)));
    const totalOrganizers = new Set([...organizers1, ...organizers2]);
    
    return sharedOrganizers.size / totalOrganizers.size;
  }

  // Recency score (recent activity gets higher weight)
  calculateRecencyScore(user1, user2) {
    const now = new Date();
    const user1Recency = this.getAccountRecency(user1, now);
    const user2Recency = this.getAccountRecency(user2, now);
    
    // More recent activity gets higher scores
    const avgRecency = (user1Recency + user2Recency) / 2;
    
    if (avgRecency <= 30) return 1.0;    // Very recent (last month)
    if (avgRecency <= 90) return 0.8;    // Recent (last 3 months)
    if (avgRecency <= 180) return 0.6;   // Somewhat recent (last 6 months)
    return 0.4; // Older activity
  }

  // Create interest vector for cosine similarity
  createInterestVector(userInterests) {
    const allPossibleInterests = this.getAllInterestCategories();
    const vector = {};
    
    // Initialize with zeros
    allPossibleInterests.forEach(interest => {
      vector[interest] = 0;
    });
    
    // Set weights based on user's interests
    userInterests.forEach(({ interest, weight, confidence }) => {
      if (vector.hasOwnProperty(interest)) {
        // Weight by both frequency and confidence
        vector[interest] = (weight || 1) * (confidence || 1);
      }
    });
    
    return vector;
  }

  // Get all possible interest categories from the system
  getAllInterestCategories() {
    return [
      // Web3 & Blockchain
      'zk', 'governance', 'ai', 'identity', 'dao', 'nft', 'nodes', 'defi', 'layer2',
      'cryptography', 'smart-contracts', 'web3-gaming', 'rwa',
      
      // Ecosystems
      'flow-ecosystem', 'ethereum', 'dynamic-ecosystem', 'hardhat', 'polygon', 'solana',
      
      // Professional
      'startups', 'investment', 'product-management', 'engineering', 'design', 'marketing',
      'conferences', 'networking',
      
      // Social & Lifestyle
      'dancing', 'salsa-dancing', 'bachata', 'fitness', 'yoga', 'running', 'hiking',
      'music', 'art', 'photography', 'travel', 'food', 'wine', 'coffee', 'books', 'gaming',
      
      // Education
      'education', 'research', 'workshops', 'mentorship'
    ];
  }

  // Find shared interests between users
  getSharedInterests(user1, user2) {
    const interests1 = new Set(user1.verifiedInterests.map(i => i.interest));
    const interests2 = new Set(user2.verifiedInterests.map(i => i.interest));
    
    const shared = [...interests1].filter(interest => interests2.has(interest));
    
    return shared.map(interest => {
      const user1Interest = user1.verifiedInterests.find(i => i.interest === interest);
      const user2Interest = user2.verifiedInterests.find(i => i.interest === interest);
      
      return {
        interest,
        user1Weight: user1Interest?.weight || 0,
        user2Weight: user2Interest?.weight || 0,
        combinedStrength: (user1Interest?.weight || 0) + (user2Interest?.weight || 0)
      };
    }).sort((a, b) => b.combinedStrength - a.combinedStrength);
  }

  // Find best matches for a user
  findMatches(targetUser, candidateUsers, options = {}) {
    const {
      limit = 10,
      minScore = 0.2,
      excludeIds = []
    } = options;

    const matches = candidateUsers
      .filter(candidate => candidate.id !== targetUser.id)
      .filter(candidate => !excludeIds.includes(candidate.id))
      .map(candidate => ({
        user: candidate,
        compatibility: this.calculateCompatibility(targetUser, candidate)
      }))
      .filter(match => match.compatibility.overallScore >= minScore)
      .sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore)
      .slice(0, limit);

    return matches;
  }

  // Proximity-based matching for events
  findNearbyMatches(targetUser, candidateUsers, currentLocation, radiusMeters = 1000) {
    if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
      return [];
    }

    const nearbyUsers = candidateUsers.filter(candidate => {
      if (!candidate.currentLocation) return false;
      
      const distance = getDistance(
        { latitude: currentLocation.lat, longitude: currentLocation.lng },
        { latitude: candidate.currentLocation.lat, longitude: candidate.currentLocation.lng }
      );
      
      return distance <= radiusMeters;
    });

    return this.findMatches(targetUser, nearbyUsers, { limit: 5, minScore: 0.3 });
  }

  // Helper functions
  isEmptyVector(vector) {
    return Object.values(vector).every(val => val === 0);
  }

  hasInternationalOverlap(locations1, locations2) {
    const getCountries = (locations) => {
      return new Set([...locations].map(loc => loc.split(', ').pop()));
    };
    
    const countries1 = getCountries(locations1);
    const countries2 = getCountries(locations2);
    
    return countries1.size > 1 && countries2.size > 1 && 
           [...countries1].some(country => countries2.has(country));
  }

  extractOrganizers(events) {
    return new Set(events.map(event => event.event?.organizer || event.organizer).filter(Boolean));
  }

  getAccountRecency(user, now) {
    const verifiedAt = new Date(user.verification?.verifiedAt || user.lastUpdated);
    const daysSince = Math.floor((now - verifiedAt) / (1000 * 60 * 60 * 24));
    return daysSince;
  }

  // Clear cache periodically
  clearCache() {
    this.cache.clear();
  }

  // Update matching weights
  updateWeights(newWeights) {
    this.weights = { ...this.weights, ...newWeights };
    this.clearCache();
  }
}

module.exports = { MatchingEngine };