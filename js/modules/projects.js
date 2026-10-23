/**
 * =============================================================================
 * Module: projects.js
 * =============================================================================
 * Manages GIS project filtering by category (Forestry, Mining, Urban, All),
 * accessibility ARIA attributes, and accordion show-more behavior.
 * =============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GeoHawk = root.GeoHawk || {};
    root.GeoHawk.Projects = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function init() {
    const filterButtons = document.querySelectorAll('.gfilters button');
    const projectCards = document.querySelectorAll('.gp');
    const gisContainer = document.querySelector('.gis');
    const showMoreBtn = document.getElementById('gmore');

    // 1. Show more accordion on mobile
    if (showMoreBtn && gisContainer) {
      showMoreBtn.addEventListener('click', () => {
        gisContainer.classList.add('open');
      });
    }

    // 2. Category filtering
    if (filterButtons.length && projectCards.length) {
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const category = btn.dataset.g;

          // Update active button state
          filterButtons.forEach(b => {
            b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
          });

          // Show/hide matching cards
          projectCards.forEach(card => {
            const matches = (category === 'all' || card.dataset.g === category);
            card.hidden = !matches;
          });

          // Auto-expand on filter change
          if (category !== 'all' && gisContainer) {
            gisContainer.classList.add('open');
          }
        });
      });
    }
  }

  return { init };
});
