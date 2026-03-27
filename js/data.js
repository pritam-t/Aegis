let violationData = [];

async function fetchViolations() {
    const { data, error } = await supabaseClient
        .from("violation_event")
        .select(`
            id,
            number_plate,
            timestamp,
            location,
            confidence,
            violation_type,
            violation_fine,
            fine_paid,
            number_plate_img,
            violation_img,
            vehicle_owner (
                owner_name,
                mobile_number,
                email,
                address
            )
        `)
        .order("timestamp", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    violationData = data.map(v => ({
        id: v.id,
        plate: v.number_plate,
        timestamp: v.timestamp,
        date: v.timestamp.split("T")[0],
        time: new Date(v.timestamp).toLocaleTimeString(),
        confidence: v.confidence + "%",
        type: v.violation_type,
        fine: `₹${v.violation_fine}`,
        paid: v.fine_paid,
        name: v.vehicle_owner?.owner_name || "Unknown",
        mobile: v.vehicle_owner?.mobile_number || "",
        email: v.vehicle_owner?.email || "",
        address: v.vehicle_owner?.address || "",
        location: v.location,
        image: v.violation_img
            ? supabaseClient.storage.from('violation_image').getPublicUrl(v.violation_img).data.publicUrl
            : null,
        plateImage: v.number_plate_img
            ? supabaseClient.storage.from('number_plates').getPublicUrl(v.number_plate_img).data.publicUrl
            : null,
    }));
}

// Group violations by date
function groupViolationsByDate() {
    const grouped = {};
    violationData.forEach(violation => {
        if (!grouped[violation.date]) {
            grouped[violation.date] = [];
        }
        grouped[violation.date].push(violation);
    });
    return grouped;
}

// Get statistics
function getStatistics() {
    const totalViolations = violationData.length;
    const paidCount = violationData.filter(v => v.paid).length;
    const pendingCount = totalViolations - paidCount;
    const totalFine = violationData.reduce((sum, v) => {
        const fine = parseInt(v.fine.replace(/[₹,]/g, ''));
        return sum + (isNaN(fine) ? 0 : fine);
    }, 0);
    
    return {
        total: totalViolations,
        paid: paidCount,
        pending: pendingCount,
        totalAmount: `₹${totalFine.toLocaleString()}`
    };
}

