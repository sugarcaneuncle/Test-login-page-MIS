// UNICLOBE MIS Logo Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const container = document.querySelector('.container');
    const logoBox = document.querySelector('.logo-box');
    const logo = document.querySelector('h1');
    
    // Initialize responsive behavior
    initResponsiveBehavior();
    
    // Add smooth animations
    addAnimations();
    
    // Add interactive features
    addInteractivity();
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResize, 100);
    });
    
    function initResponsiveBehavior() {
        // Set initial responsive state
        updateResponsiveState();
        
        // Add CSS classes for JavaScript-based responsive features
        if (window.innerWidth <= 768) {
            container.classList.add('mobile-view');
        } else {
            container.classList.add('desktop-view');
        }
    }
    
    function addAnimations() {
        // Add fade-in animation
        logoBox.style.opacity = '0';
        logoBox.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            logoBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            logoBox.style.opacity = '1';
            logoBox.style.transform = 'translateY(0)';
        }, 100);
        
        // Add hover effects for desktop
        if (window.innerWidth > 768) {
            logoBox.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            });
            
            logoBox.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        }
    }
    
    function addInteractivity() {
        // Add click effect
        logoBox.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Add keyboard navigation
        logoBox.setAttribute('tabindex', '0');
        logoBox.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add focus styles
        logoBox.addEventListener('focus', function() {
            this.style.outline = '2px solid #000000';
            this.style.outlineOffset = '2px';
        });
        
        logoBox.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    }
    
    function handleResize() {
        updateResponsiveState();
        
        // Update CSS classes
        if (window.innerWidth <= 768) {
            container.classList.remove('desktop-view');
            container.classList.add('mobile-view');
        } else {
            container.classList.remove('mobile-view');
            container.classList.add('desktop-view');
        }
        
        // Recalculate logo positioning
        recalculateLogoPosition();
    }
    
    function updateResponsiveState() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Store responsive state in CSS custom properties
        document.documentElement.style.setProperty('--viewport-width', width + 'px');
        document.documentElement.style.setProperty('--viewport-height', height + 'px');
        
        // Add orientation class
        if (width > height) {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        } else {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        }
    }
    
    function recalculateLogoPosition() {
        // Ensure logo stays within viewport bounds
        const logoRect = logoBox.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (logoRect.right > containerRect.right) {
            logoBox.style.marginRight = '0';
        }
        
        if (logoRect.bottom > containerRect.bottom) {
            logoBox.style.marginBottom = '0';
        }
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Performance optimization: Use Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(logoBox);
    }
    
    // Add loading state
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        logoBox.classList.add('loaded');
    });
    
    // Console log for debugging
    console.log('UNICLOBE MIS Logo Page loaded successfully');
    console.log('Viewport size:', window.innerWidth + 'x' + window.innerHeight);
    console.log('Device pixel ratio:', window.devicePixelRatio);
});

// Add CSS custom properties for JavaScript
document.documentElement.style.setProperty('--primary-color', '#000000');
document.documentElement.style.setProperty('--background-color', '#FFFFFF');