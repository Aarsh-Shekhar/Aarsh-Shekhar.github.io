(function () {
  var root = document.documentElement;
  var list = document.querySelector('[data-project-list]');
  var projects = Array.prototype.slice.call(document.querySelectorAll('[data-project]'));
  var sortButtons = Array.prototype.slice.call(document.querySelectorAll('[data-sort]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu-popover]');
  var commandOpen = document.querySelector('[data-command-open]');
  var commandOverlay = document.querySelector('[data-command-overlay]');
  var commandInput = document.querySelector('[data-command-input]');
  var commandResults = document.querySelector('[data-command-results]');
  var scrollTop = document.querySelector('[data-scroll-top]');
  var state = { sort: 'az', filter: 'all' };

  var storedTheme = localStorage.getItem('aarsh-projects-theme');
  if (storedTheme === 'light') root.classList.add('light');
  if (themeToggle) themeToggle.textContent = root.classList.contains('light') ? '☾' : '☀';

  function setActive(buttons, attr, value) {
    buttons.forEach(function (button) {
      var active = button.getAttribute(attr) === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function applyProjects() {
    var sorted = projects.slice().sort(function (a, b) {
      if (state.sort === 'date') return b.dataset.date.localeCompare(a.dataset.date);
      if (state.sort === 'stars') return Number(b.dataset.stars) - Number(a.dataset.stars);
      return a.dataset.title.localeCompare(b.dataset.title);
    });

    sorted.forEach(function (project) {
      var hidden = state.filter !== 'all' && project.dataset.kind !== state.filter;
      project.classList.toggle('is-hidden', hidden);
      list.appendChild(project);
    });
  }

  sortButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      state.sort = button.dataset.sort;
      setActive(sortButtons, 'data-sort', state.sort);
      applyProjects();
    });
  });

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      state.filter = button.dataset.filter;
      setActive(filterButtons, 'data-filter', state.filter);
      applyProjects();
    });
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = root.classList.toggle('light');
      localStorage.setItem('aarsh-projects-theme', isLight ? 'light' : 'dark');
      themeToggle.textContent = isLight ? '☾' : '☀';
    });
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
    });

    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && event.target !== menuToggle) closeMenu();
    });
  }

  var commands = [
    { label: 'Home', hint: 'Page', href: '../index.html' },
    { label: 'Work', hint: 'Page', href: '../work/' },
    { label: 'Research', hint: 'Page', href: '../research/' },
    { label: 'Thoughts', hint: 'Page', href: '../blog/' },
    { label: 'Photography', hint: 'Page', href: '../photography/' },
    { label: 'MindMates App', hint: 'Project', target: 'mindmates-app' },
    { label: 'JWST Cosmic Ray Filtering Pipeline', hint: 'Project', target: 'jwst-cosmic-ray-filtering-pipeline' },
    { label: 'Mars Terrain Segmentation Model', hint: 'Project', target: 'mars-terrain-segmentation-model' },
    { label: 'IoT Laundry Tracker', hint: 'Project', target: 'iot-laundry-tracker' },
    { label: 'Decentralized Study Notes Marketplace', hint: 'Project', target: 'decentralized-study-notes-marketplace' },
    { label: 'iLog 2.0', hint: 'Project', target: 'ilog-2-0' }
  ];

  function closeCommand() {
    if (!commandOverlay) return;
    commandOverlay.classList.remove('is-open');
    commandOverlay.setAttribute('aria-hidden', 'true');
  }

  function renderCommands(query) {
    if (!commandResults) return;
    var q = (query || '').trim().toLowerCase();
    var matches = commands.filter(function (command) {
      return !q || command.label.toLowerCase().indexOf(q) !== -1 || command.hint.toLowerCase().indexOf(q) !== -1;
    });

    commandResults.innerHTML = '';
    matches.forEach(function (command) {
      var item = document.createElement(command.href ? 'a' : 'button');
      item.innerHTML = '<strong>' + command.label + '</strong><span>' + command.hint + '</span>';
      if (command.href) {
        item.href = command.href;
      } else {
        item.type = 'button';
        item.addEventListener('click', function () {
          var target = document.getElementById(command.target);
          closeCommand();
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      commandResults.appendChild(item);
    });
  }

  function openCommand() {
    if (!commandOverlay || !commandInput) return;
    renderCommands('');
    commandOverlay.classList.add('is-open');
    commandOverlay.setAttribute('aria-hidden', 'false');
    commandInput.value = '';
    window.setTimeout(function () { commandInput.focus(); }, 30);
  }

  if (commandOpen) commandOpen.addEventListener('click', openCommand);
  if (commandInput) commandInput.addEventListener('input', function () { renderCommands(commandInput.value); });
  if (commandOverlay) {
    commandOverlay.addEventListener('click', function (event) {
      if (event.target === commandOverlay) closeCommand();
    });
  }

  document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openCommand();
    }
    if (event.key === 'Escape') {
      closeMenu();
      closeCommand();
    }
  });

  if (scrollTop) {
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  applyProjects();
})();
