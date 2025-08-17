// VibeFlow Eventbrite OAuth Integration Server
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import OAuth integration
const { EventbriteOAuth } = require('./services/eventbrite-oauth');
const eventbriteAuth = new EventbriteOAuth();

// Import matching engine
const { MatchingEngine } = require('./services/matching-engine');
const matchingEngine = new MatchingEngine();

// In-memory storage for demo (use database in production)
const userProfiles = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main application page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>VibeFlow - Event-Based Interest Verification</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                max-width: 900px; 
                margin: 0 auto; 
                padding: 20px; 
                background: #f8fafc;
                line-height: 1.6;
            }
            .container { 
                background: white; 
                padding: 40px; 
                border-radius: 12px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
            }
            .button { 
                display: inline-block; 
                padding: 16px 32px; 
                background: #3b82f6; 
                color: white; 
                text-decoration: none; 
                border-radius: 8px; 
                margin: 15px 0;
                font-weight: 600;
                transition: background 0.2s;
            }
            .button:hover { background: #2563eb; }
            .success { 
                background: #ecfdf5; 
                color: #065f46; 
                padding: 16px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border-left: 4px solid #10b981; 
            }
            .error { 
                background: #fef2f2; 
                color: #991b1b; 
                padding: 16px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border-left: 4px solid #ef4444; 
            }
            .profile { 
                background: #f9fafb; 
                padding: 24px; 
                border-radius: 8px; 
                margin: 24px 0; 
                border: 1px solid #e5e7eb; 
            }
            .interest { 
                display: inline-block; 
                background: #3b82f6; 
                color: white; 
                padding: 6px 14px; 
                border-radius: 20px; 
                margin: 4px; 
                font-size: 0.85em; 
                font-weight: 500;
            }
            .config-status { 
                background: #f3f4f6; 
                padding: 16px; 
                border-radius: 8px; 
                margin: 20px 0; 
                font-family: monospace;
                font-size: 0.9em;
            }
            .header { color: #1f2937; margin-bottom: 8px; }
            .subheader { color: #6b7280; margin-bottom: 24px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="header">VibeFlow Interest Verification</h1>
            <p class="subheader">Connect your Eventbrite account to extract verified interests from actual event attendance.</p>
            
            ${req.query.success ? `
                <div class="success">
                    <strong>Authentication Successful</strong><br>
                    Your event history has been analyzed and interest profile generated.
                </div>
            ` : ''}
            
            ${req.query.error ? `
                <div class="error">
                    <strong>Authentication Error:</strong> ${req.query.error}<br>
                    Please check your configuration and try again.
                </div>
            ` : ''}
            
            <h2>Connect Eventbrite Account</h2>
            <p>Authenticate to analyze your event attendance history and extract verified interests.</p>
            <a href="/auth/eventbrite?userId=user_${Date.now()}" class="button">
                Connect Eventbrite Account
            </a>
            
            <h2>System Configuration</h2>
            <div class="config-status">
                OAuth Client ID: ${process.env.EVENTBRITE_CLIENT_ID ? 'Configured' : 'Not configured'}<br>
                OAuth Client Secret: ${process.env.EVENTBRITE_CLIENT_SECRET ? 'Configured' : 'Not configured'}<br>
                Redirect URI: ${process.env.EVENTBRITE_REDIRECT_URI || 'Not configured'}
            </div>
            
            ${userProfiles.size > 0 ? `
                <h2>Latest Profile Analysis</h2>
                <div class="profile">
                    ${Array.from(userProfiles.values()).map(profile => `
                        <h3>User: ${profile.name || 'Anonymous'}</h3>
                        <p><strong>Extracted Interest Categories:</strong></p>
                        <div style="margin: 16px 0;">
                            ${profile.verifiedInterests.slice(0, 12).map(interest => 
                                `<span class="interest">${interest.interest} (${interest.weight})</span>`
                            ).join('')}
                        </div>
                        
                        <p><strong>Geographic Activity:</strong> ${profile.locationHistory.join(', ') || 'None detected'}</p>
                        <p><strong>Events Analyzed:</strong> ${profile.verification.totalVerifiedEvents}</p>
                        <p><strong>Verification Status:</strong> ${profile.verification.eventbriteVerified ? 'Verified' : 'Pending'}</p>
                        <p><strong>Profile Created:</strong> ${new Date(profile.verification.verifiedAt).toLocaleString()}</p>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    </body>
    </html>
  `);
});

// Initiate OAuth flow
app.get('/auth/eventbrite', (req, res) => {
  try {
    const userId = req.query.userId || `user_${Date.now()}`;
    const authUrl = eventbriteAuth.generateAuthUrl(userId);
    
    console.log('Initiating OAuth authorization flow for user:', userId);
    res.redirect(authUrl);
  } catch (error) {
    console.error('OAuth initiation error:', error);
    res.redirect('/?error=oauth_init_failed');
  }
});

// Handle OAuth callback
app.get('/auth/eventbrite/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    console.log('Processing OAuth callback...');
    
    if (error) {
      console.error('OAuth error from Eventbrite:', error);
      return res.redirect(`/?error=${error}`);
    }
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect('/?error=no_authorization_code');
    }
    
    await processEventbriteAuthentication(code, state, res);
    
  } catch (error) {
    console.error('OAuth callback processing error:', error);
    res.redirect('/?error=callback_processing_failed');
  }
});

// Process Eventbrite authentication and data extraction
async function processEventbriteAuthentication(code, state, res) {
  try {
    // Exchange authorization code for access token
    console.log('Exchanging authorization code for access token...');
    const tokenResult = await eventbriteAuth.exchangeCodeForToken(code);
    
    if (!tokenResult.success) {
      console.error('Token exchange failed:', tokenResult.error);
      return res.redirect('/?error=token_exchange_failed');
    }
    
    console.log('Access token obtained successfully');
    
    // Fetch user profile
    console.log('Fetching user profile data...');
    const profileResult = await eventbriteAuth.fetchUserProfile(tokenResult.accessToken);
    
    if (!profileResult.success) {
      console.error('Profile fetch failed:', profileResult.error);
      return res.redirect('/?error=profile_fetch_failed');
    }
    
    console.log('Profile data retrieved for:', profileResult.profile.name);
    
    // Fetch user's event history
    console.log('Retrieving user event history...');
    const ordersResult = await eventbriteAuth.fetchUserOrders(tokenResult.accessToken);
    
    if (!ordersResult.success) {
      console.error('Event history fetch failed:', ordersResult.error);
      return res.redirect('/?error=event_history_fetch_failed');
    }
    
    console.log(`Event history retrieved: ${ordersResult.orders.length} events found`);
    
    // Log events for debugging
    ordersResult.orders.forEach((order, index) => {
      if (order.event) {
        console.log(`  ${index + 1}. ${order.event.name}`);
        if (order.event.venue?.city) {
          console.log(`     Location: ${order.event.venue.city}, ${order.event.venue.country}`);
        }
      }
    });
    
    // Extract interests from event data
    console.log('Analyzing event data for interest extraction...');
    const extractedData = eventbriteAuth.extractInterestsFromOrders(ordersResult.orders);
    
    console.log(`Interest analysis complete: ${extractedData.interests.length} categories identified`);
    extractedData.interests.slice(0, 5).forEach(interest => {
      console.log(`  - ${interest.interest} (weight: ${interest.weight})`);
    });
    
    // Create user profile
    console.log('Creating user profile...');
    const userProfile = eventbriteAuth.createUserProfile(
      state,
      profileResult.profile,
      ordersResult,
      extractedData
    );
    
    // Store profile
    userProfiles.set(state, userProfile);
    
    console.log('User profile creation completed');
    console.log(`Top interests: ${userProfile.verifiedInterests.slice(0, 3).map(i => i.interest).join(', ')}`);
    console.log(`Geographic activity: ${userProfile.locationHistory.join(', ')}`);
    
    // Redirect to success page
    res.redirect('/?success=true');
    
  } catch (error) {
    console.error('Authentication processing error:', error);
    res.redirect('/?error=authentication_processing_failed');
  }
}

// API endpoint to retrieve user profile
app.get('/api/user/:userId', (req, res) => {
  const profile = userProfiles.get(req.params.userId);
  
  if (profile) {
    res.json({ 
      success: true, 
      profile,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({ 
      success: false, 
      error: 'Profile not found',
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to retrieve all user profiles
app.get('/api/users', (req, res) => {
  const profiles = Array.from(userProfiles.values());
  res.json({ 
    success: true, 
    profiles, 
    count: profiles.length,
    timestamp: new Date().toISOString()
  });
});

// API endpoint: Calculate compatibility between two users
app.post('/api/compatibility', (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;
    
    const user1 = userProfiles.get(user1Id);
    const user2 = userProfiles.get(user2Id);
    
    if (!user1 || !user2) {
      return res.status(404).json({
        success: false,
        error: 'One or both users not found'
      });
    }
    
    const compatibility = matchingEngine.calculateCompatibility(user1, user2);
    
    res.json({
      success: true,
      user1: { id: user1.id, name: user1.name },
      user2: { id: user2.id, name: user2.name },
      compatibility,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Compatibility calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Compatibility calculation failed'
    });
  }
});

// API endpoint: Find matches for a user
app.get('/api/matches/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, minScore = 0.2 } = req.query;
    
    const targetUser = userProfiles.get(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const allUsers = Array.from(userProfiles.values());
    const matches = matchingEngine.findMatches(targetUser, allUsers, {
      limit: parseInt(limit),
      minScore: parseFloat(minScore)
    });
    
    res.json({
      success: true,
      targetUser: { id: targetUser.id, name: targetUser.name },
      matches: matches.map(match => ({
        user: {
          id: match.user.id,
          name: match.user.name,
          topInterests: match.user.verifiedInterests.slice(0, 5)
        },
        compatibility: match.compatibility
      })),
      matchCount: matches.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Match finding error:', error);
    res.status(500).json({
      success: false,
      error: 'Match finding failed'
    });
  }
});

// Testing endpoint: Generate mock users for matching demo
app.post('/api/demo/create-mock-users', async (req, res) => {
  try {
    const mockUsers = [
      {
        id: 'mock_crypto_dancer',
        name: 'Alex Chen',
        email: 'alex@example.com',
        verifiedInterests: [
          { interest: 'defi', weight: 3, confidence: 1.0 },
          { interest: 'salsa-dancing', weight: 2, confidence: 0.67 },
          { interest: 'ethereum', weight: 2, confidence: 0.67 }
        ],
        locationHistory: ['Mexico City, MX', 'New York, NY'],
        verification: { eventbriteVerified: true, totalVerifiedEvents: 4 },
        eventHistory: { eventbrite: [] }
      },
      {
        id: 'mock_ai_researcher',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        verifiedInterests: [
          { interest: 'ai', weight: 4, confidence: 1.0 },
          { interest: 'research', weight: 3, confidence: 1.0 },
          { interest: 'ethereum', weight: 1, confidence: 0.33 }
        ],
        locationHistory: ['San Francisco, CA', 'London, UK'],
        verification: { eventbriteVerified: true, totalVerifiedEvents: 7 },
        eventHistory: { eventbrite: [] }
      }
    ];
    
    mockUsers.forEach(user => {
      userProfiles.set(user.id, user);
    });
    
    res.json({
      success: true,
      message: 'Mock users created',
      users: mockUsers.map(u => ({ id: u.id, name: u.name }))
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Mock user creation failed'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('VibeFlow Eventbrite Integration Server starting...');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Configuration Status:');
  console.log('  Client ID:', process.env.EVENTBRITE_CLIENT_ID ? 'Configured' : 'Missing');
  console.log('  Client Secret:', process.env.EVENTBRITE_CLIENT_SECRET ? 'Configured' : 'Missing');
  console.log('  Redirect URI:', process.env.EVENTBRITE_REDIRECT_URI || 'Not configured');
  console.log('Eventbrite OAuth integration ready');
  console.log('');
});

module.exports = app;

// Temporary privacy fix - disable public user browsing
app.get('/api/users', (req, res) => {
  res.status(403).json({ error: 'User browsing not allowed for privacy' });
});

// Comment out the auth requirement for now, add back when Dynamic is integrated
// app.get('/api/matches/:userId', requireAuth, (req, res) => {
app.get('/api/matches/:userId', (req, res) => {
  // TODO: Add auth check when Dynamic is integrated
  // if (req.user.id !== req.params.userId) {
  //   return res.status(403).json({ error: 'Unauthorized' });
  // }
  
  // existing logic continues...
  try {
    const { userId } = req.params;
    const { limit = 10, minScore = 0.2 } = req.query;
    
    const targetUser = userProfiles.get(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const allUsers = Array.from(userProfiles.values());
    const matches = matchingEngine.findMatches(targetUser, allUsers, {
      limit: parseInt(limit),
      minScore: parseFloat(minScore)
    });
    
    res.json({
      success: true,
      targetUser: { id: targetUser.id, name: targetUser.name },
      matches: matches.map(match => ({
        user: {
          id: match.user.id,
          name: match.user.name,
          topInterests: match.user.verifiedInterests.slice(0, 5)
        },
        compatibility: match.compatibility
      })),
      matchCount: matches.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Match finding error:', error);
    res.status(500).json({
      success: false,
      error: 'Match finding failed'
    });
  }
});