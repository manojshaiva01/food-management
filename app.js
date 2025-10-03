// Utility functions
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Add missing renderAvailableDonations function for receiver-dashboard.html
function renderAvailableDonations() {
    console.log('Rendering available donations');
    const availableDonationsList = document.getElementById('availableDonations');
    if (!availableDonationsList) return;
    availableDonationsList.innerHTML = '';
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }
    let allDonations = getDonations();
    console.log('All donations:', allDonations);
    let donations = allDonations.filter(d => !d.claimed);
    console.log('Filtered donations:', donations);
    if (donations.length === 0) {
        availableDonationsList.innerHTML = '<p>No donations available at the moment.</p>';
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
        let datePart = donation.expiryDate;
        let timePart = '';
        if (donation.expiryDate && donation.expiryDate.includes(' ')) {
            [datePart, timePart] = donation.expiryDate.split(' ');
        }
        dateTime.innerHTML = `<strong>Date:</strong> ${datePart} <br/><strong>Time:</strong> ${timePart || 'N/A'}`;

        const location = document.createElement('div');
        location.className = 'donation-step';
        location.innerHTML = `<strong>Location:</strong> ${donation.location}`;

        const donorPhone = document.createElement('div');
        donorPhone.className = 'donation-step';
        donorPhone.innerHTML = `<strong>Donor Phone:</strong> ${donation.phoneNumber}`;

        const actions = document.createElement('div');
        actions.className = 'donation-actions';

                const claimBtn = document.createElement('button');
                claimBtn.textContent = 'Claim';
                claimBtn.addEventListener('click', () => {
                    let allDonations = getDonations();
                    const donationIndex = allDonations.findIndex(d => d.id === donation.id);
                    if (donationIndex !== -1) {
                        allDonations[donationIndex].claimed = true;
                        allDonations[donationIndex].receiverId = loggedInUser.id;
                        allDonations[donationIndex].receiverName = loggedInUser.name;
                        allDonations[donationIndex].receiverPhone = loggedInUser.phoneNumber;
                        allDonations[donationIndex].receiverLocation = loggedInUser.location;
                        allDonations[donationIndex].claimedAt = new Date().toISOString();
                        saveDonations(allDonations);

                        // Create notification for donor
                        createNotification('donation_claimed', donation.donorId, donation.id, loggedInUser.name, loggedInUser.phoneNumber, loggedInUser.location);

                        alert('Donation claimed successfully! The donor will be notified.');
                        renderAvailableDonations();
                        renderMyClaims();
                    }
                });

        actions.appendChild(claimBtn);
        card.appendChild(description);
        card.appendChild(dateTime);
        card.appendChild(location);
        card.appendChild(donorPhone);
        card.appendChild(actions);

        availableDonationsList.appendChild(card);
    });
}

// Add missing renderMyClaims function for receiver-dashboard.html
        function renderMyClaims() {
            const myClaimsList = document.getElementById('myClaims');
            if (!myClaimsList) return;
            myClaimsList.innerHTML = '';
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                window.location.href = 'login.html';
                return;
            }
            let donations = getDonations().filter(d => d.claimed && d.receiverId === loggedInUser.id);
            if (donations.length === 0) {
                myClaimsList.innerHTML = '<p>No claims yet.</p>';
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
                let datePart = donation.expiryDate;
                let timePart = '';
                if (donation.expiryDate && donation.expiryDate.includes(' ')) {
                    [datePart, timePart] = donation.expiryDate.split(' ');
                }
                dateTime.innerHTML = `<strong>Date:</strong> ${datePart} <br/><strong>Time:</strong> ${timePart || 'N/A'}`;

                const location = document.createElement('div');
                location.className = 'donation-step';
                location.innerHTML = `<strong>Location:</strong> ${donation.location}`;

                const donorPhone = document.createElement('div');
                donorPhone.className = 'donation-step';
                donorPhone.innerHTML = `<strong>Donor Phone:</strong> ${donation.phoneNumber}`;

                const status = document.createElement('div');
                status.className = 'donation-step';
                status.innerHTML = `<strong>Status:</strong> <span style="color: green;">Claimed</span>`;

                const claimedAt = document.createElement('div');
                claimedAt.className = 'donation-step';
                claimedAt.innerHTML = `<strong>Claimed At:</strong> ${new Date(donation.claimedAt).toLocaleString()}`;

                const actions = document.createElement('div');
                actions.className = 'donation-actions';

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Delete';
                delBtn.addEventListener('click', () => {
                    let allDonations = getDonations();
                    allDonations = allDonations.filter(d => d.id !== donation.id);
                    saveDonations(allDonations);
                    renderMyClaims();
                });
                actions.appendChild(delBtn);

                card.appendChild(description);
                card.appendChild(dateTime);
                card.appendChild(location);
                card.appendChild(donorPhone);
                card.appendChild(status);
                card.appendChild(claimedAt);
                card.appendChild(actions);

                myClaimsList.appendChild(card);
            });
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

function getNotifications() {
    return JSON.parse(localStorage.getItem('notifications')) || [];
}

function saveNotifications(notifications) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

function createNotification(type, donorId, donationId, receiverName, receiverPhone, receiverLocation) {
    const notification = {
        id: generateId(),
        type, // 'donation_claimed'
        donorId,
        donationId,
        receiverName,
        receiverPhone,
        receiverLocation,
        createdAt: new Date().toISOString(),
        read: false
    };

    let notifications = getNotifications();
    notifications.push(notification);
    saveNotifications(notifications);
}

console.log("Script loaded"); // Debug log to check if script is loaded

// Wait for DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed"); // Debug log to check if DOMContentLoaded event fires
    // Registration
    if (document.getElementById('registerForm')) {
        const registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
        // Removed userType as per user request
        const location = document.getElementById('location').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();

        if (!name || !email || !password || !location || !phoneNumber) {
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
            location,
            phoneNumber
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
            window.location.href = 'home.html';
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

            const phone = document.createElement('div');
            phone.className = 'donation-step';
            phone.innerHTML = `<strong>Phone:</strong> ${donation.phoneNumber}`;

            if (donation.claimed) {
                const status = document.createElement('div');
                status.className = 'donation-step';
                status.innerHTML = `<strong>Status:</strong> <span style="color: green;">Claimed</span>`;

                const receiverInfo = document.createElement('div');
                receiverInfo.className = 'donation-step';
                receiverInfo.innerHTML = `<strong>Receiver:</strong> ${donation.receiverName} - ${donation.receiverPhone}`;

                const receiverLocation = document.createElement('div');
                receiverLocation.className = 'donation-step';
                receiverLocation.innerHTML = `<strong>Receiver Location:</strong> ${donation.receiverLocation}`;

                card.appendChild(status);
                card.appendChild(receiverInfo);
                card.appendChild(receiverLocation);
            }

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

            if (donation.claimed) {
                const claimedAt = document.createElement('div');
                claimedAt.className = 'donation-step';
                claimedAt.innerHTML = `<strong>Claimed At:</strong> ${new Date(donation.claimedAt).toLocaleString()}`;
                card.appendChild(claimedAt);
            }

            card.appendChild(description);
            card.appendChild(dateTime);
            card.appendChild(location);
            card.appendChild(phone);
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
                expiryDate: `${expiryDate} ${expiryTime}`,
                location,
                phoneNumber: loggedInUser.phoneNumber,
                claimed: false
            };

            let donations = getDonations();
            donations.push(newDonation);
            saveDonations(donations);
            donationForm.reset();
            renderDonations();
            // Removed redirect to home.html to stay on donor dashboard and see new donation immediately
            // window.location.href = 'home.html';
        });

    function renderNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = '';
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }
        let notifications = getNotifications().filter(n => n.donorId === loggedInUser.id);
        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p>No notifications yet.</p>';
            return;
        }
        notifications.forEach(notification => {
            const card = document.createElement('div');
            card.className = 'notification-card';

            const message = document.createElement('div');
            message.className = 'notification-message';
            message.innerHTML = `<strong>Your donation has been claimed!</strong><br>Receiver: ${notification.receiverName} - ${notification.receiverPhone}<br>Location: ${notification.receiverLocation}`;

            const timestamp = document.createElement('div');
            timestamp.className = 'notification-timestamp';
            timestamp.innerHTML = `Received: ${new Date(notification.createdAt).toLocaleString()}`;

            const actions = document.createElement('div');
            actions.className = 'notification-actions';

            const markReadBtn = document.createElement('button');
            markReadBtn.textContent = 'Mark as Read';
            markReadBtn.addEventListener('click', () => {
                let allNotifications = getNotifications();
                const notificationIndex = allNotifications.findIndex(n => n.id === notification.id);
                if (notificationIndex !== -1) {
                    allNotifications[notificationIndex].read = true;
                    saveNotifications(allNotifications);
                    renderNotifications();
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                let allNotifications = getNotifications();
                allNotifications = allNotifications.filter(n => n.id !== notification.id);
                saveNotifications(allNotifications);
                renderNotifications();
            });

            if (!notification.read) {
                card.classList.add('unread');
            }

            actions.appendChild(markReadBtn);
            actions.appendChild(deleteBtn);
            card.appendChild(message);
            card.appendChild(timestamp);
            card.appendChild(actions);

            notificationsList.appendChild(card);
        });
    }

        renderDonations();
        renderNotifications();
        renderAvailableDonations();
        renderMyClaims();

        // Logout
        document.getElementById('logout').addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });


    }

    // Home page functionality
    if (document.getElementById('quick-overview')) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        // Removed userInfo element update because it does not exist in home.html
        // document.getElementById('userInfo').textContent = `Welcome, ${loggedInUser.name}!`;

        renderQuickOverview();
        renderAvailableDonationsHome();
        renderAllDonationsDetails();

        function renderQuickOverview() {
            const totalDonations = getDonations().length;
            const availableDonations = getDonations().filter(d => !d.claimed).length;
            const myClaims = getDonations().filter(d => d.claimed && d.receiverId === loggedInUser.id).length;
            const unreadNotifications = getNotifications().filter(n => n.donorId === loggedInUser.id && !n.read).length;

            document.getElementById('totalDonationsCount').textContent = totalDonations;
            document.getElementById('availableDonationsCount').textContent = availableDonations;
            document.getElementById('myClaimsCount').textContent = myClaims;
            document.getElementById('unreadNotificationsCount').textContent = unreadNotifications;
        }

        function renderAvailableDonationsHome() {
            const availableDonationsList = document.getElementById('availableDonationsList');
            if (!availableDonationsList) return;
            availableDonationsList.innerHTML = '';

            let donations = getDonations().filter(d => !d.claimed);
            if (donations.length === 0) {
                availableDonationsList.innerHTML = '<p>No donations available at the moment.</p>';
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
                let datePart = donation.expiryDate;
                let timePart = '';
                if (donation.expiryDate && donation.expiryDate.includes(' ')) {
                    [datePart, timePart] = donation.expiryDate.split(' ');
                }
                dateTime.innerHTML = `<strong>Date:</strong> ${datePart} <br/><strong>Time:</strong> ${timePart || 'N/A'}`;

                const location = document.createElement('div');
                location.className = 'donation-step';
                location.innerHTML = `<strong>Location:</strong> ${donation.location}`;

                const phone = document.createElement('div');
                phone.className = 'donation-step';
                phone.innerHTML = `<strong>Phone:</strong> ${donation.phoneNumber}`;

                card.appendChild(description);
                card.appendChild(dateTime);
                card.appendChild(location);
                card.appendChild(phone);

                availableDonationsList.appendChild(card);
            });
        }

        function renderAllDonationsDetails() {
            const donationsDetailsList = document.getElementById('donationsDetailsList');
            if (!donationsDetailsList) return;
            donationsDetailsList.innerHTML = '';

            let donations = getDonations();
            if (donations.length === 0) {
                donationsDetailsList.innerHTML = '<p>No donations available at the moment.</p>';
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
                let datePart = donation.expiryDate;
                let timePart = '';
                if (donation.expiryDate && donation.expiryDate.includes(' ')) {
                    [datePart, timePart] = donation.expiryDate.split(' ');
                }
                dateTime.innerHTML = `<strong>Date:</strong> ${datePart} <br/><strong>Time:</strong> ${timePart || 'N/A'}`;

                const location = document.createElement('div');
                location.className = 'donation-step';
                location.innerHTML = `<strong>Location:</strong> ${donation.location}`;

                const phone = document.createElement('div');
                phone.className = 'donation-step';
                phone.innerHTML = `<strong>Phone:</strong> ${donation.phoneNumber}`;

                const actions = document.createElement('div');
                actions.className = 'donation-actions';

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Delete';
                delBtn.addEventListener('click', () => {
                    let allDonations = getDonations();
                    allDonations = allDonations.filter(d => d.id !== donation.id);
                    saveDonations(allDonations);
                    renderAllDonationsDetails();
                });
                actions.appendChild(delBtn);

                card.appendChild(description);
                card.appendChild(dateTime);
                card.appendChild(location);
                card.appendChild(phone);
                card.appendChild(actions);

                donationsDetailsList.appendChild(card);
            });
        }

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

        // Donation form submission
        const donationForm = document.getElementById('donationForm');
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
                expiryDate: `${expiryDate} ${expiryTime}`,
                location,
                phoneNumber: loggedInUser.phoneNumber,
                claimed: false
            };

            let donations = getDonations();
            donations.push(newDonation);
            saveDonations(donations);
            donationForm.reset();
            renderDonations();
            window.location.href = 'home.html'; // Redirect to home page after donation submission
        });

        function renderDonations() {
            const donationsList = document.getElementById('donationsList');
            donationsList.innerHTML = '';
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                window.location.href = 'login.html';
                return;
            }
            let donations = getDonations().filter(d => d.donorId === loggedInUser.id);
            if (donations.length === 0) {
                donationsList.innerHTML = '<p>No donations posted yet.</p>';
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

                const phone = document.createElement('div');
                phone.className = 'donation-step';
                phone.innerHTML = `<strong>Phone:</strong> ${donation.phoneNumber}`;

                if (donation.claimed) {
                    const status = document.createElement('div');
                    status.className = 'donation-step';
                    status.innerHTML = `<strong>Status:</strong> <span style="color: green;">Claimed</span>`;

                    const receiverInfo = document.createElement('div');
                    receiverInfo.className = 'donation-step';
                    receiverInfo.innerHTML = `<strong>Receiver:</strong> ${donation.receiverName} - ${donation.receiverPhone}`;

                    const receiverLocation = document.createElement('div');
                    receiverLocation.className = 'donation-step';
                    receiverLocation.innerHTML = `<strong>Receiver Location:</strong> ${donation.receiverLocation}`;

                    card.appendChild(status);
                    card.appendChild(receiverInfo);
                    card.appendChild(receiverLocation);
                }

                const actions = document.createElement('div');
                actions.className = 'donation-actions';

                if (!donation.claimed) {
                    const delBtn = document.createElement('button');
                    delBtn.textContent = 'Delete';
                    delBtn.addEventListener('click', () => {
                        let allDonations = getDonations();
                        allDonations = allDonations.filter(d => d.id !== donation.id);
                        saveDonations(allDonations);
                        renderDonations();
                    });
                    actions.appendChild(delBtn);
                } else {
                    const claimedAt = document.createElement('div');
                    claimedAt.className = 'donation-step';
                    claimedAt.innerHTML = `<strong>Claimed At:</strong> ${new Date(donation.claimedAt).toLocaleString()}`;
                    card.appendChild(claimedAt);
                }

                card.appendChild(description);
                card.appendChild(dateTime);
                card.appendChild(location);
                card.appendChild(phone);
                card.appendChild(actions);

                donationsList.appendChild(card);
            });
        }

        function renderNotifications() {
            const notificationsList = document.getElementById('notificationsList');
            notificationsList.innerHTML = '';
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                window.location.href = 'login.html';
                return;
            }
            let notifications = getNotifications().filter(n => n.donorId === loggedInUser.id);
            if (notifications.length === 0) {
                notificationsList.innerHTML = '<p>No notifications yet.</p>';
                return;
            }
            notifications.forEach(notification => {
                const card = document.createElement('div');
                card.className = 'notification-card';

                const message = document.createElement('div');
                message.className = 'notification-message';
                message.innerHTML = `<strong>Your donation has been claimed!</strong><br>Receiver: ${notification.receiverName} - ${notification.receiverPhone}<br>Location: ${notification.receiverLocation}`;

                const timestamp = document.createElement('div');
                timestamp.className = 'notification-timestamp';
                timestamp.innerHTML = `Received: ${new Date(notification.createdAt).toLocaleString()}`;

                const actions = document.createElement('div');
                actions.className = 'notification-actions';

                const markReadBtn = document.createElement('button');
                markReadBtn.textContent = 'Mark as Read';
                markReadBtn.addEventListener('click', () => {
                    let allNotifications = getNotifications();
                    const notificationIndex = allNotifications.findIndex(n => n.id === notification.id);
                    if (notificationIndex !== -1) {
                        allNotifications[notificationIndex].read = true;
                        saveNotifications(allNotifications);
                        renderNotifications();
                    }
                });

                if (!notification.read) {
                    card.classList.add('unread');
                }

                actions.appendChild(markReadBtn);
                card.appendChild(message);
                card.appendChild(timestamp);
                card.appendChild(actions);

                notificationsList.appendChild(card);
            });

        }

        // Show quick overview and all donations details sections
        const quickOverviewSection = document.getElementById('quick-overview');
        const allDonationsDetailsSection = document.getElementById('all-donations-details');
        quickOverviewSection.style.display = 'block';
        allDonationsDetailsSection.style.display = 'block';

    }

    if (document.getElementById('availableDonations')) {
        renderAvailableDonations();
        renderMyClaims();

        // Poll for updates every 5 seconds
        setInterval(() => {
            renderAvailableDonations();
            renderMyClaims();
        }, 5000);

        // Logout
        document.getElementById('logout').addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }

    // Logout for home page (if needed, but handled in home-page-functionality.js)
    // Removed duplicate navigation buttons as they are handled in home-page-functionality.js
});
