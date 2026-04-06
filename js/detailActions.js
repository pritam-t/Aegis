// detailActions.js - Handle all detail page operations

let currentViolationId = null;

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
}

// Helper: hide skeleton span, show real element with value
function revealField(skelId, elId, value) {
    const skel = document.getElementById(skelId);
    if (skel) skel.style.display = 'none';
    const el = document.getElementById(elId);
    if (el) {
        el.style.display = '';
        if (value !== undefined) el.textContent = value;
    }
}

// Helper: hide skeleton span, show real element with innerHTML
function revealFieldHTML(skelId, elId, html) {
    const skel = document.getElementById(skelId);
    if (skel) skel.style.display = 'none';
    const el = document.getElementById(elId);
    if (el) {
        el.style.display = '';
        el.innerHTML = html;
    }
}

// Helper: hide skeleton, show image
function revealImage(skelId, imgId, src) {
    const skel = document.getElementById(skelId);
    if (skel) skel.style.display = 'none';
    const img = document.getElementById(imgId);
    if (img) {
        img.style.display = src ? '' : 'none';
        img.src = src || '';
    }
}

// Load violation detail from URL
function loadViolationDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const violationId = urlParams.get('id');

    if (!violationId) {
        window.location.href = 'events.html';
        return;
    }

    currentViolationId = violationId;

    const violation = violationData.find(v => v.id === violationId);

    if (!violation) {
        window.location.href = 'events.html';
        return;
    }

    // Reveal all text fields
    revealField('skel-detailId',        'detailId',        violation.id);
    revealField('skel-detailPlate',     'detailPlate',     violation.plate);
    revealField('skel-detailName',      'detailName',      violation.name);
    revealField('skel-detailMobile',    'detailMobile',    violation.mobile);
    revealField('skel-detailEmail',     'detailEmail',     violation.email);
    revealField('skel-detailTimestamp', 'detailTimestamp', violation.timestamp);
    revealField('skel-detailLocation',  'detailLocation',  violation.location);
    revealField('skel-detailType',      'detailType',      violation.type);
    revealField('skel-detailConfidence','detailConfidence', violation.confidence);
    revealField('skel-detailFine',      'detailFine',      violation.fine);
    revealField('skel-detailAddress',   'detailAddress',   violation.address);

    // Status badge uses innerHTML
    revealFieldHTML('skel-detailStatus', 'detailStatus',
        violation.paid
            ? '<span class="status-badge status-paid">Paid</span>'
            : '<span class="status-badge status-pending">Pending</span>'
    );

    // Images — fixed: use violation.image and violation.plateImage (mapped in data.js)
    revealImage('skel-detailImage',      'detailImage',      violation.image);
    revealImage('skel-detailPlateImage', 'detailPlateImage', violation.plateImage);

    // Show action buttons
    const actionButtons = document.getElementById('actionButtons');
    if (actionButtons) actionButtons.classList.remove('loading');
}

// Show edit modal
function showEditModal(violationId) {
    const violation = violationData.find(v => v.id === violationId);

    if (!violation) {
        alert('Violation not found!');
        return;
    }

    const modalHTML = `
        <div id="editModal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex;
            justify-content: center; align-items: center; z-index: 1000;">
            <div style="
                background: white; padding: 30px; border-radius: 12px;
                max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h2 style="margin-bottom: 20px; font-family: 'Hubot Sans', sans-serif;">Edit Violation Details</h2>

                <div style="margin-bottom: 15px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600; font-family:'Hubot Sans',sans-serif;">Owner Name</label>
                    <input type="text" id="editName" value="${violation.name}" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:6px; font-family:'Hubot Sans',sans-serif;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600; font-family:'Hubot Sans',sans-serif;">Mobile Number</label>
                    <input type="text" id="editMobile" value="${violation.mobile}" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:6px; font-family:'Hubot Sans',sans-serif;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600; font-family:'Hubot Sans',sans-serif;">Email</label>
                    <input type="email" id="editEmail" value="${violation.email}" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:6px; font-family:'Hubot Sans',sans-serif;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600; font-family:'Hubot Sans',sans-serif;">Address</label>
                    <textarea id="editAddress" rows="3" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:6px; font-family:'Hubot Sans',sans-serif;">${violation.address}</textarea>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600; font-family:'Hubot Sans',sans-serif;">Fine Amount</label>
                    <input type="text" id="editFine" value="${violation.fine}" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:6px; font-family:'Hubot Sans',sans-serif;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600; font-family:'Hubot Sans',sans-serif;">Payment Status</label>
                    <select id="editPaid" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:6px; font-family:'Hubot Sans',sans-serif;">
                        <option value="true" ${violation.paid ? 'selected' : ''}>Paid</option>
                        <option value="false" ${!violation.paid ? 'selected' : ''}>Pending</option>
                    </select>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button onclick="closeEditModal()" style="padding:10px 20px; background:#6c757d; color:white; border:none; border-radius:6px; cursor:pointer; font-family:'Hubot Sans',sans-serif; font-weight:600;">Cancel</button>
                    <button onclick="saveViolationChanges('${violationId}')" style="padding:10px 20px; background:#ff6b35; color:white; border:none; border-radius:6px; cursor:pointer; font-family:'Hubot Sans',sans-serif; font-weight:600;">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.remove();
}

function saveViolationChanges(violationId) {
    const violation = violationData.find(v => v.id === violationId);

    if (!violation) {
        alert('Violation not found!');
        closeEditModal();
        return;
    }

    const name    = document.getElementById('editName').value;
    const mobile  = document.getElementById('editMobile').value;
    const email   = document.getElementById('editEmail').value;
    const address = document.getElementById('editAddress').value;
    const fine    = document.getElementById('editFine').value;
    const paid    = document.getElementById('editPaid').value === 'true';

    if (!name || !mobile || !email || !address || !fine) {
        alert('Please fill in all fields!');
        return;
    }

    violation.name    = name;
    violation.mobile  = mobile;
    violation.email   = email;
    violation.address = address;
    violation.fine    = fine;
    violation.paid    = paid;

    closeEditModal();
    alert('Violation updated successfully!');
    loadViolationDetail();
}

function deleteViolation(violationId) {
    const confirmation = confirm('Are you sure you want to delete this violation record?\n\nID: ' + violationId + '\n\nThis action cannot be undone.');

    if (!confirmation) return;

    const index = violationData.findIndex(v => v.id === violationId);

    if (index === -1) {
        alert('Violation not found!');
        return;
    }

    violationData.splice(index, 1);
    alert('Violation deleted successfully!');
    window.location.href = 'events.html';
}

// Initialize when page loads
window.onload = async function () {
    await fetchViolations();
    loadViolationDetail();
};