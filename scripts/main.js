/**
 * Anchor Marketing Website
 * Main JavaScript for interactions
 */

(function() {
    'use strict';

    // ============================
    // Navigation (rebrand)
    // ============================

    const nav = document.getElementById('rb-nav');
    const navToggle = document.getElementById('rb-nav-toggle');
    const navSheet = document.getElementById('rb-nav-sheet');

    // Mobile menu toggle
    if (navToggle && navSheet) {
        navToggle.addEventListener('click', function() {
            const open = navSheet.dataset.open === 'true';
            navSheet.dataset.open = open ? 'false' : 'true';
            navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        });

        // Close sheet when a link is clicked
        navSheet.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navSheet.dataset.open = 'false';
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================
    // Smooth Scroll
    // ============================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // Scroll-triggered Animations
    // ============================

    const fadeElements = document.querySelectorAll('.fade-in');

    function checkFadeIn() {
        const triggerBottom = window.innerHeight * 0.85;

        fadeElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkFadeIn, { passive: true });
    window.addEventListener('resize', checkFadeIn, { passive: true });
    checkFadeIn(); // Initial check

    // ============================
    // FAQ Accordion — native <details>, one open at a time
    // ============================

    const faqItems = document.querySelectorAll('.rb-faq-item');
    faqItems.forEach(function(item) {
        item.addEventListener('toggle', function() {
            if (item.open) {
                faqItems.forEach(function(other) {
                    if (other !== item && other.open) other.open = false;
                });
            }
        });
    });

    // ============================
    // Intersection Observer for Performance
    // ============================

    // Use Intersection Observer for better scroll performance if supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -15% 0px',
            threshold: 0
        };

        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(function(element) {
            fadeObserver.observe(element);
        });

        // Remove scroll listener since we're using IntersectionObserver
        window.removeEventListener('scroll', checkFadeIn);
    }

    // ============================
    // Prefers Reduced Motion
    // ============================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');

            // Make all fade-in elements visible immediately
            fadeElements.forEach(function(element) {
                element.classList.add('visible');
            });
        }
    }

    prefersReducedMotion.addEventListener('change', handleReducedMotion);
    handleReducedMotion();

})();
