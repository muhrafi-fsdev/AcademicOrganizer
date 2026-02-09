/**
 * Academic Organizer - Auto-Save Module
 * Handles localStorage persistence for tasks and experiments
 */

const AcademicOrganizer = {
    // Storage keys
    TASKS_KEY: 'academic_organizer_tasks',
    EXPERIMENTS_KEY: 'academic_organizer_experiments',
    
    // Default data
    defaultTasks: [
        { id: 1, title: 'Laporan Praktikum Fisika', subject: 'Fisika Dasar', deadline: '2025-01-25', priority: 'high', status: 'sedang' },
        { id: 2, title: 'Tugas Pemrograman Web', subject: 'Web Development', deadline: '2025-01-28', priority: 'high', status: 'belum' },
        { id: 3, title: 'Essay Bahasa Inggris', subject: 'English', deadline: '2025-01-22', priority: 'medium', status: 'selesai' },
        { id: 4, title: 'Presentasi Algoritma', subject: 'Struktur Data', deadline: '2025-01-30', priority: 'high', status: 'belum' },
        { id: 5, title: 'Quiz Matematika Diskrit', subject: 'Matematika', deadline: '2025-01-20', priority: 'low', status: 'selesai' },
        { id: 6, title: 'Project Database', subject: 'Basis Data', deadline: '2025-02-05', priority: 'medium', status: 'sedang' },
        { id: 7, title: 'Makalah Kewarganegaraan', subject: 'PKN', deadline: '2025-01-15', priority: 'low', status: 'selesai' },
        { id: 8, title: 'UTS Jaringan Komputer', subject: 'Jaringan Komputer', deadline: '2025-01-10', priority: 'high', status: 'selesai' }
    ],
    
    defaultExperiments: [
        { id: 1, title: 'Pengukuran Tegangan Listrik', subject: 'Fisika Dasar', date: '2025-01-18', status: 'selesai' },
        { id: 2, title: 'Analisis Rangkaian RC', subject: 'Elektronika', date: '2025-01-15', status: 'selesai' },
        { id: 3, title: 'Percobaan Optika Geometri', subject: 'Fisika Dasar', date: '2025-01-12', status: 'selesai' },
        { id: 4, title: 'Pengukuran Viskositas Fluida', subject: 'Fisika Dasar', date: '2025-01-08', status: 'selesai' },
        { id: 5, title: 'Simulasi Rangkaian Digital', subject: 'Sistem Digital', date: '2025-01-05', status: 'selesai' },
        { id: 6, title: 'Analisis Spektrum Cahaya', subject: 'Fisika Dasar', date: '2024-12-28', status: 'selesai' },
        { id: 7, title: 'Pengujian Op-Amp', subject: 'Elektronika', date: '2024-12-20', status: 'selesai' },
        { id: 8, title: 'Percobaan Hukum Ohm', subject: 'Fisika Dasar', date: '2024-12-15', status: 'selesai' }
    ],
    
    // Initialize data
    init() {
        if (!localStorage.getItem(this.TASKS_KEY)) {
            this.saveTasks(this.defaultTasks);
        }
        if (!localStorage.getItem(this.EXPERIMENTS_KEY)) {
            this.saveExperiments(this.defaultExperiments);
        }
        this.createSaveIndicator();
    },
    
    // Create save indicator element
    createSaveIndicator() {
        if (document.getElementById('saveIndicator')) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'saveIndicator';
        indicator.className = 'save-indicator';
        indicator.innerHTML = '<i class="fas fa-check-circle"></i><span>Tersimpan</span>';
        document.body.appendChild(indicator);
    },
    
    // Show save indicator
    showSaveIndicator(status = 'saved') {
        const indicator = document.getElementById('saveIndicator');
        if (!indicator) return;
        
        indicator.className = 'save-indicator show ' + status;
        
        if (status === 'saving') {
            indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Menyimpan...</span>';
        } else {
            indicator.innerHTML = '<i class="fas fa-check-circle"></i><span>Tersimpan</span>';
        }
        
        if (status === 'saved') {
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }
    },
    
    // Tasks CRUD
    getTasks() {
        try {
            return JSON.parse(localStorage.getItem(this.TASKS_KEY)) || this.defaultTasks;
        } catch (e) {
            return this.defaultTasks;
        }
    },
    
    saveTasks(tasks) {
        this.showSaveIndicator('saving');
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
        setTimeout(() => this.showSaveIndicator('saved'), 300);
    },
    
    addTask(task) {
        const tasks = this.getTasks();
        task.id = Date.now();
        tasks.unshift(task);
        this.saveTasks(tasks);
        return task;
    },
    
    updateTask(id, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            this.saveTasks(tasks);
            return tasks[index];
        }
        return null;
    },
    
    deleteTask(id) {
        const tasks = this.getTasks();
        const filtered = tasks.filter(t => t.id !== id);
        this.saveTasks(filtered);
        return true;
    },
    
    // Experiments CRUD
    getExperiments() {
        try {
            return JSON.parse(localStorage.getItem(this.EXPERIMENTS_KEY)) || this.defaultExperiments;
        } catch (e) {
            return this.defaultExperiments;
        }
    },
    
    saveExperiments(experiments) {
        this.showSaveIndicator('saving');
        localStorage.setItem(this.EXPERIMENTS_KEY, JSON.stringify(experiments));
        setTimeout(() => this.showSaveIndicator('saved'), 300);
    },
    
    addExperiment(experiment) {
        const experiments = this.getExperiments();
        experiment.id = Date.now();
        experiments.unshift(experiment);
        this.saveExperiments(experiments);
        return experiment;
    },
    
    updateExperiment(id, updates) {
        const experiments = this.getExperiments();
        const index = experiments.findIndex(e => e.id === id);
        if (index !== -1) {
            experiments[index] = { ...experiments[index], ...updates };
            this.saveExperiments(experiments);
            return experiments[index];
        }
        return null;
    },
    
    deleteExperiment(id) {
        const experiments = this.getExperiments();
        const filtered = experiments.filter(e => e.id !== id);
        this.saveExperiments(filtered);
        return true;
    },
    
    // Statistics
    getStats() {
        const tasks = this.getTasks();
        const experiments = this.getExperiments();
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'selesai').length;
        const pendingTasks = tasks.filter(t => t.status === 'belum').length;
        const inProgressTasks = tasks.filter(t => t.status === 'sedang').length;
        
        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            totalExperiments: experiments.length,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    },
    
    // Get upcoming deadlines (within 7 days)
    getUpcomingDeadlines() {
        const tasks = this.getTasks();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return tasks
            .filter(task => {
                if (task.status === 'selesai') return false;
                const deadline = new Date(task.deadline);
                const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 7;
            })
            .map(task => {
                const deadline = new Date(task.deadline);
                const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                return {
                    ...task,
                    daysLeft: diffDays,
                    urgency: diffDays <= 2 ? 'urgent' : diffDays <= 4 ? 'warning' : 'normal'
                };
            })
            .sort((a, b) => a.daysLeft - b.daysLeft);
    },
    
    // Export data
    exportData() {
        const data = {
            tasks: this.getTasks(),
            experiments: this.getExperiments(),
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `academic_organizer_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Import data
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.tasks) this.saveTasks(data.tasks);
                    if (data.experiments) this.saveExperiments(data.experiments);
                    resolve(true);
                } catch (err) {
                    reject(new Error('Invalid file format'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },
    
    // Reset to default
    resetData() {
        this.saveTasks(this.defaultTasks);
        this.saveExperiments(this.defaultExperiments);
    },
    
    // Format date
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },
    
    // Get priority badge class
    getPriorityClass(priority) {
        const classes = {
            low: 'priority-low',
            medium: 'priority-medium',
            high: 'priority-high',
            urgent: 'priority-urgent'
        };
        return classes[priority] || 'priority-medium';
    },
    
    // Get priority label
    getPriorityLabel(priority) {
        const labels = {
            low: 'Rendah',
            medium: 'Sedang',
            high: 'Tinggi',
            urgent: 'Urgent'
        };
        return labels[priority] || 'Sedang';
    },
    
    // Get status badge class
    getStatusClass(status) {
        const classes = {
            belum: 'status-belum',
            sedang: 'status-sedang',
            selesai: 'status-selesai'
        };
        return classes[status] || 'status-belum';
    },
    
    // Get status label
    getStatusLabel(status) {
        const labels = {
            belum: 'Belum Selesai',
            sedang: 'Sedang Dikerjakan',
            selesai: 'Selesai'
        };
        return labels[status] || 'Belum Selesai';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    AcademicOrganizer.init();
});

// Export for use
window.AcademicOrganizer = AcademicOrganizer;
