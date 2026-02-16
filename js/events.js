// events.js - All logic for events page

// Logout function
function logout() {
    window.location.href = 'login.html';
}

// Navigate to detail page
function showDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load and display events grouped by date
function loadEventsByDate() {
    const container = document.getElementById('violationsContainer');
    const groupedData = groupViolationsByDate();
    
    // Sort dates in descending order (most recent first)
    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));
    
    sortedDates.forEach(date => {
        const violations = groupedData[date];
        
        // Create card for this date
        const card = document.createElement('div');
        card.className = 'card';
        
        // Date header inside card
        const dateHeader = document.createElement('h2');
        dateHeader.textContent = formatDate(date);
        dateHeader.style.marginBottom = '20px';
        card.appendChild(dateHeader);
        
        // Create table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Number Plate</th>
                    <th>Timestamp</th>
                    <th>Confidence</th>
                    <th>Violation Type</th>
                    <th>Violation Fine</th>
                    <th>Fine Paid</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        violations.forEach(violation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" class="id-link" onclick="showDetail('${violation.id}'); return false;">${violation.id}</a></td>
                <td>${violation.plate}</td>
                <td>${violation.timestamp}</td>
                <td>${violation.confidence}</td>
                <td><span class="violation-type ${violation.type === 'Helmet' ? 'helmet' : 'no-helmet'}">${violation.type}</span></td>
                <td>${violation.fine}</td>
                <td><span class="status-badge ${violation.paid ? 'status-paid' : 'status-pending'}">${violation.paid ? 'Paid' : 'Pending'}</span></td>
            `;
            tbody.appendChild(row);
        });
        
        tableContainer.appendChild(table);
        card.appendChild(tableContainer);
        container.appendChild(card);
    });
}

// Update summary cards at the top
function updateSummaryCards() {
    // Today's count (assuming today is 2024-02-15)
    const todayDate = '2024-02-15';
    const todayEvents = violationData.filter(v => v.date === todayDate).length;
    document.getElementById('todayCount').textContent = todayEvents;

    // High confidence count (>95%)
    const highConfCount = violationData.filter(v => parseFloat(v.confidence) > 95).length;
    document.getElementById('highConfidence').textContent = highConfCount;

    // Pending payment count
    const pendingCount = violationData.filter(v => !v.paid).length;
    document.getElementById('pendingPayment').textContent = pendingCount;
}

// Initialize events page
function initEventsPage() {
    loadEventsByDate();
    updateSummaryCards();
}

// Load events on page load
window.onload = async function () {
    await fetchViolations();
    initEventsPage();
};
