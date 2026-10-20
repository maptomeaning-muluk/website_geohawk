GEOHAWK AERIALS WEBSITE — READ ME FIRST
=======================================

WHAT IS IN THIS FOLDER
----------------------
index.html            The website page (all text and sections)
css/style.css         All design: colours, fonts, layout, mobile and desktop styles
js/main.js            All behaviour: menu, scrolling logos, filters, enquiry form, 3D globe
js/vendor/three.min.js  three.js library that draws the 3D globe (open source, MIT licence)
images/               Every photo, map, logo and icon used on the site
  images/photos/      Field survey and training photos
  images/maps/        GeoHawk project maps
  images/clients/     Client and partner logos (scrolling strip)
  images/earth/       NASA Earth images used to paint the globe (public domain)
  images/icons/       Website icons for phones and browsers
  images/og-cover.jpg Preview picture shown when the link is shared on WhatsApp / LinkedIn
favicon.png           Small icon shown in the browser tab
404.html              Friendly page shown if someone opens a wrong link
.htaccess             Server settings for Hostinger (speed, caching, security)
robots.txt            Tells Google it may list the website
sitemap.xml           Helps Google find the website

Languages used: HTML, CSS and JavaScript only. No PHP, Java, database or build step is needed.
The site works on mobile, tablet and desktop automatically.

NOTE: ".htaccess" starts with a dot, so Windows/Mac may hide it. It is inside the zip; it will appear in Hostinger's File Manager.

HOW TO UPLOAD TO HOSTINGER
--------------------------
1. Log in to Hostinger > Websites > Dashboard (next to your domain) > File Manager.
2. Open the folder "public_html".
3. Delete what is inside (for example default.php or an old index.html).
4. Click Upload > File and upload "geohawk-website.zip".
5. Right-click the zip > Extract. Extract into public_html.
6. IMPORTANT: index.html must sit DIRECTLY inside public_html (public_html/index.html),
   not inside a sub-folder. If Hostinger created public_html/geohawk-website/, open it,
   select everything inside, use "Move" to move it up into public_html, then delete the empty folder.
7. Delete the zip file from public_html.
8. Open your domain in a browser. Press Ctrl + F5 if you still see an old page.

AFTER UPLOADING (OPTIONAL BUT RECOMMENDED)
------------------------------------------
- Turn on the free SSL (padlock) in hPanel > Security / SSL, and switch on "Force HTTPS".
- Replace "YOUR-DOMAIN.com" with your real domain (for example geohawkaerials.com) in these
  3 files, using File Manager's Edit option:
    index.html   (near the top: canonical, og:url, og:image and the logo/url lines)
    robots.txt
    sitemap.xml
  The website works without this change; it only improves Google search and link previews.

HOW TO EDIT LATER
-----------------
- Phone / email / WhatsApp: simply open js/config.js and change the values in SITE_CONFIG.
  Changes there will automatically update all phone numbers, WhatsApp links, email links, and buttons across the entire website.
- Photos: upload a new photo into images/photos/ with the SAME file name to replace an old one.
- Colours: the first lines of css/style.css (":root") hold all brand colours.
After any change, press Ctrl + F5 to see it.

PREVIEW ON YOUR OWN COMPUTER
----------------------------
You can double-click index.html to preview it. On your computer the globe shows as a flat
spinning Earth (browsers block 3D textures from local files); on Hostinger the full 3D globe
with satellites appears automatically.

CREDITS
-------
Earth imagery: NASA Visible Earth, Blue Marble and Black Marble (public domain).
Farmland photo: Zoshua Colah on Unsplash (Unsplash Licence).
Boundary data for maps: MoEFCC Parivesh, PM GatiShakti and Census of India via the india-geodata
project (CC BY 4.0). Globe library: three.js (MIT).
