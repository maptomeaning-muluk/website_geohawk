/**
 * =============================================================================
 * Module: contact.js
 * =============================================================================
 * Manages inquiry form interactivity, dynamic service selection, WhatsApp
 * deep linking / web fallback, email composition, and copy-to-clipboard actions.
 * =============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GeoHawk = root.GeoHawk || {};
    root.GeoHawk.Contact = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 2 && /Macintosh/.test(navigator.userAgent));

  function getWhatsAppUrl(phone, text) {
    const q = text ? encodeURIComponent(text) : '';
    if (isMobile) {
      return 'https://wa.me/' + phone + (q ? '?text=' + q : '');
    }
    return 'https://web.whatsapp.com/send?phone=' + phone + (q ? '&text=' + q : '');
  }

  function openWhatsAppDirect(phone, text) {
    const q = text ? encodeURIComponent(text) : '';
    if (isMobile) {
      const deepLink = 'whatsapp://send?phone=' + phone + (q ? '&text=' + q : '');
      const fallback = 'https://wa.me/' + phone + (q ? '?text=' + q : '');
      const start = Date.now();
      window.location.href = deepLink;
      setTimeout(() => {
        if (document.hasFocus() && Date.now() - start < 2000) {
          window.location.href = fallback;
        }
      }, 1200);
    } else {
      window.open('https://web.whatsapp.com/send?phone=' + phone + (q ? '&text=' + q : ''), '_blank', 'noopener');
    }
  }

  function init(config) {
    const CFG = config || (typeof window !== 'undefined' ? window.SITE_CONFIG : {});
    const contact = CFG.contact || {};
    const WA_PHONE = contact.whatsappNumber || "917028478109";
    const EMAIL = contact.email || "geohawkaerials@gmail.com";

    // 1. Service Preselection via [data-s] buttons
    const svcSelect = document.getElementById('f-svc');
    if (svcSelect) {
      document.querySelectorAll('[data-s]').forEach(btn => {
        btn.addEventListener('click', () => {
          const serviceName = btn.dataset.s;
          if (![...svcSelect.options].some(o => o.value === serviceName)) {
            const opt = document.createElement('option');
            opt.textContent = serviceName;
            svcSelect.appendChild(opt);
          }
          svcSelect.value = serviceName;
          updateFormLinks();
        });
      });
    }

    // 2. Floating WhatsApp Button
    const floatWa = document.querySelector('.float .wa');
    if (floatWa) {
      floatWa.href = isMobile ? ('whatsapp://send?phone=' + WA_PHONE) : ('https://web.whatsapp.com/send?phone=' + WA_PHONE);
      floatWa.addEventListener('click', (e) => {
        if (isMobile) {
          e.preventDefault();
          openWhatsAppDirect(WA_PHONE, '');
        }
      });
    }

    // 3. Form fields and dynamic link updating
    const form = document.getElementById('enq');
    const fName = document.getElementById('f-name');
    const fOrg = document.getElementById('f-org');
    const fPhone = document.getElementById('f-phone');
    const fEmail = document.getElementById('f-email');
    const fMsg = document.getElementById('f-msg');
    const sendWa = document.getElementById('sendWa');
    const sendMail = document.getElementById('sendMail');
    const sendGmail = document.getElementById('sendGmail');

    function updateFormLinks() {
      if (!form) return;
      const name = (fName?.value || '').trim();
      const org = (fOrg?.value || '').trim();
      const phone = (fPhone?.value || '').trim();
      const email = (fEmail?.value || '').trim();
      const svc = (svcSelect?.value || '').trim();
      const msg = (fMsg?.value || '').trim();

      const lines = [
        'Hi GeoHawk Aerials, I would like to enquire about your services.',
        '',
        name ? `Name: ${name}` : '',
        org ? `Organisation: ${org}` : '',
        phone ? `Phone: ${phone}` : '',
        email ? `Email: ${email}` : '',
        svc ? `Service: ${svc}` : '',
        msg ? `Requirement:\n${msg}` : ''
      ].filter(Boolean).join('\n');

      const subject = `Enquiry: ${svc || 'Geospatial Services'}${name ? ' - ' + name : ''}`;

      // Update WhatsApp link
      if (sendWa) {
        sendWa.href = getWhatsAppUrl(WA_PHONE, lines);
      }

      // Update Mailto link
      if (sendMail) {
        sendMail.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
      }

      // Update Gmail link
      if (sendGmail) {
        sendGmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
      }
    }

    if (form) {
      form.addEventListener('input', updateFormLinks);
      if (svcSelect) svcSelect.addEventListener('change', updateFormLinks);
      updateFormLinks();

      if (sendWa) {
        sendWa.addEventListener('click', (e) => {
          if (isMobile) {
            e.preventDefault();
            const text = (sendWa.href.split('text=')[1] || '');
            openWhatsAppDirect(WA_PHONE, decodeURIComponent(text));
          }
        });
      }
    }

    // 4. Copy to Clipboard
    document.querySelectorAll('.copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.dataset.copy;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.background = '#178A4E';
          btn.style.color = '#fff';

          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 1800);
        }).catch(err => {
          console.error('[GeoHawk.Contact] Failed to copy text: ', err);
        });
      });
    });
  }

  return { init, getWhatsAppUrl, openWhatsAppDirect };
});
