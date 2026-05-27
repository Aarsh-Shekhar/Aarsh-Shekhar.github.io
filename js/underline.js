/* underline.js — Animated sketchy SVG underline on hover */

(function () {
  var ns  = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('underline-svg-layer');
  if (!svg) return;

  /* Colors used for underlines — warm amber/golden tones */
  var COLORS = [
    ['#f59e42', '#f97316'],   /* orange */
    ['#f472b6', '#ec4899'],   /* pink */
    ['#a78bfa', '#7c3aed'],   /* purple */
    ['#34d399', '#059669'],   /* green */
    ['#60a5fa', '#2563eb'],   /* blue */
    ['#fbbf24', '#d97706'],   /* amber */
  ];

  var activeLink  = null;
  var activePath  = null;
  var activeGrad  = null;
  var colorIndex  = 0;
  var animFrame   = null;
  var animStart   = null;
  var animDur     = 260; /* ms for the draw-in animation */

  /* ----------------------------------------------------------
     Generate a wavy/sketchy path for a given bounding rect
     ---------------------------------------------------------- */
  function wavePath(x, y, w, amplitude, segments) {
    var segs = segments || 8;
    var step = w / segs;
    var d    = 'M ' + x + ' ' + y;

    for (var i = 0; i <= segs; i++) {
      var px  = x + i * step;
      var jitter = (Math.random() - 0.5) * amplitude * 2;
      var py  = y + jitter;

      if (i === 0) {
        d += ' L ' + px + ' ' + py;
      } else {
        var cpx = px - step * 0.5 + (Math.random() - 0.5) * step * 0.3;
        var cpy = y + (Math.random() - 0.5) * amplitude * 1.8;
        d += ' Q ' + cpx + ' ' + cpy + ' ' + px + ' ' + py;
      }
    }
    return d;
  }

  /* ----------------------------------------------------------
     Show underline beneath el
     ---------------------------------------------------------- */
  function showUnderline(el) {
    if (activeLink === el) return;
    hideUnderline();

    activeLink = el;
    cancelAnimationFrame(animFrame);

    var rect = el.getBoundingClientRect();
    var x    = rect.left;
    var y    = rect.bottom + 1.5;
    var w    = rect.width;

    /* Pick a color pair */
    var pair = COLORS[colorIndex % COLORS.length];
    colorIndex++;

    /* Defs with linearGradient */
    var defs = svg.querySelector('defs') || (function () {
      var d = document.createElementNS(ns, 'defs');
      svg.appendChild(d);
      return d;
    }());

    var gradId = 'ul-grad-' + Date.now();
    var grad   = document.createElementNS(ns, 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '0%');

    var stop1 = document.createElementNS(ns, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', pair[0]);
    var stop2 = document.createElementNS(ns, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', pair[1]);
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    activeGrad = grad;

    /* Path for the underline */
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#' + gradId + ')');
    path.setAttribute('stroke-width', '1.8');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('opacity', '0');

    var amplitude = rect.height * 0.12;
    var pathData  = wavePath(x, y, w, amplitude, Math.max(6, Math.ceil(w / 14)));
    path.setAttribute('d', pathData);

    /* Stroke-dasharray trick for draw-in animation */
    svg.appendChild(path);
    var totalLen = path.getTotalLength ? path.getTotalLength() : w * 1.05;
    path.setAttribute('stroke-dasharray',  totalLen);
    path.setAttribute('stroke-dashoffset', totalLen);

    activePath = path;
    animStart  = null;

    function tick(ts) {
      if (!animStart) animStart = ts;
      var elapsed = ts - animStart;
      var prog    = Math.min(elapsed / animDur, 1);
      /* Ease-out cubic */
      var ease    = 1 - Math.pow(1 - prog, 3);

      path.setAttribute('stroke-dashoffset', totalLen * (1 - ease));
      path.setAttribute('opacity', Math.min(ease * 1.6, 1));

      if (prog < 1) {
        animFrame = requestAnimationFrame(tick);
      }
    }
    animFrame = requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------
     Hide / fade out the active underline
     ---------------------------------------------------------- */
  function hideUnderline() {
    cancelAnimationFrame(animFrame);
    if (activePath) {
      var p = activePath;
      /* Quick fade out */
      var fadeStart = null;
      var fadeDur   = 160;
      function fade(ts) {
        if (!fadeStart) fadeStart = ts;
        var prog = Math.min((ts - fadeStart) / fadeDur, 1);
        p.setAttribute('opacity', 1 - prog);
        if (prog < 1) {
          requestAnimationFrame(fade);
        } else {
          if (p.parentNode) p.parentNode.removeChild(p);
        }
      }
      requestAnimationFrame(fade);
      activePath = null;
    }
    if (activeGrad && activeGrad.parentNode) {
      activeGrad.parentNode.removeChild(activeGrad);
      activeGrad = null;
    }
    activeLink = null;
  }

  /* ----------------------------------------------------------
     Attach listeners to all underline-able links
     ---------------------------------------------------------- */
  function attachListeners() {
    var links = document.querySelectorAll('.inline-link, .nav-link');
    links.forEach(function (el) {
      el.addEventListener('mouseenter', function () { showUnderline(el); });
      el.addEventListener('mouseleave', hideUnderline);
      el.addEventListener('focus',      function () { showUnderline(el); });
      el.addEventListener('blur',       hideUnderline);
    });
  }

  /* ----------------------------------------------------------
     Re-position underline on scroll (so it tracks the element)
     ---------------------------------------------------------- */
  window.addEventListener('scroll', function () {
    if (!activeLink || !activePath) return;
    var rect  = activeLink.getBoundingClientRect();
    var x     = rect.left;
    var y     = rect.bottom + 1.5;
    var w     = rect.width;
    var amp   = rect.height * 0.12;
    var pd    = wavePath(x, y, w, amp, Math.max(6, Math.ceil(w / 14)));
    activePath.setAttribute('d', pd);
  }, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachListeners);
  } else {
    attachListeners();
  }

})();
