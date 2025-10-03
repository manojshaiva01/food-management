// Dummy data setup for testing receiver dashboard

// Dummy logged in user (receiver)
const dummyUser = {
    id: 'receiver1',
    name: 'Test Receiver',
    email: 'receiver@example.com',
    password: 'password',
    location: '12.9716, 77.5946',
    phoneNumber: '1234567890'
};
localStorage.setItem('loggedInUser', JSON.stringify(dummyUser));

// Dummy donations data
const dummyDonations = [
    {
        id: 'donation1',
        donorId: 'donor1',
        foodType: 'Bread',
        quantity: '5 loaves',
        expiryDate: '2023-12-31 18:00',
        location: '12.9716, 77.5946',
        phoneNumber: '0987654321',
        claimed: false
    },
    {
        id: 'donation2',
        donorId: 'donor2',
        foodType: 'Rice',
        quantity: '10 kg',
        expiryDate: '2023-12-30 12:00',
        location: '12.2958, 76.6394',
        phoneNumber: '1122334455',
        claimed: true,
        receiverId: 'receiver1',
        receiverName: 'Test Receiver',
        receiverPhone: '1234567890',
        receiverLocation: '12.9716, 77.5946',
        claimedAt: new Date().toISOString()
    }
];
localStorage.setItem('donations', JSON.stringify(dummyDonations));

console.log('Dummy user and donations data set in localStorage.');
