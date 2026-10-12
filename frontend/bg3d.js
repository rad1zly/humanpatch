/* ============================================================
   HumanPatch — Three.js motion background (landing)
   - Network "digital city" particles + connecting lines
   - Pauses when tab hidden or when leaving landing
   - Respects prefers-reduced-motion
   - Degrades silently if THREE fails to load
   ============================================================ */
(function () {
  let renderer, scene, camera, raf, container, running = false;
  let particles, lines;
  const NODE_COUNT = 90;
  const LINK_DIST = 130;

  function boot() {
    try {
      container = document.getElementById("bg3d");
      if (!container || typeof THREE === "undefined") return false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 2000);
      camera.position.z = 420;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
      container.appendChild(renderer.domElement);

      // nodes
      const pts = [];
    const positions = new Float32Array(NODE_COUNT * 3);
    const vels = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * innerWidth * 1.1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * innerHeight * 1.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
      vels.push([(Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.12]);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x5eead4, size: 3.2, transparent: true, opacity: 0.75, depthWrite: false });
    particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // links (rebuilt each frame from close pairs — capped for perf)
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NODE_COUNT * 6 * 3), 3));
    lines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.16 }));
    scene.add(lines);

    window.addEventListener("resize", onResize);
    running = true;
    tick();
    return true;
    } catch (e) {
      console.warn("[bg3d] disabled:", e && e.message);
      return false;
    }
  }

  function onResize() {
    if (!renderer) return;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }

  function tick() {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (document.hidden) return;

    const pos = particles.geometry.attributes.position.array;
    const vel = vels;
    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      pos[ix] += vel[i][0]; pos[ix + 1] += vel[i][1]; pos[ix + 2] += vel[i][2];
      if (pos[ix] > innerWidth * 0.6) vel[i][0] = -Math.abs(vel[i][0]);
      if (pos[ix] < -innerWidth * 0.6) vel[i][0] = Math.abs(vel[i][0]);
      if (pos[ix + 1] > innerHeight * 0.6) vel[i][1] = -Math.abs(vel[i][1]);
      if (pos[ix + 1] < -innerHeight * 0.6) vel[i][1] = Math.abs(vel[i][1]);
      if (pos[ix + 2] > 160) vel[i][2] = -Math.abs(vel[i][2]);
      if (pos[ix + 2] < -160) vel[i][2] = Math.abs(vel[i][2]);
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // rebuild links
    const lpos = lines.geometry.attributes.position.array;
    let li = 0;
    for (let a = 0; a < NODE_COUNT && li < lpos.length - 6; a++) {
      for (let b = a + 1; b < NODE_COUNT && li < lpos.length - 6; b++) {
        const dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
          lpos[li++] = pos[a * 3]; lpos[li++] = pos[a * 3 + 1]; lpos[li++] = pos[a * 3 + 2];
          lpos[li++] = pos[b * 3]; lpos[li++] = pos[b * 3 + 1]; lpos[li++] = pos[b * 3 + 2];
        }
      }
    }
    for (; li < lpos.length; li++) lpos[li] = 0;
    lines.geometry.attributes.position.needsUpdate = true;

    camera.position.x = (innerWidth / 2 - 0) * 0; // keep centered
    scene.rotation.y = Math.sin(Date.now() * 0.00006) * 0.12;
    renderer.render(scene, camera);
  }

  window.hpStartBg3d = function () {
    if (running) return;
    // wait for THREE if CDN still loading
    if (typeof THREE === "undefined") { setTimeout(window.hpStartBg3d, 150); return; }
    boot();
  };
  window.hpStopBg3d = function () {
    running = false;
    cancelAnimationFrame(raf);
    if (renderer) { renderer.dispose(); renderer.domElement.remove(); renderer = null; }
    if (container) container.innerHTML = "";
  };
})();
