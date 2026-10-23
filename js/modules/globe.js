/**
 * =============================================================================
 * Module: globe.js
 * =============================================================================
 * Three.js 3D Interactive Earth Globe Visualization.
 * Renders custom Day/Night shaders, graticule lines, pulsing radar markers for
 * pan-India project sites, and satellites orbiting in inclined planes.
 * Configured dynamically via SITE_CONFIG.globe.
 * =============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GeoHawk = root.GeoHawk || {};
    root.GeoHawk.Globe = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function init(config) {
    const CFG = config || (typeof window !== 'undefined' ? window.SITE_CONFIG : {});
    const globeCfg = CFG.globe || {};

    const canvas = document.getElementById('globe');
    const stage = document.getElementById('stage');
    const cssGlobe = document.getElementById('cssGlobe');

    if (!canvas || !stage) return;

    // Check WebGL availability
    const T = typeof window !== 'undefined' ? window.THREE : null;
    if (!T) {
      console.warn('[GeoHawk.Globe] Three.js library not loaded. Fallback CSS globe retained.');
      if (cssGlobe) cssGlobe.hidden = false;
      return;
    }

    let renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('[GeoHawk.Globe] WebGL initialization failed:', e);
      if (cssGlobe) cssGlobe.hidden = false;
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(globeCfg.cameraFov || 45, 1, 0.1, 50);
    camera.position.z = globeCfg.cameraDistance || 4.8;

    const R = globeCfg.radius || 1.6;
    const textureLoader = new T.TextureLoader();

    // Load textures defined in config
    const dayTexturePath = globeCfg.textures?.day || 'images/earth/earth-day.jpg';
    const nightTexturePath = globeCfg.textures?.night || 'images/earth/earth-night.jpg';

    const dayTexture = textureLoader.load(dayTexturePath, () => {
      // Texture successfully loaded: hide CSS fallback globe
      if (cssGlobe) cssGlobe.hidden = true;
    });
    const nightTexture = textureLoader.load(nightTexturePath);

    const sunDirection = new T.Vector3(-0.8, 0.35, 0.85).normalize();

    // Groups for rotation & tilt
    const tiltGroup = new T.Group();
    tiltGroup.rotation.x = globeCfg.initialTilt || 0.34;
    tiltGroup.rotation.z = -0.10;
    scene.add(tiltGroup);

    const spinGroup = new T.Group();
    tiltGroup.add(spinGroup);

    // 1. Earth Sphere with Custom Day/Night Shader
    const earthGeo = new T.SphereGeometry(R, 96, 96);
    const earthMat = new T.ShaderMaterial({
      uniforms: {
        d: { value: dayTexture },
        n: { value: nightTexture },
        s: { value: sunDirection }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vUv = uv;
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 w = modelMatrix * vec4(position, 1.0);
          vV = normalize(cameraPosition - w.xyz);
          gl_Position = projectionMatrix * viewMatrix * w;
        }
      `,
      fragmentShader: `
        uniform sampler2D d;
        uniform sampler2D n;
        uniform vec3 s;
        varying vec2 vUv;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float k = dot(normalize(vN), s);
          float m = smoothstep(-0.18, 0.28, k);
          vec3 dc = texture2D(d, vUv).rgb;
          vec3 nc = texture2D(n, vUv).rgb * vec3(1.6, 1.35, 0.9) + vec3(0.015, 0.04, 0.09);
          vec3 c = mix(nc, dc * (0.3 + 0.95 * max(k, 0.0)), m);
          float r = pow(1.0 - max(dot(normalize(vN), vV), 0.0), 3.0);
          c += vec3(0.3, 0.62, 0.95) * r * 0.45;
          gl_FragColor = vec4(c, 1.0);
        }
      `
    });
    spinGroup.add(new T.Mesh(earthGeo, earthMat));

    // 2. Atmospheric Rim Glow
    const atmosGeo = new T.SphereGeometry(R * 1.045, 64, 64);
    const atmosMat = new T.ShaderMaterial({
      side: T.BackSide,
      blending: T.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 w = modelMatrix * vec4(position, 1.0);
          vV = normalize(cameraPosition - w.xyz);
          gl_Position = projectionMatrix * viewMatrix * w;
        }
      `,
      fragmentShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float i = pow(max(0.62 - dot(vN, vV), 0.0), 2.4);
          gl_FragColor = vec4(0.36, 0.70, 1.0, 1.0) * i * 1.1;
        }
      `
    });
    scene.add(new T.Mesh(atmosGeo, atmosMat));

    // Coordinate conversion utility (lat/lon to Vector3)
    function latLonToVec3(lat, lon, radius) {
      const phi = (lon + 180) * Math.PI / 180;
      const theta = (90 - lat) * Math.PI / 180;
      return new T.Vector3(
        -radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // 3. Graticule coordinate lines (lat/long grid)
    const graticuleMat = new T.LineBasicMaterial({ color: 0x6EE0A3, transparent: true, opacity: 0.10 });
    for (let a = -60; a <= 60; a += 30) {
      const pts = [];
      for (let o = -180; o <= 180; o += 4) pts.push(latLonToVec3(a, o, R * 1.002));
      spinGroup.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), graticuleMat));
    }
    for (let o = -180; o < 180; o += 30) {
      const pts = [];
      for (let a = -90; a <= 90; a += 4) pts.push(latLonToVec3(a, o, R * 1.002));
      spinGroup.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), graticuleMat));
    }

    // 4. Project Site Markers (Pulsing Radar Rings)
    const sites = globeCfg.sites || [
      [18.52, 73.85, "Pune"], [21.14, 79.08, "Nagpur"], [19.07, 72.87, "Mumbai"]
    ];
    const markerObjects = [];
    const dotGeo = new T.SphereGeometry(0.014, 12, 12);
    const dotMat = new T.MeshBasicMaterial({ color: 0xF2D27F });
    const ringGeo = new T.RingGeometry(0.022, 0.03, 32);

    sites.forEach((s, idx) => {
      const pos = latLonToVec3(s[0], s[1], R * 1.004);
      const dot = new T.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      spinGroup.add(dot);

      const ringMat = new T.MeshBasicMaterial({ color: 0x6EE0A3, transparent: true, side: T.DoubleSide, depthWrite: false });
      const ring = new T.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2));
      spinGroup.add(ring);

      markerObjects.push({ ring, mat: ringMat, phase: idx * 0.37 });
    });

    // 5. Orbiting Satellites
    function createSatelliteModel() {
      const satGroup = new T.Group();
      const goldMat = new T.MeshBasicMaterial({ color: 0xC9A24C });
      const panelMat = new T.MeshBasicMaterial({ color: 0x2F6DB0, side: T.DoubleSide });

      // Body
      satGroup.add(new T.Mesh(new T.BoxGeometry(0.06, 0.045, 0.045), goldMat));

      // Solar Panels
      const panelGeo = new T.PlaneGeometry(0.12, 0.04);
      [0.10, -0.10].forEach(x => {
        const p = new T.Mesh(panelGeo, panelMat);
        p.position.x = x;
        satGroup.add(p);
        const edges = new T.LineSegments(new T.EdgesGeometry(panelGeo), new T.LineBasicMaterial({ color: 0x9BC8EE }));
        edges.position.x = x;
        satGroup.add(edges);
      });
      return satGroup;
    }

    const satelliteConfigs = globeCfg.satellites || [
      { radius: 2.2, tiltX: 0.95, tiltY: 0.3, speed: 0.0016, color: 0x6EE0A3 },
      { radius: 2.55, tiltX: -0.55, tiltY: 1.2, speed: 0.0011, color: 0xC9A24C },
      { radius: 2.85, tiltX: 0.25, tiltY: 2.4, speed: 0.0008, color: 0x7FB8E8 }
    ];

    const orbits = [];
    satelliteConfigs.forEach((sc, i) => {
      const planeGroup = new T.Group();
      planeGroup.rotation.x = sc.tiltX;
      planeGroup.rotation.y = sc.tiltY;
      scene.add(planeGroup);

      // Orbit Line
      const orbitPts = [];
      for (let a = 0; a <= 128; a++) {
        const t = (a / 128) * Math.PI * 2;
        orbitPts.push(new T.Vector3(Math.cos(t) * sc.radius, 0, Math.sin(t) * sc.radius));
      }
      const orbitLine = new T.LineLoop(
        new T.BufferGeometry().setFromPoints(orbitPts),
        new T.LineDashedMaterial({ color: sc.color, transparent: true, opacity: 0.4, dashSize: 0.06, gapSize: 0.05 })
      );
      orbitLine.computeLineDistances();
      planeGroup.add(orbitLine);

      // Satellite model
      const sat = createSatelliteModel();
      planeGroup.add(sat);

      // Beam to Earth surface
      const beamGeo = new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3()]);
      const beamLine = new T.Line(beamGeo, new T.LineBasicMaterial({ color: sc.color, transparent: true, opacity: 0.5 }));
      scene.add(beamLine);

      // Footprint ring on earth
      const footprint = new T.Mesh(
        new T.RingGeometry(0.05, 0.075, 40),
        new T.MeshBasicMaterial({ color: sc.color, transparent: true, opacity: 0.55, side: T.DoubleSide, depthWrite: false })
      );
      scene.add(footprint);

      orbits.push({
        sat,
        radius: sc.radius,
        speed: sc.speed,
        angle: i * 2.1,
        beamGeo,
        beamLine,
        footprint
      });
    });

    // 6. Camera / View Orienting over India
    function calculateHomeYaw(lat, lon) {
      const p = latLonToVec3(lat, lon, 1);
      return -Math.atan2(p.x, p.z);
    }
    const homeCoord = globeCfg.homeCoordinates || { lat: 21, lon: 79 };
    const HOME_YAW = calculateHomeYaw(homeCoord.lat, homeCoord.lon);
    spinGroup.rotation.y = HOME_YAW;
    tiltGroup.rotation.x = globeCfg.initialTilt || 0.34;

    // 7. Interactive Drag Controls
    let drag = null;
    let idleTime = 0;

    canvas.addEventListener('pointerdown', e => {
      drag = {
        x: e.clientX,
        y: e.clientY,
        rotY: spinGroup.rotation.y,
        rotX: tiltGroup.rotation.x
      };
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', e => {
      if (!drag) return;
      spinGroup.rotation.y = drag.rotY + (e.clientX - drag.x) * 0.006;
      tiltGroup.rotation.x = Math.max(-0.4, Math.min(1.0, drag.rotX + (e.clientY - drag.y) * 0.004));
      idleTime = 0;
    });

    const endDrag = () => { drag = null; };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    // 8. Responsive Canvas Resizing
    function resize() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // 9. Visibility Observer (pauses rendering when off-screen to save battery & GPU)
    let isVisible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        isVisible = entries[0].isIntersecting;
      }).observe(stage);
    }

    // 10. Animation Loop
    const worldPos = new T.Vector3();
    const clock = new T.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      idleTime += dt;

      // Smooth auto-centering return to India when idle
      if (!drag && idleTime > 1.5) {
        const targetYaw = HOME_YAW + (reduceMotion ? 0 : Math.sin(t * 0.45) * 0.28);
        spinGroup.rotation.y += (targetYaw - spinGroup.rotation.y) * Math.min(1, dt * 1.6);
        tiltGroup.rotation.x += (0.34 - tiltGroup.rotation.x) * Math.min(1, dt * 1.6);
      }

      // Animate site pulse rings
      markerObjects.forEach(m => {
        const k = reduceMotion ? 0.5 : ((t * 0.9 + m.phase) % 1);
        const scale = 1 + k * 2.2;
        m.ring.scale.set(scale, scale, scale);
        m.mat.opacity = 0.8 * (1 - k);
      });

      // Animate satellites
      orbits.forEach(o => {
        if (!reduceMotion) o.angle += o.speed * 110 * dt;
        o.sat.position.set(Math.cos(o.angle) * o.radius, 0, Math.sin(o.angle) * o.radius);
        o.sat.rotation.y = -o.angle;
        o.sat.getWorldPosition(worldPos);

        const groundPos = worldPos.clone().normalize().multiplyScalar(R * 1.01);
        const posAttr = o.beamGeo.attributes.position;
        posAttr.setXYZ(0, worldPos.x, worldPos.y, worldPos.z);
        posAttr.setXYZ(1, groundPos.x, groundPos.y, groundPos.z);
        posAttr.needsUpdate = true;

        o.footprint.position.copy(groundPos);
        o.footprint.lookAt(groundPos.clone().multiplyScalar(2));

        const isFacingCamera = worldPos.z > -0.2;
        o.beamLine.visible = isFacingCamera;
        o.footprint.visible = isFacingCamera;
      });

      renderer.render(scene, camera);
    }

    animate();
  }

  return { init };
});
