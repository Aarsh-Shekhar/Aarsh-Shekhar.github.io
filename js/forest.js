/* forest.js — Cherry blossom forest matching brianzhou.org algorithm */

/* ----------------------------------------------------------
   Seeded PRNG (LCG)
   ---------------------------------------------------------- */
function SeededRandom(seed) { this.s = seed >>> 0; }
SeededRandom.prototype.next = function () {
  this.s = (Math.imul(this.s, 1664525) + 1013904223) >>> 0;
  return this.s / 0x100000000;
};
SeededRandom.prototype.range = function (lo, hi) { return lo + this.next() * (hi - lo); };

function ease(t) { var c = t < 0 ? 0 : t > 1 ? 1 : t; return c * c * (3 - 2 * c); }
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

/* ----------------------------------------------------------
   Color helpers
   ---------------------------------------------------------- */
function rgba(c, a) {
  return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (+(+a).toFixed(3)) + ')';
}
function lerpC(a, b, t) {
  return { r: (a.r + (b.r - a.r) * t) | 0, g: (a.g + (b.g - a.g) * t) | 0, b: (a.b + (b.b - a.b) * t) | 0 };
}

/* ----------------------------------------------------------
   Dark-mode palette — from brianzhou.org source
   ---------------------------------------------------------- */
var PAL = {
  hazeTop:       { r:  24, g:  24, b:  27 },
  hazeBottom:    { r:  76, g:  54, b:  69 },
  groundTop:     { r:  58, g:  48, b:  53 },
  groundBottom:  { r:  86, g:  63, b:  54 },
  branchFrom:    { r:  48, g:  37, b:  28 },
  branchTo:      { r:  86, g:  64, b:  43 },
  blossomFrom:   { r: 224, g: 170, b: 194 },
  blossomTo:     { r: 247, g: 221, b: 232 },
  blossomCenter: { r: 252, g: 207, b: 221 },
  leafFrom:      { r: 109, g: 128, b:  99 },
  leafTo:        { r: 140, g: 159, b: 126 }
};

function layerPalette(base, layerName) {
  if (layerName === 'background') return Object.assign({}, base, {
    branchFrom:    lerpC(base.branchFrom,    base.hazeTop,   0.22),
    branchTo:      lerpC(base.branchTo,      base.hazeTop,   0.18),
    blossomFrom:   lerpC(base.blossomFrom,   base.hazeTop,   0.18),
    blossomTo:     lerpC(base.blossomTo,     base.hazeTop,   0.15),
    blossomCenter: lerpC(base.blossomCenter, base.hazeTop,   0.12)
  });
  if (layerName === 'midground') return Object.assign({}, base, {
    branchFrom: lerpC(base.branchFrom, base.hazeTop, 0.08),
    branchTo:   lerpC(base.branchTo,   base.hazeTop, 0.04)
  });
  return base;
}

/* ----------------------------------------------------------
   Per-layer terrain config — exact values from brianzhou.org source.
   Each layer has its own landTop so the ground is near the bottom.
   ---------------------------------------------------------- */
var LAYER_CFG = {
  background: {
    landTop: 0.796, landLiftA: 0.018, landDipA: 0.008, landLiftB: 0.014, landDipB: 0.006,
    landRippleA: 0.0024, landRippleB: 0.0012, landRippleFreq: 1.02, landRipplePhase: 0.6,
    trunkMin: 0.090, trunkMax: 0.155,
    baseStrokeMin: 5.9,  baseStrokeMax:  8.6,
    trunkWidthMin: 0.090, trunkWidthMax: 0.112,
    branchWidthFloor: 0.88,
    firstSplitWidthMin: 0.76, firstSplitWidthMax: 0.92,
    childWidthMin: 0.58, childWidthMax: 0.88,
    tipFlowerMin: 1, tipFlowerMax: 1, sideFlowerMax: 0,
    leafCountMin: 1, leafCountMax: 2,
    leafLengthMin: 14, leafLengthMax: 24, leafWidthMin: 7, leafWidthMax: 13,
    rowScale: 0.78, blossomScale: 0.74, count: 9
  },
  midground: {
    landTop: 0.880, landLiftA: 0.024, landDipA: 0.012, landLiftB: 0.018, landDipB: 0.010,
    landRippleA: 0.0032, landRippleB: 0.0018, landRippleFreq: 1.18, landRipplePhase: 2.1,
    trunkMin: 0.115, trunkMax: 0.200,
    baseStrokeMin: 10.2, baseStrokeMax: 14.8,
    trunkWidthMin: 0.102, trunkWidthMax: 0.128,
    branchWidthFloor: 1.40,
    firstSplitWidthMin: 0.78, firstSplitWidthMax: 0.93,
    childWidthMin: 0.60, childWidthMax: 0.90,
    tipFlowerMin: 1, tipFlowerMax: 2, sideFlowerMax: 1,
    leafCountMin: 1, leafCountMax: 2,
    leafLengthMin: 16, leafLengthMax: 30, leafWidthMin: 8, leafWidthMax: 16,
    rowScale: 0.96, blossomScale: 0.84, count: 7
  },
  foreground: {
    landTop: 0.928, landLiftA: 0.030, landDipA: 0.016, landLiftB: 0.022, landDipB: 0.012,
    landRippleA: 0.0044, landRippleB: 0.0022, landRippleFreq: 1.32, landRipplePhase: 4.2,
    trunkMin: 0.165, trunkMax: 0.290,
    baseStrokeMin: 14.5, baseStrokeMax: 21.5,
    trunkWidthMin: 0.095, trunkWidthMax: 0.118,
    branchWidthFloor: 1.80,
    firstSplitWidthMin: 0.80, firstSplitWidthMax: 0.94,
    childWidthMin: 0.62, childWidthMax: 0.90,
    tipFlowerMin: 1, tipFlowerMax: 2, sideFlowerMax: 1,
    leafCountMin: 1, leafCountMax: 2,
    leafLengthMin: 18, leafLengthMax: 36, leafWidthMin: 9, leafWidthMax: 18,
    rowScale: 1.08, blossomScale: 0.88, count: 5
  }
};

/* ----------------------------------------------------------
   Rolling ground — each layer has its own terrain params
   ---------------------------------------------------------- */
function cubicBezier(p0,p1,p2,p3,t) {
  var mt=1-t; return mt*mt*mt*p0+3*mt*mt*t*p1+3*mt*t*t*p2+t*t*t*p3;
}

function groundY(x, W, H, cfg) {
  var t = W > 0 ? clamp(x / W, 0, 1) : 0;
  var lt = cfg.landTop, la = cfg.landLiftA, da = cfg.landDipA, lb = cfg.landLiftB, db = cfg.landDipB;
  var hill = t <= 0.5
    ? cubicBezier(lt, lt-la, lt+da, lt-lb, t/0.5)
    : cubicBezier(lt-lb, lt+db, lt-0.75*la, lt, (t-0.5)/0.5);
  var ripple = Math.sin(t*Math.PI*2*cfg.landRippleFreq+cfg.landRipplePhase)*cfg.landRippleA
             + Math.sin(t*Math.PI*2*(2.15*cfg.landRippleFreq)+1.7*cfg.landRipplePhase)*cfg.landRippleB;
  return (hill + ripple) * H;
}

/* ----------------------------------------------------------
   Sky & ground drawing (background canvas only)
   ---------------------------------------------------------- */
function drawSky(ctx, W, H) {
  ctx.fillStyle = 'rgb(24,24,27)';
  ctx.fillRect(0, 0, W, H);

  /* Soft paper/noise texture, close to Brian's dark canvas backdrop. */
  ctx.save();
  ctx.globalAlpha = 0.035;
  var noiseRng = new SeededRandom(0x4f1bbcdc);
  for (var i = 0; i < 1800; i++) {
    var x = noiseRng.next() * W;
    var y = noiseRng.next() * H;
    var a = noiseRng.next() * 0.8;
    ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}

function drawGround(ctx, W, H, cfg) {
  /* Keep the backdrop seamless; grass supplies the visible ground color. */
}

function drawGrass(ctx, W, H, cfg, seed) {
  var rng = new SeededRandom(seed >>> 0);
  var grassTop = H * 0.805;
  ctx.save();

  var wash = ctx.createLinearGradient(0, grassTop - H * 0.08, 0, H);
  wash.addColorStop(0, 'rgba(109, 128, 99, 0.00)');
  wash.addColorStop(0.24, 'rgba(109, 128, 99, 0.16)');
  wash.addColorStop(0.54, 'rgba(121, 143, 111, 0.50)');
  wash.addColorStop(1, 'rgba(137, 157, 124, 0.78)');
  ctx.fillStyle = wash;
  ctx.fillRect(0, grassTop - H * 0.08, W, H - grassTop + H * 0.08);

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  var passes = [
    { density: 1.35, minH: 76, maxH: 156, alphaMin: 0.10, alphaMax: 0.23, widthMin: 0.55, widthMax: 1.05, baseMin: -8, baseMax: 26, shape: false, dark: 0.34 },
    { density: 1.70, minH: 58, maxH: 128, alphaMin: 0.18, alphaMax: 0.38, widthMin: 1.45, widthMax: 3.50, baseMin: 4,  baseMax: 44, shape: true,  dark: 0.18 },
    { density: 1.80, minH: 40, maxH: 96,  alphaMin: 0.26, alphaMax: 0.54, widthMin: 1.15, widthMax: 2.85, baseMin: 20, baseMax: 66, shape: true,  dark: 0.08 },
    { density: 2.40, minH: 26, maxH: 72,  alphaMin: 0.22, alphaMax: 0.46, widthMin: 0.50, widthMax: 1.35, baseMin: 38, baseMax: 90, shape: false, dark: 0.03 }
  ];

  passes.forEach(function(pass, passIndex) {
    var blades = Math.round(W * pass.density);
    for (var i = 0; i < blades; i++) {
      var x = rng.range(-28, W + 28);
      var ground = groundY(x, W, H, cfg);
      var base = Math.max(ground + rng.range(pass.baseMin, pass.baseMax), H - rng.range(0, 72));
      var h = rng.range(pass.minH, pass.maxH);
      var lean = rng.range(-54, 54);
      var cx = x + lean * rng.range(0.25, 0.58);
      var top = base - h;
      var col = lerpC(PAL.leafFrom, PAL.leafTo, rng.range(0.05, 0.95));
      var shade = lerpC(col, { r: 30, g: 36, b: 31 }, pass.dark);
      var alpha = rng.range(pass.alphaMin, pass.alphaMax);
      var width = rng.range(pass.widthMin, pass.widthMax);
      if (pass.shape) {
        var tipX = x + lean;
        var ctrlY = base - h * rng.range(0.42, 0.68);
        ctx.fillStyle = rgba(shade, alpha);
        ctx.beginPath();
        ctx.moveTo(x - width * 0.48, base + 1.5);
        ctx.bezierCurveTo(x - width * 1.15, ctrlY, tipX - width * 0.34, top + h * 0.06, tipX, top);
        ctx.bezierCurveTo(tipX + width * 0.30, top + h * 0.08, x + width * 1.05, ctrlY, x + width * 0.50, base + 1.5);
        ctx.closePath();
        ctx.fill();
        if (rng.next() > 0.48) {
          ctx.strokeStyle = rgba(lerpC(shade, PAL.leafTo, 0.25), alpha * 0.38);
          ctx.lineWidth = Math.max(0.35, width * 0.16);
          ctx.beginPath();
          ctx.moveTo(x, base);
          ctx.quadraticCurveTo(cx, base - h * 0.55, tipX, top);
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = rgba(shade, alpha);
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x, base);
        ctx.quadraticCurveTo(cx, base - h * 0.55, x + lean, top);
        ctx.stroke();
      }
    }
  });

  var haze = ctx.createLinearGradient(0, H * 0.78, 0, H);
  haze.addColorStop(0, 'rgba(109, 128, 99, 0.00)');
  haze.addColorStop(0.40, 'rgba(121, 143, 111, 0.09)');
  haze.addColorStop(1, 'rgba(137, 157, 124, 0.22)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, H * 0.78, W, H * 0.22);
  ctx.restore();
}

function treeSway(tree, elapsed) {
  var settledAt = tree.delay + tree.branchDuration + tree.leafDuration + tree.flowerDuration;
  var settle = ease(clamp((elapsed - settledAt) / Math.max(1, tree.swaySettleDuration), 0, 1));
  if (settle <= 0) return 0;
  var wave = Math.sin(elapsed * tree.swaySpeed + tree.swayPhase)
           + 0.32 * Math.sin(elapsed * tree.swaySpeed * 0.58 + 1.37 * tree.swayPhase);
  return (tree.swayAmplitudeDeg * Math.PI / 180) * wave * 0.5 * settle;
}

function withTreeSway(ctx, tree, elapsed, draw) {
  var angle = treeSway(tree, elapsed);
  if (Math.abs(angle) < 0.00001) {
    draw();
    return;
  }
  ctx.save();
  ctx.translate(tree.x, tree.y);
  ctx.rotate(angle);
  ctx.translate(-tree.x, -tree.y);
  draw();
  ctx.restore();
}

/* ----------------------------------------------------------
   Branch building — matches Brian's algorithm:
   - length factor 0.45–0.99 (Brian's exact range)
   - stop when length ≤ MIN_SEG_PX (≈10px, Brian's p)
   - canopy trigger: length ≤ max(1.8*MIN_SEG_PX, 0.17*trunkLen)
   ---------------------------------------------------------- */
var MIN_SEG_PX = 10;

function buildBranch(x1, y1, angle, length, width, depth, trunkLen, rng, list, pal, cfg, canopy) {
  if (length < 0.15 || depth > 8) return;
  var x2 = x1 + Math.cos(angle) * length;
  var y2 = y1 - Math.sin(angle) * length;  /* up = negative y */
  var td = clamp(1 - depth * 0.12, 0, 1);
  list.push({ x1:x1, y1:y1, x2:x2, y2:y2, width: Math.min(width, 22),
              color: lerpC(pal.branchFrom, pal.branchTo, td),
              alpha: 0.98, depth: depth, length: length,
              growthStartRatio: 0, growthDurationRatio: 0.20 });

  /* Canopy: add flowers/leaves when branch tip is short enough */
  var canopyThresh = Math.max(1.8 * MIN_SEG_PX, 0.17 * trunkLen);
  if (length <= canopyThresh) {
    canopy.push({
      x: x2, y: y2, scale: 0.90,
      spread: 5.25 * cfg.rowScale,
      count: Math.round(rng.range(cfg.tipFlowerMin, cfg.tipFlowerMax))
    });
    /* Side flowers for mid/fg layers */
    var nSide = cfg.sideFlowerMax > 0 ? Math.round(rng.range(0, cfg.sideFlowerMax)) : 0;
    for (var s = 0; s < nSide; s++) {
      var sLen = length * rng.range(0.58, 0.90);
      var sAng = angle + rng.range(-0.7, 0.7);
      canopy.push({
        x: x2 + Math.cos(sAng) * sLen * 0.5,
        y: y2 - Math.sin(sAng) * sLen * 0.5,
        scale: 0.78, spread: 3.25 * cfg.rowScale, count: 1
      });
    }
  }

  if (length <= MIN_SEG_PX) return;

  /* Two children — Brian's exact length factor: 0.45–0.99 */
  var lenL = length * rng.range(0.45, 0.99);
  var lenR = length * rng.range(0.45, 0.99);
  var F    = depth === 0 ? rng.range(cfg.firstSplitWidthMin, cfg.firstSplitWidthMax)
                         : rng.range(cfg.childWidthMin, cfg.childWidthMax);
  var wL   = Math.max(cfg.branchWidthFloor, width * rng.range(cfg.childWidthMin, cfg.childWidthMax));
  var wR   = Math.max(cfg.branchWidthFloor, width * rng.range(cfg.childWidthMin, cfg.childWidthMax));
  /* Murray's law: cap children so sum of squares ≤ parent */
  var zSq = Math.pow(Math.max(1.5 * cfg.branchWidthFloor, 0.92 * width), 2);
  var hSq = wL * wL + wR * wR;
  if (hSq > zSq) { var sc = Math.sqrt(zSq / hSq); wL *= sc; wR *= sc; }
  wL = Math.max(cfg.branchWidthFloor * 0.92, wL);
  wR = Math.max(cfg.branchWidthFloor * 0.92, wR);

  /* Split angle: Brian's range [PI/6-0.4, PI/6] */
  var splitL = Math.PI / 6 + rng.range(-0.4, 0);
  var splitR = Math.PI / 6 + rng.range(-0.4, 0);
  buildBranch(x2, y2, angle + splitL, lenL, wL, depth+1, trunkLen, rng, list, pal, cfg, canopy);
  buildBranch(x2, y2, angle - splitR, lenR, wR, depth+1, trunkLen, rng, list, pal, cfg, canopy);
}

/* ----------------------------------------------------------
   Flower building — petal ellipses
   ---------------------------------------------------------- */
function buildFlower(x, y, scale, rng, pal) {
  var ri  = rng.next();
  var cnt = ri < 0.12 ? 4 : ri > 0.90 ? 6 : 5;
  var col = lerpC(pal.blossomFrom, pal.blossomTo, rng.range(0.12, 0.90));
  var r   = scale;
  var pL  = rng.range(5.0, 9.0) * r;
  var pW  = rng.range(2.6, 4.2) * r;
  var pO  = rng.range(2.4, 4.6) * r;
  var lens=[], wids=[], offs=[], jit=[];
  for (var i=0;i<cnt;i++){
    lens.push(pL*rng.range(0.82,1.18)); wids.push(pW*rng.range(0.78,1.14));
    offs.push(pO*rng.range(0.84,1.16));
    jit.push({rotation:rng.range(-12,12)*Math.PI/180, offsetY:rng.range(-0.8,0.8)*r, alpha:rng.range(0.88,1.05)});
  }
  return { x:x, y:y, petalCount:cnt, petalLength:pL, petalWidth:pW, petalOffset:pO,
           petalLengths:lens, petalWidths:wids, petalOffsets:offs, petalJitter:jit,
           centerRadius: rng.range(0.9,1.8)*r,
           centerOffsetX: rng.range(-0.4,0.4)*r, centerOffsetY: rng.range(-0.35,0.35)*r,
           rotation: rng.range(0,360)*Math.PI/180,
           alpha: clamp(0.80+0.14*rng.next(),0.76,0.96),
           color: col, highlightColor: lerpC(col,pal.blossomTo,0.5),
           centerColor: lerpC(pal.blossomCenter,pal.blossomTo,0.2*rng.next()) };
}

function drawFlower(ctx, f, progress) {
  if (progress <= 0) return;
  var bloom = ease(progress);
  var scale = 0.42 + 0.58 * bloom;
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.rotation);
  ctx.scale(scale, scale);
  for (var g=0;g<f.petalCount;g++) {
    var petalP = ease(clamp((progress - g * 0.035) / 0.86, 0, 1));
    if (petalP <= 0) continue;
    var angle = g / f.petalCount * Math.PI * 2;
    var jit   = f.petalJitter[g];
    ctx.save(); ctx.rotate(angle + jit.rotation);
    ctx.globalAlpha = petalP;
    ctx.fillStyle = rgba(g%2===0 ? f.color : f.highlightColor, f.alpha * clamp(jit.alpha,0,1) * bloom);
    ctx.beginPath();
    ctx.ellipse(f.petalOffsets[g], jit.offsetY, f.petalLengths[g], f.petalWidths[g], 0, 0, Math.PI*2);
    ctx.fill(); ctx.restore();
  }
  ctx.globalAlpha = bloom;
  ctx.fillStyle = rgba(f.centerColor, 0.76 * f.alpha * bloom);
  ctx.beginPath(); ctx.arc(f.centerOffsetX, f.centerOffsetY, f.centerRadius, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

/* ----------------------------------------------------------
   Canopy leaf (blossom-colored ellipse)
   ---------------------------------------------------------- */
function buildLeaf(x, y, cfg, rng, pal) {
  var col = lerpC(pal.blossomFrom, pal.blossomTo, rng.range(0.12, 0.90));
  var rs = cfg.rowScale;
  return { x:x, y:y, rotation:rng.range(0,360)*Math.PI/180,
           length:rng.range(cfg.leafLengthMin,cfg.leafLengthMax)*rs,
           width: rng.range(cfg.leafWidthMin, cfg.leafWidthMax)*rs,
           alpha:rng.range(0.50,0.80), color:col };
}

function drawLeaf(ctx, lf, progress) {
  var p = ease(progress == null ? 1 : progress);
  if (p <= 0) return;
  ctx.save(); ctx.translate(lf.x, lf.y); ctx.rotate(lf.rotation); ctx.scale(0.55 + 0.45*p, 0.55 + 0.45*p);
  ctx.fillStyle = rgba(lf.color, lf.alpha * p);
  ctx.beginPath();
  ctx.moveTo(-0.46*lf.length, 0);
  ctx.quadraticCurveTo(0, -lf.width,  0.56*lf.length, 0);
  ctx.quadraticCurveTo(0,  lf.width, -0.46*lf.length, 0);
  ctx.closePath(); ctx.fill(); ctx.restore();
}

/* ----------------------------------------------------------
   Build one tree
   ---------------------------------------------------------- */
function buildTree(seed, x, baseY, trunkLen, leanDeg, layerName, pal, cfg) {
  var rng      = new SeededRandom(seed >>> 0);
  var branches = [], leaves = [], flowers = [], canopy = [];
  var angle    = Math.PI/2 + leanDeg * Math.PI/180;
  var trunkW   = clamp(trunkLen * rng.range(cfg.trunkWidthMin, cfg.trunkWidthMax),
                        cfg.baseStrokeMin, cfg.baseStrokeMax);

  buildBranch(x, baseY, angle, trunkLen, trunkW, 0, trunkLen, rng, branches, pal, cfg, canopy);

  canopy.forEach(function(node) {
    var lc = Math.round(rng.range(cfg.leafCountMin, cfg.leafCountMax));
    var fc = node.count;
    for (var i = 0; i < lc; i++) {
      var lx = node.x + rng.range(-node.spread, node.spread);
      var ly = node.y + rng.range(-node.spread, node.spread);
      leaves.push(buildLeaf(lx, ly, cfg, rng, pal));
    }
    for (var j = 0; j < fc; j++) {
      var fx = node.x + rng.range(-node.spread * 0.6, node.spread * 0.6);
      var fy = node.y + rng.range(-node.spread * 0.6, node.spread * 0.6);
      flowers.push(buildFlower(fx, fy, node.scale * cfg.blossomScale, rng, pal));
    }
  });

  leaves.sort(function(a,b){ return b.y-a.y; });
  flowers.sort(function(a,b){ return b.y-a.y; });

  /* Growth timing ratios (matching Brian's timing formula exactly) */
  var minY = branches.reduce(function(m,b){ return Math.min(m,b.y1,b.y2); }, baseY);
  var span = Math.max(1, baseY - minY);
  branches.forEach(function(b) {
    var t = clamp((baseY-b.y1)/span, 0, 1);
    var a = clamp(b.length/span, 0.08, 0.55);
    b.growthStartRatio    = clamp(0.76*t+0.012*b.depth, 0, 0.84);
    b.growthDurationRatio = clamp(0.12+0.28*a, 0.10, 0.26);
  });

  /* Durations: Brian-style staged growth, capped so the homepage settles quickly. */
  var rng2 = new SeededRandom((0x9e3779b9^(seed>>>0))>>>0);
  var bDur = Math.min(1780, 520 + 2.0*branches.length + 110*rng2.next());
  var lDur = leaves.length  ? Math.min(760,  150 + 0.32*leaves.length  + 60*rng2.next()) : 0;
  var fDur = flowers.length ? Math.min(1850, 420 + 0.42*flowers.length + 70*rng2.next()) : 0;

  return {
    x: x, y: baseY, row: layerName,
    branches: branches, leaves: leaves, flowers: flowers,
    branchDuration: bDur, leafDuration: lDur, flowerDuration: fDur,
    swayAmplitudeDeg: layerName==='foreground' ? rng2.range(0.52,0.88)
                    : layerName==='midground'  ? rng2.range(0.34,0.60) : rng2.range(0.18,0.34),
    swaySpeed:  layerName==='foreground' ? rng2.range(0.001,0.00135)
              : layerName==='midground'  ? rng2.range(0.00085,0.00115) : rng2.range(0.00072,0.00098),
    swayPhase: rng2.range(0, Math.PI*2),
    swaySettleDuration: 720 + 260*rng2.next(),
    delay: 0
  };
}

function treeMinY(tree) {
  var minY = tree.y;
  tree.branches.forEach(function(b) { minY = Math.min(minY, b.y1, b.y2); });
  tree.leaves.forEach(function(lf) { minY = Math.min(minY, lf.y - lf.width - 0.6 * lf.length); });
  tree.flowers.forEach(function(f) { minY = Math.min(minY, f.y - 1.8 * f.petalLength); });
  return minY;
}

function shiftTreeY(tree, dy) {
  tree.y += dy;
  tree.branches.forEach(function(b) { b.y1 += dy; b.y2 += dy; });
  tree.leaves.forEach(function(lf) { lf.y += dy; });
  tree.flowers.forEach(function(f) { f.y += dy; });
}

/* ----------------------------------------------------------
   Tree animation progress
   ---------------------------------------------------------- */
function treeProgress(tree, elapsed) {
  var n = elapsed - tree.delay;
  if (n <= 0) return { branchElapsed:0, branchCount:0, leafElapsed:-Infinity, flowerElapsed:-Infinity };
  function cnt(total, t, dur) {
    if (dur<=0) return total;
    return Math.floor(ease(clamp(t/dur,0,1)) * total);
  }
  var bElap = Math.min(n, tree.branchDuration);
  var lOff  = n - 0.76*tree.branchDuration;
  var fOff  = lOff - tree.leafDuration;
  return { branchElapsed:bElap, leafElapsed:lOff, flowerElapsed:fOff };
}

function branchP(tree, b, bElap) {
  var start = tree.branchDuration * (b.growthStartRatio||0);
  var dur   = Math.max(30, tree.branchDuration * (b.growthDurationRatio||0.20));
  return clamp((bElap - start) / dur, 0, 1);
}

/* ----------------------------------------------------------
   Render a layer
   ---------------------------------------------------------- */
function renderLayer(ctx, layerName, trees, elapsed) {
  var minW = layerName==='foreground' ? 1.6 : layerName==='midground' ? 1.0 : 0;
  trees.forEach(function(tree) {
    var prog = treeProgress(tree, elapsed);

    withTreeSway(ctx, tree, elapsed, function() {
      tree.branches.forEach(function(b) {
        if (b.width < minW) return;
        var p = branchP(tree, b, prog.branchElapsed);
        if (p <= 0) return;
        var x2 = b.x1 + (b.x2-b.x1)*p, y2 = b.y1 + (b.y2-b.y1)*p;
        ctx.strokeStyle = rgba(b.color, b.alpha);
        ctx.lineWidth   = b.width; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(b.x1,b.y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.fillStyle = rgba(b.color, b.alpha);
        ctx.beginPath(); ctx.arc(x2, y2, b.width*0.5, 0, Math.PI*2); ctx.fill();
      });

      for (var i=0; i<tree.leaves.length; i++) {
        var lp = clamp((prog.leafElapsed - (i / Math.max(tree.leaves.length, 1)) * tree.leafDuration * 0.78) / 220, 0, 1);
        drawLeaf(ctx, tree.leaves[i], lp);
      }

      for (var j=0; j<tree.flowers.length; j++) {
        var stagger = (j / Math.max(tree.flowers.length, 1)) * tree.flowerDuration * 0.82;
        var fp = clamp((prog.flowerElapsed - stagger) / 360, 0, 1);
        drawFlower(ctx, tree.flowers[j], fp);
      }
    });
  });
}

/* ----------------------------------------------------------
   Canvas setup — caller provides exact CSS dimensions
   ---------------------------------------------------------- */
function prepCanvas(canvas, cssW, cssH) {
  var dpr = window.devicePixelRatio || 1;
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';
  canvas.style.left   = '0px';
  canvas.style.top    = '0px';
  canvas.width  = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  var ctx = canvas.getContext('2d');
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);
  return { ctx: ctx, W: cssW, H: cssH };
}

/* ----------------------------------------------------------
   Generate layer trees with stratified x placement.
   W, H = total canvas dimensions (H = H0 + topBleed).
   H0   = visible forest height (used for trunk scaling only).
   cfg  = LAYER_CFG entry for this layer.
   ---------------------------------------------------------- */
function genLayer(W, H, H0, name, rng, cfg, safe) {
  var pal   = layerPalette(PAL, name);
  var count = cfg.count;
  var trees = [];
  for (var i=0; i<count; i++) {
    var slot = i / count;
    var xf   = clamp(slot + rng.range(0.02, 1/count - 0.02), 0.04, 0.96);
    var x    = xf * W;
    var gy   = groundY(x, W, H, cfg);  /* layer's own terrain */
    var tLen = rng.range(cfg.trunkMin, cfg.trunkMax) * H0;
    var edge = Math.abs(x / Math.max(W, 1) - 0.5) * 2;
    var inContentBand = safe && x > safe.left && x < safe.right;
    var onLeftEdge = safe && x <= safe.left;
    var onRightEdge = safe && x >= safe.right;
    tLen *= inContentBand ? (0.64 + edge * 0.22) : (0.96 + edge * 0.42);
    if (inContentBand) {
      var maxLen = Math.max(78, (gy - safe.centerTop) / 1.95);
      tLen = Math.min(tLen, maxLen);
    }
    var lean = rng.range(-2.0, 2.0);
    if (onLeftEdge) lean = rng.range(2.2, 5.0);
    if (onRightEdge) lean = rng.range(-5.0, -2.2);
    var seed = (rng.next() * 0xffffffff) >>> 0;
    var tree = buildTree(seed, x, gy, tLen, lean, name, pal, cfg);
    if (inContentBand) {
      var minY = treeMinY(tree);
      if (minY < safe.centerTop) shiftTreeY(tree, safe.centerTop - minY);
      else if (minY > safe.centerTop + 92) shiftTreeY(tree, safe.centerTop + rng.range(28, 82) - minY);
    } else if (safe) {
      var edgeMinY = treeMinY(tree);
      var edgeTop = safe.edgeTop + (name === 'foreground' ? 0 : name === 'midground' ? 18 : 34);
      if (edgeMinY < edgeTop) shiftTreeY(tree, edgeTop - edgeMinY);
    }
    /* delay: bg first, then mid, then fg (Brian's staggering) */
    var layerIdx = name==='background' ? 0 : name==='midground' ? 1 : 2;
    tree.delay = 640 + 380*layerIdx + x/Math.max(W,1)*170 + rng.range(0,24);
    trees.push(tree);
  }
  return trees;
}

/* ----------------------------------------------------------
   Compute topBleed — Brian's exact formula:
   Math.ceil(Math.max(180, 0.48*H0, -minY+48))
   ---------------------------------------------------------- */
function computeTopBleed(trees, H0) {
  var minY = 0;
  trees.forEach(function(t) {
    t.branches.forEach(function(b) { minY = Math.min(minY, b.y1, b.y2); });
    t.leaves.forEach(function(lf)  { minY = Math.min(minY, lf.y - lf.width - 0.6*lf.length); });
    t.flowers.forEach(function(f)  { minY = Math.min(minY, f.y - 1.8*f.petalLength); });
  });
  return Math.ceil(Math.max(180, 0.48*H0, -minY+48));
}

/* ----------------------------------------------------------
   Global state
   ---------------------------------------------------------- */
var globalSeed = (Math.random() * 0xffffffff) >>> 0;
var _animFrame;
var layers = null;
var grassLayer = null;

function buildGrassLayer(W, H, cfg, seed) {
  var dpr = window.devicePixelRatio || 1;
  var canvas = document.createElement('canvas');
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  drawGrass(ctx, W, H, cfg, seed);
  return canvas;
}

/* ----------------------------------------------------------
   Build forest (two-pass: measure topBleed, then render)
   ---------------------------------------------------------- */
function buildForest(seed) {
  var bgEl  = document.getElementById('canvas-bg');
  var midEl = document.getElementById('canvas-mid');
  var fgEl  = document.getElementById('canvas-fg');
  if (!bgEl) return;

  var forestDiv  = document.getElementById('forest');
  var viewportEl = forestDiv && forestDiv.querySelector('.forest-viewport');
  var W  = window.innerWidth;
  var H  = window.innerHeight;
  var H0 = H;
  var safe = null;
  var contentEl = document.querySelector('.content-section');
  if (contentEl) {
    var cr = contentEl.getBoundingClientRect();
    var nav = document.querySelector('.site-nav');
    var bioParagraphs = document.querySelectorAll('.bio-text p');
    var navRect = nav ? nav.getBoundingClientRect() : cr;
    var societyRect = bioParagraphs.length >= 3
      ? bioParagraphs[2].getBoundingClientRect()
      : cr;
    safe = {
      left: Math.max(0, cr.left - 240),
      right: Math.min(W, cr.right + 240),
      centerTop: Math.min(H * 0.70, navRect.bottom + 34),
      edgeTop: Math.min(H * 0.56, societyRect.bottom + 14)
    };
  }

  /* --- Pass 1: generate with canvas = H0 to discover tree extents --- */
  var rng0    = new SeededRandom(seed >>> 0);
  var bgRng0  = new SeededRandom((rng0.next()*0xffffffff)>>>0);
  var midRng0 = new SeededRandom((rng0.next()*0xffffffff)>>>0);
  var fgRng0  = new SeededRandom((rng0.next()*0xffffffff)>>>0);

  var rough = [
    genLayer(W, H, H0, 'background', bgRng0,  LAYER_CFG.background, safe),
    genLayer(W, H, H0, 'midground',  midRng0, LAYER_CFG.midground, safe),
    genLayer(W, H, H0, 'foreground', fgRng0,  LAYER_CFG.foreground, safe)
  ];

  /* --- Fixed full-viewport visual layer: no clipping seam --- */
  if (viewportEl) {
    viewportEl.style.top    = '0px';
    viewportEl.style.height = H + 'px';
  }

  /* --- Pass 2: regenerate with full canvas height H --- */
  var rng   = new SeededRandom(seed >>> 0);
  var bgRng = new SeededRandom((rng.next()*0xffffffff)>>>0);
  var midRng= new SeededRandom((rng.next()*0xffffffff)>>>0);
  var fgRng = new SeededRandom((rng.next()*0xffffffff)>>>0);

  var bgC  = prepCanvas(bgEl,  W, H);
  var midC = prepCanvas(midEl, W, H);
  var fgC  = prepCanvas(fgEl,  W, H);

  /* Sky and ground on bg canvas */
  drawSky(bgC.ctx, W, H);
  drawGround(bgC.ctx, W, H, LAYER_CFG.background);

  layers = [
    { c: bgC,  name: 'background', trees: genLayer(W, H, H0, 'background', bgRng,  LAYER_CFG.background, safe) },
    { c: midC, name: 'midground',  trees: genLayer(W, H, H0, 'midground',  midRng, LAYER_CFG.midground, safe) },
    { c: fgC,  name: 'foreground', trees: genLayer(W, H, H0, 'foreground', fgRng,  LAYER_CFG.foreground, safe) }
  ];
  window.layers = layers;
  grassLayer = buildGrassLayer(W, H, LAYER_CFG.foreground, 0x7219b3 ^ globalSeed);
}

/* ----------------------------------------------------------
   Animation loop
   ---------------------------------------------------------- */
function animate(startTime) {
  return function tick(ts) {
    var elapsed = ts - startTime;
    layers.forEach(function(l) {
      l.c.ctx.clearRect(0, 0, l.c.W, l.c.H);
      if (l.name === 'background') {
        drawSky(l.c.ctx, l.c.W, l.c.H);
        drawGround(l.c.ctx, l.c.W, l.c.H, LAYER_CFG.background);
      }
      if (l.name === 'foreground') {
        l.c.ctx.drawImage(grassLayer, 0, 0, l.c.W, l.c.H);
      }
      renderLayer(l.c.ctx, l.name, l.trees, elapsed);
    });
    _animFrame = requestAnimationFrame(tick);
  };
}

function startForest(seed) {
  cancelAnimationFrame(_animFrame);
  buildForest(seed);
  if (!layers) return;
  _animFrame = requestAnimationFrame(animate(performance.now()));
}

/* ----------------------------------------------------------
   Bootstrap
   ---------------------------------------------------------- */
function forestInit() {
  startForest(globalSeed);
  var btn = document.getElementById('forest-regen');
  if (btn) btn.addEventListener('click', function() {
    globalSeed = (Math.random()*0xffffffff)>>>0;
    startForest(globalSeed);
  });
}

var _resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(function(){ startForest(globalSeed); }, 200);
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', forestInit);
else forestInit();
