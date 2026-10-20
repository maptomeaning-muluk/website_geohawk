/* ==========================================================================
   GeoHawk Aerials - Central Configuration
   Update contact details, phone numbers, WhatsApp, and email here.
   Changes made in this file automatically update links, buttons, and contact
   displays across the entire website.
   ========================================================================== */

const SITE_CONFIG = {
  companyName: "GeoHawk Aerials LLP",
  email: "geohawkaerials@gmail.com",
  phoneDisplay: "+91 70284 78109",        // Shown in text, cards, and buttons
  phoneRaw: "+917028478109",               // Used for tel:+917028478109 links
  whatsappNumber: "917028478109",         // International format without '+' or spaces
  whatsappDisplay: "+91 70284 78109",     // Shown in WhatsApp labels
  officeAddress: "GeoHawk Aerials LLP, Pune, Maharashtra, India",
  websiteUrl: "https://geohawkaerials.com"
};

if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}
