/**
 * =============================================================================
 * Module: dom-sync.js
 * =============================================================================
 * Automatically synchronizes configuration values from SITE_CONFIG into the
 * DOM across the entire website. Supports class-based targets and data-config attributes.
 * =============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GeoHawk = root.GeoHawk || {};
    root.GeoHawk.DOMSync = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function resolvePath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  function init(config) {
    const CFG = config || (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
    if (!CFG) {
      console.warn('[GeoHawk.DOMSync] No SITE_CONFIG found.');
      return;
    }

    const contact = CFG.contact || {};
    const company = CFG.company || {};

    // 1. Sync Email elements
    if (contact.email) {
      document.querySelectorAll('.cfg-email').forEach(el => {
        el.textContent = contact.email;
        if (el.tagName === 'A') el.href = 'mailto:' + contact.email;
        if (el.dataset.copy) el.dataset.copy = contact.email;
      });
    }

    // 2. Sync Phone elements
    if (contact.phoneDisplay) {
      document.querySelectorAll('.cfg-phone').forEach(el => {
        el.textContent = contact.phoneDisplay;
        if (el.tagName === 'A' && contact.phoneRaw) el.href = 'tel:' + contact.phoneRaw;
        if (el.dataset.copy && contact.phoneRaw) el.dataset.copy = contact.phoneRaw;
      });

      document.querySelectorAll('.cfg-call-btn').forEach(el => {
        el.textContent = 'Call ' + contact.phoneDisplay;
        if (contact.phoneRaw) el.href = 'tel:' + contact.phoneRaw;
      });
    }

    // 3. Sync Office Address
    if (contact.officeDisplay || company.address?.display) {
      const officeStr = contact.officeDisplay || company.address.display;
      document.querySelectorAll('.cfg-office').forEach(el => {
        el.textContent = officeStr;
      });
    }

    // 4. Sync Company Name
    if (company.name) {
      document.querySelectorAll('.cfg-company').forEach(el => {
        el.textContent = company.name;
      });
    }

    // 5. Sync Floating quick-action phone button
    const phFloat = document.querySelector('.float .ph');
    if (phFloat && contact.phoneRaw) {
      phFloat.href = 'tel:' + contact.phoneRaw;
      phFloat.setAttribute('title', 'Call ' + (contact.phoneDisplay || contact.phoneRaw));
      phFloat.setAttribute('aria-label', 'Call ' + (contact.phoneDisplay || contact.phoneRaw));
    }

    // 6. Generic data-config attribute binding
    document.querySelectorAll('[data-config]').forEach(el => {
      const key = el.getAttribute('data-config');
      const val = resolvePath(CFG, key);
      if (val !== undefined) {
        if (el.hasAttribute('data-config-attr')) {
          el.setAttribute(el.getAttribute('data-config-attr'), val);
        } else {
          el.textContent = val;
        }
      }
    });

    // 7. Explicit redirect handler for tel: and mailto: links
    if (contact.phoneRaw) {
      document.querySelectorAll('a[href^="tel:"], .cfg-phone, .cfg-call-btn').forEach(a => {
        a.addEventListener('click', () => {
          window.location.href = 'tel:' + contact.phoneRaw;
        });
      });
    }

    if (contact.email) {
      document.querySelectorAll('a[href^="mailto:"], .cfg-email').forEach(a => {
        if (a.id === 'sendMail' || a.id === 'sendGmail') return;
        a.addEventListener('click', () => {
          window.location.href = 'mailto:' + contact.email;
        });
      });
    }
  }

  return { init };
});
