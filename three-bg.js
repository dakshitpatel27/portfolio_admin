// Three.js 3D Interactive Background - Constellation Network with Python Colors
(function () {
  let scene, camera, renderer;
  let particles = [];
  let lineGeometry, lineMesh;
  let currentMode = 'about';

  const bgConfig = (window.portfolioData && window.portfolioData.settings && window.portfolioData.settings.background3d) || {};
  const maxParticles = typeof bgConfig.particleCount === 'number' ? bgConfig.particleCount : 120;
  const maxDistance = typeof bgConfig.connectionDistance === 'number' ? bgConfig.connectionDistance : 110;
  const particleSize = typeof bgConfig.particleSize === 'number' ? bgConfig.particleSize : 4.5;
  const isEnabled = bgConfig.enabled !== false;
  
  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // Python theme colors
  const colors = [
    new THREE.Color('#306998'), // Python Blue
    new THREE.Color('#FFE873'), // Python Yellow
    new THREE.Color('#4B8BBE'), // Python Light Blue
    new THREE.Color('#FFD43B'), // Python Gold
    new THREE.Color('#ffffff')  // Soft White
  ];

  init();
  animate();

  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Create soft radial gradient
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    return new THREE.CanvasTexture(canvas);
  }

  function init() {
    const container = document.getElementById('three-bg');
    if (!container) return;

    if (!isEnabled) {
      container.style.display = 'none';
      return;
    }

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0015);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 250;

    // Particles Setup
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const particleColors = new Float32Array(maxParticles * 3);

    const texture = createCircleTexture();

    for (let i = 0; i < maxParticles; i++) {
      // Position particles in a 3D box
      const x = Math.random() * 500 - 250;
      const y = Math.random() * 500 - 250;
      const z = Math.random() * 500 - 250;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Assign a color from our Python palette
      const color = colors[Math.floor(Math.random() * colors.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;

      // Save additional data for physics/movement
      particles.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ),
        targetPos: new THREE.Vector3(x, y, z),
        color: color
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Material for particles
    const particleMaterial = new THREE.PointsMaterial({
      size: particleSize,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Points system
    const pointSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(pointSystem);

    // Lines geometry and material setup
    lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4B8BBE,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Events
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
  }

  function onMouseMove(event) {
    // Standardize mouse values to [-1, 1]
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  window.setThreeBgMode = function (mode) {
    currentMode = mode;
    
    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];
      if (!p) continue;
      
      if (mode === 'about') {
        // Soft kick to get them drifting again
        p.vel.set(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        );
      } else if (mode === 'resume') {
        // Vertical streams
        const cols = 5;
        const colIndex = i % cols;
        const colX = (colIndex - (cols - 1) / 2) * 80;
        const y = Math.random() * 300 - 150;
        const z = (Math.random() - 0.5) * 60;
        p.targetPos.set(colX, y, z);
      } else if (mode === 'portfolio') {
        // Fibonacci sphere
        const phi = Math.acos(1 - 2 * (i + 0.5) / maxParticles);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        const r = 90;
        p.targetPos.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
      } else if (mode === 'certifications') {
        // Helix cylinder
        const theta = (i / maxParticles) * Math.PI * 2 * 3;
        const r = 100;
        const y = ((i / maxParticles) - 0.5) * 180;
        p.targetPos.set(
          r * Math.cos(theta),
          y,
          r * Math.sin(theta)
        );
      }
    }
  };

  window.updateThreeBgTheme = function (accentHex, bgHex, mode) {
    if (!scene) return;
    
    function adjustColorBrightness(hex, percent) {
      let R = parseInt(hex.substring(1, 3), 16);
      let G = parseInt(hex.substring(3, 5), 16);
      let B = parseInt(hex.substring(5, 7), 16);
      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);
      R = Math.min(255, Math.max(0, R));
      G = Math.min(255, Math.max(0, G));
      B = Math.min(255, Math.max(0, B));
      return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
    }

    const primaryAccent = new THREE.Color(accentHex);
    const secondaryAccent = new THREE.Color(adjustColorBrightness(accentHex, -25));
    const lightAccent = new THREE.Color(adjustColorBrightness(accentHex, 25));
    const particleColorsList = [
      primaryAccent,
      secondaryAccent,
      lightAccent,
      new THREE.Color(mode === 'light' ? '#334155' : '#ffffff'),
      new THREE.Color(mode === 'light' ? '#475569' : '#cbd5e1')
    ];

    const fogColorHex = mode === 'light' ? '#f8fafc' : bgHex;
    const isHexVal = /^#[0-9A-F]{6}$/i.test(fogColorHex);
    const resolvedFogColor = isHexVal ? fogColorHex : (mode === 'light' ? '#f8fafc' : '#090a0f');

    scene.fog.color.set(resolvedFogColor);
    if (renderer) {
      renderer.setClearColor(resolvedFogColor, 0);
    }

    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];
      if (!p) continue;
      const newColor = particleColorsList[i % particleColorsList.length];
      p.color = newColor;
    }
  };

  function render() {
    if (!scene || !camera || !renderer) return;

    // Parallax effect: camera target moves based on mouse
    targetX = mouseX * 80;
    targetY = -mouseY * 80;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Mode-specific target pos updates per frame
    if (currentMode === 'resume') {
      // Flow falling coding columns
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        p.targetPos.y -= 0.6;
        if (p.targetPos.y < -150) p.targetPos.y = 150;
      }
    } else if (currentMode === 'portfolio') {
      // Rotate target sphere
      const rotateAxis = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < maxParticles; i++) {
        particles[i].targetPos.applyAxisAngle(rotateAxis, 0.004);
      }
    } else if (currentMode === 'certifications') {
      // Rotate helix cylinder
      const rotateAxis = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < maxParticles; i++) {
        particles[i].targetPos.applyAxisAngle(rotateAxis, 0.006);
      }
    } else if (currentMode === 'contact') {
      // Vortex swirling around mouse
      const mouse3D = new THREE.Vector3(mouseX * 130, -mouseY * 130, 0);
      const time = Date.now() * 0.0015;
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        const angle = (i / maxParticles) * Math.PI * 2 + time;
        const r = 45 + Math.sin(i * 13) * 20;
        p.targetPos.set(
          mouse3D.x + Math.cos(angle) * r,
          mouse3D.y + Math.sin(angle) * r,
          mouse3D.z + (i % 10 - 5) * 6
        );
      }
    }

    // Update particle positions
    const positions = [];
    const linePositions = [];
    const lineColors = [];

    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];

      if (currentMode === 'about') {
        p.pos.add(p.vel);
        if (p.pos.x > 250 || p.pos.x < -250) p.vel.x *= -1;
        if (p.pos.y > 250 || p.pos.y < -250) p.vel.y *= -1;
        if (p.pos.z > 250 || p.pos.z < -250) p.vel.z *= -1;
      } else {
        p.pos.lerp(p.targetPos, 0.06);
      }

      positions.push(p.pos.x, p.pos.y, p.pos.z);
    }

    // Build connections
    for (let i = 0; i < maxParticles; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < maxParticles; j++) {
        const p2 = particles[j];
        const dist = p1.pos.distanceTo(p2.pos);

        if (dist < maxDistance) {
          // Add connection line segment
          linePositions.push(p1.pos.x, p1.pos.y, p1.pos.z);
          linePositions.push(p2.pos.x, p2.pos.y, p2.pos.z);

          // Line color is dynamic, blended from the two particles
          const alpha = 1.0 - (dist / maxDistance);
          const c = p1.color.clone().lerp(p2.color, 0.5);
          
          lineColors.push(c.r * alpha, c.g * alpha, c.b * alpha);
          lineColors.push(c.r * alpha, c.g * alpha, c.b * alpha);
        }
      }
    }

    // Update Points geometry buffer
    const pointSystem = scene.children.find(child => child.isPoints);
    if (pointSystem) {
      pointSystem.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      pointSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Update LineSegments geometry buffers
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    lineMesh.material.vertexColors = true; // Use vertex colors to show fading connections

    renderer.render(scene, camera);
  }
})();
