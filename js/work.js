(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-work-card]'));

  cards.forEach(function (card) {
    var button = card.querySelector('.work-card__button');
    if (!button) return;

    button.addEventListener('click', function () {
      var isOpen = card.classList.contains('is-open');
      card.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();
