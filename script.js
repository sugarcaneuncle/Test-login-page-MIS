// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const periodBtns = document.querySelectorAll('.period-btn');
const calendarDays = document.getElementById('calendarDays');
const currentMonthElement = document.getElementById('currentMonth');
const calendarNavBtns = document.querySelectorAll('.calendar-nav');

// Mock Data
const mockFinanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Tuition Fees',
        data: [125000, 132000, 128000, 145000, 138000, 152000],
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        tension: 0.4,
        fill: true
    }, {
        label: 'Other Fees',
        data: [25000, 28000, 32000, 35000, 38000, 42000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

const mockGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'New Admissions',
        data: [45, 52, 38, 67, 58, 72, 85, 78, 92, 88, 95, 102],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// School Events Data
const schoolEvents = [
    { date: '2024-12-15', title: 'Parent-Teacher Meeting', type: 'meeting' },
    { date: '2024-12-20', title: 'Annual Sports Day', type: 'event' },
    { date: '2024-12-25', title: 'Christmas Holiday', type: 'holiday' },
    { date: '2024-12-28', title: 'Exam Week Starts', type: 'exam' },
    { date: '2024-12-30', title: 'New Year Preparation', type: 'event' }
];

// Initialize Charts
let financeChart, growthChart;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeCalendar();
    initializeNavigation();
    initializePerformanceButtons();
    addAnimations();
});

// Chart Initialization
function initializeCharts() {
    // Finance Chart
    const financeCtx = document.getElementById('financeChart').getContext('2d');
    financeChart = new Chart(financeCtx, {
        type: 'line',
        data: mockFinanceData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#e2e8f0'
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });

    // Growth Chart
    const growthCtx = document.getElementById('growthChart').getContext('2d');
    growthChart = new Chart(growthCtx, {
        type: 'bar',
        data: mockGrowthData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0'
                    }
                },
                x: {
                    grid: {
                        color: '#e2e8f0'
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 4
                }
            }
        }
    });
}

// Calendar Initialization
function initializeCalendar() {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function renderCalendar(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;

        // Clear previous calendar
        calendarDays.innerHTML = '';

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(dayElement);
        }

        // Current month days
        for (let day = 1; day <= monthLength; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if it's today
            if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayElement.classList.add('today');
            }

            // Check if it has events
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEvent = schoolEvents.some(event => event.date === dateString);
            if (hasEvent) {
                dayElement.classList.add('has-event');
                dayElement.title = schoolEvents.find(event => event.date === dateString)?.title || '';
            }

            dayElement.addEventListener('click', () => {
                showEventDetails(dateString);
            });

            calendarDays.appendChild(dayElement);
        }

        // Next month days
        const totalDays = startingDay + monthLength;
        const remainingDays = 42 - totalDays; // 6 rows * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = day;
            calendarDays.appendChild(dayElement);
        }
    }

    // Navigation buttons
    calendarNavBtns[0].addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    calendarNavBtns[1].addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Initial render
    renderCalendar(currentMonth, currentYear);
}

// Event Details Modal
function showEventDetails(dateString) {
    const event = schoolEvents.find(event => event.date === dateString);
    if (event) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${event.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> ${event.type}</p>
                    <p>This is a school event that requires attention.</p>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .modal-content {
                background: white;
                border-radius: 1rem;
                padding: 0;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
            }
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                margin: 0;
                color: #1a202c;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #64748b;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.375rem;
                transition: background-color 0.3s ease;
            }
            .modal-close:hover {
                background-color: #f1f5f9;
            }
            .modal-body {
                padding: 1.5rem;
            }
            .modal-body p {
                margin-bottom: 0.75rem;
                color: #374151;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
    }
}

// Navigation Functionality
function initializeNavigation() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            link.parentElement.classList.add('active');
            
            // Update header title
            const title = link.querySelector('span').textContent;
            document.querySelector('.header-left h1').textContent = title;
            
            // Close mobile menu if open
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// Performance Buttons
function initializePerformanceButtons() {
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            periodBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update performance metrics based on period
            updatePerformanceMetrics(btn.textContent.trim());
        });
    });
}

// Update Performance Metrics
function updatePerformanceMetrics(period) {
    const metrics = {
        'This Week': { attendance: 94.2, academic: 87.5, fees: 92.8 },
        'Last Week': { attendance: 91.8, academic: 85.2, fees: 89.5 },
        'This Month': { attendance: 93.1, academic: 86.8, fees: 91.2 }
    };

    const data = metrics[period] || metrics['This Week'];
    
    // Update metric values
    document.querySelectorAll('.metric-value')[0].textContent = data.attendance + '%';
    document.querySelectorAll('.metric-value')[1].textContent = data.academic + '%';
    document.querySelectorAll('.metric-value')[2].textContent = data.fees + '%';
    
    // Update progress bars
    document.querySelectorAll('.progress-fill')[0].style.width = data.attendance + '%';
    document.querySelectorAll('.progress-fill')[1].style.width = data.academic + '%';
    document.querySelectorAll('.progress-fill')[2].style.width = data.fees + '%';
}

// Add Animations
function addAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card, .performance-card, .chart-container');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add hover effects to summary cards
    const summaryCards = document.querySelectorAll('.card');
    summaryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Real-time Updates Simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time data updates
        const randomChange = (Math.random() - 0.5) * 2;
        const currentStudents = parseInt(document.querySelector('.card-number').textContent.replace(',', ''));
        const newStudents = Math.max(1200, Math.min(1300, currentStudents + Math.round(randomChange)));
        
        document.querySelector('.card-number').textContent = newStudents.toLocaleString();
    }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
simulateRealTimeUpdates();

// Chart Period Selectors
document.querySelectorAll('.chart-period').forEach(select => {
    select.addEventListener('change', (e) => {
        const chartType = e.target.closest('.chart-container').querySelector('h3').textContent;
        
        if (chartType.includes('Finance')) {
            updateFinanceChart(e.target.value);
        } else if (chartType.includes('Growth')) {
            updateGrowthChart(e.target.value);
        }
    });
});

// Update Finance Chart
function updateFinanceChart(period) {
    const data = {
        'Last 6 Months': mockFinanceData,
        'Last Year': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Tuition Fees',
                data: [120000, 125000, 130000, 135000, 140000, 145000, 150000, 155000, 160000, 165000, 170000, 175000],
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        'Last 2 Years': {
            labels: ['2023', '2024'],
            datasets: [{
                label: 'Annual Revenue',
                data: [1500000, 1800000],
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                tension: 0.4,
                fill: true
            }]
        }
    };

    financeChart.data = data[period] || mockFinanceData;
    financeChart.update();
}

// Update Growth Chart
function updateGrowthChart(period) {
    const data = {
        'This Year': mockGrowthData,
        'Last Year': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'New Admissions',
                data: [35, 42, 28, 57, 48, 62, 75, 68, 82, 78, 85, 92],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        'Last 3 Years': {
            labels: ['2022', '2023', '2024'],
            datasets: [{
                label: 'Annual Growth',
                data: [850, 920, 1020],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: true
            }]
        }
    };

    growthChart.data = data[period] || mockGrowthData;
    growthChart.update();
}

// Export functionality
window.exportData = function() {
    const data = {
        students: 1247,
        teachers: 89,
        events: 24,
        meals: 15432,
        performance: {
            attendance: 94.2,
            academic: 87.5,
            fees: 92.8
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school-mis-data.json';
    a.click();
    URL.revokeObjectURL(url);
};

// Print functionality
window.printDashboard = function() {
    window.print();
};

// Add print styles
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .sidebar, .header, .btn-primary, .chart-controls, .calendar-nav {
            display: none !important;
        }
        .main-content {
            margin-left: 0 !important;
        }
        .dashboard-content {
            padding: 0 !important;
        }
        .card, .performance-section, .chart-container, .calendar-section {
            break-inside: avoid;
            margin-bottom: 1rem !important;
        }
    }
`;
document.head.appendChild(printStyle);