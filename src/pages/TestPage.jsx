import React from 'react';
import UserDashboard from '../Components/UserDashboard';

function TestPage() {
  const testUser = {
    userId: 'test-user-uuid-0001',
    name: 'Test User',
    email: 'testuser@example.com'
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Firestore Test Page</h1>
      <UserDashboard
        userId={testUser.userId}
        name={testUser.name}
        email={testUser.email}
      />
    </div>
  );
}

export default TestPage;