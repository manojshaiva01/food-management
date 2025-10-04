(function() {
    if (document.getElementById('availableDonations')) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return;
        }

        renderQuickOverview();
        renderAvailableDonations();

        function renderQuickOverview() {
            const availableDonations = getDonations().filter(d => !d.claimed).length;
            const myClaims = getDonations().filter(d => d.claimed && d.receiverId === loggedInUser.id).length;

            document.getElementById('availableDonationsCount').textContent = availableDonations;
            document.getElementById('myClaimsCount').textContent = myClaims;
        }

        function renderAvailableDonations() {
            const availableDonationsDiv = document.getElementById('availableDonations');
            if (!availableDonationsDiv) return;
            availableDonationsDiv.innerHTML = '';

            const donations = getDonations().filter(d => !d.claimed);
            if (donations.length === 0) {
                availableDonationsDiv.innerHTML = '<p>No donations available at the moment.</p>';
                return;
            }

            donations.forEach(donation => {
                const card = document.createElement('div');
                card.className = 'donation-card';

                card.innerHTML = `
                    <strong>Food Type:</strong> ${donation.foodType} <br/>
                    <strong>Quantity:</strong> ${donation.quantity} <br/>
                    <strong>Expiry:</strong> ${donation.expiryDate || 'N/A'} <br/>
                    <strong>Location:</strong> ${donation.location} <br/>
                    <button class="claim-btn">Claim</button>
                `;

                const claimBtn = card.querySelector('.claim-btn');
                claimBtn.addEventListener('click', () => {
                    const allDonations = getDonations();
                    const index = allDonations.findIndex(d => d.id === donation.id);
                    if (index !== -1) {
                        allDonations[index].claimed = true;
                        allDonations[index].receiverId = loggedInUser.id;
                        allDonations[index].receiverName = loggedInUser.name;
                        allDonations[index].receiverPhone = loggedInUser.phoneNumber;
                        allDonations[index].receiverLocation = loggedInUser.location;
                        allDonations[index].claimedAt = new Date().toISOString();
                        saveDonations(allDonations);

                        createNotification('donation_claimed', donation.donorId, donation.id, loggedInUser.name, loggedInUser.phoneNumber, loggedInUser.location);

                        alert('Donation claimed successfully! The donor will be notified.');
                        renderAvailableDonations();
                    }
                });

                availableDonationsDiv.appendChild(card);
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
