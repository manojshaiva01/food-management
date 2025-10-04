(function() {
    if (document.getElementById('quick-overview')) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        renderQuickOverview();
        renderMyDonations();
        renderNotifications();

        // Poll for updates every 5 seconds
        setInterval(() => {
            renderQuickOverview();
            renderMyDonations();
            renderNotifications();
        }, 5000);

        function renderQuickOverview() {
            const allDonations = getDonations();
            const myDonations = allDonations.filter(d => d.donorId === loggedInUser.id);
            const unreadNotifications = getNotifications().filter(n => n.donorId === loggedInUser.id && !n.read);

            document.getElementById('myDonationsCount').textContent = myDonations.length;
            document.getElementById('unreadNotificationsCount').textContent = unreadNotifications.length;
        }

        function renderMyDonations() {
            const myDonationsList = document.getElementById('myDonationsList');
            if (!myDonationsList) return;
            myDonationsList.innerHTML = '';

            const myDonations = getDonations().filter(d => d.donorId === loggedInUser.id);
            if (myDonations.length === 0) {
                myDonationsList.innerHTML = '<p>No donations posted yet.</p>';
                return;
            }

            myDonations.forEach(donation => {
                const card = document.createElement('div');
                card.className = 'donation-card';

                card.innerHTML = `
                    <strong>Food Type:</strong> ${donation.foodType} <br/>
                    <strong>Quantity:</strong> ${donation.quantity} <br/>
                    <strong>Expiry:</strong> ${donation.expiryDate || 'N/A'} <br/>
                    <strong>Location:</strong> ${donation.location} <br/>
                    <strong>Claimed:</strong> ${donation.claimed ? 'Yes' : 'No'}
                `;

                myDonationsList.appendChild(card);
            });
        }

        function renderNotifications() {
            const notificationsList = document.getElementById('notificationsList');
            if (!notificationsList) return;
            notificationsList.innerHTML = '';

            const notifications = getNotifications().filter(n => n.donorId === loggedInUser.id);
            if (notifications.length === 0) {
                notificationsList.innerHTML = '<p>No notifications.</p>';
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

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => {
                    let allNotifications = getNotifications();
                    allNotifications = allNotifications.filter(n => n.id !== notification.id);
                    saveNotifications(allNotifications);
                    renderNotifications();
                });

                if (!notification.read) {
                    card.classList.add('unread');
                }

                actions.appendChild(deleteBtn);
                card.appendChild(message);
                card.appendChild(timestamp);
                card.appendChild(actions);

                notificationsList.appendChild(card);
            });
        }

        // Quick post donation form handling
        const quickDonationForm = document.getElementById('quickDonationForm');
        if (quickDonationForm) {
            quickDonationForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const foodType = document.getElementById('foodType').value.trim();
                const quantity = document.getElementById('quantity').value.trim();
                const expiryDate = document.getElementById('expiryDate').value;
                const expiryTime = document.getElementById('expiryTime').value;
                const location = document.getElementById('location').value.trim();

                if (!foodType || !quantity || !expiryDate || !expiryTime || !location) {
                    alert('Please fill all fields.');
                    return;
                }

                const expiryDateTime = expiryDate + ' ' + expiryTime;

                const newDonation = {
                    id: 'donation-' + Date.now(),
                    donorId: loggedInUser.id,
                    foodType,
                    quantity,
                    expiryDate: expiryDateTime,
                    location,
                    claimed: false,
                    phoneNumber: loggedInUser.phoneNumber
                };

                const allDonations = getDonations();
                allDonations.push(newDonation);
                saveDonations(allDonations);

                alert('Donation posted successfully!');
                quickDonationForm.reset();
                renderQuickOverview();
                renderMyDonations();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            });
        }
    }
})();
