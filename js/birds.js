/* birds.js — Bird sprite animation matching brianzhou.org exactly */

(function () {

  /* Inject all bird CSS once */
  var style = document.createElement('style');
  style.textContent = [
    '.forest__birds { position:fixed; top:0; left:0; right:0; bottom:0; overflow:visible; pointer-events:none; }',
    '.forest__birds--canopy { z-index:0; }',
    '.forest__birds--sky    { z-index:1; }',
    '.forest__bird-flight { position:absolute; left:0; width:1px; height:1px; opacity:0;',
    '  will-change:transform; animation-timing-function:linear;',
    '  animation-iteration-count:infinite; animation-fill-mode:both; }',
    '.forest__bird-member { position:absolute; left:0; top:0; transform-origin:center; will-change:transform; }',
    '.forest__bird {',
    '  width:88px; height:125px;',
    '  background: linear-gradient(180deg, #b61f23 0%, #97171a 54%, #6f1013 100%);',
    '  -webkit-mask-image: url("images/bird-cells-new.svg");',
    '  -webkit-mask-size: auto 100%;',
    '  -webkit-mask-repeat: no-repeat;',
    '  -webkit-mask-position: 0 0;',
    '  mask-image: url("images/bird-cells-new.svg");',
    '  mask-size: auto 100%;',
    '  mask-repeat: no-repeat;',
    '  mask-position: 0 0;',
    '  will-change: -webkit-mask-position, mask-position, transform;',
    '  animation-name: fly-cycle;',
    '  animation-timing-function: steps(10);',
    '  animation-iteration-count: infinite;',
    '  filter: drop-shadow(0 0 2px rgba(255,233,224,.16)) drop-shadow(0 1px 3px rgba(34,10,8,.18));',
    '}',
    '.forest__bird--rtl { transform: scaleX(-1); }',
    '.forest__bird--one   { animation-duration: 1s;    animation-delay: -0.5s; }',
    '.forest__bird--two   { animation-duration: 0.9s;  animation-delay: -0.75s; }',
    '.forest__bird--three { animation-duration: 1.25s; animation-delay: -0.25s; }',
    '.forest__bird--four  { animation-duration: 1.1s;  animation-delay: -0.5s; }',
    '@keyframes fly-cycle {',
    '  100% { -webkit-mask-position: -900px 0; mask-position: -900px 0; }',
    '}',
    '@media (max-width: 767px) {',
    '  .forest__bird { width: 76px; height: 108px; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  /* ---------------------------------------------------------------
     Bird flight keyframes — matching Brian's path variants exactly.
     Each flock moves in discrete waypoints (vw/vh) across the screen.
     ---------------------------------------------------------------- */

  /* Path waypoints (progress 0→1 maps to travelStart→travelEnd % of cycle) */
  var PATHS = {
    ltr: [
      { progress: 0,    x: 110, y: -2,  s: 0.48 },
      { progress: 0.22, x:  83, y:  0,  s: 0.44 },
      { progress: 0.47, x:  52, y: -3,  s: 0.50 },
      { progress: 0.72, x:  20, y:  1.5,s: 0.47 },
      { progress: 1.0,  x: -14, y: -1,  s: 0.49 }
    ],
    rtl: [
      { progress: 0,    x: -14, y: -1,  s: 0.44 },
      { progress: 0.27, x:  17, y:  2,  s: 0.47 },
      { progress: 0.54, x:  48, y: -1.5,s: 0.50 },
      { progress: 0.81, x:  79, y:  2.5,s: 0.52 },
      { progress: 1.0,  x: 110, y:  0,  s: 0.50 }
    ]
  };

  function pct(n) { return (Math.round(n * 1000) / 10) + '%'; }
  function tfm(wp, dir) {
    var x = 'ltr' === dir ? (110 - wp.x) : wp.x;
    return 'translate3d(' + (100 - x) + 'vw,' + wp.y + 'vh,0) scale(' + wp.s + ')';
  }

  /* Render one flock's @keyframes */
  function buildKeyframes(id, flock) {
    var startX = flock.direction === 'rtl' ? 112 : -14;
    var endX   = flock.direction === 'rtl' ? -16 : 112;
    var y1 = flock.layer === 'canopy' ? -0.5 : -1.1;
    var y2 = flock.layer === 'canopy' ?  0.8 :  1.0;
    var s1 = flock.layer === 'canopy' ? 0.50 : 0.44;
    var s2 = flock.layer === 'canopy' ? 0.58 : 0.52;
    var lines = [
      '@keyframes forest-bird-flight-' + id + ' {',
      '  0%   { transform: translate3d(' + startX + 'vw,' + y1 + 'vh,0) scale(' + s1 + '); opacity: 0; }',
      '  8%   { opacity: ' + flock.opacity + '; }',
      '  34%  { transform: translate3d(' + (startX + (endX-startX)*0.33) + 'vw,' + y2 + 'vh,0) scale(' + s2 + '); opacity: ' + flock.opacity + '; }',
      '  68%  { transform: translate3d(' + (startX + (endX-startX)*0.68) + 'vw,' + y1 + 'vh,0) scale(' + s1 + '); opacity: ' + flock.opacity + '; }',
      '  92%  { opacity: ' + flock.opacity + '; }',
      '  100% { transform: translate3d(' + endX + 'vw,' + y2 + 'vh,0) scale(' + s2 + '); opacity: 0; }',
      '}'
    ];
    return lines.join('\n');
  }

  /* ---------------------------------------------------------------
     Flock definitions (from Brian's rendered HTML):
       sky flocks:    top ~ 59, 116, 165 px
       canopy flocks: top ~ 479 px (near forest)
     travelStart/End are seconds within the cycle at which the flock
     is visible (others = opacity 0).
     ---------------------------------------------------------------- */
  var CYCLE_DUR = 49.44;

  var FLOCKS = [
    /* --- canopy (behind trees, near ground) --- */
    {
      id: 0, layer: 'canopy', topVh: 62, delay: -8,
      direction: 'rtl', opacity: 0.845,
      travelStart: 0,   travelEnd: 17.9,
      cycleDuration: CYCLE_DUR,
      members: [
        { id: 0, offsetX:  18.6, offsetY: -6.1,  size: 0.90, variant: 'one',   rtl: true },
        { id: 1, offsetX: -21.5, offsetY:  9.7,  size: 0.65, variant: 'three', rtl: true }
      ]
    },
    {
      id: 2, layer: 'canopy', topVh: 68, delay: -26,
      direction: 'rtl', opacity: 0.932,
      travelStart: 5.9,  travelEnd: 22.7,
      cycleDuration: CYCLE_DUR,
      members: [
        { id: 0, offsetX:  48.3, offsetY: -16.6, size: 0.98, variant: 'three', rtl: true },
        { id: 1, offsetX:  19.0, offsetY: -1.0,  size: 0.93, variant: 'one',   rtl: true },
        { id: 2, offsetX: -10.7, offsetY: -1.6,  size: 0.90, variant: 'three', rtl: true },
        { id: 3, offsetX: -56.0, offsetY: -0.8,  size: 0.96, variant: 'three', rtl: true }
      ]
    },

    /* --- sky (high up, in front of content area) --- */
    {
      id: 1, layer: 'sky', topVh: 12, delay: -18,
      direction: 'rtl', opacity: 0.875,
      travelStart: 2.9,  travelEnd: 20.2,
      cycleDuration: CYCLE_DUR,
      members: [
        { id: 0, offsetX:  47.9, offsetY: -4.7,  size: 0.48, variant: 'two',   rtl: true },
        { id: 1, offsetX:   4.0, offsetY:  4.3,  size: 0.43, variant: 'one',   rtl: true },
        { id: 2, offsetX: -41.5, offsetY: -9.3,  size: 0.52, variant: 'one',   rtl: true }
      ]
    },
    {
      id: 3, layer: 'sky', topVh: 29, delay: -9,
      direction: 'ltr', opacity: 0.878,
      travelStart: 23.9, travelEnd: 43.4,
      cycleDuration: CYCLE_DUR,
      members: [
        { id: 0, offsetX: -34.4, offsetY: -14.8, size: 0.58, variant: 'two',   rtl: false },
        { id: 1, offsetX:   2.5, offsetY:   5.1, size: 0.65, variant: 'three', rtl: false },
        { id: 2, offsetX:  34.0, offsetY:  -1.5, size: 0.59, variant: 'four',  rtl: false }
      ]
    },
    {
      id: 4, layer: 'sky', topVh: 19, delay: -34,
      direction: 'ltr', opacity: 0.868,
      travelStart: 26.7, travelEnd: 47.6,
      cycleDuration: CYCLE_DUR,
      members: [
        { id: 0, offsetX: -40.7, offsetY:  -6.3, size: 0.40, variant: 'one',   rtl: false },
        { id: 1, offsetX:  -4.7, offsetY:   2.1, size: 0.63, variant: 'one',   rtl: false },
        { id: 2, offsetX:  44.1, offsetY:  -4.3, size: 0.48, variant: 'two',   rtl: false }
      ]
    }
  ];

  /* Inject all keyframes */
  var kfStyle = document.createElement('style');
  kfStyle.textContent = FLOCKS.map(function(f) { return buildKeyframes(f.id, f); }).join('\n\n');
  document.head.appendChild(kfStyle);

  /* Build DOM */
  var container = document.getElementById('birds-sky');
  if (!container) return;

  /* Create canopy and sky sub-containers */
  var canopyDiv = document.createElement('div');
  canopyDiv.className = 'forest__birds forest__birds--canopy';
  var skyDiv = document.createElement('div');
  skyDiv.className = 'forest__birds forest__birds--sky';
  container.appendChild(canopyDiv);
  container.appendChild(skyDiv);

  FLOCKS.forEach(function(flock) {
    var parent = flock.layer === 'canopy' ? canopyDiv : skyDiv;

    var flight = document.createElement('div');
    flight.className = 'forest__bird-flight';
    flight.style.top             = flock.topVh + 'vh';
    flight.style.animationName   = 'forest-bird-flight-' + flock.id;
    flight.style.animationDuration = flock.cycleDuration + 's';
    flight.style.animationDelay  = flock.delay + 's';
    parent.appendChild(flight);

    flock.members.forEach(function(m) {
      var member = document.createElement('div');
      member.className = 'forest__bird-member';
      member.style.transform = 'translate3d(' + m.offsetX + 'px,' + m.offsetY + 'px,0) scale(' + m.size + ')';

      var bird = document.createElement('div');
      bird.className = 'forest__bird forest__bird--' + m.variant + (m.rtl ? ' forest__bird--rtl' : '');

      member.appendChild(bird);
      flight.appendChild(member);
    });
  });

})();
