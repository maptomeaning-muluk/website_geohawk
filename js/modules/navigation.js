/**
 * =============================================================================
 * Module: navigation.js
 * =============================================================================
 * Handles mobile hamburger navigation, accessibility states, smooth scrolling,
 * and visibility of the floating quick-action buttons.
 * =============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GeoHawk = root.GeoHawk || {};
    root.GeoHawk.Navigation = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function init() {
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');

    if (menuBtn && menu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // 2. Floating action buttons visibility on scroll
    const floatBar = document.querySelector('.float');
    const heroSec = document.getElementById('home');

    if (floatBar) {
      const handleScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        const threshold = heroSec ? heroSec.offsetHeight * 0.8 : 400;
        floatBar.classList.toggle('show', scrollY > threshold);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    }
  }

  return { init };
});
