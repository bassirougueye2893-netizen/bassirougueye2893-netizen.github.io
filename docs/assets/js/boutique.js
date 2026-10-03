(function(){
  // ---- Effet 3D tilt au survol (souris) ----
  function initTilt(root){
    (root || document).querySelectorAll('.tilt').forEach(el => {
      if(el.dataset.tiltBound) return;
      el.dataset.tiltBound = '1';
      const inner = el.querySelector('.tilt-inner') || el;
      function onMove(e){
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -10;
        const ry = (px - 0.5) * 12;
        inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        el.style.setProperty('--mx', (px*100)+'%');
        el.style.setProperty('--my', (py*100)+'%');
      }
      function onLeave(){ inner.style.transform = 'rotateX(0deg) rotateY(0deg)'; }
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  // ---- Nav active au scroll ----
  function initActiveNav(){
    const links = document.querySelectorAll('.site-header .nav-links a[href^="#"]');
    if(!links.length) return;
    const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    function update(){
      let current = sections[0];
      sections.forEach(s => { if(window.scrollY + 140 >= s.offsetTop) current = s; });
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + (current && current.id)));
    }
    window.addEventListener('scroll', update, {passive:true});
    update();
  }

  // ---- Flip produit recto/verso ----
  window.R2A_bindFlipCards = function(root){
    (root || document).querySelectorAll('[data-flip-card]').forEach(card => {
      if(card.dataset.bound) return;
      card.dataset.bound = '1';
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  };

  // ---- Onglets boutique (Homme / Femme / Enfant) ----
  window.R2A_initBoutiqueTabs = function(){
    const tabs = document.querySelectorAll('[data-boutique-tab]');
    const panels = document.querySelectorAll('[data-boutique-panel]');
    if(!tabs.length) return;
    function show(cat){
      tabs.forEach(t => t.classList.toggle('active', t.dataset.boutiqueTab === cat));
      panels.forEach(p => p.classList.toggle('active', p.dataset.boutiquePanel === cat));
      history.replaceState(null, '', '#' + cat);
    }
    tabs.forEach(t => t.onclick = () => show(t.dataset.boutiqueTab));
    const initial = (location.hash || '').replace('#','') || tabs[0].dataset.boutiqueTab;
    show(tabs[Array.from(tabs).findIndex(t => t.dataset.boutiqueTab === initial)] ? initial : tabs[0].dataset.boutiqueTab);
  };

  window.R2A_initTiltScoped = initTilt;

  document.addEventListener('DOMContentLoaded', function(){
    initTilt();
    initActiveNav();
  });
})();
