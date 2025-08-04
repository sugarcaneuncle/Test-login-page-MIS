// School MIS Admin Panel JavaScript

// Global variables
let financeChart = null;
let growthChart = null;
let currentDate = new Date();

// Mock data
const mockData = {
    finance: {
        '6months': {
            labels: ['July', 'August', 'September', 'October', 'November', 'December'],
            tuition: [45000, 47000, 46500, 48000, 49500, 51000],
            fees: [8500, 8200, 8800, 9100, 8900, 9300],
            total: [53500, 55200, 55300, 57100, 58400, 60300]
        },
        'year': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tuition: [42000, 43000, 44000, 43500, 44500, 45000, 45000, 47000, 46500, 48000, 49500, 51000],
            fees: [7800, 8000, 8200, 8100, 8300, 8500, 8500, 8200, 8800, 9100, 8900, 9300],
            total: [49800, 51000, 52200, 51600, 52800, 53500, 53500, 55200, 55300, 57100, 58400, 60300]
        },
        '2years': {
            labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4'],
            tuition: [125000, 130000, 135000, 140000, 145000, 150000, 155000, 160000],
            fees: [24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000],
            total: [149000, 155000, 161000, 167000, 173000, 179000, 185000, 191000]
        }
    },
    growth: {
        'year': {
            labels: ['Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024'],
            admissions: [45, 12, 8, 5, 3, 67, 23, 15, 11, 7, 4, 2],
            total: [1150, 1162, 1170, 1175, 1178, 1245, 1268, 1283, 1294, 1301, 1305, 1307]
        },
        'semester': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            admissions: [8, 12, 5, 9, 15, 7, 11, 6],
            total: [1200, 1212, 1217, 1226, 1241, 1248, 1259, 1265]
        },
        'quarter': {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            admissions: [25, 18, 12],
            total: [1220, 1238, 1250]
        }
    },
    events: [
        { date: '2024-12-15', title: 'Parent-Teacher Conference', type: 'meeting' },
        { date: '2024-12-18', title: 'Winter Concert', type: 'event' },
        { date: '2024-12-20', title: 'Last Day Before Holiday', type: 'academic' },
        { date: '2024-12-25', title: 'Christmas Holiday', type: 'holiday' },
        { date: '2025-01-02', title: 'School Reopens', type: 'academic' },
        { date: '2025-01-15', title: 'Science Fair', type: 'event' },
        { date: '2025-01-20', title: 'Martin Luther King Jr. Day', type: 'holiday' }
    ],
    performance: {
        current: {
            attendance: 94.2,
            assignment: 87.5,
            engagement: 76.8
        },
        last: {
            attendance: 92.1,
            assignment: 88.8,
            engagement: 72.6
        }
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupHeader();
    setupCharts();
    setupCalendar();
    setupPerformanceToggle();
    updateDashboardMetrics();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.closest('.nav-item').classList.add('active');
            
            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetSection).classList.add('active');
            
            // Update URL hash
            window.location.hash = targetSection;
        });
    });
    
    // Handle initial hash
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        const targetLink = document.querySelector(`[data-section="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// Header Setup
function setupHeader() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });
    
    // Profile dropdown
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('show');
    });
    
    // Close mobile menu when clicking on main content
    document.getElementById('mainContent').addEventListener('click', function() {
        sidebar.classList.remove('show');
    });
}

// Charts Setup
function setupCharts() {
    initializeFinanceChart();
    initializeGrowthChart();
    
    // Chart timeframe selectors
    document.getElementById('financeTimeframe').addEventListener('change', function() {
        updateFinanceChart(this.value);
    });
    
    document.getElementById('growthTimeframe').addEventListener('change', function() {
        updateGrowthChart(this.value);
    });
}

// Initialize Finance Chart
function initializeFinanceChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    const data = mockData.finance['6months'];
    
    financeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Tuition Fees',
                    data: data.tuition,
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Other Fees',
                    data: data.fees,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#1e40af',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Initialize Growth Chart
function initializeGrowthChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    const data = mockData.growth['year'];
    
    growthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'New Admissions',
                    data: data.admissions,
                    backgroundColor: '#1e40af',
                    borderColor: '#1e3a8a',
                    borderWidth: 1,
                    borderRadius: 4,
                    yAxisID: 'y'
                },
                {
                    label: 'Total Students',
                    data: data.total,
                    type: 'line',
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#1e40af',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#64748b'
                    },
                    title: {
                        display: true,
                        text: 'New Admissions',
                        color: '#1e40af'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#64748b'
                    },
                    title: {
                        display: true,
                        text: 'Total Students',
                        color: '#ef4444'
                    }
                }
            }
        }
    });
}

// Update Finance Chart
function updateFinanceChart(timeframe) {
    const data = mockData.finance[timeframe];
    financeChart.data.labels = data.labels;
    financeChart.data.datasets[0].data = data.tuition;
    financeChart.data.datasets[1].data = data.fees;
    financeChart.update();
}

// Update Growth Chart
function updateGrowthChart(timeframe) {
    const data = mockData.growth[timeframe];
    growthChart.data.labels = data.labels;
    growthChart.data.datasets[0].data = data.admissions;
    growthChart.data.datasets[1].data = data.total;
    growthChart.update();
}

// Calendar Setup
function setupCalendar() {
    generateCalendar(currentDate);
    
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
    
    updateEventsList();
}

// Generate Calendar
function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    
    // Update month display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Generate calendar grid
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        emptyDay.innerHTML = `<span>${prevMonthLastDay - startingDayOfWeek + i + 1}</span>`;
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if today
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Check for events
        const hasEvent = mockData.events.some(event => event.date === currentDateStr);
        if (hasEvent) {
            dayElement.classList.add('has-event');
            dayElement.innerHTML = `<span>${day}</span><div class="event-dot"></div>`;
        } else {
            dayElement.innerHTML = `<span>${day}</span>`;
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Add days from next month to fill grid
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells
    
    for (let day = 1; day <= remainingCells; day++) {
        const nextMonthDay = document.createElement('div');
        nextMonthDay.className = 'calendar-day other-month';
        nextMonthDay.innerHTML = `<span>${day}</span>`;
        calendarGrid.appendChild(nextMonthDay);
    }
}

// Update Events List
function updateEventsList() {
    const eventList = document.getElementById('eventList');
    const upcomingEvents = mockData.events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    eventList.innerHTML = '';
    
    upcomingEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        eventItem.innerHTML = `
            <div class="event-date">${formattedDate}</div>
            <div class="event-title">${event.title}</div>
        `;
        
        eventList.appendChild(eventItem);
    });
}

// Performance Toggle Setup
function setupPerformanceToggle() {
    const weekBtns = document.querySelectorAll('.week-btn');
    
    weekBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            weekBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const week = this.getAttribute('data-week');
            updatePerformanceData(week);
        });
    });
}

// Update Performance Data
function updatePerformanceData(week) {
    const data = mockData.performance[week];
    const currentWeekElements = document.querySelectorAll('.current-week');
    const progressBars = document.querySelectorAll('.progress');
    const comparisons = document.querySelectorAll('.comparison');
    
    if (week === 'current') {
        currentWeekElements[0].textContent = '94.2%';
        currentWeekElements[1].textContent = '87.5%';
        currentWeekElements[2].textContent = '76.8%';
        
        progressBars[0].style.width = '94.2%';
        progressBars[1].style.width = '87.5%';
        progressBars[2].style.width = '76.8%';
        
        comparisons[0].textContent = '+2.1%';
        comparisons[0].className = 'comparison positive';
        comparisons[1].textContent = '-1.3%';
        comparisons[1].className = 'comparison negative';
        comparisons[2].textContent = '+4.2%';
        comparisons[2].className = 'comparison positive';
    } else {
        currentWeekElements[0].textContent = '92.1%';
        currentWeekElements[1].textContent = '88.8%';
        currentWeekElements[2].textContent = '72.6%';
        
        progressBars[0].style.width = '92.1%';
        progressBars[1].style.width = '88.8%';
        progressBars[2].style.width = '72.6%';
        
        comparisons[0].textContent = '+1.8%';
        comparisons[0].className = 'comparison positive';
        comparisons[1].textContent = '+2.5%';
        comparisons[1].className = 'comparison positive';
        comparisons[2].textContent = '-0.8%';
        comparisons[2].className = 'comparison negative';
    }
}

// Update Dashboard Metrics
function updateDashboardMetrics() {
    // Animate counter numbers
    animateCounter('totalStudents', 1247, 2000);
    animateCounter('totalTeachers', 87, 1500);
    animateCounter('totalEvents', 24, 1000);
    animateCounter('totalMeals', 8450, 2500);
}

// Animate Counter
function animateCounter(elementId, target, duration) {
    const element = document.getElementById(elementId);
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    if (financeChart) {
        financeChart.resize();
    }
    if (growthChart) {
        growthChart.resize();
    }
});

// Export functions for external use
window.SchoolMIS = {
    updateDashboardMetrics,
    generateCalendar,
    updatePerformanceData,
    formatCurrency,
    formatDate
};