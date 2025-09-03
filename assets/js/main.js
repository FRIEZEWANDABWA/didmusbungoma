// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initContactForm();
    initThemeToggle();
    initProgressBar();
    initScrollReveal();
    initMobileOptimizations();
    preventHorizontalScroll();
});

// Navigation functionality - Fixed for Android Chrome
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    console.log('Navigation elements:', { navToggle, navMenu, navLinks: navLinks.length });

    // Mobile menu toggle with Android Chrome compatibility
    if (navToggle && navMenu) {
        // Make sure the element is touchable
        navToggle.style.touchAction = 'manipulation';
        navToggle.style.cursor = 'pointer';
        navToggle.style.userSelect = 'none';
        navToggle.style.webkitUserSelect = 'none';
        navToggle.style.webkitTouchCallout = 'none';
        
        function toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Menu toggle clicked');
            
            const isActive = navMenu.classList.contains('mobile-active');
            
            if (isActive) {
                navMenu.classList.remove('mobile-active');
                navToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
                console.log('Menu closed');
            } else {
                navMenu.classList.add('mobile-active');
                navToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.log('Menu opened');
            }
        }
        
        // Add multiple event listeners for better compatibility
        navToggle.addEventListener('click', toggleMenu);
        navToggle.addEventListener('touchstart', toggleMenu, { passive: false });
        
        // Visual feedback on touch
        navToggle.addEventListener('touchstart', () => {
            navToggle.style.opacity = '0.7';
        });
        
        navToggle.addEventListener('touchend', () => {
            setTimeout(() => {
                navToggle.style.opacity = '1';
            }, 100);
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navToggle) {
                navMenu.classList.remove('mobile-active');
                navToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Theme Toggle - Fixed for Android Chrome
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        // Make sure icons load properly
        setTimeout(() => {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
                console.log('Theme icon set:', icon.className);
            }
        }, 100);
        
        // Make touchable
        themeToggle.style.touchAction = 'manipulation';
        
        function toggleTheme(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(0)';
                setTimeout(() => {
                    icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
                    icon.style.transform = 'scale(1)';
                }, 150);
            }
        }
        
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('touchstart', toggleTheme, { passive: false });
    }
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const options = {
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, options);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, stepTime);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.vision-card, .agenda-item, .project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for joining our campaign! We will contact you soon.', 'success');
            this.reset();
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Progress Bar
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Mobile Optimizations
function initMobileOptimizations() {
    // Improve touch targets
    const touchTargets = document.querySelectorAll('button, .btn, .nav-link, .vision-link, .nav-toggle, .theme-toggle');
    touchTargets.forEach(target => {
        if (window.innerWidth < 768) {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
            target.style.touchAction = 'manipulation';
        }
    });
    
    // Add touch feedback
    touchTargets.forEach(target => {
        target.addEventListener('touchstart', () => {
            target.style.opacity = '0.7';
        }, { passive: true });
        
        target.addEventListener('touchend', () => {
            setTimeout(() => {
                target.style.opacity = '1';
            }, 100);
        }, { passive: true });
    });
}

// Prevent horizontal scroll on mobile
function preventHorizontalScroll() {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
}

// Initialize page loading
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Adjust viewport for mobile
    if (window.innerWidth < 768) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Come back! - Didmus Barasa';
    } else {
        document.title = 'Didmus Barasa for Governor - Bungoma County 2027';
    }
});

preventHorizontalScroll();