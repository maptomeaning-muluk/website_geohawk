/**
 * =============================================================================
 * GeoHawk Aerials - Central Website Configuration (config.js)
 * =============================================================================
 * Single source of truth for all website settings, company details, contact
 * numbers, email addresses, service offerings, 3D globe coordinates, and SEO.
 *
 * Any changes made here automatically sync to the DOM, navigation, inquiry
 * forms, WhatsApp links, phone links, and 3D globe visualization.
 * =============================================================================
 */

const SITE_CONFIG = {
  // ---------------------------------------------------------------------------
  // 1. Company Information
  // ---------------------------------------------------------------------------
  company: {
    name: "GeoHawk Aerials LLP",
    shortName: "GeoHawk",
    tagline: "Geospatial Intelligence, Remote Sensing, Drone & DGPS Surveys, Environmental Studies & GeoAI",
    legalName: "GeoHawk Aerials LLP",
    establishedYear: 2020,
    copyrightYear: 2026,
    address: {
      display: "GeoHawk Aerials LLP, Pune, Maharashtra, India",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      pincode: "411001"
    },
    websiteUrl: "https://geohawkaerials.com"
  },

  // ---------------------------------------------------------------------------
  // 2. Contact Information
  // ---------------------------------------------------------------------------
  contact: {
    email: "geohawkaerials@gmail.com",
    supportEmail: "geohawkaerials@gmail.com",
    phoneDisplay: "+91 70284 78109",        // Formatted display string
    phoneRaw: "+917028478109",               // E.164 format for tel: links
    whatsappNumber: "917028478109",         // Digits only with country code
    whatsappDisplay: "+91 70284 78109",     // Formatted display string
    whatsappDefaultMessage: "Hello GeoHawk Aerials team, I would like to enquire about your geospatial and survey services.",
    officeDisplay: "Pune, Maharashtra, India"
  },

  // ---------------------------------------------------------------------------
  // 3. Social Media & Communication Endpoints
  // ---------------------------------------------------------------------------
  social: {
    whatsapp: "https://wa.me/917028478109",
    whatsappWeb: "https://web.whatsapp.com/send?phone=917028478109",
    phone: "tel:+917028478109",
    email: "mailto:geohawkaerials@gmail.com",
    gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=geohawkaerials@gmail.com",
    linkedin: "https://www.linkedin.com/company/geohawk-aerials"
  },

  // ---------------------------------------------------------------------------
  // 4. Core Services Catalog
  // ---------------------------------------------------------------------------
  services: [
    {
      id: "impact",
      code: "Impact Assessments",
      title: "Impact Assessments & Clearances",
      shortDesc: "Comprehensive Environmental Impact Assessments (EIA), EMP reports, and statutory Forest Clearance documentation pan India."
    },
    {
      id: "biodiversity",
      code: "Biodiversity Assessments",
      title: "Biodiversity & Ecological Studies",
      shortDesc: "Flora and fauna baseline inventory, critical habitat mapping, ecological sensitivity analysis, and conservation frameworks."
    },
    {
      id: "surveys",
      code: "DGPS & Drone Surveys",
      title: "DGPS & High-Precision Drone Surveys",
      shortDesc: "Centimetre-level photogrammetry, aerial LiDAR, topographic contouring, mine volume estimations, and CAD/GIS deliverables."
    },
    {
      id: "plans",
      code: "Wildlife Management Plans",
      title: "Wildlife Conservation & Management Plans",
      shortDesc: "Tiger corridor connectivity analysis, eco-sensitive zone management, mitigating human-wildlife conflict, and eco-restoration."
    },
    {
      id: "gis",
      code: "GIS Projects",
      title: "GIS, WebGIS & Remote Sensing",
      shortDesc: "Satellite imagery processing, time-series LULC change detection, spatial databases, and bespoke WebGIS dashboard deployment."
    },
    {
      id: "geoai",
      code: "GeoAI",
      title: "GeoAI & Predictive Analytics",
      shortDesc: "Machine learning models for forest fire susceptibility, automated feature extraction, crop yield prediction, and terrain classification."
    }
  ],

  // ---------------------------------------------------------------------------
  // 5. 3D Globe Visualizer Settings (Three.js)
  // ---------------------------------------------------------------------------
  globe: {
    enabled: true,
    radius: 1.6,
    initialTilt: 0.34,
    cameraFov: 45,
    cameraDistance: 4.8,
    homeCoordinates: { lat: 21.0, lon: 79.0 }, // Center over India
    textures: {
      day: "images/earth/earth-day.jpg",
      night: "images/earth/earth-night.jpg"
    },
    // Project location markers rendered on the 3D globe [lat, lon, label]
    sites: [
      [18.52, 73.85, "Pune"],
      [21.14, 79.08, "Nagpur"],
      [19.07, 72.87, "Mumbai"],
      [20.93, 77.75, "Amravati"],
      [19.99, 73.78, "Nashik"],
      [22.97, 78.65, "Madhya Pradesh"],
      [21.25, 81.62, "Chhattisgarh"],
      [15.29, 74.12, "Goa"],
      [12.97, 77.59, "Karnataka"],
      [23.61, 85.27, "Jharkhand"],
      [20.29, 85.82, "Odisha"],
      [28.61, 77.20, "Delhi NCR"]
    ],
    // Orbiting satellites around the 3D globe [radius, tiltX, tiltY, speed, colorHex]
    satellites: [
      { radius: 2.20, tiltX: 0.95, tiltY: 0.30, speed: 0.0016, color: 0x6EE0A3, name: "Remote Sensing Sat 1" },
      { radius: 2.55, tiltX: -0.55, tiltY: 1.20, speed: 0.0011, color: 0xC9A24C, name: "Earth Observation Sat 2" },
      { radius: 2.85, tiltX: 0.25, tiltY: 2.40, speed: 0.0008, color: 0x7FB8E8, name: "GIS Surveillance Sat 3" }
    ]
  },

  // ---------------------------------------------------------------------------
  // 6. GIS Project Categories & Filters
  // ---------------------------------------------------------------------------
  gisFilters: [
    { key: "all", label: "All Projects" },
    { key: "forestry", label: "Forestry & Wildlife" },
    { key: "mining", label: "Mining & Geology" },
    { key: "urban", label: "Urban & Infra" }
  ],

  // ---------------------------------------------------------------------------
  // 7. Client & Partner Logos
  // ---------------------------------------------------------------------------
  clients: [
    { name: "Forest Department Maharashtra", logo: "images/clients/forest-dept-maharashtra.png" },
    { name: "WCL Coal India", logo: "images/clients/wcl-coal-india.png" },
    { name: "IIT Bombay", logo: "images/clients/iit-bombay.png" },
    { name: "Tadoba Andhari Tiger Reserve", logo: "images/clients/tatr-tadoba.png" },
    { name: "Pristine Consultants", logo: "images/clients/pristine-consultants.png" },
    { name: "MIT World Peace University", logo: "images/clients/mit-wpu.png" }
  ],

  // ---------------------------------------------------------------------------
  // 8. SEO, OpenGraph & Metadata
  // ---------------------------------------------------------------------------
  meta: {
    siteTitle: "GeoHawk Aerials | Geospatial, Drone Surveys, Remote Sensing & GeoAI",
    description: "Pan-India geospatial intelligence, remote sensing, drone and DGPS surveys, environmental impact assessments, and GeoAI analytics.",
    keywords: "GeoHawk, GIS, Remote Sensing, Drone Survey, DGPS, Photogrammetry, GeoAI, EIA, Forest Clearance, Pune, Maharashtra, India",
    author: "GeoHawk Aerials LLP",
    ogImage: "images/og-cover.jpg",
    copyright: "© 2026 GeoHawk Aerials LLP. All rights reserved."
  }
};


// Backward compatibility aliases for direct top-level access
SITE_CONFIG.companyName = SITE_CONFIG.company.name;
SITE_CONFIG.email = SITE_CONFIG.contact.email;
SITE_CONFIG.phoneDisplay = SITE_CONFIG.contact.phoneDisplay;
SITE_CONFIG.phoneRaw = SITE_CONFIG.contact.phoneRaw;
SITE_CONFIG.whatsappNumber = SITE_CONFIG.contact.whatsappNumber;
SITE_CONFIG.whatsappDisplay = SITE_CONFIG.contact.whatsappDisplay;
SITE_CONFIG.officeAddress = SITE_CONFIG.contact.officeDisplay;
SITE_CONFIG.websiteUrl = SITE_CONFIG.company.websiteUrl;

// Export to window for browser use and module.exports for Node / tooling
if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}
