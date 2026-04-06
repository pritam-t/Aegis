// events.js - All logic for events page

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
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

// Reveal a stat card: hide skeleton, show real value
function revealStat(skelId, valId, value) {
    document.getElementById(skelId).style.display = 'none';
    const el = document.getElementById(valId);
    el.style.display = 'block';
    el.textContent = value;
}

// Load and display events grouped by date
function loadEventsByDate() {
    const container = document.getElementById('violationsContainer');
    const groupedData = groupViolationsByDate();

    // Sort dates in descending order (most recent first)
    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
        const violations = groupedData[date];

        const card = document.createElement('div');
        card.className = 'card';

        const dateHeader = document.createElement('h2');
        dateHeader.textContent = formatDate(date);
        dateHeader.style.marginBottom = '20px';
        card.appendChild(dateHeader);

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
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = violationData.filter(v => v.date === today).length;
    revealStat('skel-todayCount', 'todayCount', todayEvents);

    const highConfCount = violationData.filter(v => parseFloat(v.confidence) > 95).length;
    revealStat('skel-highConfidence', 'highConfidence', highConfCount);

    const pendingCount = violationData.filter(v => !v.paid).length;
    revealStat('skel-pendingPayment', 'pendingPayment', pendingCount);
}

// Initialize events page
function initEventsPage() {
    loadEventsByDate();
    updateSummaryCards();

    // Hide skeleton, reveal real content
    document.getElementById('violationsSkeleton').style.display = 'none';
    document.getElementById('violationsContainer').style.display = 'block';
}

function subscribeRealtime() {
    supabaseClient
        .channel('violations-events')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'violation_event' },
            async () => {
                await fetchViolations();
                // Clear and re-render
                document.getElementById('violationsContainer').innerHTML = '';
                initEventsPage();
            }
        )
        .subscribe();
}

// Load events on page load
window.onload = async function () {
    await fetchViolations();
    initEventsPage();
    subscribeRealtime();
};