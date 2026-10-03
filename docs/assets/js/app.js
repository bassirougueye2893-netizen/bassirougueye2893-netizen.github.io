(function(){
  const DATA = window.R2A_DATA;
        const cart = DATA.load(DATA.STORAGE_KEYS.cart, []);
  let activePromo = null;

  function persistCart(){ DATA.save(DATA.STORAGE_KEYS.cart, cart); }
  function money(v){ return `${Number(v).toFixed(2).replace('.',',')} €`; }
  function getShortcode(url){
    if(!url) return '';
    const m = String(url).match(/instagram\.com\/(?:reel|p)\/([^/?#]+)/i);
    return m ? m[1] : '';
  }
  function normalizeProduct(p){
    const copy = Object.assign({}, p);
    copy.image = DATA.asset(copy.image);
    copy.gallery = (copy.gallery || []).map(DATA.asset);
    copy.stock = Math.max(0, Math.floor(Number(copy.stock ?? 20)));
    return copy;
  }
  function getProducts(){ return DATA.load(DATA.STORAGE_KEYS.products, DATA.DEFAULT_PRODUCTS).filter(p => p.visible !== false).map(normalizeProduct); }

  function addToCart(productId, size, qty){
    const p = getProducts().find(x => x.id === productId);
    if(!p) return;

    if(p.stock <= 0){
      alert('Ce produit est actuellement en rupture de stock.');
      return;
    }

    const alreadyInCart = cart
      .filter(i => i.productId === productId)
      .reduce((sum, i) => sum + Number(i.qty || 0), 0);

    const requested = Math.max(1, Number(qty || 1));
    if(alreadyInCart + requested > p.stock){
      const remaining = Math.max(0, p.stock - alreadyInCart);
      alert(remaining > 0
        ? `Il ne reste que ${remaining} article${remaining > 1 ? 's' : ''} disponible${remaining > 1 ? 's' : ''} pour ce produit.`
        : 'Tu as déjà ajouté tout le stock disponible dans ton panier.');
      return;
    }

    const existing = cart.find(i => i.productId === productId && i.size === size);
    if(existing) existing.qty += requested; else cart.push({productId, size, qty:requested});
    persistCart();
    renderCart();
    openCart();
  }

  function removeFromCart(index){
    cart.splice(index,1);
    persistCart();
    renderCart();
  }


  function cartTotals(){
    let subtotal = 0;
    cart.forEach(item => {
      const p = getProducts().find(x => x.id === item.productId);
      if(p) subtotal += p.price * item.qty;
    });
    let discount = 0;
    if(activePromo){
      discount = activePromo.type === 'percent' ? subtotal * (activePromo.value/100) : activePromo.value;
      if(discount > subtotal) discount = subtotal;
    }
    return {subtotal, discount, total: subtotal - discount, promo:activePromo};
  }

  async function applyPromo(){
    const input = document.getElementById('promoInput');
    const status = document.getElementById('promoStatus');
    const code = (input ? input.value : '').trim();
    if(!code){
      activePromo = null;
      if(status) status.textContent = 'Aucun code promo appliqué';
      renderCart();
      return;
    }
    try{
      const response = await fetch((window.R2A_CONFIG && R2A_CONFIG.promoEndpoint) || '/api/promo', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({code})
      });
      const result = await response.json();
      if(!response.ok || !result.valid) throw new Error('invalid');
      activePromo = result.promo;
      if(status) status.textContent = `Code appliqué : ${activePromo.code}`;
    }catch(e){
      activePromo = null;
      if(status) status.textContent = 'Code invalide ou validation indisponible.';
    }
    renderCart();
  }

  function renderCart(){
    const wrap = document.getElementById('cartItems');
    const badge = document.getElementById('cartCount');
    if(!wrap || !badge) return;
    badge.textContent = cart.reduce((n,i)=>n+i.qty,0);
    if(cart.length === 0){
      wrap.innerHTML = '<div class="reel-empty">Ton panier est vide.</div>';
    }else{
      wrap.innerHTML = cart.map((item, index) => {
        const p = getProducts().find(x => x.id === item.productId);
        if(!p) return '';
        return `<div class="cart-item"><div class="row"><strong>${p.name}</strong><button class="btn btn-small btn-outline" data-remove-cart="${index}">Supprimer</button></div><div class="muted">Taille : ${item.size} • Qté : ${item.qty}</div><div class="row" style="margin-top:8px"><span class="muted">${money(p.price)} x ${item.qty}</span><strong>${money(p.price*item.qty)}</strong></div></div>`;
      }).join('');
    }
    const totals = cartTotals();
    const subtotal = document.getElementById('cartSubtotal');
    const discount = document.getElementById('cartDiscount');
    const total = document.getElementById('cartTotal');
    const promoStatus = document.getElementById('promoStatus');
    if(subtotal) subtotal.textContent = money(totals.subtotal);
    if(discount) discount.textContent = '-' + money(totals.discount);
    if(total) total.textContent = money(totals.total);
    if(promoStatus){
      if(totals.promo) promoStatus.textContent = `Code appliqué : ${totals.promo.code}`;
    }
    wrap.querySelectorAll('[data-remove-cart]').forEach(btn => btn.onclick = () => removeFromCart(Number(btn.dataset.removeCart)));
  }

  function openCart(){
    const d = document.getElementById('cartDrawer');
    const o = document.getElementById('cartOverlay');
    if(d) d.classList.add('open');
    if(o) o.classList.add('open');
  }
  function closeCart(){
    const d = document.getElementById('cartDrawer');
    const o = document.getElementById('cartOverlay');
    if(d) d.classList.remove('open');
    if(o) o.classList.remove('open');
  }

  function bindCartButtons(root){
    root.querySelectorAll('[data-add-product]').forEach(btn => {
      btn.onclick = function(){
        const id = btn.dataset.addProduct;
        const sizeSel = document.querySelector(`[data-size-for="${id}"]`);
        const qtySel = document.querySelector(`[data-qty-for="${id}"]`);
        const size = sizeSel ? sizeSel.value : 'Unique';
        const qty = qtySel ? Number(qtySel.value || 1) : 1;
        addToCart(id, size, qty);
      };
    });
  }

  function renderHomeCategories(){
    const target = document.getElementById('categoryGrid');
    if(!target) return;
    const map = [
      {key:'enfant', label:'Enfant', desc:'Toutes les tailles enfant pour bouger avec style.', image:'./assets/images/products/enfant/gallery-01-front-back.png'},
      {key:'homme', label:'Homme', desc:'Le maillot performance R2A pour la préparation et le terrain.', image:'./assets/images/products/homme/gallery-01-front-back.png'},
      {key:'femme', label:'Femme', desc:'Une coupe pensée pour le confort, la légèreté et la mobilité.', image:'./assets/images/products/femme/gallery-01-front-back.png'}
    ];
    target.innerHTML = map.map(x => `
      <article class="category-card tilt">
        <div class="tilt-inner">
          <div class="category-visual"><img src="${x.image}" alt="${x.label}"></div>
          <div class="category-body">
            <div class="kicker">Maillots R2A</div>
            <h3>${x.label}</h3>
            <p>${x.desc}</p>
            <a class="btn btn-primary" href="./boutique.html#${x.key}">Voir la page ${x.label.toLowerCase()}</a>
          </div>
        </div>
        <div class="shine"></div>
      </article>`).join('');
    if(window.R2A_initTiltScoped) window.R2A_initTiltScoped(target);
  }

  function reelMedia(reel, i){
    const title = reel.title || `Vidéo ${i+1}`;
    if(reel.video){
      return `
        <div class="reel-player-shell" data-native-player>
          <video class="reel-native-video" src="${reel.video}" autoplay muted loop playsinline preload="metadata"></video>
          <div class="reel-player-controls">
            <button class="reel-control" type="button" data-video-sound aria-label="Activer ou couper le son">🔇</button>
            <button class="reel-control" type="button" data-video-play aria-label="Lecture ou pause">⏸</button>
            <button class="reel-control" type="button" data-video-fullscreen aria-label="Plein écran">⛶</button>
          </div>
        </div>`;
    }
    const code = getShortcode(reel.url);
    if(!code) return `<div class="reel-empty">Vidéo indisponible.</div>`;
    return `
      <div class="reel-ig-shell">
        <iframe
          class="reel-ig-embed"
          title="${title}"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowfullscreen
          frameborder="0"
          scrolling="no"
          src="https://www.instagram.com/reel/${code}/embed">
        </iframe>
      </div>`;
  }

  function openReelModal(reel, i){
    let modal = document.getElementById('reelModal');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'reelModal';
      modal.className = 'reel-modal';
      modal.innerHTML = `
        <div class="reel-modal-backdrop" data-close-reel-modal></div>
        <div class="reel-modal-panel">
          <button class="reel-modal-close" type="button" data-close-reel-modal aria-label="Fermer">×</button>
          <div id="reelModalContent"></div>
        </div>`;
      document.body.appendChild(modal);
      modal.querySelectorAll('[data-close-reel-modal]').forEach(btn => btn.onclick = () => {
        modal.classList.remove('open');
        const c = document.getElementById('reelModalContent');
        if(c) c.innerHTML = '';
      });
    }
    const content = document.getElementById('reelModalContent');
    if(content) content.innerHTML = reelMedia(reel, i);
    modal.classList.add('open');
    bindVideoControls(modal);
  }

  function bindVideoControls(root){
    root.querySelectorAll('[data-native-player]').forEach(shell => {
      const video = shell.querySelector('video');
      const soundBtn = shell.querySelector('[data-video-sound]');
      const playBtn = shell.querySelector('[data-video-play]');
      const fsBtn = shell.querySelector('[data-video-fullscreen]');
      if(!video) return;

      if(soundBtn) soundBtn.onclick = () => {
        video.muted = !video.muted;
        soundBtn.textContent = video.muted ? '🔇' : '🔊';
      };
      if(playBtn) playBtn.onclick = () => {
        if(video.paused){
          video.play().catch(()=>{});
          playBtn.textContent = '⏸';
        }else{
          video.pause();
          playBtn.textContent = '▶';
        }
      };
      if(fsBtn) fsBtn.onclick = () => {
        const node = shell;
        if(node.requestFullscreen) node.requestFullscreen();
        else if(video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      };
    });
  }

  function renderReels(){
    const target = document.getElementById('reelsGrid');
    if(!target) return;
    const current = DATA.load(DATA.STORAGE_KEYS.reels, DATA.DEFAULT_REELS);
    if(!current.length){
      target.innerHTML = '<div class="reel-empty">Ajoute tes Reels depuis l’admin. Ils seront lus ici directement dans la page.</div>';
      return;
    }
    target.innerHTML = current.map((reel, i) => `
      <article class="reel-card" aria-label="${reel.title || `Vidéo ${i+1}`}">
        ${reelMedia(reel, i)}
        <button class="reel-expand-overlay" type="button" data-expand-reel="${i}" aria-label="Agrandir la vidéo">⛶</button>
      </article>`).join('');

    bindVideoControls(target);
    target.querySelectorAll('[data-expand-reel]').forEach(btn => {
      btn.onclick = () => openReelModal(current[Number(btn.dataset.expandReel)], Number(btn.dataset.expandReel));
    });
  }

  function productGalleryMarkup(p, idx){
    const front = p.gallery[1] || p.gallery[0];
    const back = p.gallery[2] || p.gallery[0];
    return `
      <div>
        <div class="flip-stage tilt">
          <div class="tilt-inner">
            <div class="flip-card" data-flip-card id="flip-${idx}">
              <div class="flip-face"><img src="${front}" alt="${p.name} — recto"></div>
              <div class="flip-face flip-face--back"><img src="${back}" alt="${p.name} — verso"></div>
            </div>
          </div>
          <div class="shine"></div>
        </div>
        <div class="flip-hint">🔄 Clique sur le visuel pour voir le dos du maillot</div>
        <div class="thumb-row">
          ${p.gallery.map(g => `<button class="thumb" data-flip-target="flip-${idx}" data-flip-image="${g}"><img src="${g}" alt="${p.name}"></button>`).join('')}
        </div>
      </div>`;
  }

  function renderCategoryPage(){
    const target = document.getElementById('productList');
    if(!target) return;
    const pageCategory = document.body.dataset.category;
    const pageProducts = getProducts().filter(p => p.category === pageCategory);
    target.innerHTML = pageProducts.map((p, idx) => `
      <section class="section section--tight">
        <div class="product-layout">
          ${productGalleryMarkup(p, idx)}
          <div class="product-panel">
            <div class="kicker">R2A • ${p.category}</div>
            <h2 style="margin:8px 0 0;font-size:2rem">${p.name}</h2>
            <div class="price">${money(p.price)}</div>
            <p class="section-copy" style="margin-top:0">${p.description}</p>
            ${p.stock <= 0
              ? `<div class="stock-alert stock-alert--out">Rupture de stock</div>`
              : p.stock <= 5
                ? `<div class="stock-alert stock-alert--low">🔥 Plus beaucoup de stock disponible — commande vite.</div>`
                : ``}
            <div class="sizes">${p.sizes.map(s => `<span class="size-chip">${s}</span>`).join('')}</div>
            <div class="form-grid">
              <label>
                <div style="margin-bottom:8px;font-weight:700">Choisir la taille</div>
                <select class="selector" data-size-for="${p.id}">${p.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select>
              </label>
              <label>
                <div style="margin-bottom:8px;font-weight:700">Quantité</div>
                <select class="selector" data-qty-for="${p.id}"><option>1</option><option>2</option><option>3</option><option>4</option></select>
              </label>
            </div>
            <div class="notice" style="margin:18px 0">Prix unique : 30 € • Les codes promo secrets peuvent être appliqués dans le panier.</div>
            <div class="row" style="margin-top:16px;flex-wrap:wrap">
              <button class="btn btn-primary" data-add-product="${p.id}" ${p.stock <= 0 ? 'disabled aria-disabled="true"' : ''}>${p.stock <= 0 ? 'Rupture de stock' : 'Ajouter au panier'}</button>
              <button class="btn btn-dark" onclick="document.getElementById('cartBtn').click()">Voir le panier</button>
            </div>
          </div>
        </div>
      </section>`).join('') || '<div class="reel-empty">Aucun produit pour cette catégorie.</div>';

    target.querySelectorAll('[data-flip-image]').forEach(btn => btn.onclick = (e) => {
      e.stopPropagation();
      const card = document.getElementById(btn.dataset.flipTarget);
      if(!card) return;
      const faces = card.querySelectorAll('img');
      if(faces[card.classList.contains('flipped') ? 1 : 0]) faces[card.classList.contains('flipped') ? 1 : 0].src = btn.dataset.flipImage;
    });
    bindCartButtons(target);
    if(window.R2A_bindFlipCards) window.R2A_bindFlipCards(target);
    if(window.R2A_initTiltScoped) window.R2A_initTiltScoped(target);
  }

  function renderBoutiquePage(){
    const wrap = document.getElementById('boutiquePanels');
    if(!wrap) return;
    const cats = [
      {key:'homme', label:'Homme'},
      {key:'femme', label:'Femme'},
      {key:'enfant', label:'Enfant'}
    ];
    const all = getProducts();
    wrap.innerHTML = cats.map(c => {
      const prods = all.filter(p => p.category === c.key);
      return `<div class="boutique-panel" data-boutique-panel="${c.key}">` + (prods.map((p, idx) => `
        <section class="section section--tight">
          <div class="product-layout">
            ${productGalleryMarkup(p, c.key + '-' + idx)}
            <div class="product-panel">
              <div class="kicker">R2A • ${p.category}</div>
              <h2 style="margin:8px 0 0;font-size:2rem">${p.name}</h2>
              <div class="price">${money(p.price)}</div>
              <p class="section-copy" style="margin-top:0">${p.description}</p>
              ${p.stock <= 0
                ? `<div class="stock-alert stock-alert--out">Rupture de stock</div>`
                : p.stock <= 5
                  ? `<div class="stock-alert stock-alert--low">🔥 Plus beaucoup de stock disponible — commande vite.</div>`
                  : ``}
              <div class="sizes">${p.sizes.map(s => `<span class="size-chip">${s}</span>`).join('')}</div>
              <div class="form-grid">
                <label><div style="margin-bottom:8px;font-weight:700">Choisir la taille</div>
                  <select class="selector" data-size-for="${p.id}">${p.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select>
                </label>
                <label><div style="margin-bottom:8px;font-weight:700">Quantité</div>
                  <select class="selector" data-qty-for="${p.id}"><option>1</option><option>2</option><option>3</option><option>4</option></select>
                </label>
              </div>
              <div class="notice" style="margin:18px 0">Prix unique : 30 € • Les codes promo secrets peuvent être appliqués dans le panier.</div>
              <div class="row" style="margin-top:16px;flex-wrap:wrap">
                <button class="btn btn-primary" data-add-product="${p.id}" ${p.stock <= 0 ? 'disabled aria-disabled="true"' : ''}>${p.stock <= 0 ? 'Rupture de stock' : 'Ajouter au panier'}</button>
                <button class="btn btn-dark" onclick="document.getElementById('cartBtn').click()">Voir le panier</button>
              </div>
            </div>
          </div>
        </section>`).join('') || '<div class="reel-empty">Aucun produit pour cette catégorie.</div>') + `</div>`;
    }).join('');

    wrap.querySelectorAll('[data-flip-image]').forEach(btn => btn.onclick = (e) => {
      e.stopPropagation();
      const card = document.getElementById(btn.dataset.flipTarget);
      if(!card) return;
      const faces = card.querySelectorAll('img');
      const i = card.classList.contains('flipped') ? 1 : 0;
      if(faces[i]) faces[i].src = btn.dataset.flipImage;
    });
    bindCartButtons(wrap);
    if(window.R2A_bindFlipCards) window.R2A_bindFlipCards(wrap);
    if(window.R2A_initTiltScoped) window.R2A_initTiltScoped(wrap);
    if(window.R2A_initBoutiqueTabs) window.R2A_initBoutiqueTabs();
  }

  function bindGeneral(){
    const cartBtn = document.getElementById('cartBtn');
    const closeBtn = document.getElementById('closeCart');
    const overlay = document.getElementById('cartOverlay');
    const promoApply = document.getElementById('applyPromo');
    const checkout = document.getElementById('checkoutBtn');
    if(cartBtn) cartBtn.onclick = openCart;
    if(closeBtn) closeBtn.onclick = closeCart;
    if(overlay) overlay.onclick = closeCart;
    if(promoApply) promoApply.onclick = applyPromo;
    if(checkout) checkout.onclick = function(){
      if(!cart.length){ alert('Ton panier est vide.'); return; }
      const totals = cartTotals();
      const lines = cart.map(item => {
        const p = getProducts().find(x => x.id === item.productId);
        return p ? `• ${p.name} / ${item.size} / x${item.qty}` : '';
      }).filter(Boolean);
      const message = [
        'Bonjour, je souhaite commander :',
        ...lines,
        '',
        `Sous-total : ${money(totals.subtotal)}`,
        `Réduction : -${money(totals.discount)}`,
        `Total : ${money(totals.total)}`,
        totals.promo ? `Code promo : ${totals.promo.code}` : '',
        '',
        'Compte : @r2a.coaching'
      ].filter(Boolean).join('\n');
      navigator.clipboard && navigator.clipboard.writeText(message).catch(()=>{});
      alert('Le récapitulatif de commande a été copié. La page Instagram va maintenant s’ouvrir.');
      window.open((window.R2A_CONFIG && R2A_CONFIG.instagramUrl) || 'https://www.instagram.com/r2a.coaching/', '_blank');
    };

    document.querySelectorAll('[data-add-product]').forEach(btn => btn.onclick = function(){
      const id = btn.dataset.addProduct;
      const sizeSel = document.querySelector(`[data-size-for="${id}"]`);
      const qtySel = document.querySelector(`[data-qty-for="${id}"]`);
      const size = sizeSel ? sizeSel.value : 'Unique';
      const qty = qtySel ? Number(qtySel.value || 1) : 1;
      addToCart(id, size, qty);
    });
    renderCart();
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderHomeCategories();
    renderReels();
    renderCategoryPage();
    renderBoutiquePage();
    bindGeneral();
  });
})();
