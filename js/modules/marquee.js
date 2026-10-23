/**
 * =============================================================================
 * Module: marquee.js
 * =============================================================================
 * Implements a seamless, accessible client logo marquee loop. Duplicates items
 * dynamically and applies proper aria-hidden attributes for screen readers.
 * =============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GeoHawk = root.GeoHawk || {};
    root.GeoHawk.Marquee = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function init() {
    const track = document.getElementById('track');
    if (!track) return;

    // Duplicate content for continuous loop
    track.innerHTML += track.innerHTML;

    // Mark duplicated logos as aria-hidden for accessibility
    const allLogos = track.querySelectorAll('.lg');
    const half = allLogos.length / 2;

    allLogos.forEach((el, idx) => {
      if (idx >= half) {
        el.setAttribute('aria-hidden', 'true');
        const img = el.querySelector('img');
        if (img) img.alt = '';
      }
    });
  }

  return { init };
});
