(function () {
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('aarsh-photo-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  var base = window.location.pathname.indexOf('/photography/gear') === 0 ? '../../' : '../';
  var photos = [
    {
      src: base + 'images/photography/photo-19.jpg',
      title: 'Kelingking overlook',
      caption: 'A cliffside view in Bali where the ocean goes impossibly blue and the scale of everything gets quiet.',
      date: 'June 24, 2026',
      location: 'Nusa Penida, Bali',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/1200s', 'ISO 32'],
      tags: ['travel', 'bali', 'scenic'],
      ratio: 'portrait',
      polaroid: true,
      tall: true
    },
    {
      src: base + 'images/photography/photo-21.jpg',
      title: 'Notre-Dame side light',
      caption: 'A portrait inside the basilica, surrounded by blue arches, gold detail, and the kind of silence that photographs well.',
      date: 'July 6, 2026',
      location: 'Montreal, Quebec',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/90s', 'ISO 250'],
      tags: ['travel', 'montreal', 'architecture'],
      ratio: 'portrait',
      polaroid: true
    },
    {
      src: base + 'images/photography/photo-05.jpg',
      title: 'Everest sunrise line',
      caption: 'A cold sunrise above the clouds, with a rope team stepping through snow toward higher ground.',
      date: 'May 27, 2026',
      location: 'Everest region',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.25mm', 'f/1.8', '1/2400s', 'ISO 32'],
      tags: ['everest', 'mountains', 'expedition'],
      ratio: 'square',
      polaroid: true
    },
    {
      src: base + 'images/photography/photo-20.jpg',
      title: 'Old Montreal menu',
      caption: 'A dinner-table portrait tucked into a narrow street of warm lights, awnings, and slow summer foot traffic.',
      date: 'July 5, 2026',
      location: 'Montreal, Quebec',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/120s', 'ISO 160'],
      tags: ['travel', 'montreal', 'portrait'],
      ratio: 'portrait',
      polaroid: true
    },
    {
      src: base + 'images/photography/photo-01.jpg',
      title: 'Philmont trail morning',
      caption: 'A bright trail morning with heavy packs and a long stretch of New Mexico forest ahead.',
      date: 'May 27, 2026',
      location: 'Philmont, New Mexico',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.25mm', 'f/1.8', '1/950s', 'ISO 32'],
      tags: ['backpacking', 'philmont', 'outdoors'],
      ratio: 'portrait',
      polaroid: true,
      tall: true
    },
    {
      src: base + 'images/photography/photo-17.jpg',
      title: 'Embarcadero blue hour',
      caption: 'San Francisco at the edge of evening, with palms, streetlights, and the skyline beginning to glow.',
      date: 'July 26, 2026',
      location: 'San Francisco, California',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/120s', 'ISO 100'],
      tags: ['travel', 'san francisco', 'city'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-24.jpg',
      title: 'San Francisco crew selfie',
      caption: 'A quick street selfie after the day, framed by the Embarcadero lights and downtown skyline.',
      date: 'July 26, 2026',
      location: 'San Francisco, California',
      camera: 'Apple iPhone',
      lens: 'Front Camera',
      meta: ['iPhone', 'f/2.2', '1/90s', 'ISO 125'],
      tags: ['travel', 'san francisco', 'friends'],
      ratio: 'wide',
      polaroid: true
    },
    {
      src: base + 'images/photography/photo-22.jpg',
      title: 'Basilica altar study',
      caption: 'A clean architectural frame of Notre-Dame, all symmetry, stained light, and impossible ornament.',
      date: 'July 6, 2026',
      location: 'Montreal, Quebec',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/100s', 'ISO 320'],
      tags: ['travel', 'montreal', 'architecture'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-16.jpg',
      title: 'Arena keynote lights',
      caption: 'A conference arena moment from high in the seats, with screens, lights, and a room full of attention.',
      date: 'July 26, 2026',
      location: 'San Francisco, California',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/120s', 'ISO 200'],
      tags: ['conference', 'technology', 'san francisco'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-18.jpg',
      title: 'Campus walk',
      caption: 'A shaded walk under tall trees, somewhere between debate rounds, campus wandering, and the next plan.',
      date: 'July 27, 2026',
      location: 'Stanford, California',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/500s', 'ISO 40'],
      tags: ['campus', 'friends', 'california'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-23.jpg',
      title: 'Gothic ceiling detail',
      caption: 'A closer look at the basilica interior, where the ceiling, columns, and carved wood turn into one dense pattern.',
      date: 'July 6, 2026',
      location: 'Montreal, Quebec',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['iPhone', 'f/1.8', '1/100s', 'ISO 400'],
      tags: ['travel', 'montreal', 'architecture'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-02.jpg',
      title: 'Ridge crew',
      caption: 'The crew pauses on a wind-cut ridge after a hard climb into open alpine air.',
      date: 'May 27, 2026',
      location: 'Philmont, New Mexico',
      camera: 'Apple iPhone',
      lens: 'Ultra Wide',
      meta: ['1.54mm', 'f/2.4', '1/600s', 'ISO 50'],
      tags: ['backpacking', 'philmont', 'crew'],
      ratio: 'wide'
    },
    {
      src: base + 'images/photography/photo-03.jpg',
      title: 'Burn-scar ascent',
      caption: 'A stark hillside climb, all blackened branches and open blue sky.',
      date: 'May 27, 2026',
      location: 'Mountain trail',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.25mm', 'f/1.8', '1/1100s', 'ISO 40'],
      tags: ['backpacking', 'landscape'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-04.jpg',
      title: 'Philmont crew portrait',
      caption: 'A full crew shot before the next push, framed by granite, pines, and dry summer light.',
      date: 'May 27, 2026',
      location: 'Philmont, New Mexico',
      camera: 'Apple iPhone',
      lens: 'Wide Camera',
      meta: ['4.2mm', 'f/1.6', '1/820s', 'ISO 32'],
      tags: ['backpacking', 'philmont', 'crew'],
      ratio: 'wide'
    },
    {
      src: base + 'images/photography/photo-06.jpg',
      title: 'Conference poster session',
      caption: 'Research conversations in motion, with posters, laptops, and a room full of small technical debates.',
      date: 'May 27, 2026',
      location: 'Conference hall',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/80s', 'ISO 250'],
      tags: ['research', 'conference'],
      ratio: 'wide'
    },
    {
      src: base + 'images/photography/photo-07.jpg',
      title: 'Research presentation',
      caption: 'A formal presentation moment from the research circuit, somewhere between nerves and momentum.',
      date: 'May 27, 2026',
      location: 'Research conference',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/90s', 'ISO 320'],
      tags: ['research', 'conference'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-08.jpg',
      title: 'App Challenge stage',
      caption: 'A pitch-day frame from the Congressional App Challenge, with the project story moving from screen to stage.',
      date: 'May 27, 2026',
      location: 'Congressional App Challenge',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/120s', 'ISO 125'],
      tags: ['technology', 'app challenge'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-09.jpg',
      title: 'MindMates demo',
      caption: 'A demo-table moment from the app challenge, where the product becomes real through questions.',
      date: 'May 27, 2026',
      location: 'Congressional App Challenge',
      camera: 'Apple iPhone',
      lens: 'Wide Camera',
      meta: ['4.2mm', 'f/1.6', '1/100s', 'ISO 160'],
      tags: ['technology', 'app challenge'],
      ratio: 'wide',
      polaroid: true
    },
    {
      src: base + 'images/photography/photo-10.jpg',
      title: 'Eagle project build',
      caption: 'A service project in the messy middle, where planning becomes lumber, tools, and people showing up.',
      date: 'May 27, 2026',
      location: 'Central Texas',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.25mm', 'f/1.8', '1/140s', 'ISO 50'],
      tags: ['eagle scout', 'service'],
      ratio: 'portrait'
    },
    {
      src: base + 'images/photography/photo-11.jpg',
      title: 'Project site',
      caption: 'A wider view of the project site, with the workday settling into a clean rhythm.',
      date: 'May 27, 2026',
      location: 'Central Texas',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/280s', 'ISO 40'],
      tags: ['eagle scout', 'service'],
      ratio: 'panorama'
    },
    {
      src: base + 'images/photography/photo-12.jpg',
      title: 'Finished service work',
      caption: 'The final stretch of a community project, documented in the quiet after the heavy lifting.',
      date: 'May 27, 2026',
      location: 'Central Texas',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/210s', 'ISO 64'],
      tags: ['eagle scout', 'service'],
      ratio: 'square'
    },
    {
      src: base + 'images/photography/photo-13.jpg',
      title: 'ISEF project floor',
      caption: 'A science fair floor full of boards, badges, and last-minute explanations sharpened by repetition.',
      date: 'May 27, 2026',
      location: 'Regeneron ISEF',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/120s', 'ISO 200'],
      tags: ['isef', 'research'],
      ratio: 'portrait',
      polaroid: true
    },
    {
      src: base + 'images/photography/photo-14.jpg',
      title: 'Awards hall',
      caption: 'A hallway snapshot from ISEF week, half documentation and half proof that the week really happened.',
      date: 'May 27, 2026',
      location: 'Regeneron ISEF',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/160s', 'ISO 100'],
      tags: ['isef', 'research'],
      ratio: 'wide'
    },
    {
      src: base + 'images/photography/photo-15.jpg',
      title: 'Biomedical grand award',
      caption: 'A final ISEF frame around the biomedical project, after months of experiments turned into one display.',
      date: 'May 27, 2026',
      location: 'Regeneron ISEF',
      camera: 'Apple iPhone',
      lens: 'Main Camera',
      meta: ['4.2mm', 'f/1.6', '1/100s', 'ISO 160'],
      tags: ['isef', 'research'],
      ratio: 'portrait'
    }
  ];

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function renderGallery(list) {
    var grid = document.querySelector('[data-photo-grid]');
    var count = document.querySelector('[data-photo-count]');
    if (!grid) return;
    count.textContent = list.length + ' photos';
    var columnCount = grid.classList.contains('is-compact') ? 4 : 3;
    var columns = [];
    for (var c = 0; c < columnCount; c++) columns.push([]);

    list.forEach(function (photo, index) {
      columns[index % columnCount].push(renderCard(photo, index));
    });

    grid.innerHTML = columns.map(function (column) {
      return '<div class="photo-column">' + column.join('') + '</div>';
    }).join('');

    grid.querySelectorAll('[data-photo-card]').forEach(function (card) {
      card.addEventListener('click', function () { openLightbox(Number(card.dataset.index), list); });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(Number(card.dataset.index), list);
        }
      });
    });
  }

  function renderCard(photo, index) {
      return '<figure class="photo-card ' + (photo.polaroid ? 'is-polaroid ' : '') + (photo.tall ? 'is-tall' : '') + '" data-photo-card data-index="' + index + '" data-ratio="' + photo.ratio + '" data-tags="' + escapeAttr(photo.tags.join(' ')) + '" tabindex="0" role="button" aria-label="Open photo: ' + escapeAttr(photo.title) + '">' +
        '<div class="photo-frame"><img src="' + photo.src + '" alt="' + escapeAttr(photo.title) + '" loading="' + (index < 5 ? 'eager' : 'lazy') + '" draggable="false" />' +
        '<div class="timestamp"><span>' + photo.date + '</span><span>' + photo.location + '</span></div></div>' +
        '<figcaption class="photo-meta"><div class="exif"><div class="exif-line">' + photo.meta.map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>' +
        '<div><span class="camera">' + photo.camera + '</span><span class="lens">' + photo.lens + '</span></div></div>' +
        '<p class="caption" title="' + escapeAttr(photo.caption) + '">' + photo.title + '</p></figcaption></figure>';
  }

  function openLightbox(index, list) {
    var photo = list[index];
    var box = document.querySelector('[data-lightbox]');
    if (!box || !photo) return;
    box.querySelector('[data-lightbox-img]').src = photo.src;
    box.querySelector('[data-lightbox-img]').alt = photo.title;
    box.querySelector('[data-lightbox-title]').textContent = photo.title;
    box.querySelector('[data-lightbox-caption]').textContent = photo.caption;
    box.querySelector('[data-lightbox-meta]').textContent = photo.location + ' • ' + photo.camera + ' • ' + photo.meta.join(' • ');
    box.classList.add('is-open');
  }

  function setupGallery() {
    var grid = document.querySelector('[data-photo-grid]');
    if (!grid) return;
    var current = photos.slice();
    renderGallery(current);

    var searchPanel = document.querySelector('[data-gallery-search]');
    var searchInput = document.querySelector('[data-search-input]');
    document.querySelector('[data-search-toggle]').addEventListener('click', function () {
      searchPanel.classList.toggle('is-open');
      if (searchPanel.classList.contains('is-open')) searchInput.focus();
    });

    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      current = photos.filter(function (photo) {
        return !q || [photo.title, photo.caption, photo.location, photo.camera].concat(photo.tags).join(' ').toLowerCase().indexOf(q) !== -1;
      });
      renderGallery(current);
    });

    document.querySelectorAll('[data-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-filter]').forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');
        var type = button.dataset.filter;
        if (type === 'Gallery') current = photos.slice();
        if (type === 'Location') current = photos.slice().sort(function (a, b) { return a.location.localeCompare(b.location); });
        if (type === 'Camera') current = photos.slice().sort(function (a, b) { return a.camera.localeCompare(b.camera); });
        if (type === 'Tags') current = photos.slice().sort(function (a, b) { return a.tags[0].localeCompare(b.tags[0]); });
        renderGallery(current);
      });
    });

    document.querySelector('[data-layout-large]').addEventListener('click', function () {
      grid.classList.remove('is-compact');
      document.querySelector('[data-layout-large]').classList.add('is-active');
      document.querySelector('[data-layout-small]').classList.remove('is-active');
    });

    document.querySelector('[data-layout-small]').addEventListener('click', function () {
      grid.classList.add('is-compact');
      document.querySelector('[data-layout-small]').classList.add('is-active');
      document.querySelector('[data-layout-large]').classList.remove('is-active');
    });

    document.querySelector('[data-sort]').addEventListener('click', function () {
      current.reverse();
      renderGallery(current);
    });
  }

  function setupControls() {
    var theme = document.querySelector('[data-theme-toggle]');
    var menu = document.querySelector('[data-menu-toggle]');
    var menuPanel = document.querySelector('[data-menu-panel]');
    var command = document.querySelector('[data-command-toggle]');
    var commandPanel = document.querySelector('[data-command-panel]');
    var commandInput = document.querySelector('[data-command-input]');
    var results = document.querySelector('[data-command-results]');
    var close = document.querySelector('[data-lightbox-close]');
    var lightbox = document.querySelector('[data-lightbox]');

    if (theme) {
      theme.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('aarsh-photo-theme', next);
      });
    }

    if (menu && menuPanel) {
      menu.addEventListener('click', function () { menuPanel.classList.toggle('is-open'); });
    }

    var links = [
      ['Home', base + 'index.html'],
      ['Work', base + 'work/'],
      ['Projects', base + 'projects/'],
      ['Research', base + 'research/'],
      ['Photography', base + 'photography/'],
      ['Gear', base + 'photography/gear/'],
      ['Miscellany', base + 'miscellany/']
    ];

    function paintResults(q) {
      results.innerHTML = links.filter(function (link) {
        return link[0].toLowerCase().indexOf(q.toLowerCase()) !== -1;
      }).map(function (link) {
        return '<a href="' + link[1] + '">' + link[0] + '</a>';
      }).join('');
    }

    if (command && commandPanel) {
      paintResults('');
      command.addEventListener('click', function () {
        commandPanel.classList.toggle('is-open');
        if (commandPanel.classList.contains('is-open')) commandInput.focus();
      });
      commandInput.addEventListener('input', function () { paintResults(commandInput.value); });
      document.addEventListener('keydown', function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          commandPanel.classList.toggle('is-open');
          commandInput.focus();
        }
        if (event.key === 'Escape' && lightbox) lightbox.classList.remove('is-open');
      });
    }

    if (close && lightbox) {
      close.addEventListener('click', function () { lightbox.classList.remove('is-open'); });
      lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) lightbox.classList.remove('is-open');
      });
    }
  }

  setupGallery();
  setupControls();
})();
