// Utility functions
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getDonations() {
    return JSON.parse(localStorage.getItem('donations')) || [];
}

function saveDonations(donations) {
    localStorage.setItem('donations', JSON.stringify(donations));
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Registration
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;
        const location = document.getElementById('location').value.trim();

        if (!name || !email || !password || !userType || !location) {
            alert('Please fill in all fields.');
            return;
        }

        let users = getUsers();
        if (users.find(u => u.email === email)) {
            alert('Email already registered.');
            return;
        }

        const newUser = {
            id: generateId(),
            name,
            email,
            password,
            userType,
            location
        };

        users.push(newUser);
        saveUsers(users);
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// Login
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        let users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            alert('Invalid email or password.');
            return;
        }

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        if (user.userType === 'donor') {
            window.location.href = 'donor-dashboard.html';
        } else {
            window.location.href = 'receiver-dashboard.html';
        }
    });
}

if (document.getElementById('donationForm')) {
    const donationForm = document.getElementById('donationForm');
    const donationsList = document.getElementById('donationsList');

    // Initialize Leaflet map for donor dashboard
    const donorMap = L.map('map').setView([12.2958, 76.6394], 13); // Mysore coordinates as default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(donorMap);

    // Add geocoder control to donor map
    const donorGeocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .on('markgeocode', function(e) {
        const bbox = e.geocode.bbox;
        const center = e.geocode.center;
        donorMap.fitBounds(bbox);
        if (donorMarker) {
            donorMarker.setLatLng(center);
        } else {
            donorMarker = L.marker(center).addTo(donorMap);
        }
        document.getElementById('location').value = `${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`;
    })
    .addTo(donorMap);

    let donorMarker;

    donorMap.on('click', function (e) {
        const { lat, lng } = e.latlng;
        if (donorMarker) {
            donorMarker.setLatLng(e.latlng);
        } else {
            donorMarker = L.marker(e.latlng).addTo(donorMap);
        }
        document.getElementById('location').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    });

    // Set default location value to Mysore coordinates on page load if empty
    const locationInput = document.getElementById('location');
    if (!locationInput.value) {
        locationInput.value = '12.2958, 76.6394'; // Mysore lat,lng
        donorMap.setView([12.2958, 76.6394], 13);
        if (donorMarker) {
            donorMarker.setLatLng([12.2958, 76.6394]);
        } else {
            donorMarker = L.marker([12.2958, 76.6394]).addTo(donorMap);
        }
    }

    function renderDonations() {
        donationsList.innerHTML = '';
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }
        let donations = getDonations().filter(d => d.donorId === loggedInUser.id);
        if (donations.length === 0) {
            donationsList.innerHTML = '<li>No donations posted yet.</li>';
            return;
        }
        donations.forEach(donation => {
            const card = document.createElement('div');
            card.className = 'donation-card stepwise-donation-card';

            const description = document.createElement('div');
            description.className = 'donation-step';
            description.innerHTML = `<strong>Description:</strong> ${donation.foodType} - ${donation.quantity}`;

            const dateTime = document.createElement('div');
            dateTime.className = 'donation-step';
            // Split expiryDate into date and time if possible
            let datePart = donation.expiryDate;
            let timePart = '';
            if (donation.expiryDate && donation.expiryDate.includes(' ')) {
                [datePart, timePart] = donation.expiryDate.split(' ');
            }
            dateTime.innerHTML = `<strong>Date:</strong> ${datePart} <br/><strong>Time:</strong> ${timePart || 'N/A'}`;

            const location = document.createElement('div');
            location.className = 'donation-step';
            location.innerHTML = `<strong>Location:</strong> ${donation.location}`;

            const actions = document.createElement('div');
            actions.className = 'donation-actions';

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', () => {
                let allDonations = getDonations();
                allDonations = allDonations.filter(d => d.id !== donation.id);
                saveDonations(allDonations);
                renderDonations();
            });

            actions.appendChild(delBtn);
            card.appendChild(description);
            card.appendChild(dateTime);
            card.appendChild(location);
            card.appendChild(actions);

            donationsList.appendChild(card);
        });
    }

    donationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const foodType = document.getElementById('foodType').value.trim();
        const quantity = document.getElementById('quantity').value.trim();
        const expiryDate = document.getElementById('expiryDate').value;
        const expiryTime = document.getElementById('expiryTime').value;
        const location = document.getElementById('location').value.trim();

        if (!foodType || !quantity || !expiryDate || !expiryTime || !location) {
            alert('Please fill in all fields.');
            return;
        }

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert('Please login first.');
            window.location.href = 'login.html';
            return;
        }

        const newDonation = {
            id: generateId(),
            donorId: loggedInUser.id,
            foodType,
            quantity,
            expiryDate,
            location
        };

        let donations = getDonations();
        donations.push(newDonation);
        saveDonations(donations);
        donationForm.reset();
        renderDonations();
    });

    // Initial render
    renderDonations();

    // Logout
    document.getElementById('logout').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });
}

if (document.getElementById('availableDonations')) {
    const availableDonationsList = document.getElementById('availableDonations');

    // Initialize Leaflet map for receiver dashboard
    const receiverMap = L.map('receiverMap').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(receiverMap);

    // Add geocoder control to receiver map
    const receiverGeocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .on('markgeocode', function(e) {
        const bbox = e.geocode.bbox;
        const center = e.geocode.center;
        receiverMap.fitBounds(bbox);
        if (receiverMarker) {
            receiverMarker.setLatLng(center);
        } else {
            receiverMarker = L.marker(center).addTo(receiverMap);
        }
        document.getElementById('receiverLocation').value = `${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`;
    })
    .addTo(receiverMap);

    let receiverMarker;

    receiverMap.on('click', function (e) {
        const { lat, lng } = e.latlng;
        if (receiverMarker) {
            receiverMarker.setLatLng(e.latlng);
        } else {
            receiverMarker = L.marker(e.latlng).addTo(receiverMap);
        }
        document.getElementById('receiverLocation').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    });

    function renderAvailableDonations() {
        availableDonationsList.innerHTML = '';
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }
        let donations = getDonations();
        if (donations.length === 0) {
            availableDonationsList.innerHTML = '<li>No donations available at the moment.</li>';
            return;
        }
        donations.forEach(donation => {
            const li = document.createElement('li');
            li.textContent = `${donation.foodType} - ${donation.quantity} - Expires: ${donation.expiryDate} - Location: ${donation.location}`;
            const claimBtn = document.createElement('button');
            claimBtn.textContent = 'Claim';
            claimBtn.style.marginLeft = '10px';
            claimBtn.addEventListener('click', () => {
                let allDonations = getDonations();
                allDonations = allDonations.filter(d => d.id !== donation.id);
                saveDonations(allDonations);
                alert('Donation claimed successfully!');
                renderAvailableDonations();
            });
            li.appendChild(claimBtn);
            availableDonationsList.appendChild(li);
        });
    }

    // Initial render
    renderAvailableDonations();

    // Logout
    document.getElementById('logout').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });
}
