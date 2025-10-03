// Home page functionality
(function() {
    if (document.getElementById('quick-overview')) {
        // Temporary: set dummy logged in user for testing
        if (!localStorage.getItem('loggedInUser')) {
            localStorage.setItem('loggedInUser', JSON.stringify({id: 'test', name: 'Test User', email: 'test@example.com', location: 'Test Location', phoneNumber: '1234567890'}));
        }
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        renderQuickOverview();
        renderAvailableDonationsWithClaim();

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

        function renderAvailableDonationsWithClaim() {
            const donationsDetailsList = document.getElementById('donationsDetailsList');
            if (!donationsDetailsList) return;
            donationsDetailsList.innerHTML = '';

            let donations = getDonations().filter(d => !d.claimed);
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
                        renderAvailableDonationsWithClaim();
                        renderQuickOverview();
                    }
                });

                actions.appendChild(claimBtn);
                card.appendChild(description);
                card.appendChild(dateTime);
                card.appendChild(location);
                card.appendChild(donorPhone);
                card.appendChild(actions);

                donationsDetailsList.appendChild(card);
            });
        }

        // Home page navigation buttons
        const btnDonate = document.getElementById('btnDonate');
        if (btnDonate) {
            btnDonate.addEventListener('click', function () {
                window.location.href = 'donor-dashboard.html';
            });
        }

        const btnNeedFood = document.getElementById('btnNeedFood');
        if (btnNeedFood) {
            btnNeedFood.addEventListener('click', function () {
                window.location.href = 'receiver-dashboard.html';
            });
        }

        // Logout for home page
        const logoutHome = document.getElementById('logout');
        if (logoutHome) {
            logoutHome.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            });
        }
    }
})();
