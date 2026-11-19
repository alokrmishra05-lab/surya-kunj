import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ---------------- plan data: measured from the sanctioned layout (same frame as the 2D plan; entry at -X) ----------------
const S = 0.17812499999999998; // metres per plan px
const CX = 546.8, CY = 150.4;
const X = (px) => (px - CX) * S;
const Z = (py) => (py - CY) * S;

const AREA = [92.96,139.29,139.29,139.29,139.29,139.29,139.29,139.29,116.13,116.13,116.13,116.13,116.13,116.13,116.13,116.13,116.13,124.51,92.96,92.96,92.96,92.96,139.29,92.96,95.10,139.29,92.96,95.10,104.55,104.55,85.61,104.72,104.72,116.13,116.13,95.10,116.13,116.13,95.10,116.13,116.13,95.10];

const plots = [{"n": 1, "face": "N", "x": 66.0, "y": 192.0, "w": 34.26, "h": 92.8}, {"n": 2, "face": "N", "x": 100.26, "y": 192.0, "w": 51.33, "h": 92.8}, {"n": 3, "face": "N", "x": 151.58, "y": 192.0, "w": 51.33, "h": 92.8}, {"n": 4, "face": "N", "x": 202.91, "y": 192.0, "w": 51.33, "h": 92.8}, {"n": 5, "face": "N", "x": 254.24, "y": 192.0, "w": 51.33, "h": 92.8}, {"n": 6, "face": "N", "x": 305.57, "y": 192.0, "w": 51.33, "h": 92.8}, {"n": 7, "face": "N", "x": 356.9, "y": 192.0, "w": 51.33, "h": 92.8}, {"n": 8, "face": "N", "x": 408.22, "y": 192.0, "w": 51.33, "h": 92.8}, {"n": 9, "face": "N", "x": 459.55, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 10, "face": "N", "x": 502.35, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 11, "face": "N", "x": 545.14, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 12, "face": "N", "x": 587.93, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 13, "face": "N", "x": 630.73, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 14, "face": "N", "x": 673.52, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 15, "face": "N", "x": 716.31, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 16, "face": "N", "x": 759.11, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 17, "face": "N", "x": 801.9, "y": 192.0, "w": 42.79, "h": 92.8}, {"n": 18, "face": "N", "x": 844.7, "y": 192.0, "w": 45.88, "h": 92.8}, {"n": 19, "face": "N", "x": 890.58, "y": 192.0, "w": 34.26, "h": 92.8}, {"n": 20, "face": "N", "x": 924.83, "y": 192.0, "w": 34.26, "h": 92.8}, {"n": 21, "face": "N", "x": 959.09, "y": 192.0, "w": 34.26, "h": 92.8}, {"n": 22, "face": "N", "x": 993.34, "y": 192.0, "w": 34.26, "h": 92.8}, {"n": 23, "face": "E", "x": 66.0, "y": 88.16, "w": 84.8, "h": 53.44}, {"n": 24, "face": "E", "x": 66.0, "y": 52.49, "w": 84.8, "h": 35.67}, {"n": 25, "face": "E", "x": 66.0, "y": 16.0, "w": 84.8, "h": 36.49}, {"n": 26, "face": "W", "x": 201.6, "y": 88.16, "w": 84.0, "h": 53.44}, {"n": 27, "face": "W", "x": 201.6, "y": 52.49, "w": 84.0, "h": 35.67}, {"n": 28, "face": "W", "x": 201.6, "y": 16.0, "w": 84.0, "h": 36.49}, {"n": 29, "face": "E", "x": 285.6, "y": 97.04, "w": 76.0, "h": 44.56}, {"n": 30, "face": "E", "x": 285.6, "y": 52.49, "w": 76.0, "h": 44.56}, {"n": 31, "face": "E", "x": 285.6, "y": 16.0, "w": 76.0, "h": 36.49}, {"n": 32, "face": "W", "x": 411.6, "y": 78.8, "w": 54.0, "h": 62.8}, {"n": 33, "face": "W", "x": 411.6, "y": 16.0, "w": 54.0, "h": 62.8}, {"n": 34, "face": "W", "x": 721.6, "y": 97.04, "w": 82.0, "h": 44.56}, {"n": 35, "face": "W", "x": 721.6, "y": 52.49, "w": 82.0, "h": 44.56}, {"n": 36, "face": "W", "x": 721.6, "y": 16.0, "w": 82.0, "h": 36.49}, {"n": 37, "face": "E", "x": 803.6, "y": 97.04, "w": 84.0, "h": 44.56}, {"n": 38, "face": "E", "x": 803.6, "y": 52.49, "w": 84.0, "h": 44.56}, {"n": 39, "face": "E", "x": 803.6, "y": 16.0, "w": 84.0, "h": 36.49}, {"n": 40, "face": "W", "x": 939.6, "y": 97.04, "w": 88.0, "h": 44.56}, {"n": 41, "face": "W", "x": 939.6, "y": 52.49, "w": 88.0, "h": 44.56}, {"n": 42, "face": "W", "x": 939.6, "y": 16.0, "w": 88.0, "h": 36.49}];
const MAIN = { x: -60, y: 141.6, w: 1087.6, h: 50.4 };
const CROSS = [{"carr": 6.0, "x": 887.6, "y": 16.0, "w": 52.0, "h": 125.6}, {"carr": 7.5, "x": 673.6, "y": 16.0, "w": 48.0, "h": 125.6}, {"carr": 6.0, "x": 361.6, "y": 16.0, "w": 50.0, "h": 125.6}, {"carr": 6.0, "x": 150.8, "y": 16.0, "w": 50.8, "h": 125.6}];
const PARK = {"x": 465.6, "y": 16.0, "w": 208.0, "h": 125.6};
const SITE = {"x": 66.0, "y": 16.0, "w": 961.6, "h": 268.8};

// ---------------- renderer / scene ----------------
const canvas = document.getElementById('c');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch (e) { const err = new Error('renderer-create-failed: ' + (e && e.message)); err.glReason = 'init'; throw err; }
// once the fallback is shown (context lost / runtime error) all 3D work stops
const glDead = () => !!window.__glDead;
const COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;
const LOWEND = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 3);
let LOW = false;
try { const q = localStorage.getItem('sk-gfx'); LOW = q ? q === 'low' : !!LOWEND; } catch (e) { LOW = !!LOWEND; }
if (location.hash === '#video') LOW = false;
function pixelRatio() { return LOW ? 1 : Math.min(window.devicePixelRatio || 1, COARSE ? 1.5 : 2); }
renderer.setPixelRatio(pixelRatio());
renderer.shadowMap.enabled = !LOW;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 2000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 8;
controls.maxDistance = 420;
controls.screenSpacePanning = false;
controls.zoomToCursor = true;
controls.keyPanSpeed = 20;

const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x6b7d4a, 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
sun.position.set(-60, 110, -70);
sun.castShadow = !LOW;
sun.shadow.mapSize.set(COARSE ? 1024 : 2048, COARSE ? 1024 : 2048);
const sc = sun.shadow.camera;
sc.left = -120; sc.right = 120; sc.top = 70; sc.bottom = -70; sc.near = 10; sc.far = 320;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
scene.add(sun);

// ---------------- helpers ----------------
const matCache = new Map();
function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts }));
  return matCache.get(key);
}
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
function box(parent, w, h, d, x, y, z, material, shadow = true) {
  const m = new THREE.Mesh(boxGeo, material);
  m.scale.set(w, h, d);
  m.position.set(x, y + h / 2, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function cyl(parent, rt, rb, h, x, y, z, material, seg = 12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// materials
const M = {
  field: mat('#8FA868'),
  siteBase: mat('#B9C59A'),
  asphalt: mat('#3B4046', { roughness: 0.95 }),
  kerb: mat('#C9C6BE'),
  drain: null,
  line: mat('#F4F1E6', { roughness: 0.6 }),
  grass: mat('#6FA24A'),
  grassDark: mat('#5C8F3E'),
  path: mat('#D8C7A3'),
  paver: mat('#B7ADA0'),
  wall: mat('#E8E2D6'),
  wallCap: mat('#9C8F80'),
  glass: new THREE.MeshStandardMaterial({ color: '#2B3E52', roughness: 0.15, metalness: 0.6, emissive: '#FFC97A', emissiveIntensity: 0 }),
  wood: mat('#8A5A3B', { roughness: 0.7 }),
  rail: new THREE.MeshStandardMaterial({ color: '#A8C6D8', roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.35 }),
  metal: mat('#4A4F55', { roughness: 0.5, metalness: 0.6 }),
  pole: mat('#5B6168', { roughness: 0.5, metalness: 0.5 }),
  lamp: new THREE.MeshStandardMaterial({ color: '#FFF4D6', emissive: '#FFD58A', emissiveIntensity: 0.2 }),
  trunk: mat('#6B4A33'),
  leaf: [mat('#4E8A3A'), mat('#3F7A34'), mat('#5E9A45'), mat('#2F6B33')],
  concrete: mat('#A9A69F'),
  water: new THREE.MeshStandardMaterial({ color: '#4C8DB5', roughness: 0.1, metalness: 0.3 }),
};
function drainMat(len, horizontal) {
  const t = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#8E8C86'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2E2F31';
    if (horizontal) for (let x = 12; x < w; x += 32) g.fillRect(x, 24, 14, h - 48);
    else for (let y = 12; y < h; y += 32) g.fillRect(24, y, w - 48, 14);
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (horizontal) t.repeat.set(len / 1.4, 1); else t.repeat.set(1, len / 1.4);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 });
}

// ---------------- ground ----------------
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), M.field);
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
box(scene, SITE.w * S, 0.06, SITE.h * S, X(SITE.x + SITE.w / 2), 0, Z(SITE.y + SITE.h / 2), M.siteBase, false);

// ---------------- roads, kerbs, drains, lines ----------------
function road(r, horizontal) {
  const w = r.w * S, d = r.h * S, cx = X(r.x + r.w / 2), cz = Z(r.y + r.h / 2);
  const len = horizontal ? w : d;
  let across = horizontal ? d : w;
  if (horizontal) box(scene, len, 0.1, across, cx, 0, cz, M.asphalt, false); else box(scene, across, 0.1, len, cx, 0, cz, M.asphalt, false);
  const off = across / 2;
  for (const sgn of [-1, 1]) {
    // drain (covered, grated) at the edge, kerb inside it
    const dr = new THREE.Mesh(boxGeo, drainMat(len, horizontal));
    if (horizontal) { dr.scale.set(len, 0.14, 0.7); dr.position.set(cx, 0.07, cz + sgn * (off - 0.35)); }
    else { dr.scale.set(0.7, 0.14, len); dr.position.set(cx + sgn * (off - 0.35), 0.07, cz); }
    dr.receiveShadow = true; scene.add(dr);
    if (horizontal) box(scene, len, 0.22, 0.25, cx, 0, cz + sgn * (off - 0.82), M.kerb, false);
    else box(scene, 0.25, 0.22, len, cx + sgn * (off - 0.82), 0, cz, M.kerb, false);
  }
  // dashed centre line
  const dash = 3, gap = 3;
  for (let t = -len / 2 + 2; t < len / 2 - 2; t += dash + gap) {
    if (horizontal) box(scene, dash, 0.02, 0.15, cx + t + dash / 2, 0.1, cz, M.line, false);
    else box(scene, 0.15, 0.02, dash, cx, 0.1, cz + t + dash / 2, M.line, false);
  }
}
road(MAIN, true);
CROSS.forEach((r) => road(r, false));

// ---------------- Ayodhya-style architectural helpers ----------------
const STONE = {
  pink: mat('#E2B79C'), pinkDark: mat('#C9967A'), cream: mat('#F1E2CC'), band: mat('#B98468'),
  maroon: mat('#7A2E2A'), saffron: mat('#E8781E', { roughness: 0.6 }), gold: mat('#C9A045', { roughness: 0.35, metalness: 0.6 }),
};
// instanced small repeated pieces (kangura merlons etc.)
const INST = new Map();
// design styles: 'ayodhya' (traditional, default) and 'modern' — objects listed here are shown/hidden by the switch
const STYLE = { ayodhya: [], modern: [] };
const MOD_NIGHT = []; // night-time hooks for the modern design materials
let INST_LAYER = '';
function instMarker(parent, key, material, w, h, d, x, y, z, geo = boxGeo) {
  key = INST_LAYER + key;
  const o = new THREE.Object3D();
  o.position.set(x, y + h / 2, z); o.scale.set(w, h, d);
  o.userData.inst = key;
  if (!INST.has(key)) INST.set(key, { material, geo, mats: [] });
  parent.add(o);
  return o;
}
function harvestMarkers(root) {
  root.updateMatrixWorld(true);
  const rm = [];
  root.traverse((o) => { if (o.userData.inst) { INST.get(o.userData.inst).mats.push(o.matrixWorld.clone()); rm.push(o); } });
  rm.forEach((o) => o.parent.remove(o));
}
function buildInstances() {
  for (const [key, e] of INST.entries()) {
    if (e.built || !e.mats.length) continue;
    const im = new THREE.InstancedMesh(e.geo, e.material, e.mats.length);
    e.mats.forEach((m, i) => im.setMatrixAt(i, m));
    im.castShadow = true; im.receiveShadow = true;
    scene.add(im); e.built = true;
    if (key.startsWith('A:')) STYLE.ayodhya.push(im);
    else if (key.startsWith('M:')) STYLE.modern.push(im);
  }
}
// kangura (merlon) row along local x from x0..x1 at height y, depth z
function kangura(parent, x0, x1, y, z, alongZ = false, size = 0.32, step = 0.62, key = 'kang', material = STONE.band) {
  const len = Math.abs(x1 - x0), n = Math.max(1, Math.floor(len / step));
  const s = (len - (n - 1) * step) / 2;
  for (let i = 0; i < n; i++) {
    const t = Math.min(x0, x1) + s + i * step;
    if (alongZ) instMarker(parent, key, material, size * 0.8, size * 1.2, size, z, y, t);
    else instMarker(parent, key, material, size, size * 1.2, size * 0.8, t, y, z);
  }
}
// arch-topped panel (w wide, h tall incl. semicircle), extruded d, facing +z
const archCache = new Map();
function archGeo(w, h, d) {
  const k = `${w.toFixed(2)}_${h.toFixed(2)}_${d.toFixed(2)}`;
  if (!archCache.has(k)) {
    const r = w / 2, sh = new THREE.Shape();
    sh.moveTo(-r, 0); sh.lineTo(r, 0); sh.lineTo(r, h - r);
    sh.absarc(0, h - r, r, 0, Math.PI, false);
    sh.lineTo(-r, 0);
    const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false, curveSegments: 14 });
    archCache.set(k, g);
  }
  return archCache.get(k);
}
function arch(parent, w, h, d, x, y, z, material) {
  const m = new THREE.Mesh(archGeo(w, h, d), material);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
  parent.add(m); return m;
}
// arched window/door with stone surround
function archedOpening(parent, w, h, x, y, z, fill, frame = STONE.band) {
  arch(parent, w + 0.3, h + 0.15, 0.08, x, y - 0.05, z, frame);
  return arch(parent, w, h, 0.1, x, y, z + 0.02, fill);
}
const domeGeo = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
function kalash(parent, x, y, z, s = 1) {
  const a = new THREE.Mesh(new THREE.SphereGeometry(0.14 * s, 10, 8), STONE.gold); a.position.set(x, y + 0.14 * s, z); parent.add(a);
  const b = new THREE.Mesh(new THREE.ConeGeometry(0.07 * s, 0.35 * s, 8), STONE.gold); b.position.set(x, y + 0.42 * s, z); parent.add(b);
}
function chhatri(parent, x, y, z, s = 1, domeMat = STONE.cream) {
  const g = new THREE.Group();
  const w = 1.6 * s;
  box(g, w + 0.2 * s, 0.15 * s, w + 0.2 * s, 0, 0, 0, STONE.band);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.16 * s, 1.3 * s, 0.16 * s, sx * (w / 2 - 0.1 * s), 0.15 * s, sz * (w / 2 - 0.1 * s), STONE.pink);
  box(g, w + 0.35 * s, 0.18 * s, w + 0.35 * s, 0, 1.45 * s, 0, STONE.band);
  const d = new THREE.Mesh(domeGeo, domeMat); d.scale.set(w * 0.55, w * 0.6, w * 0.55); d.position.y = 1.63 * s; d.castShadow = true; g.add(d);
  kalash(g, 0, 1.63 * s + w * 0.6, 0, s);
  g.position.set(x, y, z); parent.add(g); return g;
}
// Nagara-style shikhara (curvilinear tower) on square plan
const shikharaCache = new Map();
function shikhara(parent, x, y, z, baseW, h, material = STONE.pink) {
  const k = baseW + '_' + h;
  if (!shikharaCache.has(k)) {
    const pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(new THREE.Vector2((baseW / 2) * Math.SQRT2 * (1 - Math.pow(t, 1.6) * 0.82), t * h)); }
    pts.push(new THREE.Vector2(0, h));
    shikharaCache.set(k, new THREE.LatheGeometry(pts, 4));
  }
  const m = new THREE.Mesh(shikharaCache.get(k), material);
  m.rotation.y = Math.PI / 4; m.position.set(x, y, z); m.castShadow = true; parent.add(m);
  // horizontal bands for carved look
  for (let i = 1; i < 6; i++) { const t = i / 6, w = baseW * (1 - Math.pow(t, 1.6) * 0.82) + 0.08; box(parent, w, 0.1, w, x, y + t * h, z, STONE.band, false); }
  const am = new THREE.Mesh(new THREE.CylinderGeometry(baseW * 0.22, baseW * 0.22, 0.25, 16), STONE.band); am.position.set(x, y + h + 0.1, z); parent.add(am);
  kalash(parent, x, y + h + 0.22, z, 1.6);
  return m;
}
const flagMat = new THREE.MeshStandardMaterial({ color: '#F07A16', side: THREE.DoubleSide, roughness: 0.7 });
const flags = [];
function flag(parent, x, y, z, s = 1) {
  cyl(parent, 0.03 * s, 0.03 * s, 2.2 * s, x, y, z, M.metal, 6);
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(1.1 * s, -0.35 * s); sh.lineTo(0, -0.75 * s); sh.lineTo(0, 0);
  const f = new THREE.Mesh(new THREE.ShapeGeometry(sh), flagMat); f.position.set(x, y + 2.2 * s, z); parent.add(f); flags.push(f);
}

// ---------------- trees ----------------
function tree(parent, x, z, scale = 1, kind = 0) {
  const g = new THREE.Group();
  cyl(g, 0.12 * scale, 0.18 * scale, 2.2 * scale, 0, 0, 0, M.trunk, 6);
  const leaf = M.leaf[((kind % M.leaf.length) + M.leaf.length) % M.leaf.length];
  if (((kind % 3) + 3) % 3 === 2) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.3 * scale, 4.5 * scale, 8), leaf);
    c.position.y = 4 * scale; c.castShadow = true; g.add(c);
  } else {
    const sph = new THREE.IcosahedronGeometry(1.6 * scale, 1);
    const a = new THREE.Mesh(sph, leaf); a.position.y = 3.4 * scale; a.castShadow = true; g.add(a);
    const b = new THREE.Mesh(sph, leaf); b.position.set(0.7 * scale, 2.9 * scale, 0.3 * scale); b.scale.setScalar(0.7); b.castShadow = true; g.add(b);
  }
  g.position.set(x, 0, z);
  g.rotation.y = (x * 13.7 + z * 7.1) % 6.28;
  parent.add(g);
  return g;
}

// ---------------- street lights ----------------
const lightGlows = [];
const glowTex = canvasTex(128, 128, (g, w) => {
  const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
  gr.addColorStop(0, 'rgba(255,214,140,0.85)'); gr.addColorStop(0.4, 'rgba(255,190,110,0.35)'); gr.addColorStop(1, 'rgba(255,180,100,0)');
  g.fillStyle = gr; g.fillRect(0, 0, w, w);
});
const poolMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
const haloMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
const LAMP = { pole: mat('#24211F', { roughness: 0.45, metalness: 0.5 }), capGeo: new THREE.ConeGeometry(0.32, 0.35, 4) };
function streetLight(x, z, dirX, dirZ) {
  // heritage lantern post (Ram Path style): stone base, black pole with gold bands, lantern with gold cap
  const px = x + dirX * 0.85, pz = z + dirZ * 0.85;
  const g = new THREE.Group();
  box(g, 0.55, 0.6, 0.55, 0, 0, 0, STONE.pinkDark);
  cyl(g, 0.08, 0.12, 5.2, 0, 0.6, 0, LAMP.pole, 10);
  for (const h of [1.1, 3.0, 5.6]) cyl(g, 0.13, 0.13, 0.12, 0, h, 0, STONE.gold, 10);
  box(g, 1.3, 0.07, 0.07, 0, 5.4, 0, LAMP.pole);
  for (const s of [-1, 1]) {
    box(g, 0.34, 0.55, 0.34, s * 0.62, 4.75, 0, M.lamp, false);
    const cap = new THREE.Mesh(LAMP.capGeo, STONE.gold); cap.position.set(s * 0.62, 5.42, 0); cap.rotation.y = Math.PI / 4; g.add(cap);
  }
  kalash(g, 0, 5.75, 0, 0.8);
  g.position.set(px, 0, pz);
  g.rotation.y = Math.atan2(-dirZ, dirX) + Math.PI / 2;
  scene.add(g);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), poolMat);
  pool.rotation.x = -Math.PI / 2; pool.position.set(px, 0.13, pz); scene.add(pool);
  const halo = new THREE.Sprite(haloMat); halo.scale.set(3.4, 3.4, 1); halo.position.set(px, 5.0, pz); scene.add(halo);
  lightGlows.push(pool, halo);
}
{
  const zN = Z(MAIN.y) - 0.15, zS = Z(MAIN.y + MAIN.h) + 0.15;
  let k = 0;
  for (let x = X(-40); x < X(1025); x += 16, k++) {
    if (k % 2 === 0) streetLight(x, zN, 0, 1); else streetLight(x, zS, 0, -1);
  }
  for (const r of CROSS) {
    const xx = X(r.x) - 0.15;
    for (let z = Z(r.y) + 8; z < Z(r.y + r.h) - 2; z += 15) streetLight(xx, z, 1, 0);
  }
}

// ---------------- houses (Ayodhya / Nagara-inspired row houses) ----------------
const PALETTES = [
  { wall: '#EBC9AE', accent: '#7A2E2A' },
  { wall: '#F2E2CC', accent: '#B5532A' },
  { wall: '#E4B898', accent: '#7A2E2A' },
  { wall: '#F4E8D6', accent: '#8C3B22' },
  { wall: '#E9C2A2', accent: '#A04020' },
  { wall: '#EFD8BE', accent: '#6E2A26' },
];
const windowMeshes = [];

function car(parent, x, z, rotY, color) {
  const g = new THREE.Group();
  box(g, 1.8, 0.7, 4.1, 0, 0.3, 0, mat(color, { roughness: 0.35, metalness: 0.4 }));
  box(g, 1.6, 0.6, 2.2, 0, 1.0, -0.2, M.glass);
  for (const [dx, dz] of [[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]]) {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.25, 12), M.metal);
    wh.rotation.z = Math.PI / 2; wh.position.set(dx, 0.33, dz); g.add(wh);
  }
  g.position.set(x, 0, z); g.rotation.y = rotY; parent.add(g);
}

const halfCylGeo = new THREE.CylinderGeometry(1, 1, 1, 16, 1, false, 0, Math.PI);
function jharokha(parent, x, y, zf, w, roofMat) {
  // projecting balcony window: base slab + brackets, slim pillars, bangaldar roof, kalash
  const d = 0.9;
  box(parent, w + 0.2, 0.22, d + 0.1, x, y - 0.22, zf + d / 2, STONE.band);
  for (const s of [-1, 0, 1]) box(parent, 0.18, 0.5, d * 0.7, x + s * (w / 2 - 0.2), y - 0.72, zf + d * 0.35, STONE.pinkDark);
  box(parent, w, 0.7, 0.1, x, y, zf + d - 0.05, STONE.pink); // low carved parapet
  for (const s of [-1, -0.33, 0.33, 1]) box(parent, 0.11, 1.6, 0.11, x + s * (w / 2 - 0.08), y + 0.7, zf + d - 0.08, STONE.pinkDark);
  box(parent, w + 0.3, 0.16, d + 0.3, x, y + 2.3, zf + d / 2, STONE.band);
  const r = new THREE.Mesh(halfCylGeo, roofMat);
  r.rotation.set(0, 0, Math.PI / 2); r.scale.set(0.45, w + 0.3, (d + 0.3) / 2);
  r.position.set(x, y + 2.46, zf + d / 2); r.castShadow = true; parent.add(r);
  kalash(parent, x, y + 2.9, zf + d / 2, 0.9);
  const win = archedOpening(parent, Math.min(1.2, w - 0.6), 1.7, x, y + 0.15, zf + 0.04, M.glass, STONE.band);
  windowMeshes.push(win);
}

function house(p, idx) {
  const faceS = p.face === 'S' || p.face === 'N';
  const W = (faceS ? p.w : p.h) * S;
  const D = (faceS ? p.h : p.w) * S;
  const big = AREA[p.n - 1] >= 130;
  const pal = PALETTES[(idx * 5 + (big ? 1 : 0)) % PALETTES.length];
  const variant = (idx * 7) % 3;
  const g = new THREE.Group();
  const front = Math.min(3.4, D * 0.24), rear = Math.min(1.4, D * 0.1);
  const bw = Math.max(5.8, Math.min(W - 0.25, (AREA[p.n - 1] * 1.15) / (D - 1)));
  const hx = -W / 2 + 0.12 + bw / 2;
  const bd = D - front - rear;
  const z0 = -D / 2 + rear, zf = z0 + bd;
  const wallM = mat(pal.wall), accM = mat(pal.accent);

  // grounds
  box(g, W - 0.05, 0.12, front, 0, 0, D / 2 - front / 2, M.grass, false);
  const gateW = Math.min(3.0, bw * 0.45);
  const gateX = hx + bw / 2 - gateW / 2;
  box(g, gateW, 0.14, front, gateX, 0, D / 2 - front / 2, M.paver, false);
  box(g, W - 0.05, 0.12, rear, 0, 0, -D / 2 + rear / 2, M.grassDark, false);
  // boundary wall: sandstone with small pillar caps + metal gate
  const lw = gateX - gateW / 2 - (-W / 2), rw = W / 2 - (gateX + gateW / 2);
  if (lw > 0.2) { box(g, lw, 1.0, 0.22, -W / 2 + lw / 2, 0, D / 2 - 0.1, STONE.pink); box(g, lw, 0.08, 0.32, -W / 2 + lw / 2, 1.0, D / 2 - 0.1, STONE.band, false); }
  if (rw > 0.2) { box(g, rw, 1.0, 0.22, W / 2 - rw / 2, 0, D / 2 - 0.1, STONE.pink); box(g, rw, 0.08, 0.32, W / 2 - rw / 2, 1.0, D / 2 - 0.1, STONE.band, false); }
  for (const s of [-1, 1]) { const px = gateX + s * (gateW / 2 + 0.2); box(g, 0.4, 1.5, 0.4, px, 0, D / 2 - 0.1, STONE.pinkDark); const c = new THREE.Mesh(domeGeo, STONE.cream); c.scale.set(0.24, 0.24, 0.24); c.position.set(px, 1.5, D / 2 - 0.1); g.add(c); }
  box(g, gateW - 0.3, 1.25, 0.05, gateX, 0, D / 2 - 0.1, mat('#2E2A26', { metalness: 0.5, roughness: 0.4 }));
  box(g, 0.15, 1.0, front, W / 2 - 0.08, 0, D / 2 - front / 2, STONE.pink);

  const hb = new THREE.Group(); hb.position.x = hx; g.add(hb);
  const fl = 3.3, pl = 0.6;
  // plinth + floors + carved string courses
  box(hb, bw, pl, bd, 0, 0, z0 + bd / 2, STONE.pinkDark);
  box(hb, bw, fl, bd, 0, pl, z0 + bd / 2, wallM);
  box(hb, bw, fl, bd, 0, pl + fl, z0 + bd / 2, wallM);
  box(hb, bw + 0.16, 0.28, bd + 0.16, 0, pl + fl - 0.14, z0 + bd / 2, STONE.band);
  box(hb, bw + 0.1, 0.12, bd + 0.1, 0, pl + 0.6, z0 + bd / 2, STONE.band, false);
  const top = pl + 2 * fl;
  box(hb, bw + 0.24, 0.3, bd + 0.24, 0, top - 0.15, z0 + bd / 2, STONE.band); // cornice
  box(hb, bw - 0.2, 0.06, bd - 0.2, 0, top + 0.15, z0 + bd / 2, mat('#D9CBB6'), false);
  // parapet + kangura on front and sides
  box(hb, bw, 0.7, 0.18, 0, top + 0.15, zf - 0.09, wallM);
  box(hb, 0.18, 0.7, bd, -bw / 2 + 0.09, top + 0.15, z0 + bd / 2, wallM);
  box(hb, 0.18, 0.7, bd, bw / 2 - 0.09, top + 0.15, z0 + bd / 2, wallM);
  kangura(hb, -bw / 2 + 0.2, bw / 2 - 0.2, top + 0.85, zf - 0.09);
  // stair room (mumty) with small dome
  const mw = Math.min(3.2, bw * 0.45), mx = -bw / 2 + mw / 2 + 0.2;
  box(hb, mw, 2.7, 3.4, mx, top + 0.15, z0 + 1.9, wallM);
  box(hb, mw + 0.2, 0.18, 3.6, mx, top + 2.85, z0 + 1.9, STONE.band);
  const md = new THREE.Mesh(domeGeo, STONE.cream); md.scale.set(mw * 0.36, mw * 0.4, mw * 0.36); md.position.set(mx, top + 3.03, z0 + 1.9); md.castShadow = true; hb.add(md);
  kalash(hb, mx, top + 3.03 + mw * 0.4, z0 + 1.9, 0.9);
  if (idx % 4 === 0) flag(hb, mx + mw / 2 - 0.3, top + 3.03, z0 + 0.6, 0.9);
  // roof-corner chhatri on bigger houses / alternate houses
  if (big || idx % 3 === 2) chhatri(hb, bw / 2 - 1.2, top + 0.15, zf - 1.3, 0.85);

  const fz = zf + 0.02;
  // main door: arched, wood, stone surround, saffron toran band, steps
  const doorX = -bw / 2 + 1.1;
  arch(hb, 1.8, 3.0, 0.1, doorX, pl, fz, accM);
  arch(hb, 1.2, 2.55, 0.12, doorX, pl, fz + 0.04, M.wood);
  box(hb, 1.6, 0.12, 0.06, doorX, pl + 2.55, fz + 0.18, STONE.saffron, false);
  box(hb, 1.8, 0.2, 0.6, doorX, 0.2, fz + 0.3, STONE.band, false);
  box(hb, 1.8, 0.2, 0.9, doorX, 0, fz + 0.45, STONE.band, false);

  const ff = pl + fl + 0.55; // first-floor sill height
  if (variant === 1) {
    // ground-floor arched verandah (3 arches) with first-floor terrace balcony
    const vw = bw - 2.4, vx = doorX + 0.9 + vw / 2 + 0.2, vd = 1.6;
    box(hb, vw, 0.2, vd, vx, pl - 0.2, zf + vd / 2, STONE.band, false);
    const sh = new THREE.Shape();
    const n = 3, aw = vw / n, H = fl - 0.2;
    sh.moveTo(-vw / 2, 0);
    for (let i = 0; i < n; i++) {
      const cx0 = -vw / 2 + aw * i, r = aw / 2 - 0.22;
      sh.lineTo(cx0 + 0.22, 0); sh.lineTo(cx0 + 0.22, H - 0.7 - r);
      sh.absarc(cx0 + aw / 2, H - 0.7 - r, r, Math.PI, 0, true);
      sh.lineTo(cx0 + aw - 0.22, 0);
    }
    sh.lineTo(vw / 2, 0); sh.lineTo(vw / 2, H); sh.lineTo(-vw / 2, H); sh.lineTo(-vw / 2, 0);
    const colon = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: false, curveSegments: 12 }), STONE.pink);
    colon.position.set(vx, pl, zf + vd - 0.3); colon.castShadow = true; hb.add(colon);
    box(hb, vw + 0.1, 0.25, vd + 0.1, vx, pl + H, zf + vd / 2, STONE.band);
    box(hb, vw, 0.85, 0.12, vx, pl + H + 0.25, zf + vd - 0.06, STONE.pink);
    kangura(hb, vx - vw / 2 + 0.2, vx + vw / 2 - 0.2, pl + H + 1.1, zf + vd - 0.06, false, 0.24, 0.5, 'kangS');
    windowMeshes.push(box(hb, vw * 0.8, 1.6, 0.06, vx, pl + 0.7, fz, M.glass, false));
    for (let i = 0; i < 2; i++) windowMeshes.push(archedOpening(hb, 1.0, 1.9, vx - vw / 4 + i * vw / 2, ff, fz, M.glass));
  } else {
    // ground-floor arched windows
    const gws = bw > 7.5 ? 2 : 1;
    for (let i = 0; i < gws; i++) {
      const x = doorX + 1.9 + i * 1.7;
      windowMeshes.push(archedOpening(hb, 1.0, 1.8, x, pl + 0.75, fz, M.glass));
      box(hb, 1.3, 0.1, 0.25, x, pl + 0.7, fz + 0.1, STONE.band, false);
    }
    if (variant === 0 || bw < 7) {
      // central jharokha + side arched window
      jharokha(hb, bw / 2 - 2.0, ff, zf, 2.2, accM);
      windowMeshes.push(archedOpening(hb, 0.9, 1.7, -bw / 2 + 1.2, ff, fz, M.glass));
    } else {
      // twin jharokhas
      jharokha(hb, -bw / 4, ff, zf, 1.9, accM);
      jharokha(hb, bw / 4, ff, zf, 1.9, accM);
    }
  }
  // side jaali screen strip on wider houses
  if (bw > 9) for (let k = 0; k < 6; k++) box(hb, 0.08, 2.4, 0.08, -bw / 2 + 0.3 + k * 0.18, pl + fl + 0.3, fz + 0.06, STONE.band, false);

  // garden
  if (W - bw > 4) tree(g, hx + bw / 2 + (W - bw) / 2, z0 + bd / 2, 0.9, idx + 1);
  if (idx % 3 !== 1) tree(g, hx - bw / 2 + 1.1, D / 2 - 1.3, 0.55, idx);
  else {
    // tulsi chaura (small raised planter) in front yard
    box(g, 0.7, 0.7, 0.7, hx - bw / 2 + 1.0, 0.12, D / 2 - 1.4, STONE.cream);
    box(g, 0.5, 0.35, 0.5, hx - bw / 2 + 1.0, 0.82, D / 2 - 1.4, M.leaf[0]);
  }
  if (idx % 2 === 0) car(g, gateX, D / 2 - front / 2 + 0.1, 0, ['#B23A3A', '#E6E6E6', '#2E4A6B', '#3A3A3A', '#C9B79C'][idx % 5]);

  const cx = X(p.x + p.w / 2), cz = Z(p.y + p.h / 2);
  g.position.set(cx, 0.06, cz);
  g.rotation.y = p.face === 'S' ? 0 : p.face === 'N' ? Math.PI : p.face === 'E' ? Math.PI / 2 : -Math.PI / 2;
  scene.add(g); STYLE.ayodhya.push(g);
  harvestMarkers(g);
  p.center = new THREE.Vector3(cx, 0, cz);
  p.top = top + 3.5;
}
INST_LAYER = 'A:';
plots.forEach((p, i) => house(p, i));
INST_LAYER = '';


// ---------------- park, OHT, STP ----------------
{
  const cx = X(PARK.x + PARK.w / 2), cz = Z(PARK.y + PARK.h / 2), pw = PARK.w * S, pd = PARK.h * S;
  box(scene, pw, 0.15, pd, cx, 0, cz, M.grass, false);
  // elliptical walking track
  const shape = new THREE.Shape(); shape.absellipse(0, 0, pw / 2 - 3, pd / 2 - 4, 0, Math.PI * 2);
  const hole = new THREE.Path(); hole.absellipse(0, 0, pw / 2 - 4.6, pd / 2 - 5.6, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const track = new THREE.Mesh(new THREE.ShapeGeometry(shape, 64), M.path);
  track.rotation.x = -Math.PI / 2; track.position.set(cx, 0.17, cz); track.receiveShadow = true; scene.add(track);
  // central lawn feature: round fountain
  cyl(scene, 3.2, 3.4, 0.5, cx, 0.15, cz, M.concrete, 32);
  cyl(scene, 2.8, 2.8, 0.06, cx, 0.62, cz, M.water, 32);
  cyl(scene, 0.25, 0.4, 1.4, cx, 0.6, cz, M.concrete, 12);
  // trees ring + benches
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    tree(scene, cx + Math.cos(a) * (pw / 2 - 1.6), cz + Math.sin(a) * (pd / 2 - 2), 0.9 + (i % 3) * 0.15, i);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    const bx = cx + Math.cos(a) * (pw / 2 - 6.5), bz = cz + Math.sin(a) * (pd / 2 - 7.5);
    const b = new THREE.Group();
    box(b, 1.8, 0.1, 0.5, 0, 0.45, 0, M.wood); box(b, 1.8, 0.45, 0.08, 0, 0.55, -0.22, M.wood);
    box(b, 0.1, 0.45, 0.4, -0.8, 0, 0, M.metal); box(b, 0.1, 0.45, 0.4, 0.8, 0, 0, M.metal);
    b.position.set(bx, 0.15, bz); b.lookAt(cx, 0.15, cz); scene.add(b);
  }
  // kids play: colourful blocks + slide
  const kx = cx - pw / 2 + 8, kz = cz + pd / 2 - 6;
  box(scene, 6, 0.08, 6, kx, 0.15, kz, mat('#E7B65C'), false);
  box(scene, 1.5, 1.8, 1.5, kx - 1.5, 0.2, kz - 1, mat('#D9534F'));
  box(scene, 0.7, 0.1, 3.2, kx - 1.5, 1.0, kz + 1.0, mat('#3E88C7')).rotation.x = 0.5;
  box(scene, 1.0, 1.0, 1.0, kx + 1.8, 0.2, kz + 1.4, mat('#5CB85C'));

  // OHT: overhead tank on columns (rear-left corner of park)
  const ox = cx + pw / 2 - 6, oz = cz - pd / 2 + 6;
  for (const [dx, dz] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]) cyl(scene, 0.25, 0.3, 14, ox + dx, 0.15, oz + dz, M.concrete, 8);
  box(scene, 3.6, 0.2, 0.2, ox, 5, oz - 1.6, M.concrete); box(scene, 3.6, 0.2, 0.2, ox, 10, oz + 1.6, M.concrete);
  cyl(scene, 3.4, 2.6, 4.5, ox, 14.15, oz, mat('#D9D4CA'), 24);
  cyl(scene, 3.5, 3.5, 0.3, ox, 18.6, oz, mat('#9C968C'), 24);
  // STP: low plant with tanks and railing
  const sx = cx - pw / 2 + 7, sz = cz - pd / 2 + 5;
  box(scene, 9, 1.2, 7, sx, 0.15, sz, M.concrete);
  cyl(scene, 1.4, 1.4, 0.05, sx - 2.2, 1.36, sz, M.water, 20);
  cyl(scene, 1.4, 1.4, 0.05, sx + 2.2, 1.36, sz, M.water, 20);
  box(scene, 3, 2.6, 2.4, sx, 1.35, sz - 2.1, mat('#C9C3B8'));
  for (const s of [-1, 1]) box(scene, 9, 0.9, 0.05, sx, 1.35, sz + s * 3.5, M.metal, false);
}

{ const cx = X(PARK.x + PARK.w / 2), cz = Z(PARK.y + PARK.h / 2); chhatri(scene, cx + 9, 0.15, cz + 4, 2.0, STONE.cream); }
// hydrants at road crossings
for (const r of CROSS) {
  const hx = X(r.x) - 0.6, hz = Z(MAIN.y) - 1.0;
  cyl(scene, 0.18, 0.2, 0.8, hx, 0, hz, mat('#D63B3B', { roughness: 0.4 }), 10);
  cyl(scene, 0.22, 0.22, 0.12, hx, 0.8, hz, mat('#D63B3B', { roughness: 0.4 }), 10);
}

// spur verges: a few trees at the dead ends

let GATE = null; // gate position, reused by the modern gate
// ---------------- boundary wall + Ayodhya-style entry gate ----------------
{
  const x0 = X(SITE.x), x1 = X(SITE.x + SITE.w), z0 = Z(SITE.y), z1 = Z(SITE.y + SITE.h);
  const gz = Z(MAIN.y + MAIN.h / 2), hr = MAIN.h * S / 2 + 0.25;
  const pierW = 2.4, sideW = 2.8, gateHalf = hr + pierW + sideW;
  const wallRoot = new THREE.Group(); scene.add(wallRoot);
  function wallSeg(a, b, c, d) {
    const len = Math.hypot(c - a, d - b);
    const horiz = Math.abs(d - b) < 0.01;
    box(wallRoot, horiz ? len : 0.35, 2.2, horiz ? 0.35 : len, (a + c) / 2, 0, (b + d) / 2, STONE.pink);
    box(wallRoot, horiz ? len : 0.5, 0.15, horiz ? 0.5 : len, (a + c) / 2, 2.2, (b + d) / 2, STONE.band, false);
    box(wallRoot, horiz ? len : 0.45, 0.35, horiz ? 0.45 : len, (a + c) / 2, 0, (b + d) / 2, STONE.pinkDark, false);
    if (horiz) kangura(wallRoot, Math.min(a, c), Math.max(a, c), 2.35, b, false, 0.3, 0.7, 'kangW');
    else kangura(wallRoot, Math.min(b, d), Math.max(b, d), 2.35, a, true, 0.3, 0.7, 'kangW');
    const n = Math.max(1, Math.round(len / 8));
    for (let i = 0; i <= n; i++) {
      const t = i / n, px = a + (c - a) * t, pz = b + (d - b) * t;
      box(wallRoot, 0.7, 2.7, 0.7, px, 0, pz, STONE.pinkDark);
      box(wallRoot, 0.85, 0.12, 0.85, px, 2.7, pz, STONE.band, false);
      instMarker(wallRoot, 'wallDome', STONE.cream, 0.36, 0.38, 0.36, px, 2.82 - 0.19, pz, domeGeo);
    }
  }
  wallSeg(x0, z0, x1, z0); wallSeg(x1, z0, x1, z1); wallSeg(x0, z1, x1, z1);
  const hrw = MAIN.h * S / 2 + 0.2;
  wallSeg(x0, z0, x0, gz - hrw); wallSeg(x0, gz + hrw, x0, z1);
  harvestMarkers(wallRoot);

  // gate group: local x across the road, local +z faces outward (world -x)
  const G = new THREE.Group();
  G.position.set(x0 - 4, 0, gz); G.rotation.y = -Math.PI / 2; scene.add(G); STYLE.ayodhya.push(G);
  INST_LAYER = 'A:';
  const pierH = 13;
  for (const s of [-1, 1]) {
    const px = s * (hr + pierW / 2);
    box(G, pierW + 0.6, 0.8, pierW + 0.6, px, 0, 0, STONE.pinkDark);
    box(G, pierW, pierH, pierW, px, 0.8, 0, STONE.pink);
    for (const h of [3.2, 6.6, 10, pierH + 0.5]) box(G, pierW + 0.25, 0.3, pierW + 0.25, px, h, 0, STONE.band);
    for (const fz of [1, -1]) {
      const niche = new THREE.Group(); niche.position.z = fz * (pierW / 2); niche.rotation.y = fz > 0 ? 0 : Math.PI; G.add(niche); niche.position.x = px;
      archedOpening(niche, 1.0, 2.0, 0, 1.0, 0, STONE.maroon, STONE.band);
      archedOpening(niche, 1.0, 2.4, 0, 3.8, 0, STONE.maroon, STONE.band);
      box(niche, 0.34, 0.5, 0.34, 0, 7.2, 0.25, M.lamp, false);
    }
    box(G, pierW + 0.5, 0.35, pierW + 0.5, px, pierH + 0.8, 0, STONE.band);
    shikhara(G, px, pierH + 1.15, 0, pierW - 0.2, 7.5);
    flag(G, px, pierH + 1.15 + 7.5 + 1.0, 0, 1.5);
  }
  // central arched span
  const H = 14.2, spring = 5.4, r = hr - 0.1;
  const sh = new THREE.Shape();
  sh.moveTo(-hr, 0); sh.lineTo(-r, 0); sh.lineTo(-r, spring); sh.absarc(0, spring, r, Math.PI, 0, true); sh.lineTo(r, 0); sh.lineTo(hr, 0);
  sh.lineTo(hr, H); sh.lineTo(-hr, H); sh.lineTo(-hr, 0);
  const span = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 1.8, bevelEnabled: false, curveSegments: 24 }), STONE.pink);
  span.position.z = -0.9; span.castShadow = true; span.receiveShadow = true; G.add(span);
  for (const fz of [0.95, -0.95]) {
    const trim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.16, 8, 32, Math.PI), STONE.gold);
    trim.position.set(0, spring, fz); G.add(trim);
    const trim2 = new THREE.Mesh(new THREE.TorusGeometry(r + 0.5, 0.1, 8, 32, Math.PI), STONE.band);
    trim2.position.set(0, spring, fz); G.add(trim2);
  }
  // bells (ghanti) hanging under the arch
  for (const bx of [-1.6, 0, 1.6]) {
    cyl(G, 0.015, 0.015, 0.8, bx, spring + r - 0.85 - Math.abs(bx) * 0.25, 0, M.metal, 4);
    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.35, 12, 1, true), STONE.gold); bell.position.set(bx, spring + r - 1.02 - Math.abs(bx) * 0.25, 0); G.add(bell);
  }
  // name plate (both faces)
  const signTex = canvasTex(1024, 192, (g, w, h) => {
    g.fillStyle = '#6E2A26'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#D8AE4F'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = '#F2C55C'; g.font = '700 88px Rajdhani, Mukta, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('सूर्य कुंज आवासीय योजना', w / 2, h / 2 + 6);
  });
  window.__signTex = signTex;
  const signMat = new THREE.MeshStandardMaterial({ map: signTex, emissive: '#ffffff', emissiveMap: signTex, emissiveIntensity: 0.12 });
  for (const fz of [1, -1]) {
    const sp = new THREE.Mesh(new THREE.PlaneGeometry(2 * hr - 0.8, 1.45), signMat);
    sp.position.set(0, 10.8, fz * 0.92); if (fz < 0) sp.rotation.y = Math.PI; G.add(sp);
  }
  box(G, 2 * hr + 2 * pierW, 0.4, 2.3, 0, H, 0, STONE.band);
  kangura(G, -hr + 0.3, hr - 0.3, H + 0.4, 0.9, false, 0.36, 0.72, 'kangG');
  kangura(G, -hr + 0.3, hr - 0.3, H + 0.4, -0.9, false, 0.36, 0.72, 'kangG');
  chhatri(G, 0, H + 0.4, 0, 1.45, STONE.cream);
  chhatri(G, -hr * 0.62, H + 0.4, 0, 0.8);
  chhatri(G, hr * 0.62, H + 0.4, 0, 0.8);
  // sun emblem (सूर्य) on both faces above the plate
  const sunG = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.12, 32), STONE.gold); disc.rotation.x = Math.PI / 2; sunG.add(disc);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const ray = new THREE.Mesh(new THREE.ConeGeometry(0.13, i % 2 ? 0.5 : 0.75, 4), STONE.gold);
    ray.position.set(Math.cos(a) * (i % 2 ? 1.0 : 1.1), Math.sin(a) * (i % 2 ? 1.0 : 1.1), 0); ray.rotation.z = a - Math.PI / 2; sunG.add(ray);
  }
  for (const fz of [1.05, -1.05]) { const sg = sunG.clone(); sg.position.set(0, H - 1.3, fz); G.add(sg); }
  // pedestrian side arches
  for (const s of [-1, 1]) {
    const cx = s * (hr + pierW + sideW / 2), sw = sideW, sh2 = new THREE.Shape(), rr = 0.85, sp2 = 2.6;
    sh2.moveTo(-sw / 2, 0); sh2.lineTo(-rr, 0); sh2.lineTo(-rr, sp2); sh2.absarc(0, sp2, rr, Math.PI, 0, true); sh2.lineTo(rr, 0); sh2.lineTo(sw / 2, 0);
    sh2.lineTo(sw / 2, 5); sh2.lineTo(-sw / 2, 5); sh2.lineTo(-sw / 2, 0);
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh2, { depth: 1.2, bevelEnabled: false, curveSegments: 14 }), STONE.pink);
    m.position.set(cx, 0, -0.6); m.castShadow = true; G.add(m);
    box(G, sw + 0.3, 0.25, 1.5, cx, 5, 0, STONE.band);
    kangura(G, cx - sw / 2 + 0.2, cx + sw / 2 - 0.2, 5.25, 0.55, false, 0.3, 0.6, 'kangG');
    const dm = new THREE.Mesh(domeGeo, STONE.cream); dm.scale.set(0.8, 0.9, 0.8); dm.position.set(cx, 5.25, 0); dm.castShadow = true; G.add(dm);
    kalash(G, cx, 6.15, 0, 1);
  }
  harvestMarkers(G);
  INST_LAYER = '';
  // pier lantern glows for night
  for (const s of [-1, 1]) for (const fz of [1, -1]) {
    const v = new THREE.Vector3(s * (hr + pierW / 2), 7.45, fz * (pierW / 2 + 0.25)); G.localToWorld(v);
    const halo = new THREE.Sprite(haloMat); halo.scale.set(3, 3, 1); halo.position.copy(v); scene.add(halo); lightGlows.push(halo); STYLE.ayodhya.push(halo);
  }
  // guard room (inside, beside the gate) with dome
  const grx = x0 - 9, grz = gz - hr - 7;
  const GR = new THREE.Group(); scene.add(GR); STYLE.ayodhya.push(GR);
  box(GR, 3.2, 3.0, 3.2, grx, 0, grz, STONE.cream);
  box(GR, 3.6, 0.25, 3.6, grx, 3.0, grz, STONE.band);
  const gd = new THREE.Mesh(domeGeo, STONE.pink); gd.scale.set(1.3, 1.4, 1.3); gd.position.set(grx, 3.25, grz); gd.castShadow = true; GR.add(gd);
  kalash(GR, grx, 4.65, grz, 1);
  GATE = { x0, gz, hr };
  // approach road outside the gate
  box(scene, 60, 0.08, MAIN.h * S, x0 - 30, 0, gz, M.asphalt, false);
  box(scene, 14, 0.08, 400, x0 - 66, 0, 0, M.asphalt, false);
}

// distant trees
for (let i = 0; i < 160; i++) {
  const a = Math.random() * Math.PI * 2, r = 140 + Math.random() * 220;
  tree(scene, Math.cos(a) * r * 1.3, Math.sin(a) * r * 0.9, 1.2 + Math.random(), i);
}

buildInstances();
// ---------------- plot number labels ----------------
const labels = new THREE.Group();
for (const p of plots) {
  const tex = canvasTex(128, 128, (g, w) => {
    g.fillStyle = 'rgba(15,27,45,0.88)'; g.beginPath(); g.arc(w / 2, w / 2, 56, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#F5A524'; g.lineWidth = 6; g.stroke();
    g.fillStyle = '#FFFFFF'; g.font = '700 60px Rajdhani, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(p.n), w / 2, w / 2 + 3);
  });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.scale.set(2.6, 2.6, 1);
  sp.position.set(p.center.x, p.top + 1.2, p.center.z);
  sp.renderOrder = 10;
  labels.add(sp);
}
labels.visible = false;
scene.add(labels);

// ---------------- day / night ----------------
const DAY = { bg: new THREE.Color('#BFD9EE'), fog: new THREE.Color('#CFE1EE'), hemi: 0.9, sun: 2.4, glow: 0, win: 0, lamp: 0.2, exp: 1.05 };
const NIGHT = { bg: new THREE.Color('#101C33'), fog: new THREE.Color('#14223A'), hemi: 0.3, sun: 0.35, glow: 1, win: 1.4, lamp: 4, exp: 1.35 };
scene.fog = new THREE.Fog(DAY.fog.clone(), 380, 1100);
scene.background = DAY.bg.clone();
let nightT = 0, nightTarget = 0;
function applyNight(t) {
  scene.background.copy(DAY.bg).lerp(NIGHT.bg, t);
  scene.fog.color.copy(DAY.fog).lerp(NIGHT.fog, t);
  hemi.intensity = THREE.MathUtils.lerp(DAY.hemi, NIGHT.hemi, t);
  sun.intensity = THREE.MathUtils.lerp(DAY.sun, NIGHT.sun, t);
  sun.color.set(t > 0.5 ? '#9FB4FF' : '#FFF1DC');
  poolMat.opacity = t * 0.9; haloMat.opacity = t;
  M.glass.emissiveIntensity = t * NIGHT.win;
  M.lamp.emissiveIntensity = THREE.MathUtils.lerp(DAY.lamp, NIGHT.lamp, t);
  renderer.toneMappingExposure = THREE.MathUtils.lerp(DAY.exp, NIGHT.exp, t);
  MOD_NIGHT.forEach((f) => f(t));
}


// ---------------- drainage & water management visualisation ----------------
const DR = { group: new THREE.Group(), on: false, flowTex: [], rain: null, labelSprites: [], sys: { sewer: [], drain: [], rain: [] } };
DR.group.visible = false;
DR.group.userData.util = true;
scene.add(DR.group);
{
  const zMain = Z(MAIN.y + MAIN.h / 2), halfMain = (MAIN.h * S) / 2;
  const xs = X(SITE.x) + 0.6, xe = X(SITE.x + SITE.w) - 0.6, x0 = X(SITE.x);
  const zEdgeSpur = Z(MAIN.y); // main-road edge on the spur side
  const pcx = X(PARK.x + PARK.w / 2), pcz = Z(PARK.y + PARK.h / 2), pw = PARK.w * S, pd = PARK.h * S;
  const stpX = pcx - pw / 2 + 7, stpZ = pcz - pd / 2 + 5;
  const COL = { sewer: '#8A4B1F', drain: '#2563EB', rain: '#06B6D4' };

  function flowTexture(color) {
    return canvasTex(128, 32, (g, w, h) => {
      g.fillStyle = color; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,255,255,0.85)';
      for (let x = 8; x < w; x += 64) { g.beginPath(); g.moveTo(x, 6); g.lineTo(x + 22, h / 2); g.lineTo(x, h - 6); g.lineTo(x + 10, h / 2); g.closePath(); g.fill(); }
    });
  }
  function pipe(sys, pts, r, color) {
    const path = new THREE.CurvePath();
    let len = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = new THREE.Vector3(...pts[i]), b = new THREE.Vector3(...pts[i + 1]);
      path.add(new THREE.LineCurve3(a, b)); len += a.distanceTo(b);
    }
    const tex = flowTexture(color);
    tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(Math.max(1, len / 2.2), 1);
    DR.flowTex.push(tex);
    const m = new THREE.Mesh(new THREE.TubeGeometry(path, Math.max(8, Math.round(len * 1.5)), r, 10, false),
      new THREE.MeshStandardMaterial({ map: tex, emissive: color, emissiveIntensity: 0.35, roughness: 0.5 }));
    m.userData.util = true; DR.group.add(m); DR.sys[sys].push(m);
    return m;
  }
  function solid(sys, mesh) { mesh.userData.util = true; DR.group.add(mesh); DR.sys[sys].push(mesh); return mesh; }

  // ---- 1. SEWER (underground) -> STP
  const ys = -1.8;
  pipe('sewer', [[xe, ys, zMain], [stpX, ys, zMain]], 0.32, COL.sewer);
  pipe('sewer', [[xs, ys, zMain], [stpX, ys, zMain]], 0.32, COL.sewer);
  pipe('sewer', [[stpX, ys, zMain], [stpX, ys, stpZ + 2.5], [stpX, -0.6, stpZ + 2.5]], 0.38, COL.sewer);
  for (const r of CROSS) {
    const xc = X(r.x + r.w / 2);
    pipe('sewer', [[xc, ys + 0.2, Z(r.y) + 1.5], [xc, ys, zMain]], 0.24, COL.sewer);
    for (let z = Z(r.y) + 4; z < zEdgeSpur - 1; z += 10) solid('sewer', manhole(xc, z));
  }
  for (let x = xs + 6; x < xe - 2; x += 24) solid('sewer', manhole(x, zMain));
  // house connections
  for (const p of plots) {
    if (!p.center) continue;
    if (p.face === 'N') {
      pipe('sewer', [[p.center.x, -1.0, p.center.z], [p.center.x, -1.6, zMain + 0.4]], 0.09, COL.sewer);
    } else {
      let best = null, bd = 1e9;
      for (const r of CROSS) { const xc = X(r.x + r.w / 2); const d = Math.abs(xc - p.center.x); if (d < bd) { bd = d; best = xc; } }
      if (bd < 30) pipe('sewer', [[p.center.x, -1.0, p.center.z], [best + Math.sign(p.center.x - best) * 0.4, -1.6, p.center.z]], 0.09, COL.sewer);
    }
  }
  // STP highlight ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.18, 8, 48), new THREE.MeshBasicMaterial({ color: COL.sewer }));
  ring.rotation.x = -Math.PI / 2; ring.position.set(stpX, 0.35, stpZ); solid('sewer', ring);

  function manhole(x, z) {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 20), new THREE.MeshStandardMaterial({ color: '#2B2B2B', metalness: 0.6, roughness: 0.4 }));
    c.position.y = 0.14; g.add(c);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.8, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#6B6258', transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
    shaft.position.y = -0.8; g.add(shaft);
    g.position.set(x, 0, z); g.userData.util = true;
    return g;
  }

  // ---- 2. NAALI (covered drains at road edges) -> big nala outside
  const yd = -0.15, dOff = halfMain - 0.35;
  const nalaX = x0 - 56;
  for (const s of [-1, 1]) {
    pipe('drain', [[xe, yd, zMain + s * dOff], [x0, yd, zMain + s * dOff], [nalaX + 1.4, yd - 0.4, zMain + s * dOff]], 0.2, COL.drain);
  }
  for (const r of CROSS) {
    const xc = X(r.x + r.w / 2), half = (r.w * S) / 2 - 0.35;
    for (const s of [-1, 1]) pipe('drain', [[xc + s * half, yd, Z(r.y) + 0.8], [xc + s * half, yd, zMain - dOff]], 0.16, COL.drain);
  }
  // big nala: open concrete channel along the outer road
  {
    const L = 260, W = 2.6, Dp = 1.3;
    const conc = new THREE.MeshStandardMaterial({ color: '#9C978E', roughness: 0.9 });
    const bed = new THREE.Mesh(boxGeo, conc); bed.scale.set(W + 0.6, 0.2, L); bed.position.set(nalaX, -Dp, 0); solid('drain', bed);
    for (const s of [-1, 1]) { const w = new THREE.Mesh(boxGeo, conc); w.scale.set(0.3, Dp + 0.2, L); w.position.set(nalaX + s * (W / 2 + 0.15), -Dp / 2 + 0.1, 0); solid('drain', w); }
    const wt = canvasTex(64, 256, (g, w, h) => { g.fillStyle = '#2E6FB7'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 3; for (let y = 10; y < h; y += 28) { g.beginPath(); g.moveTo(8, y); g.quadraticCurveTo(w / 2, y + 10, w - 8, y); g.stroke(); } });
    wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(1, L / 6); DR.nalaTex = wt;
    const water = new THREE.Mesh(new THREE.PlaneGeometry(W, L), new THREE.MeshStandardMaterial({ map: wt, emissive: '#1E4E8C', emissiveIntensity: 0.4, roughness: 0.2 }));
    water.rotation.x = -Math.PI / 2; water.position.set(nalaX, -0.55, 0); solid('drain', water);
    const slab = new THREE.Mesh(boxGeo, conc); slab.scale.set(W + 1.2, 0.3, MAIN.h * S + 2); slab.position.set(nalaX, 0.02, zMain); solid('drain', slab);
  }

  // ---- 3. RAINWATER HARVESTING -> recharge pits in the park
  const pits = [[pcx - pw / 2 + 3.5, pcz], [pcx + pw / 2 - 3.5, pcz + 2], [pcx - 7, pcz + pd / 2 - 2.6], [pcx + 7, pcz + pd / 2 - 2.6]];
  DR.seep = [];
  for (const [px, pz] of pits) {
    const g = new THREE.Group(); g.position.set(px, 0, pz); g.userData.util = true;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 3, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#8C7A62', transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    shaft.position.y = -1.5; g.add(shaft);
    const fill = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.6, 20), new THREE.MeshStandardMaterial({ color: '#B59E7E', transparent: true, opacity: 0.45 }));
    fill.position.y = -1.6; g.add(fill);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 20), new THREE.MeshStandardMaterial({ color: COL.rain, emissive: COL.rain, emissiveIntensity: 0.5 }));
    cap.position.y = 0.22; g.add(cap);
    const seep = new THREE.Mesh(new THREE.ConeGeometry(2.6, 5, 24, 1, true), new THREE.MeshBasicMaterial({ color: COL.rain, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }));
    seep.rotation.x = Math.PI; seep.position.y = -5.5; g.add(seep); DR.seep.push(seep);
    solid('rain', g);
  }
  pipe('rain', [[pits[2][0], -0.6, zMain - dOff], [pits[2][0], -0.6, pits[2][1] + 1.1]], 0.16, COL.rain);
  pipe('rain', [[pits[3][0], -0.6, zMain - dOff], [pits[3][0], -0.6, pits[3][1] + 1.1]], 0.16, COL.rain);
  { const r = CROSS.find((c) => c.carr === 7.5); if (r) { const xw = X(r.x) + 0.35; pipe('rain', [[xw, -0.6, pits[1][1] - 6], [xw, -0.6, pits[1][1]], [pits[1][0] + 1.1, -0.6, pits[1][1]]], 0.16, COL.rain); } }
  pipe('rain', [[pcx - pw / 2 + 1, -0.4, pcz + pd / 2 - 1], [pits[0][0], -0.6, pits[0][1] + 1.1]], 0.12, COL.rain);

  // rain particles over the site
  const N = 2500, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = xs + Math.random() * (xe - xs); pos[i * 3 + 1] = Math.random() * 40; pos[i * 3 + 2] = Z(SITE.y) + Math.random() * SITE.h * S; }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  DR.rain = new THREE.Points(rg, new THREE.PointsMaterial({ color: '#9BD7FF', size: 0.35, transparent: true, opacity: 0.8, depthWrite: false }));
  DR.rain.userData.util = true; DR.group.add(DR.rain); DR.sys.rain.push(DR.rain);

  // labels (redrawn per language)
  const LBL = [
    [{ hi: 'STP — सीवेज शोधन संयंत्र', en: 'STP — Sewage treatment plant' }, COL.sewer, stpX, 9, stpZ],
    [{ hi: 'बाहर का बड़ा नाला', en: 'Main drain outside' }, COL.drain, nalaX, 7, zMain - 18],
    [{ hi: 'रिचार्ज पिट (वर्षा जल)', en: 'Recharge pits (rainwater)' }, COL.rain, pcx, 7, pcz],
    [{ hi: 'भूमिगत सीवर लाइन', en: 'Underground sewer line' }, COL.sewer, X(SITE.x + SITE.w * 0.78), 5, zMain],
  ];
  DR.drawLabels = () => {
    const en = document.documentElement.lang === 'en';
    DR.labelSprites.forEach((s) => DR.group.remove(s)); DR.labelSprites = [];
    for (const [t, c, x, y, z] of LBL) {
      const tex = canvasTex(768, 128, (g, w, h) => {
        g.fillStyle = 'rgba(15,20,30,.88)'; g.beginPath(); g.roundRect(4, 14, w - 8, h - 28, 24); g.fill();
        g.fillStyle = c; g.fillRect(4, 14, 22, h - 28);
        g.fillStyle = '#fff'; g.font = '700 50px Mukta, sans-serif'; g.textBaseline = 'middle'; g.fillText(en ? t.en : t.hi, 46, h / 2 + 2);
      });
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
      sp.scale.set(27, 4.5, 1); sp.position.set(x, y, z); sp.renderOrder = 20; sp.userData.util = true;
      DR.group.add(sp); DR.labelSprites.push(sp);
    }
  };
  DR.drawLabels();
  new MutationObserver(() => DR.drawLabels()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}

const ghostCache = new Map();
function ghostOf(m) {
  if (!ghostCache.has(m.uuid)) { const g = m.clone(); g.transparent = true; g.opacity = 0.12; g.depthWrite = false; ghostCache.set(m.uuid, g); }
  return ghostCache.get(m.uuid);
}
function setDrainage(on) {
  DR.on = on; DR.group.visible = on;
  const isUtil = (o) => { for (let p = o; p; p = p.parent) if (p.userData && p.userData.util) return true; return false; };
  scene.traverse((o) => {
    if (!(o.isMesh || o.isInstancedMesh) || isUtil(o)) return;
    if (on) { if (!o.userData.orig) o.userData.orig = o.material; o.material = Array.isArray(o.material) ? o.material.map(ghostOf) : ghostOf(o.material); o.castShadow = false; }
    else if (o.userData.orig) { o.material = o.userData.orig; delete o.userData.orig; o.castShadow = true; }
  });
  scene.traverse((o) => { if (o.isSprite && !isUtil(o)) { if (on) { o.userData.wasVis = o.visible; o.visible = false; } else if ('wasVis' in o.userData) o.visible = o.userData.wasVis; } });
  if (on) { nightTarget = 0; labels.visible = false; const ip = document.getElementById('panel'); if (ip) { ip.setAttribute('hidden', ''); const ib = document.getElementById('info'); ib.setAttribute('aria-expanded', 'false'); ib.setAttribute('aria-pressed', 'false'); } const dp = document.getElementById('drainPanel'); if (dp) { dp.classList.remove('min'); const mb = document.getElementById('drainMin'); mb.textContent = '–'; mb.setAttribute('aria-expanded', 'true'); } }
  const p = document.getElementById('drainPanel'); if (p) p.hidden = !on;
  const b = document.getElementById('drainBtn'); if (b) b.setAttribute('aria-pressed', String(on));
}
function animateDrainage(dt) {
  if (!DR.on) return;
  for (const t of DR.flowTex) t.offset.x -= dt * 0.55;
  if (DR.nalaTex) DR.nalaTex.offset.y += dt * 0.25;
  const tt = clock.elapsedTime;
  DR.seep.forEach((s, i) => { s.material.opacity = 0.15 + 0.15 * (0.5 + 0.5 * Math.sin(tt * 2 + i)); });
  if (DR.rain && DR.rain.visible) {
    const a = DR.rain.geometry.attributes.position;
    for (let i = 0; i < a.count; i++) { let y = a.getY(i) - dt * 22; if (y < 0) y += 40; a.setY(i, y); }
    a.needsUpdate = true;
  }
}

// ---------------- MODERN design (optional, built on first switch) ----------------
// contemporary villas: white planes, wood cladding, cantilevered slabs, glass balcony, jaali panel;
// modern entry gate: louvered pylon, sloping cantilever beam with pergola fins, tall name pylon with wood arc
let modernBuilt = false;
function plankTex(base, line, vertical) {
  const t = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) {
      g.fillStyle = i % 2 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.05)';
      if (vertical) g.fillRect(i * 16, 0, 16, h); else g.fillRect(0, i * 16, w, 16);
      g.fillStyle = line;
      if (vertical) g.fillRect(i * 16, 0, 2, h); else g.fillRect(0, i * 16, w, 2);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function jaaliTex() {
  // white panel with a cascade of hexagonal "cube" cut-outs (like a CNC jaali)
  const draw = (lit) => (g, w, h) => {
    g.fillStyle = lit ? '#000' : '#F6F6F4'; g.fillRect(0, 0, w, h);
    const r = 15, dx = r * 1.732, dy = r * 1.5;
    for (let row = 0; row < h / dy + 1; row++) for (let col = 0; col < w / dx + 1; col++) {
      const cx = col * dx + (row % 2 ? dx / 2 : 0) + 6, cy = row * dy + 10;
      const band = 0.15 + 0.55 * (1 - cy / h); // wider at the top, tapering down
      const centre = w * (0.3 + 0.15 * Math.sin(cy / 90));
      if (Math.abs(cx - centre) > w * band) continue;
      if (((row * 7 + col * 13) % 10) < 2) continue;
      const pts = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; pts.push([cx + r * 0.82 * Math.cos(a), cy + r * 0.82 * Math.sin(a)]); }
      g.beginPath(); pts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
      g.fillStyle = lit ? '#FFD9A0' : '#8E9FA9'; g.fill();
      g.strokeStyle = lit ? '#000' : '#E4E9EC'; g.lineWidth = 1.8;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(pts[1][0], pts[1][1]); g.moveTo(cx, cy); g.lineTo(pts[3][0], pts[3][1]); g.moveTo(cx, cy); g.lineTo(pts[5][0], pts[5][1]); g.stroke();
    }
  };
  return { map: canvasTex(256, 768, draw(false)), glow: canvasTex(256, 768, draw(true)) };
}
let MOD = null;
function modMaterials() {
  const jt = jaaliTex();
  const woodTex = [plankTex('#8A5432', 'rgba(40,20,10,0.35)', true), plankTex('#6E4128', 'rgba(30,15,8,0.4)', true), plankTex('#9C6A43', 'rgba(50,25,10,0.3)', true)];
  const gateTex = plankTex('#7C7268', 'rgba(30,30,30,0.45)', false);
  MOD = {
    white: mat('#F3F2EF', { roughness: 0.6 }), white2: mat('#E9E7E2', { roughness: 0.7 }),
    char: mat('#2A2B2E', { roughness: 0.5, metalness: 0.3 }), grey: mat('#8E9093', { roughness: 0.7 }),
    pylon: mat('#9A9C9E', { roughness: 0.75 }), plinth: mat('#6F7275'), stone: mat('#B9B1A6', { roughness: 0.9 }),
    woods: woodTex.map((t) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 })),
    slat: mat('#7A4A2C', { roughness: 0.7 }),
    gate: new THREE.MeshStandardMaterial({ map: gateTex, roughness: 0.8 }),
    darkGlass: new THREE.MeshStandardMaterial({ color: '#1E2328', roughness: 0.1, metalness: 0.7, emissive: '#FFC97A', emissiveIntensity: 0 }),
    jaali: new THREE.MeshStandardMaterial({ map: jt.map, emissive: '#FFFFFF', emissiveMap: jt.glow, emissiveIntensity: 0, roughness: 0.6 }),
    flower: mat('#E8783A'), flower2: mat('#D9478A'), shrub: mat('#3E7A35'),
  };
  MOD_NIGHT.push((t) => { MOD.jaali.emissiveIntensity = t * 1.1; MOD.darkGlass.emissiveIntensity = t * 0.9; });
}
// box with a special material on its +z face only
function faceBox(parent, w, h, d, x, y, z, side, front) {
  const m = box(parent, w, h, d, x, y, z, side);
  m.material = [side, side, side, side, front, side];
  return m;
}

function modernHouse(p, idx) {
  const faceS = p.face === 'S' || p.face === 'N';
  const W = (faceS ? p.w : p.h) * S, D = (faceS ? p.h : p.w) * S;
  const g = new THREE.Group();
  const front = Math.min(3.4, D * 0.24), rear = Math.min(1.4, D * 0.1);
  const bw = Math.max(5.8, Math.min(W - 0.25, (AREA[p.n - 1] * 1.15) / (D - 1)));
  const hx = -W / 2 + 0.12 + bw / 2;
  const bd = D - front - rear, z0 = -D / 2 + rear, zf = z0 + bd;
  const mir = idx % 2 ? -1 : 1;              // jaali on the right (1) or left (-1)
  const wood = MOD.woods[idx % 3];
  const stoneGF = idx % 3 === 2;

  // grounds: lawn, driveway, rear
  box(g, W - 0.05, 0.12, front, 0, 0, D / 2 - front / 2, M.grass, false);
  const gateW = Math.min(3.2, bw * 0.46);
  const gateX = hx - mir * (bw / 2 - gateW / 2 - 0.15);
  box(g, gateW, 0.14, front, gateX, 0, D / 2 - front / 2, M.paver, false);
  box(g, W - 0.05, 0.12, rear, 0, 0, -D / 2 + rear / 2, M.grassDark, false);
  // front boundary: white rendered wall, charcoal coping, LED strips, wood panel, slatted wood gate
  const wz = D / 2 - 0.12, wh = 1.45;
  const segs = [[-W / 2, gateX - gateW / 2], [gateX + gateW / 2, W / 2]];
  segs.forEach(([a, b2], si) => {
    const len = b2 - a; if (len < 0.2) return;
    box(g, len, wh, 0.25, (a + b2) / 2, 0, wz, MOD.white);
    box(g, len + 0.02, 0.06, 0.3, (a + b2) / 2, wh, wz, MOD.char, false);
    if (len > 2.2) {
      // wood-clad pedestrian door next to the gate + LED strips
      const nearGate = si === 0 ? b2 - 0.75 : a + 0.75;
      box(g, 1.1, wh + 0.35, 0.12, nearGate, 0, wz + 0.1, wood);
      const far = si === 0 ? a + 0.6 : b2 - 0.6, dir = si === 0 ? 1 : -1;
      for (let k = 0; k < 3; k++) box(g, 0.06, wh - 0.4, 0.04, far + dir * k * 0.45, 0.2, wz + 0.14, M.lamp, false);
      box(g, len - 1.6, 0.4, 0.5, (a + b2) / 2 + (si === 0 ? -0.6 : 0.6), 0.12, wz - 0.4, MOD.shrub, false);
    }
  });
  box(g, gateW, 0.12, 0.2, gateX, 1.75, wz, MOD.char, false);
  for (let x = gateX - gateW / 2 + 0.08; x < gateX + gateW / 2 - 0.05; x += 0.15) instMarker(g, 'slat', MOD.slat, 0.1, 1.6, 0.06, x, 0.12, wz);
  box(g, 0.15, 1.0, front, W / 2 - 0.08, 0, D / 2 - front / 2, MOD.white);

  const hb = new THREE.Group(); hb.position.x = hx; g.add(hb);
  const pl = 0.45, fl = 3.3, sl = 0.35;
  const y1 = pl + fl, y2 = y1 + sl + fl, top = y2 + sl;
  // plinth
  box(hb, bw, pl, bd, 0, 0, z0 + bd / 2, MOD.plinth);
  // ground floor (recessed under the first-floor slab)
  const gfz = zf - 0.9;
  box(hb, bw, fl, gfz - z0, 0, pl, z0 + (gfz - z0) / 2, MOD.white);
  if (stoneGF) box(hb, bw * 0.45, fl, 0.1, -mir * bw * 0.22, pl, gfz + 0.05, MOD.stone);
  windowMeshes.push(box(hb, bw * 0.34, 2.1, 0.08, mir * bw * 0.12, pl + 0.55, gfz + 0.05, M.glass, false));
  box(hb, bw * 0.34 + 0.12, 0.08, 0.1, mir * bw * 0.12, pl + 2.65, gfz + 0.06, MOD.char, false);
  // door with wood cladding panel
  const dx = -mir * (bw / 2 - 1.0);
  box(hb, 1.6, fl, 0.1, dx, pl, gfz + 0.06, wood);
  box(hb, 1.0, 2.4, 0.06, dx, pl, gfz + 0.13, MOD.char);
  box(hb, 2.0, 0.18, 0.9, dx, 0.27, gfz + 0.45, MOD.grey, false);
  // first-floor slab (projecting), charcoal fascia line
  box(hb, bw + 0.2, sl, bd + 0.3, 0, y1, z0 + bd / 2 + 0.15, MOD.white);
  box(hb, bw + 0.22, 0.07, 0.05, 0, y1 + 0.1, zf + 0.31, MOD.char, false);
  for (let k = 0; k < 3; k++) instMarker(hb, 'dl', M.lamp, 0.2, 0.03, 0.2, -bw / 3 + k * bw / 3, y1 - 0.03, gfz + 0.45);
  // first floor: set back for a glass-railed balcony
  const ffz = zf - 1.5;
  box(hb, bw, fl, ffz - z0, 0, y1 + sl, z0 + (ffz - z0) / 2, MOD.white2);
  windowMeshes.push(box(hb, bw * 0.46, 2.45, 0.08, -mir * bw * 0.05, y1 + sl + 0.1, ffz + 0.05, M.glass, false));
  box(hb, bw * 0.46 + 0.12, 0.1, 0.1, -mir * bw * 0.05, y1 + sl + 2.55, ffz + 0.06, MOD.char, false);
  const railW = bw - 2.0, railX = -mir * 0.6;
  box(hb, railW, 1.0, 0.04, railX, y1 + sl, zf + 0.12, M.rail, false);
  box(hb, railW, 0.05, 0.08, railX, y1 + sl + 1.0, zf + 0.12, MOD.char, false);
  for (let k = 0; k < 3; k++) {
    const px = railX - railW / 2 + 0.6 + k * (railW - 1.2) / 2;
    box(hb, 0.5, 0.45, 0.5, px, y1 + sl, zf - 0.3, MOD.char);
    const sp = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), MOD.shrub); sp.position.set(px, y1 + sl + 0.85, zf - 0.3); sp.scale.y = 1.3; sp.castShadow = true; hb.add(sp);
  }
  // second slab with warm wood soffit + down-lights
  box(hb, bw + 0.2, sl, bd + 0.3, 0, y2, z0 + bd / 2 + 0.15, MOD.white);
  box(hb, bw - 0.4, 0.04, 1.7, 0, y2 - 0.04, zf - 0.6, wood, false);
  for (let k = 0; k < 4; k++) instMarker(hb, 'dl', M.lamp, 0.2, 0.03, 0.2, -bw * 0.36 + k * bw * 0.24, y2 - 0.07, zf - 0.6);
  // tall jaali panel standing proud of the facade
  const jx = mir * (bw / 2 - 0.85);
  faceBox(hb, 1.5, fl + sl + 2.6, 0.35, jx, y1 + sl * 0.5, zf + 0.35, MOD.white, MOD.jaali);
  // tall wood-clad strip with dark glazing on the other side, held by a white frame
  const sx = -mir * (bw / 2 - 0.55);
  box(hb, 1.1, top - pl, 0.3, sx, pl, zf + 0.05, wood);
  windowMeshes.push(box(hb, 0.5, top - pl - 1.0, 0.06, sx, pl + 0.5, zf + 0.22, MOD.darkGlass, false));
  box(hb, 0.25, top + 0.9, 0.5, -mir * (bw / 2 - 0.02), 0, zf + 0.1, MOD.white);
  // roof: partial second floor (stair + room) with a cantilevered frame + parapet
  const rw = bw * 0.6, rx = -mir * (bw / 2 - rw / 2), rd = Math.min(bd * 0.55, 7);
  box(hb, rw, 3.0, rd, rx, top, z0 + rd / 2, MOD.white2);
  windowMeshes.push(box(hb, rw * 0.5, 1.8, 0.06, rx, top + 0.6, z0 + rd + 0.03, M.glass, false));
  box(hb, rw + 0.5, 0.45, rd + 1.4, rx, top + 3.0, z0 + rd / 2 + 0.6, MOD.white);
  box(hb, rw + 0.1, 0.04, 1.3, rx, top + 2.96, z0 + rd + 0.6, wood, false);
  for (let k = 0; k < 3; k++) instMarker(hb, 'dl', M.lamp, 0.18, 0.03, 0.18, rx - rw / 3 + k * rw / 3, top + 2.93, z0 + rd + 0.6);
  box(hb, bw, 0.9, 0.18, 0, top, zf - 0.09, MOD.white);
  box(hb, 0.18, 0.9, bd, mir * (bw / 2 - 0.09), top, z0 + bd / 2, MOD.white);
  box(hb, bw + 0.02, 0.06, 0.24, 0, top + 0.9, zf - 0.09, MOD.char, false);
  box(hb, bw - 0.3, 0.05, bd - 0.3, 0, top + 0.02, z0 + bd / 2, MOD.grey, false);

  // garden + car
  if (W - bw > 4) tree(g, hx + bw / 2 + (W - bw) / 2, z0 + bd / 2, 0.9, idx + 1);
  tree(g, gateX + mir * (gateW / 2 + 1.2), D / 2 - 1.4, 0.55, idx);
  if (idx % 2 === 1) car(g, gateX, D / 2 - front / 2 + 0.1, 0, ['#E6E6E6', '#2E4A6B', '#3A3A3A', '#B23A3A', '#C9B79C'][idx % 5]);

  g.position.set(X(p.x + p.w / 2), 0.06, Z(p.y + p.h / 2));
  g.rotation.y = p.face === 'S' ? 0 : p.face === 'N' ? Math.PI : p.face === 'E' ? Math.PI / 2 : -Math.PI / 2;
  scene.add(g); STYLE.modern.push(g);
  harvestMarkers(g);
  p.top = Math.max(p.top || 0, top + 3.5);
}

function modernGate() {
  const { x0, gz, hr } = GATE;
  const G = new THREE.Group();
  G.position.set(x0 - 4, 0, gz); G.rotation.y = -Math.PI / 2; scene.add(G); STYLE.modern.push(G);
  // sliding gate leaves (horizontal weathered planks in a charcoal frame)
  // two leaves slid open along the inside of the pylons, so the road stays clear
  const gh = 2.4;
  MOD.gate.map.repeat.set(hr / 2.5, 1.2);
  for (const s of [-1, 1]) {
    const cx = s * (hr + hr / 2 + 0.1), lz = s < 0 ? -1.0 : -1.35;
    box(G, hr, gh, 0.14, cx, 0.12, lz, MOD.gate);
    box(G, hr, 0.1, 0.2, cx, gh + 0.12, lz, MOD.char, false);
    for (const xx of [cx - hr / 2, cx + hr / 2]) box(G, 0.12, gh, 0.2, xx, 0.12, lz, MOD.char, false);
  }
  box(G, 2 * hr, 0.03, 0.2, 0, 0, -1.2, MOD.char, false);
  // left: open louvered pylon frame
  const lx0 = -hr - 0.2, lx1 = -hr - 3.0, lh = 6.4, ld = 1.6, lc = (lx0 + lx1) / 2, lw = lx0 - lx1;
  box(G, 0.4, lh, ld, lx0 - 0.2, 0, 0, MOD.white2);
  box(G, 0.4, lh, ld, lx1 + 0.2, 0, 0, MOD.white2);
  box(G, lw, 0.4, ld, lc, 0, 0, MOD.white2);
  for (let y = 0.8; y < lh - 0.3; y += 0.42) instMarker(G, 'louv', MOD.char, lw - 0.8, 0.1, ld - 0.4, lc, y, 0);
  // sloping cantilever beam (white band) from the left pylon over the road to the name pylon
  const bt = 0.95, y0 = lh, yHi = 8.3, xa = lx1, xb = -hr * 0.15, xc = hr * 0.6, xd = hr + 1.6;
  const sh = new THREE.Shape();
  sh.moveTo(xa, y0); sh.lineTo(xb, y0); sh.lineTo(xc, yHi); sh.lineTo(xd, yHi);
  sh.lineTo(xd, yHi + bt); sh.lineTo(xc - 0.25, yHi + bt); sh.lineTo(xb - 0.25, y0 + bt); sh.lineTo(xa, y0 + bt); sh.lineTo(xa, y0);
  const beam = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 2.2, bevelEnabled: false }), MOD.white);
  beam.position.z = -1.1; beam.castShadow = true; beam.receiveShadow = true; G.add(beam);
  // pergola fins hanging under the level part of the beam
  for (let x = xa + 0.4; x < xb - 0.2; x += 0.38) instMarker(G, 'perg', MOD.char, 0.1, 0.75, 2.0, x, y0 - 0.75, 0);
  box(G, xb - xa - 0.4, 0.08, 2.0, (xa + xb) / 2 + 0.2, y0 - 0.83, 0, MOD.char, false);
  // down-lights + night glows under the beam
  for (const [lx, ly] of [[xa + 1.2, y0 - 0.88], [(xa + xb) / 2, y0 - 0.88], [xb - 0.6, y0 - 0.88], [xc + 0.7, yHi - 0.04]]) {
    box(G, 0.25, 0.04, 0.25, lx, ly, 0, M.lamp, false);
    const v = new THREE.Vector3(lx, ly - 0.2, 0); G.localToWorld(v);
    const halo = new THREE.Sprite(haloMat); halo.scale.set(3, 3, 1); halo.position.copy(v); scene.add(halo); lightGlows.push(halo); STYLE.modern.push(halo);
  }
  // right: tall grey name pylon with a wooden half-round and guard cabin window
  const px = hr + 1.9, pw = 3.4, ph = 10.2, pd = 2.3;
  box(G, pw, ph, pd, px, 0, 0, MOD.pylon);
  box(G, pw + 0.1, 0.12, pd + 0.1, px, ph, 0, MOD.char, false);
  const arcS = new THREE.Shape(); const ar = 2.05;
  arcS.moveTo(0, -ar); arcS.absarc(0, 0, ar, -Math.PI / 2, Math.PI / 2, false); arcS.lineTo(0, -ar);
  const arc = new THREE.Mesh(new THREE.ExtrudeGeometry(arcS, { depth: pd + 0.12, bevelEnabled: false, curveSegments: 32 }), MOD.woods[0]);
  arc.position.set(hr + 0.2, 3.6, -(pd + 0.12) / 2); arc.castShadow = true; G.add(arc);
  box(G, 1.3, 1.5, pd + 0.2, px + 0.7, 2.9, 0, MOD.white);
  windowMeshes.push(box(G, 0.9, 0.9, pd + 0.26, px + 0.7, 3.2, 0, M.glass, false));
  // name: metal letters on both faces
  const nameTex = canvasTex(512, 384, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 118px Mukta, Rajdhani, sans-serif'; g.fillText('सूर्य कुंज', w / 2, h * 0.36);
    g.font = '600 56px Mukta, Rajdhani, sans-serif'; g.fillText('आवासीय योजना', w / 2, h * 0.76);
  });
  const nameMat = new THREE.MeshStandardMaterial({ map: nameTex, transparent: true, emissive: '#FFFFFF', emissiveMap: nameTex, emissiveIntensity: 0.15, depthWrite: false });
  MOD_NIGHT.push((t) => { nameMat.emissiveIntensity = 0.15 + t * 0.9; });
  for (const fz of [1, -1]) {
    const np = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 2.3), nameMat);
    np.position.set(px + 0.05, 8.0, fz * (pd / 2 + 0.03)); if (fz < 0) np.rotation.y = Math.PI; G.add(np);
  }
  // curved planter with flowers at the pylon base (outside)
  const pr = 1.9;
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(pr, pr, 0.6, 28, 1, false, 0, Math.PI), MOD.white);
  pot.position.set(px - 0.4, 0.3, pd / 2); pot.castShadow = true; G.add(pot);
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(pr - 0.15, pr - 0.15, 0.62, 28, 1, false, 0, Math.PI), MOD.shrub);
  soil.position.set(px - 0.4, 0.33, pd / 2); G.add(soil);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI, rr = 0.4 + ((i * 37) % 10) / 10 * (pr - 0.7);
    instMarker(G, i % 3 ? 'flw' : 'flw2', i % 3 ? MOD.flower : MOD.flower2, 0.32, 0.25, 0.32, px - 0.4 + Math.sin(a) * rr * 0.98, 0.62, pd / 2 + Math.cos(a) * rr * 0.98, domeGeo);
  }
  harvestMarkers(G);
}

function buildModern() {
  if (modernBuilt) return;
  modernBuilt = true;
  modMaterials();
  INST_LAYER = 'M:';
  plots.forEach((p, i) => modernHouse(p, i));
  modernGate();
  INST_LAYER = '';
  buildInstances();
  labels.children.forEach((sp, i) => { sp.position.y = plots[i].top + 1.2; });
  applyNight(nightT);
}
let STYLE_NOW = 'ayodhya';
function setStyle(name) {
  name = name === 'modern' ? 'modern' : 'ayodhya';
  const sw0 = document.getElementById('styleSw');
  if (name === 'modern' && !modernBuilt && sw0 && !sw0.dataset.busy) {
    // first switch builds the modern houses: show a busy state, then build on the next frame
    sw0.dataset.busy = '1'; sw0.setAttribute('aria-busy', 'true'); sw0.setAttribute('aria-checked', 'true');
    document.body.classList.add('building');
    setTimeout(() => { setStyle(name); delete sw0.dataset.busy; sw0.removeAttribute('aria-busy'); document.body.classList.remove('building'); }, 60);
    return;
  }
  const drainWas = DR.on;
  if (drainWas) setDrainage(false);
  if (name === 'modern') buildModern();
  STYLE.ayodhya.forEach((o) => { o.visible = name === 'ayodhya'; });
  STYLE.modern.forEach((o) => { o.visible = name === 'modern'; });
  if (drainWas) setDrainage(true);
  STYLE_NOW = name;
  try { localStorage.setItem('sk-style', name); } catch (e) {}
  const sw = document.getElementById('styleSw');
  if (sw) sw.setAttribute('aria-checked', String(name === 'modern'));
  lastActive = performance.now();
}
window.__setStyle = setStyle;
window.__look = (px, py, pz, tx, ty, tz) => { camera.position.set(px, py, pz); controls.target.set(tx, ty, tz); controls.update(); lastActive = performance.now(); };
window.__plots = plots;

// ---------------- camera presets ----------------
const presets = {
  aerial: { pos: [-125, 85, -85], target: [0, 0, 0] },
  top: { pos: [0, 210, 0.01], target: [0, 0, 0] },
  street: { pos: [X(-20), 1.7, Z(MAIN.y + MAIN.h / 2) + 1.2], target: [X(300), 1.6, Z(MAIN.y + MAIN.h / 2)], noFit: true },
  gate: { pos: [X(SITE.x) - 48, 8, Z(MAIN.y + MAIN.h / 2) + 16], target: [X(SITE.x) - 4, 9.5, Z(MAIN.y + MAIN.h / 2)] },
  park: { pos: [4, 24, 22], target: [4, 0, -12.7] },
  drain: { pos: [-70, 120, 120], target: [-48, -2, -4] },
};
let tween = null;
function fitPos(p) {
  const v = new THREE.Vector3(...p.pos), t = new THREE.Vector3(...p.target);
  const a = camera.aspect;
  if (a < 1.2 && !p.noFit) { const f = Math.min(2.2, 1.2 / Math.max(a, 0.4)); v.sub(t).multiplyScalar(f).add(t); }
  return v;
}
function goTo(name) {
  const p = presets[name];
  tween = { t: 0, fromPos: camera.position.clone(), toPos: fitPos(p), fromT: controls.target.clone(), toT: new THREE.Vector3(...p.target) };
  controls.maxPolarAngle = name === 'street' ? Math.PI * 0.62 : Math.PI * 0.48;
  controls.minDistance = name === 'street' ? 0.5 : 8;
}
camera.position.set(...presets.aerial.pos);
controls.target.set(...presets.aerial.target);

// ---------------- UI ----------------
const $ = (id) => document.getElementById(id);
function setActive(group, btn) { document.querySelectorAll(`[data-group="${group}"]`).forEach((b) => b.setAttribute('aria-pressed', String(b === btn))); }
document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => { goTo(b.dataset.view); setActive('view', b); controls.autoRotate = false; $('rot').setAttribute('aria-pressed', 'false'); }));
$('day').addEventListener('click', (e) => { nightTarget = 0; setActive('time', e.currentTarget); });
$('night').addEventListener('click', (e) => { nightTarget = 1; setActive('time', e.currentTarget); });
$('rot').addEventListener('click', (e) => { controls.autoRotate = !controls.autoRotate; e.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate)); });
$('nums').addEventListener('click', (e) => { labels.visible = !labels.visible; e.currentTarget.setAttribute('aria-pressed', String(labels.visible)); });
function setInfo(open) { const p = $('panel'); if (open) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); $('info').setAttribute('aria-expanded', String(open)); $('info').setAttribute('aria-pressed', String(open)); }
$('info').addEventListener('click', () => setInfo($('panel').hasAttribute('hidden')));
$('panelX').addEventListener('click', () => setInfo(false));
$('drainMin').addEventListener('click', (e) => { const p = $('drainPanel'); const min = !p.classList.contains('min'); p.classList.toggle('min', min); e.currentTarget.textContent = min ? '+' : '–'; e.currentTarget.setAttribute('aria-expanded', String(!min)); });
// ---- navigation pad (hold to repeat) & keyboard
const BOUND = { x0: X(SITE.x) - 60, x1: X(SITE.x + SITE.w) + 20, z0: Z(SITE.y) - 40, z1: Z(SITE.y + SITE.h) + 40 };
function stopHold() { clearInterval(hold); hold = null; }
window.addEventListener('blur', () => stopHold());
document.addEventListener('visibilitychange', () => { if (document.hidden) stopHold(); clock.getDelta(); });
function goHome() {
  stopHold();
  if (DR.on) setDrainage(false);
  controls.autoRotate = false; $('rot').setAttribute('aria-pressed', 'false');
  goTo('aerial'); setActive('view', document.querySelector('[data-view="aerial"]'));
}
function clampTarget() {
  const t = controls.target, dx = THREE.MathUtils.clamp(t.x, BOUND.x0, BOUND.x1) - t.x, dz = THREE.MathUtils.clamp(t.z, BOUND.z0, BOUND.z1) - t.z;
  if (dx || dz) { t.x += dx; t.z += dz; camera.position.x += dx; camera.position.z += dz; }
  if (camera.position.y < 0.8) camera.position.y = 0.8;
}
controls.addEventListener('change', clampTarget);
const sph = new THREE.Spherical(), off = new THREE.Vector3();
function navAct(act, k) {
  if (glDead()) return;
  tween = null; controls.autoRotate = false; $('rot').setAttribute('aria-pressed', 'false');
  off.copy(camera.position).sub(controls.target); sph.setFromVector3(off);
  const dist = sph.radius;
  if (act === 'zoom-in' || act === 'zoom-out') {
    sph.radius = THREE.MathUtils.clamp(dist * (act === 'zoom-in' ? 1 - 0.08 * k : 1 + 0.08 * k), controls.minDistance, controls.maxDistance);
  } else if (act === 'rot-l' || act === 'rot-r') {
    sph.theta += (act === 'rot-l' ? 1 : -1) * 0.06 * k;
  } else if (act === 'tilt-up' || act === 'tilt-down') {
    sph.phi = THREE.MathUtils.clamp(sph.phi + (act === 'tilt-up' ? -1 : 1) * 0.03 * k, 0.05, controls.maxPolarAngle);
  } else if (act.startsWith('pan')) {
    const fwd = new THREE.Vector3(); camera.getWorldDirection(fwd); fwd.y = 0; if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1); fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
    const step = Math.max(0.6, dist * 0.025) * k;
    const v = act === 'pan-f' ? fwd : act === 'pan-b' ? fwd.clone().negate() : act === 'pan-l' ? right.clone().negate() : right;
    controls.target.addScaledVector(v, step);
  }
  off.setFromSpherical(sph); camera.position.copy(controls.target).add(off);
  clampTarget(); controls.update();
}
let hold = null;
document.querySelectorAll('.nb[data-act]').forEach((b) => {
  const act = b.dataset.act;
  const start = (e) => {
    e.preventDefault();
    if (act === 'home') { goHome(); return; }
    navAct(act, 1); clearInterval(hold); let n = 0; hold = setInterval(() => { n++; navAct(act, Math.min(2, 0.6 + n * 0.08)); }, 40);
  };
  const stop = () => { clearInterval(hold); hold = null; };
  b.addEventListener('pointerdown', (e) => { try { b.setPointerCapture(e.pointerId); } catch (_) {} start(e); });
  b.addEventListener('pointerup', stop); b.addEventListener('pointercancel', stop); b.addEventListener('lostpointercapture', stop);
  b.addEventListener('contextmenu', (e) => e.preventDefault());
  b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (act === 'home') start(e); else navAct(act, 2); } });
});
window.addEventListener('keydown', (e) => {
  if (glDead()) return;
  if (e.target.closest && e.target.closest('button,input,textarea')) return;
  const map = { ArrowUp: 'pan-f', ArrowDown: 'pan-b', ArrowLeft: 'pan-l', ArrowRight: 'pan-r', '+': 'zoom-in', '=': 'zoom-in', '-': 'zoom-out', q: 'rot-l', e: 'rot-r', Q: 'rot-l', E: 'rot-r' };
  if (map[e.key]) { e.preventDefault(); navAct(map[e.key], 1.5); }
});
$('drainBtn').addEventListener('click', () => { const on = !DR.on; setDrainage(on); if (on) { goTo('drain'); setActive('view', null); } });
document.querySelectorAll('[data-sys]').forEach((b) => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on));
  DR.sys[b.dataset.sys].forEach((m) => { m.visible = on; });
}));
if (location.hash === '#drainage') { setDrainage(true); camera.position.set(...presets.drain.pos); controls.target.set(...presets.drain.target); }
const gfxBtn = $('gfx');
function setGfx(low) {
  LOW = low; try { localStorage.setItem('sk-gfx', low ? 'low' : 'high'); } catch (e) {}
  renderer.setPixelRatio(pixelRatio()); resize();
  renderer.shadowMap.enabled = !low; sun.castShadow = !low;
  scene.traverse((o) => { if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((mm) => { mm.needsUpdate = true; }); } });
  gfxBtn.setAttribute('aria-pressed', String(low)); lastActive = performance.now();
}
gfxBtn.setAttribute('aria-pressed', String(LOW));
gfxBtn.addEventListener('click', () => setGfx(!LOW));
// design switch: traditional (Ayodhya) ⇄ modern
{
  const sw = $('styleSw');
  let want = 'ayodhya';
  try { want = localStorage.getItem('sk-style') || 'ayodhya'; } catch (e) {}
  const q = new URLSearchParams(location.search).get('design');
  if (q === 'modern' || q === 'traditional') want = q === 'modern' ? 'modern' : 'ayodhya';
  if (location.hash === '#video') want = 'ayodhya';
  if (sw) sw.addEventListener('click', () => setStyle(STYLE_NOW === 'modern' ? 'ayodhya' : 'modern'));
  if (want === 'modern') setStyle('modern');
}
renderer.domElement.addEventListener('webglcontextlost', () => { stopHold(); if (window.__fallback) window.__fallback('lost'); });
// toolbar: show a fade when more buttons are hidden to the right
const barEl = document.querySelector('.bar');
function barFade() { barEl.classList.toggle('more', barEl.scrollWidth - barEl.clientWidth - barEl.scrollLeft > 4); }
barEl.addEventListener('scroll', barFade, { passive: true }); window.addEventListener('resize', barFade); setTimeout(barFade, 300);
controls.autoRotateSpeed = 0.6;

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();
if (location.hash !== '#drainage' && location.hash !== '#video') camera.position.copy(fitPos(presets.aerial));

const clock = new THREE.Clock();
let lastActive = performance.now(), lastRender = 0;
['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, () => { lastActive = performance.now(); }, { passive: true }));
function loop() {
  if (glDead()) return; // fallback shown: stop the render loop
  const dt = Math.min(clock.getDelta(), 0.05);
  if (Math.abs(nightT - nightTarget) > 0.001) { nightT += Math.sign(nightTarget - nightT) * Math.min(Math.abs(nightTarget - nightT), dt * 1.2); applyNight(nightT); }
  if (tween) {
    if (tween.t0 === undefined) tween.t0 = performance.now();
    tween.t = Math.min(1, (performance.now() - tween.t0) / 1600);
    const e = tween.t < 0.5 ? 2 * tween.t * tween.t : 1 - Math.pow(-2 * tween.t + 2, 2) / 2;
    camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
    controls.target.lerpVectors(tween.fromT, tween.toT, e);
    if (tween.t >= 1) tween = null;
  }
  animateDrainage(dt);
  const moving = controls.update();
  const busy = moving || tween || hold || controls.autoRotate || DR.on || Math.abs(nightT - nightTarget) > 0.001;
  const now = performance.now();
  if (busy) lastActive = now;
  // idle: after 4 s without interaction, render only ~5 frames/s (flags keep moving, GPU rests)
  if (busy || now - lastActive < 4000 || now - lastRender > 200) {
    const tt = clock.elapsedTime; flags.forEach((f, i) => { f.rotation.y = Math.sin(tt * 2.2 + i) * 0.35; });
    try { renderer.render(scene, camera); } catch (e) { console.warn('3D render failed', e); if (window.__fallback) window.__fallback('init'); return; }
    lastRender = now;
  }
  requestAnimationFrame(loop);
}
applyNight(0);

// ---------------- video (walkthrough) mode ----------------
const VIDEO = location.hash === '#video';
if (VIDEO) {
  document.body.classList.add('video');
  sun.shadow.mapSize.set(2048, 2048);
  const K = [
    [0, [-170, 70, 90], [0, 0, 0]],
    [5, [-175, 26, 25], [-90, 8, 3]],
    [10, [-130, 4.2, 4], [-90, 9, 3]],
    [15, [-86, 3.2, 3.2], [-40, 3.2, 3]],
    [21, [-45, 3.4, 4.2], [-5, 3.2, 3]],
    [26, [-25, 5, -0.5], [-22, 5.5, 16]],
    [31, [0, 5.5, -0.5], [6, 5, 16]],
    [36, [22, 24, 2], [2, 1, -13]],
    [41, [-16, 20, 2], [6, 1, -13]],
    [46, [80, 75, 80], [0, 0, 0]],
    [52, [-40, 65, 110], [0, 0, 0]],
    [58, [-130, 50, 65], [-30, 0, 0]],
    [64, [-170, 55, 30], [-40, 0, 0]],
  ];
  const pc = new THREE.CatmullRomCurve3(K.map((k) => new THREE.Vector3(...k[1])), false, 'centripetal');
  const tc = new THREE.CatmullRomCurve3(K.map((k) => new THREE.Vector3(...k[2])), false, 'centripetal');
  const CAPS = [
    [0, 5.5, 'सूर्य कुंज आवासीय योजना', 'ग्राम सरेठी, तहसील सदर, अयोध्या · ADA से ले-आउट स्वीकृत'],
    [7, 14, 'मुख्य द्वार', ''],
    [15.5, 23, 'चौड़ी आंतरिक सड़कें', ''],
    [24, 32, 'कॉन्सेप्ट घर', 'हम प्लॉट देते हैं · पसंद आए तो ऐसा घर बनवा सकते हैं'],
    [33.5, 41, 'सेंट्रल पार्क', 'वॉकिंग ट्रैक, फव्वारा, छतरी मंडप व बच्चों का कोना'],
    [42, 48.5, '42 आवासीय प्लॉट', 'लगभग 921 से 1500 वर्ग फ़ुट तक'],
    [50, 57.6, 'रात में जगमगाती कॉलोनी', 'सूर्य कुंज आवासीय योजना · अयोध्या'],
  ];
  const cap = document.getElementById('cap'), capT = document.getElementById('capT'), capS = document.getElementById('capS');
  const smooth = (x) => x * x * (3 - 2 * x);
  window.__frame = (t) => {
    let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
    const f = THREE.MathUtils.clamp((t - K[i][0]) / (K[i + 1][0] - K[i][0]), 0, 1);
    const u = (i + f) / (K.length - 1);
    camera.position.copy(pc.getPoint(u)); camera.lookAt(tc.getPoint(u));
    applyNight(smooth(THREE.MathUtils.clamp((t - 46) / 4, 0, 1)));
    flags.forEach((fl, j) => { fl.rotation.y = Math.sin(t * 2.2 + j) * 0.35; });
    const c = CAPS.find((c) => t >= c[0] && t <= c[1]);
    if (c) {
      capT.textContent = c[2]; capS.textContent = c[3];
      const a = Math.min(1, (t - c[0]) / 0.6, (c[1] - t) / 0.6);
      cap.style.opacity = String(Math.max(0, a));
    } else cap.style.opacity = '0';
    const endEl = document.getElementById('end');
    endEl.style.opacity = String(THREE.MathUtils.clamp((t - 58.2) / 0.7, 0, 1));
    renderer.render(scene, camera);
  };
}
if (!VIDEO) loop();

// redraw text textures once web fonts arrive
if (document.fonts && document.fonts.ready) {
  Promise.all([document.fonts.load('700 92px Rajdhani'), document.fonts.load('700 60px Rajdhani')]).catch(() => {}).then(() => {
    const t = window.__signTex; const c = t.image; const g = c.getContext('2d');
    g.fillStyle = '#6E2A26'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = '#D8AE4F'; g.lineWidth = 8; g.strokeRect(10, 10, c.width - 20, c.height - 20);
    g.fillStyle = '#F2C55C'; g.font = '700 88px Rajdhani, Mukta, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('सूर्य कुंज आवासीय योजना', c.width / 2, c.height / 2 + 6);
    t.needsUpdate = true;
  });
}
window.__jump = (n) => { const p = presets[n]; tween = null; camera.position.set(...p.pos); controls.target.set(...p.target); controls.maxPolarAngle = Math.PI * 0.62; controls.minDistance = 0.5; };
window.__nav = navAct; window.__cam = camera;
window.__ready = true;
