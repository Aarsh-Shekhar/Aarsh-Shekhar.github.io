(function () {
  var root = document.documentElement;
  var papers = Array.prototype.slice.call(document.querySelectorAll('[data-paper]'));
  var yearBlocks = Array.prototype.slice.call(document.querySelectorAll('[data-year-block]'));
  var search = document.querySelector('[data-search]');
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu-popover]');
  var commandOpen = document.querySelector('[data-command-open]');
  var commandOverlay = document.querySelector('[data-command-overlay]');
  var commandInput = document.querySelector('[data-command-input]');
  var commandResults = document.querySelector('[data-command-results]');
  var modal = document.querySelector('[data-modal-panel]');
  var modalTitle = document.querySelector('[data-modal-title]');
  var modalCopy = document.querySelector('[data-modal-copy]');
  var modalClose = document.querySelector('[data-modal-close]');
  var scrollTop = document.querySelector('[data-scroll-top]');

  var storedTheme = localStorage.getItem('aarsh-research-theme');
  if (storedTheme === 'light') root.classList.add('light');
  if (themeToggle) themeToggle.textContent = root.classList.contains('light') ? '☾' : '☀';

  function filterPapers() {
    var q = search ? search.value.trim().toLowerCase() : '';
    papers.forEach(function (paper) {
      var haystack = paper.textContent.toLowerCase();
      paper.classList.toggle('is-hidden', q && haystack.indexOf(q) === -1);
    });

    yearBlocks.forEach(function (block) {
      var anyVisible = Array.prototype.some.call(block.querySelectorAll('[data-paper]'), function (paper) {
        return !paper.classList.contains('is-hidden');
      });
      block.style.display = anyVisible ? '' : 'none';
    });
  }

  if (search) search.addEventListener('input', filterPapers);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = root.classList.toggle('light');
      localStorage.setItem('aarsh-research-theme', isLight ? 'light' : 'dark');
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

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  papers.forEach(function (paper) {
    if (!paper.id) {
      var title = paper.querySelector('h3');
      paper.id = slug(title ? title.textContent : paper.dataset.title);
    }
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function openModal(paper, mode) {
    if (!modal || !modalTitle || !modalCopy) return;
    var title = paper.querySelector('h3') ? paper.querySelector('h3').textContent : 'Research';
    var copy = paper.querySelector('.abstract-text') ? paper.querySelector('.abstract-text').textContent : '';
    modalTitle.textContent = mode === 'bibtex' ? 'BibTeX' : title;
    modalCopy.textContent = mode === 'bibtex'
      ? '@misc{' + slug(title).replace(/-/g, '') + ',\\n  author = {Aarsh Shekhar},\\n  title = {' + title + '},\\n  year = {' + (paper.dataset.year || '2026') + '}\\n}'
      : copy;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  papers.forEach(function (paper) {
    Array.prototype.forEach.call(paper.querySelectorAll('[data-modal]'), function (button) {
      button.addEventListener('click', function () {
        openModal(paper, button.dataset.modal);
      });
    });

    Array.prototype.forEach.call(paper.querySelectorAll('[data-expand-media]'), function (button) {
      button.addEventListener('click', function () {
        openModal(paper, 'abstract');
      });
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal();
    });
  }

  var commands = [
    { label: 'Home', hint: 'Page', href: '../index.html' },
    { label: 'Work', hint: 'Page', href: '../work/' },
    { label: 'Projects', hint: 'Page', href: '../projects/' },
    { label: 'Research', hint: 'Page', href: '../research/' },
    { label: 'Thoughts', hint: 'Page', href: '../blog/' }
  ].concat(papers.map(function (paper) {
    var title = paper.querySelector('h3') ? paper.querySelector('h3').textContent : paper.dataset.title;
    return { label: title, hint: paper.dataset.year || 'Research', target: paper.id };
  }));

  function closeCommand() {
    if (!commandOverlay) return;
    commandOverlay.classList.remove('is-open');
    commandOverlay.setAttribute('aria-hidden', 'true');
  }

  function renderCommands(query) {
    if (!commandResults) return;
    var q = (query || '').trim().toLowerCase();
    commandResults.innerHTML = '';
    commands.filter(function (command) {
      return !q || command.label.toLowerCase().indexOf(q) !== -1 || command.hint.toLowerCase().indexOf(q) !== -1;
    }).forEach(function (command) {
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
      closeModal();
    }
  });

  if (scrollTop) {
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
