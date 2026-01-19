/**
 * ============================================
 * Academic Organizer JavaScript
 * Script untuk interaksi dan validasi
 * ============================================
 */

// Fungsi untuk konfirmasi delete
function confirmDelete(itemName) {
    return confirm(`Apakah Anda yakin ingin menghapus ${itemName}?`);
}

// Fungsi untuk validasi form
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });
    
    if (!isValid) {
        alert('Harap lengkapi semua field yang wajib diisi!');
    }
    
    return isValid;
}

// Fungsi untuk auto-hide alert setelah beberapa detik
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});

// Fungsi untuk highlight active menu
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Set active menu saat halaman load
document.addEventListener('DOMContentLoaded', setActiveMenu);

// Fungsi untuk filter tabel
function filterTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toLowerCase();
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell) {
                const textValue = cell.textContent || cell.innerText;
                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }
        
        row.style.display = found ? '' : 'none';
    }
}

// Fungsi untuk format tanggal
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('id-ID', options);
}

// Fungsi untuk countdown deadline
function updateDeadlineCountdown() {
    const deadlineCells = document.querySelectorAll('.deadline-countdown');
    
    deadlineCells.forEach(cell => {
        const deadline = new Date(cell.dataset.deadline);
        const now = new Date();
        const diff = deadline - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days < 0) {
            cell.innerHTML = '<span style="color: #dc3545;">Terlambat</span>';
        } else if (days === 0) {
            cell.innerHTML = '<span style="color: #ffc107;">Hari ini!</span>';
        } else if (days <= 3) {
            cell.innerHTML = `<span style="color: #ff6b6b;">${days} hari lagi</span>`;
        } else {
            cell.innerHTML = `${days} hari lagi`;
        }
    });
}

// Update countdown setiap menit
setInterval(updateDeadlineCountdown, 60000);
document.addEventListener('DOMContentLoaded', updateDeadlineCountdown);

// Fungsi untuk print
function printPage() {
    window.print();
}

// Fungsi untuk export ke CSV (sederhana)
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        cols.forEach(col => {
            csvRow.push(col.innerText);
        });
        csv.push(csvRow.join(','));
    });
    
    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Fungsi untuk toggle sidebar di mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// ============================================
// FITUR BARU V2.0 - Dark Mode Toggle
// ============================================
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ============================================
// FITUR BARU V2.0 - Notifications
// ============================================
function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function loadNotifications() {
    // Simulated - replace with AJAX call
    const container = document.getElementById('notificationsList');
    if (!container) return;
    
    // Example notification HTML
    container.innerHTML = `
        <div class="notification-item unread">
            <div class="notification-title">Tugas Mendekati Deadline</div>
            <div class="notification-message">Tugas "Laporan Praktikum" akan jatuh tempo dalam 2 hari</div>
            <div class="notification-time">5 menit lalu</div>
        </div>
        <div class="notification-item">
            <div class="notification-title">Eksperimen Telah Dinilai</div>
            <div class="notification-message">Eksperimen "Hukum Ohm" telah dinilai dengan nilai 92.5</div>
            <div class="notification-time">2 jam lalu</div>
        </div>
    `;
}

// ============================================
// FITUR BARU V2.0 - File Upload Handler
// ============================================
function handleFileUpload(inputElement, previewElement) {
    const file = inputElement.files[0];
    if (!file) return;
    
    // Validate size (10MB max)
    if (file.size > 10485760) {
        alert('File terlalu besar! Maksimal 10MB');
        inputElement.value = '';
        return;
    }
    
    // Show preview for images
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (previewElement) {
                previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; border-radius: 8px;">`;
            }
        };
        reader.readAsDataURL(file);
    } else {
        if (previewElement) {
            previewElement.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-alt" style="font-size: 32px; color: var(--primary-color);"></i>
                    <p>${file.name}</p>
                    <small>${formatFileSize(file.size)}</small>
                </div>
            `;
        }
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// FITUR BARU V2.0 - Chart.js Helpers
// ============================================
function createLineChart(canvasId, labels, data, label) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createBarChart(canvasId, labels, data, label) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: [
                    '#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ============================================
// FITUR BARU V2.0 - Export Functions
// ============================================
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        cols.forEach(col => csvRow.push(col.innerText));
        csv.push(csvRow.join(','));
    });
    
    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(csvFile);
    link.download = filename + '.csv';
    link.click();
}

// ============================================
// Initialize on page load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Update deadline countdowns
    updateDeadlineCountdowns();
    
    // Load notifications if element exists
    if (document.getElementById('notificationsList')) {
        loadNotifications();
    }
    
    // Close notifications when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.notification-container')) {
            const dropdown = document.getElementById('notificationsDropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    });
});

// Export functions to global scope
window.toggleTheme = toggleTheme;
window.toggleNotifications = toggleNotifications;
window.handleFileUpload = handleFileUpload;
window.createLineChart = createLineChart;
window.createBarChart = createBarChart;
window.exportTableToCSV = exportTableToCSV;
