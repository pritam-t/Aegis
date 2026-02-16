let violationData = [];

async function fetchViolations() {
    const { data, error } = await supabase
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
            image1_url,
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
        image: v.image1_url
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









// // Sample violation data
// const violationData = [
//     {
//         id: 'VIO-001',
//         plate: 'MH12AB1234',
//         date: '2024-02-15',
//         time: '14:23:45',
//         timestamp: '2024-02-15 14:23:45',
//         confidence: '98.5%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: false,
//         name: 'Rajesh Kumar',
//         mobile: '+91 98765 43210',
//         email: 'rajesh.kumar@email.com',
//         location: 'Bandra-Worli Sea Link, Mumbai',
//         address: 'Flat 402, Sunrise Apartments, Linking Road, Bandra West, Mumbai, Maharashtra 400050',
//         image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-002',
//         plate: 'DL8CAF5678',
//         date: '2024-02-15',
//         time: '15:10:22',
//         timestamp: '2024-02-15 15:10:22',
//         confidence: '96.2%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: true,
//         name: 'Priya Sharma',
//         mobile: '+91 87654 32109',
//         email: 'priya.sharma@email.com',
//         location: 'Andheri-Kurla Road, Mumbai',
//         address: 'B-304, Green Valley Society, Andheri East, Mumbai, Maharashtra 400069',
//         image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-003',
//         plate: 'KA05MN9012',
//         date: '2024-02-14',
//         time: '09:45:18',
//         timestamp: '2024-02-14 09:45:18',
//         confidence: '99.1%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: false,
//         name: 'Amit Patel',
//         mobile: '+91 76543 21098',
//         email: 'amit.patel@email.com',
//         location: 'Western Express Highway, Borivali',
//         address: '12/A, Shanti Nagar, SV Road, Borivali West, Mumbai, Maharashtra 400092',
//         image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-004',
//         plate: 'TN09XY3456',
//         date: '2024-02-14',
//         time: '16:32:55',
//         timestamp: '2024-02-14 16:32:55',
//         confidence: '94.8%',
//         type: 'Helmet',
//         fine: '₹0',
//         paid: true,
//         name: 'Sneha Iyer',
//         mobile: '+91 65432 10987',
//         email: 'sneha.iyer@email.com',
//         location: 'Powai Lake Road, Mumbai',
//         address: 'Tower 3, Flat 1205, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
//         image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-005',
//         plate: 'GJ01PQ7890',
//         date: '2024-02-13',
//         time: '11:15:33',
//         timestamp: '2024-02-13 11:15:33',
//         confidence: '97.3%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: true,
//         name: 'Vikram Singh',
//         mobile: '+91 54321 09876',
//         email: 'vikram.singh@email.com',
//         location: 'Marine Drive, South Mumbai',
//         address: '8th Floor, Nariman Point Plaza, Marine Drive, Mumbai, Maharashtra 400021',
//         image: 'https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-006',
//         plate: 'RJ14ST2345',
//         date: '2024-02-13',
//         time: '13:48:12',
//         timestamp: '2024-02-13 13:48:12',
//         confidence: '95.6%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: false,
//         name: 'Neha Gupta',
//         mobile: '+91 43210 98765',
//         email: 'neha.gupta@email.com',
//         location: 'Jogeshwari-Vikhroli Link Road',
//         address: 'C-201, Royal Gardens, Jogeshwari East, Mumbai, Maharashtra 400060',
//         image: 'https://images.unsplash.com/photo-1517650862521-d580d5348145?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-007',
//         plate: 'UP16VW6789',
//         date: '2024-02-12',
//         time: '08:22:47',
//         timestamp: '2024-02-12 08:22:47',
//         confidence: '98.9%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: true,
//         name: 'Arjun Reddy',
//         mobile: '+91 32109 87654',
//         email: 'arjun.reddy@email.com',
//         location: 'Eastern Express Highway, Thane',
//         address: 'Flat 605, Emerald Towers, Ghodbunder Road, Thane West, Maharashtra 400607',
//         image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-008',
//         plate: 'MP09YZ1234',
//         date: '2024-02-12',
//         time: '17:05:29',
//         timestamp: '2024-02-12 17:05:29',
//         confidence: '93.4%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: false,
//         name: 'Kavita Desai',
//         mobile: '+91 21098 76543',
//         email: 'kavita.desai@email.com',
//         location: 'LBS Marg, Kurla',
//         address: '23, Krishna Kunj, LBS Road, Kurla West, Mumbai, Maharashtra 400070',
//         image: 'https://images.unsplash.com/photo-1611386564638-baee8cde4e1a?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-009',
//         plate: 'HR26AB5678',
//         date: '2024-02-11',
//         time: '12:38:51',
//         timestamp: '2024-02-11 12:38:51',
//         confidence: '96.7%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: true,
//         name: 'Rahul Joshi',
//         mobile: '+91 10987 65432',
//         email: 'rahul.joshi@email.com',
//         location: 'Mulund-Goregaon Link Road',
//         address: 'Bungalow 14, Green Meadows, Mulund West, Mumbai, Maharashtra 400080',
//         image: 'https://images.unsplash.com/photo-1580869040144-e2df3a8b4f52?w=600&h=400&fit=crop'
//     },
//     {
//         id: 'VIO-010',
//         plate: 'PB03CD9012',
//         date: '2024-02-11',
//         time: '18:52:14',
//         timestamp: '2024-02-11 18:52:14',
//         confidence: '99.5%',
//         type: 'No Helmet',
//         fine: '₹1,000',
//         paid: false,
//         name: 'Anjali Mehta',
//         mobile: '+91 09876 54321',
//         email: 'anjali.mehta@email.com',
//         location: 'SV Road, Malad',
//         address: 'A-102, Lotus Residency, Marve Road, Malad West, Mumbai, Maharashtra 400064',
//         image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=400&fit=crop'
//     }
// ];
