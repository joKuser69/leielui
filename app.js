/* LEI & LUI by Ioana — comportamento
   1. fine dell'animazione d'ingresso (solo prima visita, vedi boot.js)
   2. marchio nell'header quando il logo grande esce dallo schermo
   3. comparsa dolce dei contenuti allo scroll
   4. riflesso sul logo che segue lo scroll + parallasse leggero (logo e gemme)  */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Fine dell'animazione d'ingresso --- */
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

  var hero = document.querySelector('.hero');
  var logo = document.querySelector('.logo');

  /* --- 2. Il marchio nell'header compare quando il logo grande esce dallo schermo --- */
  if (logo && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      root.classList.toggle('scrolled', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(logo);
  } else {
    root.classList.add('scrolled');
  }

  /* --- 3. Comparsa allo scroll --- */
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  /* --- 4. Riflesso + parallasse, guidati dallo scroll (un solo ciclo per fotogramma) --- */
  if (reduce) return;
  var decos = document.querySelectorAll('.deco');
  var ticking = false;

  function update() {
    ticking = false;
    var y = Math.max(0, window.pageYOffset || 0);
    var vh = window.innerHeight || 800;

    if (logo && hero) {
      var hh = hero.offsetHeight || vh;
      var p = Math.min(1, y / (hh * 0.6));                 // il riflesso attraversa il logo nel primo 60% dell'hero
      logo.style.setProperty('--shine', p.toFixed(3));
      logo.style.setProperty('--py', (Math.min(y, hh) * 0.12).toFixed(1));   // il logo scorre al 88% della pagina
      root.classList.toggle('scrolled-a-bit', y > 40);
    }
    for (var k = 0; k < decos.length; k++) {
      var d = decos[k];
      var f = parseFloat(d.getAttribute('data-parallax')) || 0.1;
      var r = d.parentElement.getBoundingClientRect();     // si misura la sezione, non l'elemento (che si muove)
      d.style.setProperty('--py', ((vh / 2 - (r.top + r.height / 2)) * f).toFixed(1));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
