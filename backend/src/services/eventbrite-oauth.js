// VibeFlow Eventbrite OAuth Integration
// This handles connecting to users' Eventbrite accounts

class EventbriteOAuth {
  constructor() {
    // Configuration for Eventbrite API
    this.config = {
      clientId: process.env.EVENTBRITE_CLIENT_ID,
      clientSecret: process.env.EVENTBRITE_CLIENT_SECRET,
      redirectUri: process.env.EVENTBRITE_REDIRECT_URI,
      authUrl: 'https://www.eventbrite.com/oauth/authorize',
      tokenUrl: 'https://www.eventbrite.com/oauth/token',
      apiBaseUrl: 'https://www.eventbriteapi.com/v3'
    };
  }

    // Step 1: Create the URL to send users to Eventbrite
    generateAuthUrl(userId) {
        const stateParam = `${userId}_${Date.now()}`;
        
        const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        scope: 'read',
        state: stateParam
        });

        return `${this.config.authUrl}?${params}`;
    }
    // Step 2: Trade the code for an access token
    async exchangeCodeForToken(code) {
        try {
            console.log('🔄 Token exchange request details:');
            console.log('  Code:', code.substring(0, 10) + '...');
            console.log('  Client ID:', this.config.clientId);
            console.log('  Redirect URI:', this.config.redirectUri);
            
            const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            code: code,
            redirect_uri: this.config.redirectUri
            });
            
            console.log('🔄 Request body:', requestBody.toString());
            
            const response = await fetch(this.config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody
            });

            console.log('📡 Token response status:', response.status);
            
            const responseText = await response.text();
            console.log('📡 Token response body:', responseText);
            
            if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.status} - ${responseText}`);
            }

            const tokenData = JSON.parse(responseText);
            
            if (tokenData.access_token) {
            console.log('🔑 Access token received (first 20 chars):', tokenData.access_token.substring(0, 20) + '...');
            console.log('🔑 Token type:', tokenData.token_type);
            console.log('🔑 Full token data keys:', Object.keys(tokenData));
            
            return {
                success: true,
                accessToken: tokenData.access_token
            };
            } else {
            throw new Error('No access token in response: ' + responseText);
            }
        } catch (error) {
            console.error('❌ Token exchange error:', error);
            return {
            success: false,
            error: error.message
            };
        }
        }

    // Step 3: Get basic info about the user
    async fetchUserProfile(accessToken) {
        try {
            console.log('🔍 Fetching profile with token:', accessToken.substring(0, 10) + '...');
            console.log('🔍 Using URL:', `${this.config.apiBaseUrl}/users/me/`);
            
            const response = await fetch(`${this.config.apiBaseUrl}/users/me/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
            });

            console.log('📡 Profile response status:', response.status);
            console.log('📡 Profile response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Profile error response body:', errorText);
            throw new Error(`Profile fetch failed: ${response.status} - ${errorText}`);
            }

            const userData = await response.json();
            console.log('✅ Profile data received for:', userData.name);
            
            return {
            success: true,
            profile: {
                id: userData.id,
                name: userData.name,
                email: userData.emails?.[0]?.email,
                firstName: userData.first_name,
                lastName: userData.last_name
            }
            };
        } catch (error) {
            console.error('❌ Full profile error:', error.message);
            return {
            success: false,
            error: error.message
            };
        }
        }

  // Step 4: Get user's past event purchases 
  async fetchUserOrders(accessToken) {
    try {
      const url = `${this.config.apiBaseUrl}/users/me/orders/?expand=event.venue,event.category&time_filter=past`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Orders fetch failed: ${response.status}`);
      }

      const ordersData = await response.json();
      
      // Clean up the data to just what we need
      const processedOrders = ordersData.orders?.map(order => ({
        orderId: order.id,
        orderDate: order.created,
        status: order.status,
        event: order.event ? {
          id: order.event.id,
          name: order.event.name?.text,
          description: order.event.description?.text,
          startDate: order.event.start?.local,
          venue: order.event.venue ? {
            name: order.event.venue.name,
            city: order.event.venue.address?.city,
            country: order.event.venue.address?.country
          } : null,
          category: order.event.category ? {
            name: order.event.category.name
          } : null
        } : null
      })) || [];

      return {
        success: true,
        orders: processedOrders,
        totalCount: ordersData.pagination?.object_count || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Step 5: Extract interests from what events they actually attended
  extractInterestsFromOrders(orders) {
    const interestFrequency = new Map();
    const locationHistory = new Set();

    orders.forEach(order => {
      if (!order.event) return;

      const event = order.event;
      const eventText = `${event.name || ''} ${event.description || ''}`.toLowerCase();

      // Track locations where they buy tickets
      if (event.venue?.city && event.venue?.country) {
        locationHistory.add(`${event.venue.city}, ${event.venue.country}`);
      }

      // Extract interests based on event content
      const extractedInterests = this.findInterestsInText(eventText);
      
      extractedInterests.forEach(interest => {
        const current = interestFrequency.get(interest) || { 
          weight: 0, 
          events: []
        };
        
        current.weight += 1;
        current.events.push(event.name);
        
        interestFrequency.set(interest, current);
      });
    });

    // Convert to sorted array (strongest interests first)
    const interests = Array.from(interestFrequency.entries()).map(([interest, data]) => ({
      interest,
      weight: data.weight,
      confidence: Math.min(data.weight / 3, 1.0), // More events = higher confidence
      eventCount: data.events.length,
      sampleEvents: data.events.slice(0, 2), // Show examples
      source: 'eventbrite'
    })).sort((a, b) => b.weight - a.weight);

    return {
      interests,
      locationHistory: Array.from(locationHistory),
      totalEvents: orders.length
    };
  }

  // Helper: Find specific interests in event text
  findInterestsInText(eventText) {
        const interests = [];

        // Web3 & Blockchain Technology
        const web3Keywords = {
            'zk': ['zk', 'zero knowledge', 'zk-snarks', 'zk-starks', 'zero-knowledge'],
            'governance': ['governance', 'voting', 'proposals', 'dao governance'],
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'neural networks', 'llm'],
            'identity': ['identity', 'did', 'self-sovereign', 'credential', 'authentication'],
            'dao': ['dao', 'decentralized autonomous', 'governance token'],
            'nft': ['nft', 'non-fungible', 'digital art', 'collectibles', 'metadata'],
            'nodes': ['nodes', 'validator', 'infrastructure', 'consensus'],
            'defi': ['defi', 'decentralized finance', 'yield', 'liquidity', 'dex'],
            'layer2': ['layer 2', 'l2', 'scaling', 'rollups', 'optimistic'],
            'cryptography': ['cryptography', 'encryption', 'hash', 'merkle', 'signatures'],
            'smart-contracts': ['smart contracts', 'solidity', 'vyper', 'contract'],
            'web3-gaming': ['web3 gaming', 'play to earn', 'gamefi', 'metaverse'],
            'rwa': ['rwa', 'real world assets', 'tokenization', 'asset backing']
        };

        // Ecosystem Specific
        const ecosystemKeywords = {
            'flow-ecosystem': ['flow', 'flow blockchain', 'cadence', 'flow developer'],
            'ethereum': ['ethereum', 'eth', 'vitalik', 'evm', 'merge'],
            'dynamic-ecosystem': ['dynamic', 'dynamic auth', 'wallet connection'],
            'hardhat': ['hardhat', 'foundry', 'truffle', 'development tools'],
            'polygon': ['polygon', 'matic', 'pos', 'polygon pos'],
            'solana': ['solana', 'sol', 'rust', 'anchor framework'],
            'cosmos': ['cosmos', 'ibc', 'atom', 'cosmos sdk'],
            'polkadot': ['polkadot', 'substrate', 'parachain', 'dot']
        };

        // Professional & Business
        const professionalKeywords = {
            'startups': ['startup', 'entrepreneur', 'founder', 'venture capital'],
            'investment': ['investment', 'vc', 'funding', 'raise', 'valuation'],
            'product-management': ['product', 'pm', 'roadmap', 'user experience'],
            'engineering': ['engineering', 'software', 'development', 'code'],
            'design': ['design', 'ux', 'ui', 'user interface', 'figma'],
            'marketing': ['marketing', 'growth', 'acquisition', 'branding'],
            'business-development': ['business development', 'partnerships', 'strategy'],
            'conferences': ['conference', 'summit', 'convention', 'expo'],
            'networking': ['networking', 'meetup', 'professional', 'connections']
        };

        // Social & Lifestyle (Bumble-inspired)
        const socialKeywords = {
            'dancing': ['dance', 'dancing', 'social dance', 'ballroom'],
            'salsa-dancing': ['salsa', 'salsa dancing', 'latin dance'],
            'bachata': ['bachata', 'sensual dance'],
            'fitness': ['fitness', 'gym', 'workout', 'exercise', 'training'],
            'yoga': ['yoga', 'meditation', 'mindfulness', 'wellness'],
            'running': ['running', 'marathon', 'jogging', 'trail running'],
            'hiking': ['hiking', 'outdoor', 'nature', 'trails', 'mountains'],
            'cycling': ['cycling', 'bike', 'biking', 'bicycle'],
            'music': ['music', 'concert', 'live music', 'festival'],
            'art': ['art', 'gallery', 'exhibition', 'creative', 'painting'],
            'photography': ['photography', 'photo', 'camera', 'visual'],
            'travel': ['travel', 'adventure', 'explore', 'journey'],
            'food': ['food', 'cooking', 'culinary', 'restaurant', 'chef'],
            'wine': ['wine', 'tasting', 'vineyard', 'sommelier'],
            'coffee': ['coffee', 'cafe', 'espresso', 'roasting'],
            'books': ['books', 'reading', 'literature', 'author'],
            'gaming': ['gaming', 'games', 'esports', 'video games'],
            'volunteering': ['volunteer', 'charity', 'community service', 'nonprofit']
        };

        // Education & Learning
        const educationKeywords = {
            'education': ['education', 'learning', 'teaching', 'academic'],
            'research': ['research', 'study', 'analysis', 'investigation'],
            'workshops': ['workshop', 'training', 'masterclass', 'bootcamp'],
            'mentorship': ['mentor', 'coaching', 'guidance', 'advisor'],
            'certification': ['certification', 'credential', 'qualified', 'accredited']
        };

        // Combine all categories
        const allKeywords = {
            ...web3Keywords,
            ...ecosystemKeywords,
            ...professionalKeywords,
            ...socialKeywords,
            ...educationKeywords
        };

        // Extract interests
        Object.entries(allKeywords).forEach(([interest, keywords]) => {
            if (keywords.some(keyword => eventText.includes(keyword))) {
            interests.push(interest);
            }
        });

        return [...new Set(interests)];
        }

  // Step 6: Create final user profile with all verified data
  createUserProfile(walletAddress, profile, ordersData, extractedData) {
    return {
      walletAddress,
      id: walletAddress,
      name: profile.name,
      email: profile.email,
      eventbriteId: profile.id,
      
      // Verified interests from actual purchases
      verifiedInterests: extractedData.interests,
      
      // Event history
      eventHistory: {
        eventbrite: ordersData.orders,
        totalPurchases: ordersData.totalCount
      },
      
      // Geographic data
      locationHistory: extractedData.locationHistory,
      
      // Verification status
      verification: {
        eventbriteVerified: true,
        totalVerifiedEvents: extractedData.totalEvents,
        verifiedAt: new Date().toISOString()
      },
      
      lastUpdated: new Date().toISOString()
    };
  }
    // Demo function with actual event types
  getMockUserData() {
    return {
      profile: {
        id: 'demo_user_123',
        name: 'Demo User',
        email: 'demo@example.com'
      },
      orders: [
        {
          orderId: '10807839299',
          orderDate: '2024-10-19T22:39:00Z',
          event: {
            name: 'AfroLatin Brunch - Salsa, Bachata, Timba & Kiz Social',
            description: 'Join us for amazing brunch with live Latin music and social dancing',
            venue: { city: 'Mexico City', country: 'MX' },
            category: { name: 'Music' }
          }
        },
        {
          orderId: '10655051959',
          orderDate: '2024-10-07T12:03:00Z',
          event: {
            name: 'BachaMambo Dual Rooms - Salsa y Bachata',
            description: 'Two rooms of social dancing with different styles',
            venue: { city: 'Mexico City', country: 'MX' },
            category: { name: 'Performing & Visual Arts' }
          }
        },
        {
          orderId: '9891609699',
          orderDate: '2024-06-24T12:34:00Z',
          event: {
            name: 'Modular Summit 3.0',
            description: 'Conference on modular blockchain architecture and scalability',
            venue: { city: 'Brussels', country: 'BE' },
            category: { name: 'Business & Professional' }
          }
        }
      ]
    };
  }
}

module.exports = { EventbriteOAuth };