// Counter Animation
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize counters when scrolled to stats section
const initCounters = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateValue(stat.id || 'counter-' + Math.random().toString(36).substr(2, 9), 0, target, 2000);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
};

// Back to top button functionality
const initBackToTop = () => {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// Smooth scrolling for navigation links
const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
            }
        });
    });
};

// Form submission handling
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const alertBox = document.getElementById('contactAlert');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (alertBox) {
            alertBox.className = 'alert d-none';
            alertBox.textContent = '';
        }

        // Disable button during submit
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (alertBox) {
                    alertBox.className = 'alert alert-success';
                    alertBox.textContent = 'Thank you! Your message has been sent.';
                }
                contactForm.reset();
            } else {
                // Try to parse errors from Formspree
                let message = 'Something went wrong. Please try again later.';
                try {
                    const data = await response.json();
                    if (data && data.errors && data.errors.length) {
                        message = data.errors.map(e => e.message).join(', ');
                    }
                } catch (_) { /* ignore json parse errors */ }

                if (alertBox) {
                    alertBox.className = 'alert alert-danger';
                    alertBox.textContent = message;
                }
            }
        } catch (error) {
            if (alertBox) {
                alertBox.className = 'alert alert-danger';
                alertBox.textContent = 'Network error. Please check your connection and try again.';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    });
};

// Navbar scroll effect
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initCounters();
    initBackToTop();
    initSmoothScrolling();
    initContactForm();
});
