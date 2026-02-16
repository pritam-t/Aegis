// detailActions.js - Handle all detail page operations

let currentViolationId = null;

// Logout function
function logout() {
    window.location.href = 'login.html';
}

// Load violation detail from URL
function loadViolationDetail() {
    // Get violation ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const violationId = urlParams.get('id');

    if (!violationId) {
        window.location.href = 'events.html';
        return;
    }

    // Store current violation ID globally
    currentViolationId = violationId;

    // Find violation data
    const violation = violationData.find(v => v.id === violationId);
    
    if (!violation) {
        window.location.href = 'events.html';
        return;
    }

    // Populate detail page
    document.getElementById('detailId').textContent = violation.id;
    document.getElementById('detailPlate').textContent = violation.plate;
    document.getElementById('detailName').textContent = violation.name;
    document.getElementById('detailMobile').textContent = violation.mobile;
    document.getElementById('detailEmail').textContent = violation.email;
    document.getElementById('detailTimestamp').textContent = violation.timestamp;
    document.getElementById('detailLocation').textContent = violation.location;
    document.getElementById('detailType').textContent = violation.type;
    document.getElementById('detailConfidence').textContent = violation.confidence;
    document.getElementById('detailFine').textContent = violation.fine;
    document.getElementById('detailStatus').innerHTML = violation.paid 
        ? '<span class="status-badge status-paid">Paid</span>' 
        : '<span class="status-badge status-pending">Pending</span>';
    document.getElementById('detailAddress').textContent = violation.address;
    document.getElementById('detailImage').src = violation.image;
}

// Show edit modal (Professional modal with form)
function showEditModal(violationId) {
    const violation = violationData.find(v => v.id === violationId);
    
    if (!violation) {
        alert('Violation not found!');
        return;
    }

    // Create modal HTML
    const modalHTML = `
        <div id="editModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h2 style="margin-bottom: 20px; font-family: 'Hubot Sans', sans-serif;">Edit Violation Details</h2>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-family: 'Hubot Sans', sans-serif;">Owner Name</label>
                    <input type="text" id="editName" value="${violation.name}" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: 'Hubot Sans', sans-serif;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-family: 'Hubot Sans', sans-serif;">Mobile Number</label>
                    <input type="text" id="editMobile" value="${violation.mobile}" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: 'Hubot Sans', sans-serif;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-family: 'Hubot Sans', sans-serif;">Email</label>
                    <input type="email" id="editEmail" value="${violation.email}" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: 'Hubot Sans', sans-serif;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-family: 'Hubot Sans', sans-serif;">Address</label>
                    <textarea id="editAddress" rows="3" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: 'Hubot Sans', sans-serif;">${violation.address}</textarea>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-family: 'Hubot Sans', sans-serif;">Fine Amount</label>
                    <input type="text" id="editFine" value="${violation.fine}" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: 'Hubot Sans', sans-serif;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-family: 'Hubot Sans', sans-serif;">Payment Status</label>
                    <select id="editPaid" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: 'Hubot Sans', sans-serif;">
                        <option value="true" ${violation.paid ? 'selected' : ''}>Paid</option>
                        <option value="false" ${!violation.paid ? 'selected' : ''}>Pending</option>
                    </select>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="closeEditModal()" style="
                        padding: 10px 20px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: 'Hubot Sans', sans-serif;
                        font-weight: 600;
                    ">Cancel</button>
                    <button onclick="saveViolationChanges('${violationId}')" style="
                        padding: 10px 20px;
                        background: #ff6b35;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: 'Hubot Sans', sans-serif;
                        font-weight: 600;
                    ">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

// Save changes from modal
function saveViolationChanges(violationId) {
    const violation = violationData.find(v => v.id === violationId);
    
    if (!violation) {
        alert('Violation not found!');
        closeEditModal();
        return;
    }

    // Get values from form
    const name = document.getElementById('editName').value;
    const mobile = document.getElementById('editMobile').value;
    const email = document.getElementById('editEmail').value;
    const address = document.getElementById('editAddress').value;
    const fine = document.getElementById('editFine').value;
    const paid = document.getElementById('editPaid').value === 'true';

    // Validate inputs
    if (!name || !mobile || !email || !address || !fine) {
        alert('Please fill in all fields!');
        return;
    }

    // Update violation
    violation.name = name;
    violation.mobile = mobile;
    violation.email = email;
    violation.address = address;
    violation.fine = fine;
    violation.paid = paid;

    // Close modal and refresh
    closeEditModal();
    alert('Violation updated successfully!');
    loadViolationDetail();
}

// Delete violation
function deleteViolation(violationId) {
    const confirmation = confirm('Are you sure you want to delete this violation record?\n\nID: ' + violationId + '\n\nThis action cannot be undone.');
    
    if (!confirmation) {
        return;
    }

    // Find the index of the violation
    const index = violationData.findIndex(v => v.id === violationId);
    
    if (index === -1) {
        alert('Violation not found!');
        return;
    }

    // Remove the violation from the array
    violationData.splice(index, 1);

    // Show success message and redirect
    alert('Violation deleted successfully!');
    window.location.href = 'events.html';
}

// Initialize when page loads
window.onload = async function () {
    await fetchViolations();
    loadViolationDetail();
};
