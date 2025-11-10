// Humbu Wandeme Digital - Advanced JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Humbu Wandeme Digital - Advanced Features Loaded');
    
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.className = 'mobile-menu-btn';
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        navContainer.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Contact Form Handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData);
            
            // Simulate form submission
            showNotification('Thank you for your message! We will contact you within 24 hours.', 'success');
            this.reset();
        });
    }

    // Service Cards Animation
    const animateCards = () => {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    };

    // Notification System
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    };

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Dashboard Functionality
    if (window.location.pathname.includes('dashboard')) {
        initializeDashboard();
    }

    // Blog Interactions
    initializeBlog();

    // Initialize animations
    animateCards();
});

// Dashboard Features
function initializeDashboard() {
    console.log('Initializing Client Dashboard...');
    
    // Project status updates
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
    
    // Support ticket system
    const ticketForm = document.querySelector('#ticket-form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Support ticket submitted! We will respond within 2 hours.', 'success');
            this.reset();
        });
    }
}

// Blog Features
function initializeBlog() {
    // Blog search functionality
    const searchInput = document.querySelector('.blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const articles = document.querySelectorAll('.article-card');
            
            articles.forEach(article => {
                const title = article.querySelector('h3').textContent.toLowerCase();
                const content = article.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    }
}

// API Integration Stubs
const HumbuAPI = {
    // Project management
    getProjects: async () => {
        return await fetch('/api/projects').then(r => r.json());
    },
    
    // Support tickets
    createTicket: async (data) => {
        return await fetch('/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    
    // Blog articles
    getArticles: async () => {
        return await fetch('/api/articles').then(r => r.json());
    }
};

// Utility Functions
const Utils = {
    // Format currency for South African Rand
    formatZAR: (amount) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount);
    },
    
    // Date formatting
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Local storage helpers
    storage: {
        get: (key) => {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch {
                return localStorage.getItem(key);
            }
        },
        set: (key, value) => {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
};

// Export for global access
window.HumbuAPI = HumbuAPI;
window.Utils = Utils;
