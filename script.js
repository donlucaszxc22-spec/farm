document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmationBox = document.getElementById('confirmationBox');

    // 1. Setup Date validation logic on index.html
    const dateInput = document.getElementById('serviceDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // 2. Handle Booking Submit on index.html
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Format raw time input to 12-hour AM/PM format
            const rawTime = document.getElementById('serviceTime').value;
            const formattedTime = formatTimeTo12Hour(rawTime);

            const newBooking = {
                id: Date.now(),
                name: document.getElementById('fullName').value,
                phone: document.getElementById('phoneNumber').value,
                email: document.getElementById('emailAddress').value,
                service: document.getElementById('serviceSelect').value,
                date: document.getElementById('serviceDate').value,
                time: formattedTime,
                location: document.getElementById('farmLocation').value
            };

            // Save to browser LocalStorage
            let bookings = JSON.parse(localStorage.getItem('farmBookings')) || [];
            bookings.push(newBooking);
            localStorage.setItem('farmBookings', JSON.stringify(bookings));

            // Populate confirmation view
            document.getElementById('confName').innerText = newBooking.name;
            document.getElementById('confService').innerText = newBooking.service;
            document.getElementById('confDate').innerText = `${newBooking.date} at ${newBooking.time}`;

            bookingForm.classList.add('hidden');
            confirmationBox.classList.remove('hidden');
        });
    }

    // 3. Load History details on history.html
    const historyContainer = document.getElementById('historyContainer');
    if (historyContainer) {
        loadHistory(historyContainer);
    }
});

// Helper function to convert 24-hour time to 12-hour AM/PM string
function formatTimeTo12Hour(timeString) {
    if (!timeString) return '';
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
}

// Reset booking form view
function resetForm() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmationBox = document.getElementById('confirmationBox');

    bookingForm.reset();
    confirmationBox.classList.add('hidden');
    bookingForm.classList.remove('hidden');
}

// Render dynamic history array records from local storage
function loadHistory(container) {
    let bookings = JSON.parse(localStorage.getItem('farmBookings')) || [];
    const clearBtn = document.getElementById('clearHistoryBtn');

    if (bookings.length === 0) {
        container.innerHTML = `<div class="no-history">No scheduled booking history found.<br><a href="index.html" style="color: #059669; font-weight: 500;">Book a service now</a></div>`;
        if (clearBtn) clearBtn.classList.add('hidden');
        return;
    }

    if (clearBtn) clearBtn.classList.remove('hidden');
    container.innerHTML = '';

    // Loop through bookings (show newest first)
    bookings.reverse().forEach(b => {
        container.innerHTML += `
            <div class="history-card">
                <p><strong>Service:</strong> ${b.service}</p>
                <p><strong>Date & Time:</strong> ${b.date} at ${b.time}</p>
                <p><strong>Client:</strong> ${b.name} (${b.phone})</p>
                <p><strong>Location:</strong> ${b.location}</p>
            </div>
        `;
    });
}

// Clear all local records function
function clearHistory() {
    if (confirm("Are you sure you want to clear your full scheduling history?")) {
        localStorage.removeItem('farmBookings');
        location.reload();
    }
}