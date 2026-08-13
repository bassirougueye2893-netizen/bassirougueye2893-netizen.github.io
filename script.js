(function () {
  "use strict";

  const container = document.getElementById("canvas-container");
  const tooltip = document.getElementById("node-tooltip");
  const overlay = document.getElementById("detail-overlay");
  const modalCard = overlay.querySelector(".modal-card");
  const introVeil = document.getElementById("intro-veil");
  const enterBtn = document.getElementById("enter-btn");
  const closeBtn = document.getElementById("close-panel");
  const legendList = document.getElementById("legend-list");

  // Build the legend from CATEGORY_META (data.js) so the 3 titles on the
  // left are always in sync with the actual category labels used in the data.
  Object.keys(CATEGORY_META).forEach((key) => {
    const meta = CATEGORY_META[key];
    const color = "#" + new THREE.Color(meta.color).getHexString();
    const btn = document.createElement("button");
    btn.className = "legend-item";
    btn.dataset.filter = key;
    btn.innerHTML = `<span class="dot" style="--dot-color:${color}"></span><span class="legend-text">${meta.label}</span>`;
    legendList.appendChild(btn);
  });
  const legendButtons = document.querySelectorAll(".legend-item");

  const GLOBE_RADIUS = 1.7;

  // ---------------------------------------------------------------------
  // Scene setup
  // ---------------------------------------------------------------------
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Keep the globe perfectly centered and fully inside the viewport at any
  // window size (avoids it overflowing off the bottom on narrow/short screens).
  function fitCameraToGlobe() {
    const padded = GLOBE_RADIUS + 0.35; // room for labels + halos poking out
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const aspect = window.innerWidth / window.innerHeight;
    const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * aspect);
    const distForHeight = padded / Math.sin(vFOV / 2);
    const distForWidth = padded / Math.sin(hFOV / 2);
    const distance = Math.max(distForHeight, distForWidth) * 1.12;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
  }
  fitCameraToGlobe();

  // Subtle ambient starfield
  (function buildStarfield() {
    const starCount = 900;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x8b93a7,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(geo, mat));
  })();

  // Globe wireframe (lat/long grid look)
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const globeCore = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 48, 48),
    new THREE.MeshBasicMaterial({
      color: 0x0b0f1c,
      transparent: true,
      opacity: 0.55,
    })
  );
  globeGroup.add(globeCore);

  const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 28, 20);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x2a3350,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

  // Outer glow rim
  const glowGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 48, 48);
  const glowMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { glowColor: { value: new THREE.Color(0x4fd8e8) } },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 glowColor;
      void main() {
        float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(glowColor, intensity * 0.35);
      }
    `,
    side: THREE.BackSide,
  });
  globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

  // Lighting (mostly for subtlety; materials above are mostly self-lit)
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const pointLight = new THREE.PointLight(0x4fd8e8, 1.1, 30);
  pointLight.position.set(6, 4, 6);
  scene.add(pointLight);

  // ---------------------------------------------------------------------
  // Node placement: cluster each category in its own latitude band
  // ---------------------------------------------------------------------
  function latLongToVector3(latDeg, lonDeg, radius) {
    const lat = THREE.MathUtils.degToRad(latDeg);
    const lon = THREE.MathUtils.degToRad(lonDeg);
    const x = radius * Math.cos(lat) * Math.cos(lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lon);
    return new THREE.Vector3(x, y, z);
  }

  const BAND_RANGES = {
    specialite: [32, 68],
    transversale: [-14, 20],
    metiers: [-66, -30],
  };

  const grouped = { specialite: [], transversale: [], metiers: [] };
  COMPETENCY_DATA.forEach((d) => grouped[d.category].push(d));

  const nodeMeshes = [];
  const pickables = []; // dots + labels, both clickable/hoverable
  const nodeLinks = []; // for constellation arcs per category

  Object.keys(grouped).forEach((cat) => {
    const items = grouped[cat];
    const [latMin, latMax] = BAND_RANGES[cat];
    const color = CATEGORY_META[cat].color;
    const categoryPositions = [];

    items.forEach((item, i) => {
      const lon = (360 / items.length) * i + (cat === "transversale" ? 40 : 0);
      const latSpread = items.length > 1 ? (latMax - latMin) * (i / (items.length - 1)) : (latMax - latMin) / 2;
      const lat = latMin + latSpread;
      const pos = latLongToVector3(lat, lon, GLOBE_RADIUS);
      categoryPositions.push(pos);

      // Node core (glowing sphere) — enlarged for easy clicking/visibility
      const nodeGeo = new THREE.SphereGeometry(0.058, 20, 20);
      const nodeMat = new THREE.MeshBasicMaterial({ color });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { data: item, baseScale: 1 };
      globeGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Halo sprite
      const haloMat = new THREE.SpriteMaterial({
        map: makeHaloTexture(color),
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      });
      const halo = new THREE.Sprite(haloMat);
      halo.scale.set(0.29, 0.29, 1);
      halo.position.copy(pos);
      globeGroup.add(halo);
      nodeMesh.userData.halo = halo;

      // AC-code label, always facing the camera, floating just above the node
      const labelMat = new THREE.SpriteMaterial({
        map: makeLabelTexture(item.code, color),
        transparent: true,
        depthWrite: false,
        depthTest: true,
      });
      const label = new THREE.Sprite(labelMat);
      const labelWidth = 0.11 * item.code.length + 0.22;
      label.scale.set(labelWidth, labelWidth * 0.32, 1);
      label.position.copy(pos.clone().normalize().multiplyScalar(GLOBE_RADIUS + 0.22));
      label.userData = { data: item, mesh: nodeMesh };
      globeGroup.add(label);
      nodeMesh.userData.label = label;
      pickables.push(nodeMesh, label);
    });

    // Connect consecutive nodes within a category — constellation feel
    for (let i = 0; i < categoryPositions.length - 1; i++) {
      nodeLinks.push({ a: categoryPositions[i], b: categoryPositions[i + 1], color });
    }
  });

  function makeLabelTexture(text, hexColor) {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    const c = new THREE.Color(hexColor);
    const rgb = `${Math.floor(c.r * 255)},${Math.floor(c.g * 255)},${Math.floor(c.b * 255)}`;

    ctx.font = "600 40px 'JetBrains Mono', monospace";
    const textWidth = ctx.measureText(text).width;

    // Rounded background chip so the code stays legible over the globe
    // wireframe / starfield even when the point isn't hovered.
    const padX = 22;
    const chipW = textWidth + padX * 2;
    const chipH = 62;
    const chipX = canvas.width / 2 - chipW / 2;
    const chipY = canvas.height / 2 - chipH / 2;
    const r = chipH / 2;
    ctx.beginPath();
    ctx.moveTo(chipX + r, chipY);
    ctx.arcTo(chipX + chipW, chipY, chipX + chipW, chipY + chipH, r);
    ctx.arcTo(chipX + chipW, chipY + chipH, chipX, chipY + chipH, r);
    ctx.arcTo(chipX, chipY + chipH, chipX, chipY, r);
    ctx.arcTo(chipX, chipY, chipX + chipW, chipY, r);
    ctx.closePath();
    ctx.fillStyle = "rgba(6, 8, 15, 0.82)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(${rgb},0.9)`;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgb(${rgb})`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
    return new THREE.CanvasTexture(canvas);
  }

  function makeHaloTexture(hexColor) {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const c = new THREE.Color(hexColor);
    const rgb = `${Math.floor(c.r * 255)},${Math.floor(c.g * 255)},${Math.floor(c.b * 255)}`;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, `rgba(${rgb},0.85)`);
    gradient.addColorStop(0.4, `rgba(${rgb},0.25)`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  // Constellation arcs (slightly bulging out from the surface)
  nodeLinks.forEach((link) => {
    const mid = link.a.clone().add(link.b).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS * 1.12);
    const curve = new THREE.QuadraticBezierCurve3(link.a, mid, link.b);
    const points = curve.getPoints(24);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: link.color,
      transparent: true,
      opacity: 0.35,
    });
    globeGroup.add(new THREE.Line(geo, mat));
  });

  // ---------------------------------------------------------------------
  // Interaction: drag to rotate, click a node, hover tooltip
  // ---------------------------------------------------------------------
  let isDragging = false;
  let prevPointer = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0.0011 };
  let dragMoved = false;

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();

  function onPointerDown(e) {
    isDragging = true;
    dragMoved = false;
    container.classList.add("grabbing");
    prevPointer = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e) {
    if (isDragging) {
      const dx = e.clientX - prevPointer.x;
      const dy = e.clientY - prevPointer.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true;
      velocity.x = dx * 0.0025;
      velocity.y = dy * 0.0025;
      globeGroup.rotation.y += velocity.x;
      globeGroup.rotation.x += velocity.y;
      globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x));
      prevPointer = { x: e.clientX, y: e.clientY };
    }
    handleHover(e);
  }
  function onPointerUp(e) {
    isDragging = false;
    container.classList.remove("grabbing");
    if (!dragMoved) handleClick(e);
  }

  container.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
  container.addEventListener(
    "touchstart",
    (e) => onPointerDown(e.touches[0]),
    { passive: true }
  );
  container.addEventListener(
    "touchmove",
    (e) => onPointerMove(e.touches[0]),
    { passive: true }
  );
  container.addEventListener("touchend", (e) => onPointerUp(e.changedTouches[0]));

  function getIntersects(clientX, clientY) {
    pointerNDC.x = (clientX / window.innerWidth) * 2 - 1;
    pointerNDC.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    return raycaster.intersectObjects(pickables).filter((hit) => hit.object.visible);
  }

  let hoveredMesh = null;
  function handleHover(e) {
    const hits = getIntersects(e.clientX, e.clientY);
    if (hits.length > 0) {
      const hit = hits[0].object;
      const mesh = hit.userData.mesh || hit; // label hits resolve back to their dot
      container.style.cursor = "pointer";
      if (hoveredMesh !== mesh) {
        hoveredMesh = mesh;
      }
      const d = hit.userData.data;
      tooltip.innerHTML = `<span class="tt-code">${d.code}</span>${d.title}`;
      tooltip.style.left = e.clientX + "px";
      tooltip.style.top = e.clientY + "px";
      tooltip.classList.add("visible");
    } else {
      hoveredMesh = null;
      tooltip.classList.remove("visible");
      container.style.cursor = isDragging ? "grabbing" : "grab";
    }
  }

  function handleClick(e) {
    const hits = getIntersects(e.clientX, e.clientY);
    if (hits.length > 0) {
      openPanel(hits[0].object.userData.data);
    }
  }

  // ---------------------------------------------------------------------
  // Detail panel population
  // ---------------------------------------------------------------------
  const detailCode = overlay.querySelector(".detail-code");
  const detailTitle = overlay.querySelector(".detail-title");
  const detailImage = overlay.querySelector(".detail-image");
  const detailImageWrap = overlay.querySelector(".detail-image-wrap");
  const blocks = {
    realisation: overlay.querySelector(".detail-realisation"),
    part: overlay.querySelector(".detail-part"),
    justification: overlay.querySelector(".detail-justification"),
    bilan: overlay.querySelector(".detail-bilan"),
  };
  const detailEmpty = overlay.querySelector(".detail-empty");

  function setBlock(block, value) {
    if (value) {
      block.style.display = "block";
      block.querySelector(".block-text").textContent = value;
    } else {
      block.style.display = "none";
    }
  }

  function openPanel(data) {
    const color = "#" + new THREE.Color(CATEGORY_META[data.category].color).getHexString();
    overlay.style.setProperty("--current-color", color);
    detailCode.textContent = data.code;
    detailTitle.textContent = data.title;

    if (data.image) {
      detailImage.src = data.image;
      detailImage.alt = data.title;
      detailImage.classList.add("visible");
      detailImageWrap.classList.add("has-image");
    } else {
      detailImage.classList.remove("visible");
      detailImage.removeAttribute("src");
      detailImageWrap.classList.remove("has-image");
    }

    setBlock(blocks.realisation, data.realisation);
    setBlock(blocks.part, data.part);
    setBlock(blocks.justification, data.justification);
    setBlock(blocks.bilan, data.bilan);

    const anyContent = data.realisation || data.part || data.justification || data.bilan;
    detailEmpty.style.display = anyContent ? "none" : "block";

    overlay.classList.add("open");
    modalCard.scrollTop = 0;
  }

  function closePanel() {
    overlay.classList.remove("open");
  }

  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePanel();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  // ---------------------------------------------------------------------
  // Legend filtering
  // ---------------------------------------------------------------------
  let activeFilter = null;
  legendButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      activeFilter = activeFilter === filter ? null : filter;
      legendButtons.forEach((b) =>
        b.classList.toggle("dimmed", activeFilter && b.dataset.filter !== activeFilter)
      );
      nodeMeshes.forEach((m) => {
        const match = !activeFilter || m.userData.data.category === activeFilter;
        m.visible = match;
        if (m.userData.halo) m.userData.halo.visible = match;
        if (m.userData.label) m.userData.label.visible = match;
      });
    });
  });

  // ---------------------------------------------------------------------
  // Intro veil
  // ---------------------------------------------------------------------
  enterBtn.addEventListener("click", () => introVeil.classList.add("hidden"));

  // ---------------------------------------------------------------------
  // Resize
  // ---------------------------------------------------------------------
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    fitCameraToGlobe();
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---------------------------------------------------------------------
  // Animation loop
  // ---------------------------------------------------------------------
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!isDragging) {
      globeGroup.rotation.y += 0.0011;
      velocity.x *= 0.94;
      velocity.y *= 0.94;
    }

    // gentle node pulse
    nodeMeshes.forEach((m, i) => {
      const pulse = 1 + Math.sin(t * 1.6 + i) * 0.12;
      m.scale.setScalar(pulse * (m === hoveredMesh ? 1.6 : 1));
      if (m.userData.halo) {
        m.userData.halo.scale.set(0.29 * pulse, 0.29 * pulse, 1);
      }
    });

    renderer.render(scene, camera);
  }
  animate();
})();
