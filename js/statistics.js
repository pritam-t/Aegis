// statistics.js - All logic for statistics page with animations

// Calculate statistics
function calculateStats() {
    const total = violationData.length;
    const noHelmet = violationData.filter(v => v.type === 'No Helmet').length;
    const helmet = violationData.filter(v => v.type === 'Helmet').length;
    const paid = violationData.filter(v => v.paid).length;
    const pending = total - paid;
    
    const avgConf = violationData.reduce((sum, v) => sum + parseFloat(v.confidence), 0) / total;
    const highConf = violationData.filter(v => parseFloat(v.confidence) > 95).length;
    
    const complianceRate = ((helmet / total) * 100).toFixed(1);
    const violationRate = ((noHelmet / total) * 100).toFixed(1);
    
    // Calculate fine amounts
    const totalFine = violationData.reduce((sum, v) => {
        const fine = parseInt(v.fine.replace(/[₹,]/g, ''));
        return sum + (isNaN(fine) ? 0 : fine);
    }, 0);
    
    const collectedFine = violationData.filter(v => v.paid).reduce((sum, v) => {
        const fine = parseInt(v.fine.replace(/[₹,]/g, ''));
        return sum + (isNaN(fine) ? 0 : fine);
    }, 0);
    
    const pendingFine = totalFine - collectedFine;
    const collectionRate = ((collectedFine / totalFine) * 100).toFixed(1);
    
    return {
        total, noHelmet, helmet, paid, pending,
        avgConf: avgConf.toFixed(1), highConf,
        complianceRate, violationRate,
        totalFine, collectedFine, pendingFine, collectionRate
    };
}

// Animate counting numbers
function animateNumber(element, target, duration = 1000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Update statistics cards with animation
function updateStatsCards() {
    const stats = calculateStats();
    
    // Animate the numbers
    animateNumber(document.getElementById('totalEvents'), stats.total);
    animateNumber(document.getElementById('complianceRate'), parseFloat(stats.complianceRate), 1000, '%');
    animateNumber(document.getElementById('violationRate'), parseFloat(stats.violationRate), 1000, '%');
    animateNumber(document.getElementById('avgConfidence'), parseFloat(stats.avgConf), 1000, '%');
    
    animateNumber(document.getElementById('highConfCount'), stats.highConf);
    document.getElementById('avgConf2').textContent = stats.avgConf + '%';
    document.getElementById('collectedAmount').textContent = '₹' + stats.collectedFine.toLocaleString();
    document.getElementById('pendingAmount').textContent = '₹' + stats.pendingFine.toLocaleString();
    document.getElementById('collectionRate').textContent = stats.collectionRate + '%';
}

// Create charts with animations
function createCharts() {
    const stats = calculateStats();
    
    // Common animation configuration
    const animationConfig = {
        duration: 1500,
        easing: 'easeInOutQuart'
    };
    
    // Violation Type Chart (Doughnut) with rotation animation
    const ctx1 = document.getElementById('violationTypeChart').getContext('2d');
    new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['No Helmet', 'Helmet'],
            datasets: [{
                data: [stats.noHelmet, stats.helmet],
                backgroundColor: ['#dc3545', '#28a745'],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Hubot Sans', size: 13 },
                        padding: 12,
                        boxWidth: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { family: 'Hubot Sans', size: 14 },
                    bodyFont: { family: 'Hubot Sans', size: 13 }
                }
            }
        }
    });

    // Payment Status Chart (Doughnut) with delayed animation
    const ctx2 = document.getElementById('paymentStatusChart').getContext('2d');
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Paid', 'Pending'],
            datasets: [{
                data: [stats.paid, stats.pending],
                backgroundColor: ['#28a745', '#ffc107'],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                delay: 200,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Hubot Sans', size: 13 },
                        padding: 12,
                        boxWidth: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { family: 'Hubot Sans', size: 14 },
                    bodyFont: { family: 'Hubot Sans', size: 13 }
                }
            }
        }
    });

    // Daily Trend Chart (Line) with progressive reveal
    const dailyData = {};
    violationData.forEach(v => {
        dailyData[v.date] = (dailyData[v.date] || 0) + 1;
    });
    const dates = Object.keys(dailyData).sort();
    const counts = dates.map(d => dailyData[d]);

    const ctx3 = document.getElementById('dailyTrendChart').getContext('2d');
    new Chart(ctx3, {
        type: 'line',
        data: {
            labels: dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Violations',
                data: counts,
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.15)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#ff6b35',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart',
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 150;
                    }
                    return delay;
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { family: 'Hubot Sans', size: 14 },
                    bodyFont: { family: 'Hubot Sans', size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { family: 'Hubot Sans', size: 12 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Hubot Sans', size: 12 }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Confidence Distribution (Bar) with stagger animation
    const confRanges = {
        '90-94%': 0,
        '95-97%': 0,
        '98-100%': 0
    };
    violationData.forEach(v => {
        const conf = parseFloat(v.confidence);
        if (conf >= 90 && conf < 95) confRanges['90-94%']++;
        else if (conf >= 95 && conf < 98) confRanges['95-97%']++;
        else confRanges['98-100%']++;
    });

    const ctx4 = document.getElementById('confidenceChart').getContext('2d');
    new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: Object.keys(confRanges),
            datasets: [{
                label: 'Events',
                data: Object.values(confRanges),
                backgroundColor: ['#ffc107', '#ff6b35', '#28a745'],
                borderColor: ['#e0a800', '#e55a2b', '#218838'],
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 1500,
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 200 + 400;
                    }
                    return delay;
                },
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { family: 'Hubot Sans', size: 14 },
                    bodyFont: { family: 'Hubot Sans', size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { family: 'Hubot Sans', size: 12 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Hubot Sans', size: 12 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Fine Collection Chart (Bar - Horizontal) with slide animation
    const ctx5 = document.getElementById('fineCollectionChart').getContext('2d');
    new Chart(ctx5, {
        type: 'bar',
        data: {
            labels: ['Amount Collected', 'Amount Pending'],
            datasets: [{
                label: 'Amount (₹)',
                data: [stats.collectedFine, stats.pendingFine],
                backgroundColor: ['#28a745', '#ffc107'],
                borderWidth: 2,
                borderColor: ['#218838', '#e0a800'],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 1800,
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 300 + 600;
                    }
                    return delay;
                },
                easing: 'easeOutQuart',
                x: {
                    from: 0
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { family: 'Hubot Sans', size: 14 },
                    bodyFont: { family: 'Hubot Sans', size: 13 },
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.parsed.x.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: { family: 'Hubot Sans', size: 12 },
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: { family: 'Hubot Sans', size: 13 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create location table with fade-in animation
function createLocationTable() {
    const locationCounts = {};
    violationData.forEach(v => {
        const loc = v.location.split(',')[0]; // Get main location name
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const sortedLocations = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5

    const tbody = document.getElementById('locationTable');
    const total = violationData.length;

    sortedLocations.forEach(([location, count], index) => {
        const percentage = ((count / total) * 100).toFixed(1);
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = `all 0.5s ease ${index * 0.1}s`;
        row.innerHTML = `
            <td>${location}</td>
            <td>${count}</td>
            <td>${percentage}%</td>
        `;
        tbody.appendChild(row);
        
        // Trigger animation
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Logout function
function logout() {
    window.location.href = 'login.html';
}

// Initialize on load
function setupScrollAnimations() {
    const options = { threshold: 0.25 };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const id = entry.target.id;

            if (id === 'statsSection') {
                updateStatsCards();
            }

            if (id === 'chartsSection') {
                createCharts();
            }

            if (id === 'locationSection') {
                createLocationTable();
            }

            obs.unobserve(entry.target);
        });
    }, options);

    observer.observe(document.getElementById('statsSection'));
    observer.observe(document.getElementById('chartsSection'));
    observer.observe(document.getElementById('locationSection'));
}

window.onload = setupScrollAnimations;
