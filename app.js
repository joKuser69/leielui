/* LEI & LUI by Ioana — comportamento minimo */
(function () {
  var root = document.documentElement;

  /* --- Fine dell'animazione d'ingresso --- */
  var INTRO_MS = 6900;               // durata totale della sequenza (vedi style.css)
  var timer = null;
  function endIntro() {
    if (timer) { clearTimeout(timer); timer = null; }
    root.classList.remove('intro');  // senza la classe il logo è già nello stato finale
  }
  if (root.classList.contains('intro')) {
    timer = setTimeout(endIntro, INTRO_MS);
    var skip = document.querySelector('.skip-intro');
    if (skip) skip.addEventListener('click', endIntro);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') endIntro(); });
  }

  /* --- Il marchio nell'header compare quando il logo grande esce dallo schermo --- */
  var logo = document.querySelector('.logo');
  if (logo && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      root.classList.toggle('scrolled', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(logo);
  } else {
    root.classList.add('scrolled');  // senza supporto: marchio sempre visibile
  }
})();
