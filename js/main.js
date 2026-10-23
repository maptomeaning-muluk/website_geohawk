/**
 * =============================================================================
 * GeoHawk Aerials - Main Application Orchestrator (main.js)
 * =============================================================================
 * Bootstraps and coordinates all modular subsystems:
 * - DOMSync: Hydrates contact info and config values from config.js
 * - Navigation: Mobile menu, smooth scrolling, and floating action buttons
 * - Contact: Inquiry form validation, WhatsApp deep linking, email links, and copy actions
 * - Projects: GIS project category filtering and show-more accordion
 * - Marquee: Continuous accessible client logos marquee
 * - Globe: Interactive Three.js 3D Earth visualization
 * =============================================================================
 */

(function () {
  'use strict';

  function bootstrap() {
    const CFG = (typeof window !== 'undefined' && window.SITE_CONFIG) ? window.SITE_CONFIG : {};
    const modules = window.GeoHawk || {};

    // 1. Synchronize DOM with central configuration
    if (modules.DOMSync && typeof modules.DOMSync.init === 'function') {
      try {
        modules.DOMSync.init(CFG);
      } catch (e) {
        console.error('[GeoHawk] Error initializing DOMSync:', e);
      }
    }

    // 2. Initialize Navigation & Scroll Behaviors
    if (modules.Navigation && typeof modules.Navigation.init === 'function') {
      try {
        modules.Navigation.init();
      } catch (e) {
        console.error('[GeoHawk] Error initializing Navigation:', e);
      }
    }

    // 3. Initialize Contact Form & WhatsApp Handlers
    if (modules.Contact && typeof modules.Contact.init === 'function') {
      try {
        modules.Contact.init(CFG);
      } catch (e) {
        console.error('[GeoHawk] Error initializing Contact:', e);
      }
    }

    // 4. Initialize GIS Projects Filtering
    if (modules.Projects && typeof modules.Projects.init === 'function') {
      try {
        modules.Projects.init();
      } catch (e) {
        console.error('[GeoHawk] Error initializing Projects:', e);
      }
    }

    // 5. Initialize Client Logo Marquee
    if (modules.Marquee && typeof modules.Marquee.init === 'function') {
      try {
        modules.Marquee.init();
      } catch (e) {
        console.error('[GeoHawk] Error initializing Marquee:', e);
      }
    }

    // 6. Initialize Three.js 3D Globe Visualization
    if (modules.Globe && typeof modules.Globe.init === 'function') {
      try {
        modules.Globe.init(CFG);
      } catch (e) {
        console.error('[GeoHawk] Error initializing Globe:', e);
      }
    }
  }

  // Execute on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
