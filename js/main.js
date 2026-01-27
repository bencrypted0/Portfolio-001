/**
 * Cybersecurity Portfolio - Main JavaScript
 * Handles interactions, animations, and copy-to-clipboard functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initMobileNav();
    initCopyButtons();
    initScrollAnimations();
    initSmoothScroll();
    initTypingEffect();
    initContactForm();
});

/**
 * Page Loader
 * Shows a progress bar and reveals the page only after `window.load`.
 */
function initPageLoader() {
    const loader = document.getElementById('page-loader');
    const content = document.getElementById('page-content');
    const fill = document.getElementById('loader-bar-fill');
    if (!loader || !content || !fill) return;

    const progressEl = loader.querySelector('[role="progressbar"]');

    let progress = 0;
    let target = 90;
    let rafId = 0;

    const setProgress = (value) => {
        progress = Math.max(0, Math.min(100, value));
        fill.style.width = `${progress}%`;
        if (progressEl) {
            progressEl.setAttribute('aria-valuemin', '0');
            progressEl.setAttribute('aria-valuemax', '100');
            progressEl.setAttribute('aria-valuenow', String(Math.round(progress)));
        }
    };

    // Smoothly creep toward 90% until everything is loaded.
    const tick = () => {
        const next = progress + (target - progress) * 0.03;
        setProgress(next);
        rafId = window.requestAnimationFrame(tick);
    };

    tick();

    window.addEventListener('load', () => {
        target = 100;

        const finish = () => {
            if (progress >= 99.5) {
                // Update text when loading is done
                const lampTitle = loader.querySelector('.lamp-title');
                if (lampTitle) {
                    lampTitle.textContent = 'Initialization Complete';
                }

                window.cancelAnimationFrame(rafId);
                setProgress(100);

                // Trigger shrink animation
                loader.classList.add('shrinking');

                // Wait for shrink animation (800ms) + small buffer before fading out
                setTimeout(() => {
                    document.body.classList.remove('is-loading');
                    document.body.classList.add('is-loaded');

                    // Remove loader from DOM after fade-out completes
                    window.setTimeout(() => loader.remove(), 600);
                }, 1000); // 800ms animation + 200ms pause

                return;
            }

            window.requestAnimationFrame(finish);
        };

        finish();
    }, { once: true });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu-mobile');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any link inside
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Copy to Clipboard functionality
 */
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.dataset.copy;

            try {
                await navigator.clipboard.writeText(textToCopy);

                // Update button state
                const textSpan = btn.querySelector('.copy-text');
                const originalText = textSpan.textContent;

                btn.classList.add('copied');
                textSpan.textContent = 'Copied!';

                setTimeout(() => {
                    btn.classList.remove('copied');
                    textSpan.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

/**
 * Scroll-based fade-in animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add fade-in class to animatable elements
    const animatableSelectors = [
        '.about-block',
        '.skill-category',
        '.project-card',
        '.cert-card',
        '.stat-item'
    ];

    animatableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in');
        });
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Enhanced smooth scrolling for anchor links
 */
function initSmoothScroll() {
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
}

/**
 * Typing effect for role text
 */
function initTypingEffect() {
    const roleElement = document.getElementById('typed-role');
    if (!roleElement) return;

    const roles = [
        'Fancy Words Incoming',
        'Cybersecurity Enthusiast',
        'Security Operations Analyst',
        'Log Forensics Specialist',
        'Threat Detection Engineer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentRole = roles[roleIndex];

        if (isPaused) {
            isPaused = false;
            isDeleting = true;
            setTimeout(type, 1500);
            return;
        }

        if (isDeleting) {
            const nextText = currentRole.substring(0, charIndex - 1);
            roleElement.textContent = nextText.length ? nextText : '\u00A0';
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }

            setTimeout(type, 50);
        } else {
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isPaused = true;
                setTimeout(type, 100);
                return;
            }

            setTimeout(type, 100);
        }
    }

    // Start after a short delay
    setTimeout(type, 2000);
}

/**
 * Contact form: open user's email client with filled details.
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (form.querySelector('#contact-name')?.value || '').trim();
        const email = (form.querySelector('#contact-email')?.value || '').trim();
        const inquiry = (form.querySelector('#contact-inquiry')?.value || '').trim();
        const message = (form.querySelector('#contact-message')?.value || '').trim();

        const subject = `Portfolio contact${name ? ` from ${name}` : ''}`;
        const bodyLines = [
            `Name: ${name || '-'}`,
            `Email: ${email || '-'}`,
            `Inquiry: ${inquiry || '-'}`,
            '',
            message || ''
        ];

        const mailto = `mailto:bennetsharwin76@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
        window.location.href = mailto;
    });
}

// Disable placeholder social cards until you provide URLs
document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[data-href-pending="true"]') : null;
    if (!a) return;
    e.preventDefault();
}, { capture: true });
