(function () {
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('aarsh-misc-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  var assetBase = window.location.pathname.split('/').filter(Boolean).length ? '../' : '';

  var albums = [
    { title: 'GEMINI', creator: 'Macklemore', kind: 'album', tag: 'hip hop', color: 'orange', cover: assetBase + 'images/misc/gemini.jpg' },
    { title: 'So Far So Good', creator: 'The Chainsmokers', kind: 'album', tag: 'electronic', color: 'cyan', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'Ghost Stories', creator: 'Coldplay', kind: 'album', tag: 'alternative rock', color: 'violet', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'Moon Music', creator: 'Coldplay', kind: 'album', tag: 'alternative rock', color: 'violet', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'The Loneliest Time', creator: 'Carly Rae Jepsen', kind: 'album', tag: 'pop', color: 'pink', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'A Rush of Blood to the Head', creator: 'Coldplay', kind: 'album', tag: 'alternative rock', color: 'violet', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'Viva la Vida', creator: 'Coldplay', kind: 'album', tag: 'alternative rock', color: 'violet', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'Currents', creator: 'Tame Impala', kind: 'album', tag: 'psychedelic', color: 'pink', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'Worlds', creator: 'Porter Robinson', kind: 'album', tag: 'electronic', color: 'cyan', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'Scaled and Icy', creator: 'Twenty One Pilots', kind: 'album', tag: 'pop rock', color: 'blue', cover: assetBase + 'images/misc/library-playlist.jpg' },
    { title: 'Divide', creator: 'Ed Sheeran', kind: 'album', tag: 'pop', color: 'pink', cover: assetBase + 'images/misc/library-playlist.jpg' }
  ];

  var books = [
    { title: 'Chip War', creator: 'Chris Miller', tag: 'technology', color: 'blue', cover: assetBase + 'images/books/60321447.jpg' },
    { title: 'Zero to One', creator: 'Peter Thiel', tag: 'business', color: 'gray', cover: assetBase + 'images/books/13805758-L.jpg' },
    { title: 'Why Nations Fail', creator: 'Daron Acemoglu & James A. Robinson', tag: 'economics', color: 'green', cover: assetBase + 'images/books/12158480.jpg' },
    { title: 'Educated', creator: 'Tara Westover', tag: 'memoir', color: 'cyan', cover: assetBase + 'images/books/35133922.jpg' },
    { title: 'The Hype Machine', creator: 'Sinan Aral', tag: 'technology', color: 'blue', cover: assetBase + 'images/books/cover_w500_h500.jpg' },
    { title: 'Co-Intelligence', creator: 'Ethan Mollick', tag: 'technology', color: 'blue', cover: assetBase + 'images/books/198678736.jpg' },
    { title: 'The Worlds I See', creator: 'Fei-Fei Li', tag: 'AI', color: 'violet', cover: assetBase + 'images/books/14609022-L.jpg' },
    { title: 'The Rise and Fall of the New Deal Order', creator: 'Steve Fraser & Gary Gerstle', tag: 'history', color: 'red', cover: assetBase + 'images/books/7258954-L.jpg' },
    { title: 'Talking to Strangers', creator: 'Malcolm Gladwell', tag: 'society', color: 'orange', cover: assetBase + 'images/books/14860497-L.jpg' },
    { title: 'The Odyssey', creator: 'Homer', tag: 'classic', color: 'amber', cover: assetBase + 'images/books/1381.jpg' }
  ];

  var quotes = [
    { title: 'The world may be broken, but hope is not crazy.', creator: 'John Green', tag: 'hope', color: 'blue' },
    { title: 'Alea iacta est.', creator: 'Julius Caesar', tag: 'courage', color: 'red' },
    { title: 'Work hard, be kind, and amazing things will happen.', creator: "Conan O'Brien", tag: 'hope', color: 'blue' },
    { title: 'In the darkest times, hope is something you give yourself. That is the meaning of inner strength.', creator: 'Uncle Iroh, Avatar: The Last Airbender', tag: 'hope', color: 'blue' }
  ];

  var channels = [
    ['STEM', 'Andrej Karpathy', 'https://www.youtube.com/@AndrejKarpathy'],
    ['STEM', 'Kurzgesagt', 'https://www.youtube.com/@kurzgesagt'],
    ['STEM', 'Real Engineering', 'https://www.youtube.com/@RealEngineering'],
    ['STEM', '3Blue1Brown', 'https://www.youtube.com/@3blue1brown'],
    ['STEM', 'Veritasium', 'https://www.youtube.com/@veritasium'],
    ['STEM', 'Hank Green', 'https://www.youtube.com/@hankschannel'],
    ['STEM', 'BobbyBroccoli', 'https://www.youtube.com/@BobbyBroccoli'],
    ['STEM', 'Code Bullet', 'https://www.youtube.com/@CodeBullet'],
    ['History', 'Oversimplified', 'https://www.youtube.com/@OverSimplified'],
    ['History', 'Historia Civilis', 'https://www.youtube.com/@HistoriaCivilis'],
    ['History', 'Kings and Generals', 'https://www.youtube.com/@KingsandGenerals'],
    ['History', 'Fall of Civilizations', 'https://www.youtube.com/@FallofCivilizations'],
    ['History', 'The Operations Room', 'https://www.youtube.com/@TheOperationsRoom'],
    ['World', 'Polymatter', 'https://www.youtube.com/@PolyMatter'],
    ['World', 'Wendover Productions', 'https://www.youtube.com/@Wendoverproductions'],
    ['World', 'Half as Interesting', 'https://www.youtube.com/@halfasinteresting'],
    ['World', 'CGP Grey', 'https://www.youtube.com/@CGPGrey'],
    ['World', 'Fern', 'https://www.youtube.com/@fern-tv'],
    ['World', 'Great Big Story', 'https://www.youtube.com/@GreatBigStory'],
    ['World', 'Hoog', 'https://www.youtube.com/@hoog-youtube'],
    ['Infrastructure', 'City Beautiful', 'https://www.youtube.com/@CityBeautiful'],
    ['Infrastructure', 'The B1M', 'https://www.youtube.com/@TheB1M'],
    ['Econ', 'Economics Explained', 'https://www.youtube.com/@EconomicsExplained'],
    ['Econ', 'Hoser', 'https://www.youtube.com/@h0ser'],
    ['Econ', 'Micro', 'https://www.youtube.com/@Micro-Econ-YT'],
    ['Creators', 'Tom Scott', 'https://www.youtube.com/@TomScottGo'],
    ['Creators', 'Vlogbrothers', 'https://www.youtube.com/@vlogbrothers'],
    ['Creators', 'Atrioc', 'https://www.youtube.com/@atrioc'],
    ['Creators', 'Mark Rober', 'https://www.youtube.com/@MarkRober'],
    ['Creators', 'Answer in Progress', 'https://www.youtube.com/@answerinprogress'],
    ['Creators', 'Stuff Made Here', 'https://www.youtube.com/@StuffMadeHere']
  ].map(function (row) {
    return { group: row[0], title: row[1], href: row[2], tag: row[0].toLowerCase(), color: row[0] === 'STEM' ? 'gray' : 'blue' };
  });

  var tracks = [
    ['STAY (with Justin Bieber)', 'The Kid LAROI, Justin Bieber', '2:22'],
    ['The Nights', 'Avicii', '2:57'],
    ['Hold On', 'Justin Bieber', '2:51'],
    ['Ghost', 'Justin Bieber', '2:33'],
    ['Decades Mashup 2', 'Stephen Scaccia, Randy C, Nikita Afonso', '3:49'],
    ['A Sky Full of Stars', 'Coldplay', '4:28'],
    ['Counting Stars', 'OneRepublic', '4:17'],
    ['Maps', 'Maroon 5', '3:10'],
    ['Secrets', 'OneRepublic', '3:44'],
    ['All Time Low', 'Jon Bellion', '3:38']
  ];

  function tagHTML(item, kind) {
    return '<span class="tag tag--' + (item.color || 'gray') + '">' + item.tag + '</span><span class="tag">' + kind + '</span><span class="tag tag--amber">★</span>';
  }

  function iconFor(kind) {
    return { album: '♫', book: '▭', quote: '❝', channel: '▶' }[kind] || '•';
  }

  function makeRow(item, kind, hidden) {
    return '<li class="list-row" tabindex="0" data-preview-item data-kind="' + kind + '"' +
      ' data-title="' + escapeAttr(item.title) + '" data-creator="' + escapeAttr(item.creator || '') + '"' +
      ' data-cover="' + escapeAttr(item.cover || '') + '" data-tag="' + escapeAttr(item.tag || '') + '"' +
      (hidden ? ' hidden' : '') + '>' +
      '<div class="row-main"><span class="row-icon ' + (kind === 'channel' ? 'youtube' : '') + '">' + iconFor(kind) + '</span>' +
      '<span class="row-title">' + item.title + (item.creator ? '<span class="row-meta"> | ' + item.creator + '</span>' : '') + '</span></div>' +
      '<div class="tag-stack">' + tagHTML(item, kind) + '</div></li>';
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function renderOverview() {
    var host = document.querySelector('[data-overview]');
    if (!host) return;

    host.innerHTML =
      overviewSection('Music Library', 'Playlists and albums I keep coming back to.', 'library', 'album', albums, renderAlbumPreview(albums[0]), '11 albums') +
      overviewSection('Bookshelf', "What I've read, what I'm reading, and what's on deck.", 'bookshelf', 'book', books, renderBookPreview(books[0]), '10 books') +
      overviewSection('Quotes', 'Things people have said that stuck with me.', 'quotes', 'quote', quotes, renderQuotePreview(quotes[0]), '4 quotes') +
      overviewSection('Channels', 'YouTube channels I keep returning to for ideas and craft.', 'channels', 'channel', channels, renderMonitorPreview(channels[0]), '31 channels');

    host.querySelectorAll('[data-preview-item]').forEach(function (row) {
      row.addEventListener('mouseenter', updatePreview);
      row.addEventListener('focus', updatePreview);
    });

    host.querySelectorAll('[data-expand-section]').forEach(function (button) {
      button.addEventListener('click', function () {
        var section = button.closest('.misc-section');
        section.querySelectorAll('[hidden]').forEach(function (item) { item.hidden = false; });
        button.hidden = true;
      });
    });
  }

  function overviewSection(title, subtitle, href, kind, data, preview, countText) {
    var shown = data.slice(0, 5).map(function (item) { return makeRow(item, kind, false); }).join('');
    var hidden = data.slice(5).map(function (item) { return makeRow(item, kind, true); }).join('');
    var more = data.length > 5 ? '<button type="button" data-expand-section>+ ' + (data.length - 5) + ' more</button>' : '<span></span>';
    return '<section class="misc-section" data-section="' + kind + '"><div class="section-copy">' +
      '<h2 class="section-heading"><a href="../' + href + '/">' + title + '</a></h2><p class="section-subtitle">' + subtitle + '</p></div>' +
      '<div class="collection-layout"><div class="preview-stage" data-preview-stage>' + preview + '</div>' +
      '<div class="collection-list"><p class="favorite-line">Recent <span class="star">★</span> <a href="../' + href + '/">favorites</a>:</p>' +
      '<ul class="item-list">' + shown + hidden + '</ul><div class="more-line"><span>' + countText + '</span>' + more + '</div></div></div></section>';
  }

  function updatePreview(event) {
    var row = event.currentTarget;
    var section = row.closest('.misc-section');
    section.querySelectorAll('.list-row').forEach(function (item) { item.classList.remove('is-active'); });
    row.classList.add('is-active');
    var item = {
      title: row.dataset.title,
      creator: row.dataset.creator,
      cover: row.dataset.cover,
      tag: row.dataset.tag
    };
    var stage = section.querySelector('[data-preview-stage]');
    if (row.dataset.kind === 'album') stage.innerHTML = renderAlbumPreview(item);
    if (row.dataset.kind === 'book') stage.innerHTML = renderBookPreview(item);
    if (row.dataset.kind === 'quote') stage.innerHTML = renderQuotePreview(item);
    if (row.dataset.kind === 'channel') stage.innerHTML = renderMonitorPreview(item);
  }

  function renderAlbumPreview(item) {
    return '<div class="album-object"><div class="album-disc"><img src="' + item.cover + '" alt=""></div>' +
      '<div class="album-cover"><img src="' + item.cover + '" alt="' + escapeAttr(item.title) + ' by ' + escapeAttr(item.creator || '') + '"></div></div>';
  }

  function renderBookPreview(item) {
    return '<div class="book-preview"><img src="' + item.cover + '" alt="' + escapeAttr(item.title) + '"></div>';
  }

  function renderQuotePreview(item) {
    return '<div class="quote-card"><span class="quote-mark">“</span><p>' + item.title + '</p><cite>— ' + item.creator + '</cite></div>';
  }

  function renderMonitorPreview(item) {
    return '<div class="monitor-preview"><div class="monitor-screen"><span>▶</span></div><div class="monitor-base"></div></div>';
  }

  function renderLibrary() {
    var list = document.querySelector('[data-tracklist]');
    if (!list) return;
    list.innerHTML = tracks.map(function (track, i) {
      return '<li><span>' + (i + 1) + '</span><div><strong>' + track[0] + '</strong><span>' + track[1] + '</span></div><span>' + track[2] + '</span></li>';
    }).join('');

    document.querySelectorAll('[data-library-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('[data-library-tab]').forEach(function (item) { item.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var label = tab.textContent.trim();
        document.querySelector('[data-ipod-title]').textContent = label;
      });
    });
  }

  function renderBookshelf() {
    var grid = document.querySelector('[data-book-grid]');
    if (!grid) return;
    grid.innerHTML = books.concat([
      { title: 'Good Economics for Hard Times', cover: assetBase + 'images/books/55707494.jpg' },
      { title: 'The Signal and the Noise', cover: assetBase + 'images/books/1024685.jpg' },
      { title: 'The Making of the Atomic Bomb', cover: assetBase + 'images/books/10534.jpg' }
    ]).filter(function (book) { return !book.cover.match(/undefined/); }).map(function (book) {
      return '<a class="shelf-book" href="https://www.google.com/search?q=' + encodeURIComponent(book.title + ' book') + '" target="_blank" rel="noopener noreferrer" data-book-card data-title="' + escapeAttr(book.title.toLowerCase()) + '"><img src="' + book.cover + '" alt="' + escapeAttr(book.title) + '"></a>';
    }).join('');

    var search = document.querySelector('[data-book-search]');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      document.querySelectorAll('[data-book-card]').forEach(function (card) {
        card.hidden = q && card.dataset.title.indexOf(q) === -1;
      });
    });
  }

  function renderQuotes() {
    var wall = document.querySelector('[data-quote-wall]');
    if (!wall) return;
    wall.innerHTML = [
      { title: "Don't ignore your dreams; don't work too much; say what you think; cultivate friendships; be happy.", creator: 'Paul Graham' },
      quotes[0],
      { title: 'To all of you out there, please keep your dreams alive.', creator: 'Ke Huy Quan' },
      quotes[2],
      quotes[3]
    ].map(function (quote) {
      return '<article class="big-quote"><p>' + quote.title + '</p><cite>' + quote.creator + '</cite></article>';
    }).join('');
  }

  function renderChannels() {
    var host = document.querySelector('[data-channel-groups]');
    if (!host) return;
    var groups = ['STEM', 'History', 'World', 'Infrastructure', 'Econ', 'Creators'];
    host.innerHTML = groups.map(function (group) {
      var cards = channels.filter(function (channel) { return channel.group === group; }).map(function (channel) {
        return '<a class="channel-card" data-channel-card data-group="' + channel.group + '" href="' + channel.href + '" target="_blank" rel="noopener noreferrer">' +
          '<div class="channel-thumb"></div><div class="channel-card-footer"><h3>' + channel.title + '</h3><span class="youtube">▶</span></div></a>';
      }).join('');
      return '<section class="channel-group" data-channel-group="' + group + '"><h2>' + group + '</h2><div class="channel-grid">' + cards + '</div></section>';
    }).join('');

    document.querySelectorAll('[data-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-filter]').forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');
        var filter = button.dataset.filter;
        document.querySelectorAll('[data-channel-group]').forEach(function (section) {
          section.hidden = filter !== 'All groups' && section.dataset.channelGroup !== filter;
        });
        document.querySelector('[data-showing]').textContent = filter === 'All groups' ? 'Showing 31 channels across 6 groups.' : 'Showing ' + channels.filter(function (c) { return c.group === filter; }).length + ' channels in ' + filter + '.';
      });
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

    if (theme) {
      theme.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('aarsh-misc-theme', next);
      });
    }

    if (menu && menuPanel) {
      menu.addEventListener('click', function () { menuPanel.classList.toggle('is-open'); });
    }

    var links = [
      ['Home', assetBase + 'index.html'],
      ['Work', assetBase + 'work/'],
      ['Projects', assetBase + 'projects/'],
      ['Research', assetBase + 'research/'],
      ['Miscellany', assetBase + 'miscellany/'],
      ['Music Library', assetBase + 'library/'],
      ['Bookshelf', assetBase + 'bookshelf/'],
      ['Quotes', assetBase + 'quotes/'],
      ['Channels', assetBase + 'channels/']
    ];

    function paintResults(q) {
      var filtered = links.filter(function (link) { return link[0].toLowerCase().indexOf(q.toLowerCase()) !== -1; });
      results.innerHTML = filtered.map(function (link) { return '<a href="' + link[1] + '">' + link[0] + '</a>'; }).join('');
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
      });
    }
  }

  renderOverview();
  renderLibrary();
  renderBookshelf();
  renderQuotes();
  renderChannels();
  setupControls();
})();
