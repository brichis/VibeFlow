// Test 1: Create users with high compatibility
fetch('/api/demo/create-mock-users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    users: [
      {
        id: 'crypto_enthusiast_1',
        name: 'Alice Crypto',
        verifiedInterests: [
          { interest: 'defi', weight: 4, confidence: 1.0 },
          { interest: 'ethereum', weight: 3, confidence: 1.0 },
          { interest: 'smart-contracts', weight: 2, confidence: 0.8 }
        ],
        locationHistory: ['San Francisco, CA', 'New York, NY'],
        verification: { eventbriteVerified: true, totalVerifiedEvents: 8 }
      },
      {
        id: 'crypto_enthusiast_2', 
        name: 'Bob DeFi',
        verifiedInterests: [
          { interest: 'defi', weight: 3, confidence: 1.0 },
          { interest: 'ethereum', weight: 4, confidence: 1.0 },
          { interest: 'layer2', weight: 2, confidence: 0.7 }
        ],
        locationHistory: ['San Francisco, CA', 'Los Angeles, CA'],
        verification: { eventbriteVerified: true, totalVerifiedEvents: 6 }
      }
    ]
  })
})
.then(response => response.json())
.then(data => console.log('High compatibility users created:', data));

// Test 2: Check detailed compatibility breakdown
fetch('/api/compatibility', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user1Id: 'crypto_enthusiast_1',
    user2Id: 'crypto_enthusiast_2'
  })
})
.then(response => response.json())
.then(data => {
  console.log('=== DETAILED COMPATIBILITY ANALYSIS ===');
  console.log('Overall Score:', data.compatibility.overallScore);
  console.log('Breakdown:', data.compatibility.breakdown);
  console.log('Shared Interests:', data.compatibility.sharedInterests);
  console.log('Metadata:', data.compatibility.metadata);
});

// Test 3: Test with different minimum score thresholds
fetch('/api/matches/crypto_enthusiast_1?minScore=0.1')
.then(response => response.json())
.then(data => {
  console.log('=== MATCHES WITH 10% MIN THRESHOLD ===');
  console.log('Match count:', data.matchCount);
  data.matches.forEach(match => {
    console.log(`${match.user.name}: ${Math.round(match.compatibility.overallScore * 100)}%`);
  });
});

// Test 4: Analyze weight distribution impact
fetch('/api/compatibility', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user1Id: 'mock_crypto_dancer',
    user2Id: 'mock_ai_researcher'
  })
})
.then(response => response.json())
.then(data => {
  console.log('=== WEIGHT ANALYSIS ===');
  const breakdown = data.compatibility.breakdown;
  console.log('Interest contribution:', breakdown.interests * 0.6);
  console.log('Geography contribution:', breakdown.geography * 0.2);
  console.log('Event history contribution:', breakdown.eventHistory * 0.15);
  console.log('Recency contribution:', breakdown.recency * 0.05);
});

// Test 5: Edge case - user with no interests
fetch('/api/demo/create-mock-users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    users: [{
      id: 'empty_user',
      name: 'Empty Profile',
      verifiedInterests: [],
      locationHistory: [],
      verification: { eventbriteVerified: false, totalVerifiedEvents: 0 }
    }]
  })
})
.then(response => response.json())
.then(() => {
  return fetch('/api/compatibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user1Id: 'mock_crypto_dancer',
      user2Id: 'empty_user'
    })
  });
})
.then(response => response.json())
.then(data => {
  console.log('=== EDGE CASE: EMPTY PROFILE ===');
  console.log('Compatibility with empty profile:', data.compatibility.overallScore);
});
