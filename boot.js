/* Eseguito nell'<head>, prima del rendering.
   Decide se mostrare l'animazione d'ingresso: solo alla PRIMA visita di questo browser.
   - Ricorda la visita con una voce locale (localStorage): resta sul dispositivo, non viene inviata a nessuno.
   - Rispetta "riduci movimento" del sistema.
   - Per rivederla (test): aggiungi ?intro all'indirizzo, es. .../index.html?intro  */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var force = /[?&]intro(=|&|$)/.test(location.search);
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var seen = localStorage.getItem('ll-intro-v1');
    if ((force || !seen) && !reduce) {
      root.classList.add('intro');
      localStorage.setItem('ll-intro-v1', '1');
    }
  } catch (e) { /* storage non disponibile: niente animazione, sito normale */ }
})();
