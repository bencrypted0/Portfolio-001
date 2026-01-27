/**
 * Liquid Tubelight Navbar Effect
 * Creates a smooth, flowing liquid background with lamp light glow
 * that follows the active/hovered navigation item.
 */

(function () {
    'use strict';

    // State
    let activeIndex = -1;  // Start with no active item
    let isTransitioning = false;
    let isInitialized = false;

    // DOM Elements
    let navPill, navMenu, navLinks;
    let liquidBg, lampLight, glowPrimary, glowSecondary;

    /**
     * Initialize the liquid navbar
     */
    function init() {
        if (isInitialized) return;

        // Get elements
        navPill = document.getElementById('nav-pill');
        navMenu = document.getElementById('nav-menu');
        liquidBg = document.getElementById('liquidBg');
        lampLight = document.getElementById('lampLight');
        glowPrimary = document.getElementById('glowPrimary');
        glowSecondary = document.getElementById('glowSecondary');

        if (!navPill || !navMenu || !liquidBg || !lampLight) {
            console.warn('Liquid navbar: Required elements not found');
            return;
        }

        navLinks = navPill.querySelectorAll('.nav-link[data-index]');

        if (navLinks.length === 0) {
            console.warn('Liquid navbar: No nav links found');
            return;
        }

        setupEventListeners();
        isInitialized = true;

        // Check if there's a hash in the URL to set initial active state
        const hash = window.location.hash;
        if (hash) {
            const matchingLink = Array.from(navLinks).find(link => link.getAttribute('href') === hash);
            if (matchingLink) {
                const index = parseInt(matchingLink.dataset.index, 10);
                setActiveItem(index, false);
            }
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Mouse enter on nav links - show liquid effect
        navLinks.forEach((link, index) => {
            link.addEventListener('mouseenter', () => {
                updateLiquidPosition(index, true);
                showEffects();
            });

            link.addEventListener('click', (e) => handleNavClick(e, index));
        });

        // Mouse leave from nav-pill - hide effects or return to active
        navPill.addEventListener('mouseleave', () => {
            if (activeIndex >= 0) {
                updateLiquidPosition(activeIndex, true);
            } else {
                hideEffects();
            }
        });

        // Window resize - update position
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (activeIndex >= 0) {
                    updateLiquidPosition(activeIndex, false);
                }
            }, 100);
        });

        // Scroll spy - update active based on scroll position
        window.addEventListener('scroll', debounce(updateActiveFromScroll, 100), { passive: true });
    }

    /**
     * Debounce helper
     */
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

    /**
     * Update active item based on scroll position
     */
    function updateActiveFromScroll() {
        const scrollY = window.scrollY + 100; // Offset for header

        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;

                    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                        if (activeIndex !== index) {
                            setActiveItem(index, true);
                        }
                    }
                }
            }
        });
    }

    /**
     * Set active navigation item
     */
    function setActiveItem(index, animate = true) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to new item
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }

        activeIndex = index;
        updateLiquidPosition(index, animate);
        showEffects();
    }

    /**
     * Show liquid effects
     */
    function showEffects() {
        liquidBg.style.opacity = '1';
        lampLight.style.opacity = '1';
        glowPrimary.style.opacity = '1';
        glowSecondary.style.opacity = '1';
    }

    /**
     * Hide liquid effects
     */
    function hideEffects() {
        liquidBg.style.opacity = '0';
        lampLight.style.opacity = '0';
        glowPrimary.style.opacity = '0';
        glowSecondary.style.opacity = '0';
    }

    /**
     * Update liquid background position
     */
    function updateLiquidPosition(index, animate = true) {
        const targetLink = navLinks[index];
        if (!targetLink) return;

        // Get positions
        const navPillRect = navPill.getBoundingClientRect();
        const linkRect = targetLink.getBoundingClientRect();

        const left = linkRect.left - navPillRect.left;
        const width = linkRect.width;
        const height = linkRect.height;

        // Add transitioning class for elastic effect on big jumps
        if (animate && activeIndex >= 0 && Math.abs(index - activeIndex) > 1) {
            navPill.classList.add('transitioning');
            setTimeout(() => {
                navPill.classList.remove('transitioning');
            }, 800);
        }

        // Update liquid background
        liquidBg.style.left = `${left}px`;
        liquidBg.style.width = `${width}px`;
        liquidBg.style.height = `${height}px`;
        liquidBg.style.top = '0.25rem';

        // Update lamp light position (centered above the item)
        const lampCenter = left + (width / 2);
        lampLight.style.left = `${lampCenter}px`;
        lampLight.style.transform = 'translateX(-50%)';

        // Update glow positions
        glowPrimary.style.left = `${lampCenter}px`;
        glowSecondary.style.left = `${lampCenter}px`;
    }

    /**
     * Create ripple effect
     */
    function createRipple(e, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('liquid-ripple');

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    }

    /**
     * Handle navigation click
     */
    function handleNavClick(e, index) {
        if (isTransitioning) return;

        isTransitioning = true;

        // Create ripple effect
        createRipple(e, e.currentTarget);

        // Set active
        setActiveItem(index, true);

        // Reset transition flag
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also initialize after window load to ensure correct positioning
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (activeIndex >= 0) {
                updateLiquidPosition(activeIndex, false);
            }
        }, 100);
    });

    // Expose API
    window.LiquidNavbar = {
        init: init,
        setActive: setActiveItem,
        isInitialized: () => isInitialized
    };

})();
