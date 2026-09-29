// Pixel-art "Under the Sea" scene — converted from PixelArtSea.tsx (React) to
// plain JS. Same drawing routines, drawn once onto a small 320x180 canvas
// and scaled up crisply with image-rendering: pixelated.

const IW = 320;
const IH = 180;

const R = (ctx, x, y, w, h, c) => {
  ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w, h)
}
const P = (ctx, x, y, c) => R(ctx, x, y, 1, 1, c)
const DITH = (ctx, x, y, w, h, c1, c2) => {
  for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) {
    ctx.fillStyle = (dx + dy) % 2 === 0 ? c1 : c2
    ctx.fillRect((x + dx) | 0, (y + dy) | 0, 1, 1)
  }
}
const DISK = (ctx, cx, cy, r, c) => {
  if (r <= 0) return
  ctx.fillStyle = c
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(Math.max(0, r * r - y * y)))
    ctx.fillRect((cx - w) | 0, (cy + y) | 0, w * 2 + 1, 1)
  }
}
const HDISK = (ctx, cx, cy, r, c) => {
  if (r <= 0) return
  ctx.fillStyle = c
  for (let y = -r; y <= 0; y++) {
    const w = Math.floor(Math.sqrt(Math.max(0, r * r - y * y)))
    ctx.fillRect((cx - w) | 0, (cy + y) | 0, w * 2 + 1, 1)
  }
}
const LINE = (ctx, x0, y0, x1, y1, c) => {
  ctx.fillStyle = c
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
  let err = dx - dy, cx = x0 | 0, cy = y0 | 0
  while (true) {
    ctx.fillRect(cx, cy, 1, 1)
    if (cx === (x1 | 0) && cy === (y1 | 0)) break
    const e2 = 2 * err
    if (e2 > -dy) { err -= dy; cx += sx }
    if (e2 < dx) { err += dx; cy += sy }
  }
}

function drawScene(ctx) {
  // ── 1. WATER DEPTH GRADIENT ─────────────────────────────────────────────
  R(ctx, 0, 0, IW, 2, '#00FFFF')
  DITH(ctx, 0, 2, IW, 2, '#00FFFF', '#00DDEE')
  R(ctx, 0, 4, IW, 4, '#00CCDD')
  DITH(ctx, 0, 8, IW, 3, '#00CCDD', '#00AABB')
  R(ctx, 0, 11, IW, 5, '#0099BB')
  DITH(ctx, 0, 16, IW, 3, '#0099BB', '#0077AA')
  R(ctx, 0, 19, IW, 7, '#0077AA')
  DITH(ctx, 0, 26, IW, 4, '#0077AA', '#005588')
  R(ctx, 0, 30, IW, 8, '#005588')
  DITH(ctx, 0, 38, IW, 4, '#005588', '#004477')
  R(ctx, 0, 42, IW, 9, '#004477')
  DITH(ctx, 0, 51, IW, 5, '#004477', '#003366')
  R(ctx, 0, 56, IW, 10, '#003366')
  DITH(ctx, 0, 66, IW, 5, '#003366', '#002255')
  R(ctx, 0, 71, IW, 12, '#002255')
  DITH(ctx, 0, 83, IW, 5, '#002255', '#001A44')
  R(ctx, 0, 88, IW, 14, '#001A44')
  DITH(ctx, 0, 102, IW, 6, '#001A44', '#001133')
  R(ctx, 0, 108, IW, 15, '#001133')
  DITH(ctx, 0, 123, IW, 6, '#001133', '#000C22')
  R(ctx, 0, 129, IW, 14, '#000C22')
  DITH(ctx, 0, 143, IW, 6, '#000C22', '#000811')
  R(ctx, 0, 149, IW, 31, '#000811')

  // ── 2. LIGHT RAYS ────────────────────────────────────────────────────────
  const rays = [
    { tx: 30, bx: 58, w: 4 },
    { tx: 88, bx: 112, w: 7 },
    { tx: 148, bx: 170, w: 5 },
    { tx: 208, bx: 226, w: 4 },
    { tx: 268, bx: 284, w: 6 },
  ]
  for (const ray of rays) {
    for (let y = 0; y < 138; y++) {
      const t = y / 138
      const rx = Math.round(ray.tx + (ray.bx - ray.tx) * t)
      const rw = Math.max(1, Math.round(ray.w * (1 - t * 0.25)))
      const col =
        y < 8 ? '#66FFFF' : y < 20 ? '#44EEFF' : y < 40 ? '#33CCEE' :
        y < 65 ? '#22AACC' : y < 90 ? '#118899' :
        y < 115 ? '#007788' : '#006677'
      if (t < 0.9 && (t < 0.55 || y % 2 === 0)) {
        ctx.fillStyle = col
        ctx.fillRect(rx, y, rw, 1)
      }
    }
  }

  // ── 3. BACKGROUND SILHOUETTES (depth layers) ─────────────────────────────
  R(ctx, 0, 118, 38, 62, '#00080E')
  // Large coral silhouette far left
  for (let y = 0; y < 30; y++) {
    const xw = Math.floor(Math.sqrt(Math.max(0, 28 * 28 - (y - 28) * (y - 28))))
    R(ctx, 58 - xw, 120 + y, xw * 2, 1, '#00090F')
  }
  // Kelp silhouette far right
  for (let i = 0; i < 9; i++) {
    const sx = 272 + i * 6
    let cc = sx
    for (let y = 168; y > 60; y--) {
      ctx.fillStyle = '#00090D'
      ctx.fillRect(cc, y, 2, 1)
      if (y % 9 === 0) cc = sx + (y % 18 === 0 ? 2 : -2)
    }
  }

  // ── 4. OCEAN FLOOR ───────────────────────────────────────────────────────
  DITH(ctx, 0, 154, IW, 3, '#A87C22', '#8B6218')
  R(ctx, 0, 157, IW, 8, '#8B6218')
  R(ctx, 0, 165, IW, 15, '#6B4C10')
  // Sand ripple texture
  for (let x = 0; x < IW; x += 7) {
    R(ctx, x, 156 - ((x * 11) % 3), 4, 1, '#C89A2A')
  }
  // Dark sand patches
  for (let x = 8; x < IW; x += 25) {
    R(ctx, x, 160, 10, 3, '#5A4008')
  }

  // ── 5. FLOOR ROCKS ───────────────────────────────────────────────────────
  const rock = (rx, ry, rw, rh) => {
    R(ctx, rx, ry, rw, rh, '#4A3B5A')
    R(ctx, rx + 1, ry, rw - 2, 1, '#7A6B8A')
    R(ctx, rx, ry + rh - 1, rw, 1, '#2A1B3A')
    R(ctx, rx + rw - 1, ry + 1, 1, rh - 1, '#3A2B4A')
  }
  rock(5, 149, 30, 11); rock(280, 148, 38, 13); rock(196, 151, 24, 8)
  rock(74, 151, 18, 7); rock(132, 153, 14, 6)

  // ── 6. SEAWEED FOREST ────────────────────────────────────────────────────
  const seaweed = (sx, baseY, height) => {
    let cc = sx
    for (let y = baseY; y > baseY - height; y--) {
      const phase = baseY - y
      if (phase > 0 && phase % 9 === 0) cc = sx + (Math.sin(phase * 0.35) > 0 ? 2 : -2)
      R(ctx, cc, y, 2, 1, '#117722')
      P(ctx, cc + 1, y, '#44EE55')
      if (phase % 11 === 5) {
        const lx = cc + (cc > sx ? -5 : 2)
        R(ctx, lx, y, 5, 2, '#00AA33')
        R(ctx, lx + 1, y, 3, 1, '#33DD44')
      }
    }
  }
  seaweed(120, 154, 56); seaweed(128, 154, 66); seaweed(136, 154, 48)
  seaweed(144, 154, 73); seaweed(152, 154, 59); seaweed(159, 154, 63)
  seaweed(166, 154, 50); seaweed(173, 154, 44)

  // ── 7. BRANCHING RED CORAL (left) ────────────────────────────────────────
  const branch = (x0, y0, x1, y1, w) => {
    const ddx = x1 - x0, ddy = y1 - y0
    const len = Math.ceil(Math.sqrt(ddx * ddx + ddy * ddy))
    for (let i = 0; i < len; i++) {
      const t = i / len
      const bx = (x0 + ddx * t) | 0, by = (y0 + ddy * t) | 0
      R(ctx, bx - Math.ceil(w / 2), by, w, 1, '#CC1133')
      P(ctx, bx - Math.ceil(w / 2), by, '#FF2244')
    }
  }
  branch(32, 156, 30, 132, 3); branch(30, 132, 28, 110, 3)
  branch(28, 110, 15, 92, 2);  branch(15, 92, 9, 76, 1); branch(15, 92, 22, 82, 1)
  branch(28, 110, 43, 94, 2);  branch(43, 94, 38, 79, 1); branch(43, 94, 53, 83, 1)
  branch(53, 83, 48, 70, 1);   branch(53, 83, 61, 76, 1)
  branch(9, 76, 7, 65, 1);     branch(9, 76, 15, 68, 1)
  branch(22, 82, 18, 70, 1);   branch(38, 79, 33, 68, 1)
  branch(48, 70, 43, 60, 1);   branch(61, 76, 58, 65, 1); branch(61, 76, 67, 68, 1)
  for (const [tx, ty] of [[7,65],[15,68],[18,70],[33,68],[43,60],[58,65],[67,68]]) {
    DISK(ctx, tx, ty, 2, '#FF5566'); P(ctx, tx, ty - 1, '#FFAABB')
  }

  // ── 8. BRAIN CORAL ───────────────────────────────────────────────────────
  const BCX = 90, BCY = 153, BCR = 19
  HDISK(ctx, BCX, BCY, BCR, '#CC2233')
  HDISK(ctx, BCX, BCY, BCR - 3, '#DD3344')
  HDISK(ctx, BCX, BCY, BCR - 7, '#EE4455')
  // maze-like grooves
  for (let y = BCY - BCR; y < BCY; y += 3) {
    const xw = Math.floor(Math.sqrt(Math.max(0, BCR * BCR - (y - BCY) * (y - BCY)))) - 1
    for (let x = BCX - xw; x < BCX + xw; x++) {
      if ((x + y * 2) % 5 < 1) P(ctx, x, y, '#881122')
      else if ((x + y * 2) % 5 < 2) P(ctx, x, y, '#BB1133')
    }
  }
  HDISK(ctx, BCX - 6, BCY - 10, 5, '#FF6677')
  R(ctx, BCX - BCR, BCY, BCR * 2 + 1, 3, '#551122')

  // ── 9. FAN CORAL (right) ─────────────────────────────────────────────────
  const fanBase = [252, 158]
  const fanBranches = [
    [220, 108], [228, 99], [238, 93], [249, 89], [259, 92], [268, 101], [276, 113]
  ]
  for (const [ex, ey] of fanBranches) LINE(ctx, fanBase[0], fanBase[1], ex, ey, '#DD2288')
  // sub-branches
  const fanSub = [
    [228,130,222,116],[228,130,235,119],[238,120,231,108],[238,120,244,111],
    [249,114,243,100],[249,114,255,103],[259,118,253,106],[259,118,265,109],
    [238,93,231,78],[249,89,243,74],[249,89,255,76]
  ]
  for (const [x0, y0, x1, y1] of fanSub) LINE(ctx, x0, y0, x1, y1, '#CC1177')
  for (const [x0, y0, x1, y1] of [[238,93,231,78],[249,89,243,74],[249,89,255,76]])
    LINE(ctx, x0, y0, x1, y1, '#FF44AA')
  for (const [px, py] of [[220,108],[228,99],[238,93],[249,89],[259,92],[268,101],[276,113],
    [222,116],[235,119],[231,108],[244,111],[243,100],[255,103],[253,106],[265,109],
    [231,78],[243,74],[255,76]])
    P(ctx, px, py, '#FF88CC')

  // ── 10. TUBE CORAL CLUSTERS ──────────────────────────────────────────────
  const tube = (tx, ty, th, c, ct) => {
    R(ctx, tx, ty, 3, th, c)
    R(ctx, tx + 1, ty, 1, th, ct)
    DISK(ctx, tx + 1, ty, 2, ct)
    R(ctx, tx, ty + 2, 3, th - 2, c)
  }
  tube(108, 148, 12, '#0099BB', '#00DDFF'); tube(113, 151, 9, '#0077AA', '#00CCEE')
  tube(118, 144, 15, '#009ABB', '#00EEFF')
  tube(193, 149, 11, '#CC3388', '#FF66BB'); tube(197, 152, 8, '#AA2266', '#EE55AA')
  tube(201, 147, 13, '#CC3388', '#FF77CC')
  tube(226, 151, 9, '#FF8833', '#FFCC66'); tube(230, 154, 7, '#DD6622', '#FFAA44')

  // ── 11. STONE RUINS ──────────────────────────────────────────────────────
  // Column 1 (intact)
  R(ctx, 182, 120, 8, 37, '#666677')
  R(ctx, 181, 117, 10, 4, '#888899'); R(ctx, 180, 115, 12, 3, '#AAAAAA')
  R(ctx, 181, 157, 10, 2, '#555566')
  for (let y = 123; y < 154; y += 3) { P(ctx, 183, y, '#888899'); P(ctx, 185, y, '#888899'); P(ctx, 187, y, '#888899') }
  for (let y = 125; y < 152; y += 8) { R(ctx, 182, y, 3, 2, '#446644'); R(ctx, 186, y + 4, 2, 2, '#335533') }
  // Column 2 (broken)
  R(ctx, 210, 132, 8, 26, '#666677'); R(ctx, 209, 129, 10, 4, '#888899'); R(ctx, 208, 128, 12, 2, '#999999')
  R(ctx, 209, 158, 10, 2, '#555566')
  LINE(ctx, 212, 132, 214, 148, '#444455')
  R(ctx, 204, 155, 14, 5, '#666677'); R(ctx, 204, 154, 14, 2, '#888899')
  R(ctx, 211, 139, 4, 2, '#446644'); R(ctx, 213, 149, 3, 2, '#335533')
  // Entablature
  R(ctx, 181, 112, 18, 4, '#777788'); R(ctx, 181, 112, 18, 1, '#999999')
  R(ctx, 202, 115, 9, 3, '#555566')

  // ── 12. TREASURE CHEST ───────────────────────────────────────────────────
  const CX = 146, CY = 152
  R(ctx, CX, CY, 20, 10, '#774422')
  R(ctx, CX, CY + 3, 20, 1, '#553311'); R(ctx, CX, CY + 7, 20, 1, '#553311')
  R(ctx, CX, CY, 20, 1, '#CCAA00'); R(ctx, CX, CY + 4, 20, 1, '#CCAA00'); R(ctx, CX, CY + 8, 20, 1, '#CCAA00')
  R(ctx, CX + 8, CY + 3, 4, 3, '#FFDD00'); P(ctx, CX + 9, CY + 4, '#AA8800'); P(ctx, CX + 10, CY + 4, '#AA8800')
  // Lid (ajar)
  R(ctx, CX, CY - 4, 20, 5, '#885533'); R(ctx, CX, CY - 5, 20, 1, '#AA7744')
  R(ctx, CX, CY - 4, 20, 1, '#DDBB66')
  R(ctx, CX + 1, CY - 2, 2, 4, '#AA8800'); R(ctx, CX + 17, CY - 2, 2, 4, '#AA8800')
  // Glow from inside
  R(ctx, CX + 3, CY - 3, 14, 2, '#FFFF88'); R(ctx, CX + 5, CY - 4, 10, 1, '#FFFFAA')
  R(ctx, CX + 7, CY - 5, 6, 1, '#FFFFFF')
  for (let gy = CY - 10; gy < CY - 2; gy++) {
    const gw = Math.max(0, 16 - (CY - gy) * 2)
    if (gw > 0) DITH(ctx, CX + 2, gy, gw, 1, '#775500', '#001133')
  }
  // Spilled coins
  for (const [gx, gy] of [[CX - 3, CY + 9], [CX + 22, CY + 8], [CX - 2, CY + 11], [CX + 23, CY + 10]]) {
    DISK(ctx, gx, gy, 2, '#FFCC00'); P(ctx, gx, gy - 1, '#FFFF44')
  }

  // ── 13. ANGLERFISH ───────────────────────────────────────────────────────
  const AFX = 36, AFY = 133
  DISK(ctx, AFX, AFY, 14, '#0D1E2E'); DISK(ctx, AFX + 4, AFY - 2, 10, '#0D1E2E')
  R(ctx, AFX - 12, AFY - 3, 26, 7, '#0D1E2E'); R(ctx, AFX - 9, AFY + 2, 19, 5, '#162A3A')
  R(ctx, AFX - 14, AFY + 4, 22, 6, '#071018')
  for (let t = AFX - 13; t < AFX + 8; t += 3) { P(ctx, t, AFY + 4, '#DDEEFF'); P(ctx, t + 1, AFY + 9, '#CCDDEE') }
  DISK(ctx, AFX + 8, AFY - 5, 3, '#FFFF22'); DISK(ctx, AFX + 8, AFY - 5, 1, '#000000'); P(ctx, AFX + 7, AFY - 6, '#FFFFFF')
  LINE(ctx, AFX + 10, AFY - 12, AFX + 8, AFY - 20, '#556677')
  LINE(ctx, AFX + 8, AFY - 20, AFX + 14, AFY - 26, '#556677')
  DISK(ctx, AFX + 15, AFY - 27, 3, '#AAFF22'); DISK(ctx, AFX + 15, AFY - 27, 1, '#FFFFFF')
  for (let ld = 1; ld <= 3; ld++) DITH(ctx, AFX + 10, AFY - 32 + ld, 12 - ld * 2, 12 - ld * 2, '#223300', '#001122')
  R(ctx, AFX - 15, AFY - 2, 8, 4, '#0D1E2E')

  // ── 14. SEA TURTLE ───────────────────────────────────────────────────────
  const TUX = 222, TUY = 40
  DISK(ctx, TUX, TUY, 11, '#446633'); R(ctx, TUX - 12, TUY - 8, 24, 16, '#446633')
  for (let sy = -8; sy < 7; sy += 4) for (let sx = -9; sx < 11; sx += 5) R(ctx, TUX + sx, TUY + sy, 3, 3, '#2A4422')
  DISK(ctx, TUX - 3, TUY - 4, 4, '#558844'); P(ctx, TUX - 2, TUY - 5, '#88BB66')
  DISK(ctx, TUX + 13, TUY - 2, 5, '#557733'); P(ctx, TUX + 15, TUY - 3, '#669944')
  P(ctx, TUX + 16, TUY - 4, '#111111'); P(ctx, TUX + 17, TUY - 4, '#FFFFFF')
  R(ctx, TUX - 12, TUY - 13, 11, 5, '#446633'); R(ctx, TUX + 5, TUY - 13, 11, 5, '#446633')
  R(ctx, TUX - 11, TUY + 7, 9, 5, '#446633'); R(ctx, TUX + 7, TUY + 7, 9, 5, '#446633')

  // ── 15. JELLYFISH ────────────────────────────────────────────────────────
  // J1: large purple
  const JX1 = 65, JY1 = 44
  HDISK(ctx, JX1, JY1, 15, '#AA44CC'); HDISK(ctx, JX1, JY1, 12, '#CC55EE')
  HDISK(ctx, JX1, JY1, 7, '#DDAAFF'); R(ctx, JX1 - 15, JY1, 30, 4, '#AA44CC')
  HDISK(ctx, JX1 - 4, JY1 - 5, 5, '#EEBBFF')
  for (let ti = 0; ti < 8; ti++) {
    const tx = JX1 - 13 + ti * 4
    const cols = ['#CC77EE', '#AA55CC', '#EE99FF', '#BB66DD', '#DD88FF', '#9933BB', '#CC77EE', '#EE99FF']
    for (let ts = 0; ts < 28; ts++) P(ctx, tx + Math.round(Math.sin(ts * 0.5 + ti) * 2), JY1 + 4 + ts, cols[ti])
  }
  for (const [sx, sy] of [[JX1-8,JY1-7],[JX1+3,JY1-9],[JX1+8,JY1-5],[JX1-3,JY1-11],[JX1+1,JY1-4]]) DISK(ctx, sx, sy, 1, '#FFCCFF')

  // J2: medium cyan
  const JX2 = 267, JY2 = 63
  HDISK(ctx, JX2, JY2, 11, '#22AAAA'); HDISK(ctx, JX2, JY2, 8, '#33CCCC'); HDISK(ctx, JX2, JY2, 4, '#88FFEE')
  R(ctx, JX2 - 11, JY2, 22, 3, '#22AAAA')
  for (let ti = 0; ti < 6; ti++) {
    const tx = JX2 - 9 + ti * 4
    for (let ts = 0; ts < 22; ts++) P(ctx, tx + Math.round(Math.sin(ts * 0.4 + ti) * 1.5), JY2 + 3 + ts, '#44DDCC')
  }

  // J3: small magenta
  const JX3 = 156, JY3 = 22
  HDISK(ctx, JX3, JY3, 8, '#EE2288'); HDISK(ctx, JX3, JY3, 5, '#FF44AA'); HDISK(ctx, JX3, JY3, 2, '#FFAACC')
  R(ctx, JX3 - 8, JY3, 16, 2, '#EE2288')
  for (let ti = 0; ti < 5; ti++) {
    const tx = JX3 - 6 + ti * 3
    for (let ts = 0; ts < 17; ts++) P(ctx, tx + Math.round(Math.sin(ts * 0.5 + ti) * 1), JY3 + 2 + ts, '#FF66BB')
  }

  // ── 16. SCHOOL OF TROPICAL FISH ──────────────────────────────────────────
  const fish = (fx, fy, flip) => {
    R(ctx, fx, fy, 5, 3, '#FF8800'); P(ctx, fx + 2, fy, '#FF9911')
    R(ctx, fx + 2, fy, 1, 3, '#FFFFFF')
    P(ctx, fx + 3, fy + 1, '#000000'); P(ctx, fx + 3, fy, '#FFFFFF')
    if (!flip) { R(ctx, fx - 2, fy, 2, 3, '#FF6600'); P(ctx, fx - 2, fy + 1, '#FFAA44') }
    else { R(ctx, fx + 5, fy, 2, 3, '#FF6600'); P(ctx, fx + 6, fy + 1, '#FFAA44') }
    R(ctx, fx + 1, fy - 1, 3, 1, '#FF6600')
  }
  for (const [fx, fy, fl] of [
    [248,17,true],[256,13,true],[264,19,true],[272,15,true],[280,11,true],
    [253,24,false],[261,27,false],[269,23,false],[277,19,false],[283,15,false],
    [246,29,true],[254,33,true],[266,31,true],[288,25,true],[296,21,false]
  ]) fish(fx, fy, !!fl)

  // ── 17. SEAHORSE ─────────────────────────────────────────────────────────
  const SHX = 107, SHY = 118
  R(ctx, SHX + 4, SHY, 5, 4, '#FF8833'); R(ctx, SHX + 6, SHY + 4, 2, 3, '#FF8833'); P(ctx, SHX + 8, SHY + 6, '#CC5511')
  R(ctx, SHX + 4, SHY - 2, 1, 3, '#FF9944'); R(ctx, SHX + 6, SHY - 3, 1, 4, '#FF9944'); R(ctx, SHX + 8, SHY - 2, 1, 3, '#FF9944')
  DISK(ctx, SHX + 7, SHY + 1, 2, '#111111'); P(ctx, SHX + 6, SHY, '#FFFFFF')
  R(ctx, SHX + 3, SHY + 6, 7, 4, '#FF9944')
  R(ctx, SHX + 2, SHY + 10, 8, 4, '#FF8833'); R(ctx, SHX + 2, SHY + 14, 7, 4, '#FF8833')
  R(ctx, SHX + 3, SHY + 18, 6, 4, '#FF9944'); R(ctx, SHX + 3, SHY + 22, 5, 4, '#FF8833')
  for (let sg = 0; sg < 5; sg++) { R(ctx, SHX + 2, SHY + 10 + sg * 4, 1, 3, '#CC5511'); R(ctx, SHX + 8 - sg, SHY + 10 + sg * 4, 1, 3, '#FFAA55') }
  R(ctx, SHX + 4, SHY + 26, 4, 2, '#FF9944'); R(ctx, SHX + 6, SHY + 28, 3, 2, '#FF8833')
  R(ctx, SHX + 7, SHY + 30, 2, 2, '#FF9944'); P(ctx, SHX + 7, SHY + 32, '#FF8833')
  R(ctx, SHX + 10, SHY + 7, 6, 2, '#FFBB66'); R(ctx, SHX + 10, SHY + 5, 4, 3, '#FFBB66')
  R(ctx, SHX + 8, SHY + 12, 5, 3, '#FFAA44'); R(ctx, SHX + 5, SHY + 10, 2, 18, '#FFEEAA')

  // ── 18. OCTOPUS (peeking from right foreground) ───────────────────────────
  const OX = 295, OY = 152
  HDISK(ctx, OX, OY, 13, '#CC4488'); HDISK(ctx, OX, OY, 9, '#EE66AA'); HDISK(ctx, OX - 2, OY - 4, 6, '#FF88BB')
  DISK(ctx, OX - 5, OY - 6, 2, '#111111'); P(ctx, OX - 6, OY - 7, '#FFFFFF')
  DISK(ctx, OX + 4, OY - 6, 2, '#111111'); P(ctx, OX + 3, OY - 7, '#FFFFFF')
  LINE(ctx, OX - 11, OY + 2, OX - 16, OY + 9, '#AA2266'); LINE(ctx, OX - 16, OY + 9, OX - 13, OY + 16, '#AA2266')
  LINE(ctx, OX + 6, OY + 3, OX + 14, OY + 11, '#AA2266'); LINE(ctx, OX - 4, OY + 5, OX - 5, OY + 16, '#AA2266')
  for (const [ppx, ppy] of [[OX-13,OY+6],[OX-11,OY+13],[OX+10,OY+7]]) P(ctx, ppx, ppy, '#FF88BB')

  // ── 19. STARFISH ─────────────────────────────────────────────────────────
  const starfish = (sx, sy, r, col) => {
    DISK(ctx, sx, sy, r, col)
    for (let arm = 0; arm < 5; arm++) {
      const angle = (arm / 5) * Math.PI * 2 - Math.PI / 2
      const ex = sx + Math.round(Math.cos(angle) * r * 2.8)
      const ey = sy + Math.round(Math.sin(angle) * r * 2.8)
      LINE(ctx, sx, sy, ex, ey, col); LINE(ctx, sx + 1, sy, ex + 1, ey, col)
    }
    DISK(ctx, sx, sy, r - 1, '#FF9944'); P(ctx, sx - 1, sy - 1, '#FFCCAA')
  }
  starfish(70, 158, 3, '#FF6622'); starfish(200, 160, 2, '#EE5511'); starfish(243, 156, 2, '#FF7733')

  // ── 20. SMALL ANEMONES ───────────────────────────────────────────────────
  const anemone = (ax, ay, col) => {
    R(ctx, ax, ay, 4, 3, '#553311')
    for (let i = 0; i < 5; i++) { R(ctx, ax - 1 + i, ay - 3, 1, 4, col); P(ctx, ax - 1 + i, ay - 4, '#FFFFFF') }
  }
  anemone(50, 158, '#FF4488'); anemone(180, 156, '#FF8833'); anemone(296, 155, '#AA44FF')

  // ── 21. BIOLUMINESCENT ALGAE PATCHES ─────────────────────────────────────
  for (const [ax, ay] of [[28,157],[62,156],[100,158],[235,157],[278,156]]) {
    DITH(ctx, ax, ay, 10, 2, '#00FF88', '#001122')
  }

  // ── 22. BUBBLES ──────────────────────────────────────────────────────────
  const bubbleCoords = [
    [14,28],[21,52],[34,78],[46,38],[54,98],[68,18],[79,68],[93,44],
    [109,58],[124,33],[138,78],[153,48],[167,28],[179,63],[193,88],
    [204,38],[214,70],[223,53],[239,78],[251,43],[258,28],[273,63],
    [284,88],[294,48],[303,73],[309,32],[29,128],[58,143],[88,118],
    [228,128],[174,108],[44,58],[118,93],[302,105],[185,42]
  ]
  for (const [bx, by] of bubbleCoords) {
    const sz = (bx + by) % 3 === 0 ? 2 : 1
    DISK(ctx, bx, by, sz, '#BBDDFF')
    if (sz === 2) P(ctx, bx - 1, by - 1, '#EEFFFF')
  }

  // ── 23. FOREGROUND ROCKS (darkest, front layer) ───────────────────────────
  R(ctx, 0, 163, 25, 17, '#2A1B3A'); R(ctx, 0, 161, 20, 3, '#4A3B5A')
  R(ctx, IW - 22, 161, 22, 19, '#2A1B3A'); R(ctx, IW - 20, 159, 18, 3, '#4A3B5A')
  P(ctx, 8, 161, '#22AA33'); P(ctx, 13, 160, '#33BB44')
  P(ctx, IW - 11, 160, '#22AA33'); P(ctx, IW - 8, 161, '#44CC55')

  // ── 24. SURFACE SHIMMER ──────────────────────────────────────────────────
  for (let rx = 0; rx < IW; rx += 9) {
    R(ctx, rx + 2, 1, 5, 1, '#AAFFFF'); R(ctx, rx + 1, 0, 2, 1, '#88EEFF')
    DITH(ctx, rx, 2, 9, 1, '#33CCDD', '#00AABB')
  }
  // Water surface top line
  R(ctx, 0, 0, IW, 1, '#CCFFFF')
}


function initSea() {
  const canvas = document.getElementById('sea-canvas');
  if (!canvas) return;
  canvas.width = IW;
  canvas.height = IH;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  drawScene(ctx);
}

document.addEventListener('DOMContentLoaded', initSea);
