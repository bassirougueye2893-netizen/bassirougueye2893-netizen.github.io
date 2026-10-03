(function(){
  const DATA = window.R2A_DATA;
  const login = document.getElementById('adminLogin');
  const panel = document.getElementById('adminPanel');
  const form = document.getElementById('productForm');
  const promoForm = document.getElementById('promoForm');
  const reelForm = document.getElementById('reelForm');

  function loadProducts(){ return DATA.load(DATA.STORAGE_KEYS.products, DATA.DEFAULT_PRODUCTS); }
  function loadPromos(){ return DATA.load(DATA.STORAGE_KEYS.promos, DATA.DEFAULT_PROMOS); }
  function loadReels(){ return DATA.load(DATA.STORAGE_KEYS.reels, DATA.DEFAULT_REELS); }
  function saveProducts(v){ DATA.save(DATA.STORAGE_KEYS.products, v); }
  function savePromos(v){ DATA.save(DATA.STORAGE_KEYS.promos, v); }
  function saveReels(v){ DATA.save(DATA.STORAGE_KEYS.reels, v); }

  function showPanel(){
    login.style.display = 'none';
    panel.style.display = 'block';
    renderLists();
  }

  function renderLists(){
    const products = loadProducts();
    const promos = loadPromos();
    const reels = loadReels();
    document.getElementById('productsList').innerHTML = products.map((p, i) => `
      <div class="list-item admin-stock-item">
        <div class="row">
          <strong>${p.name}</strong>
          <button class="btn btn-small btn-outline" data-del-product="${i}">Supprimer</button>
        </div>
        <div class="muted">${p.category} • ${p.price} € • ${p.sizes.join(', ')}</div>
        <div class="admin-stock-row">
          <label for="stock-${i}">Stock disponible</label>
          <input id="stock-${i}" class="input admin-stock-input" type="number" min="0" step="1" value="${Math.max(0, Number(p.stock ?? 20))}" data-stock-input="${i}">
          <button class="btn btn-small btn-primary" type="button" data-save-stock="${i}">Mettre à jour</button>
        </div>
      </div>`).join('');
    document.getElementById('promosList').innerHTML = promos.map((p, i) => `<div class="list-item"><div class="row"><strong>${p.code}</strong><button class="btn btn-small btn-outline" data-del-promo="${i}">Supprimer</button></div><div class="muted">${p.type === 'percent' ? p.value + '%' : p.value + ' €'} • ${p.active ? 'actif' : 'inactif'}</div></div>`).join('');
    document.getElementById('reelsList').innerHTML = reels.map((r, i) => `<div class="list-item"><div class="row"><strong>${r.title || 'Reel'}</strong><button class="btn btn-small btn-outline" data-del-reel="${i}">Supprimer</button></div><div class="muted" style="word-break:break-all">${r.video ? '🎬 Vidéo directe : ' + r.video : 'Instagram : ' + (r.url || '')}</div></div>`).join('');

    document.querySelectorAll('[data-del-product]').forEach(btn => btn.onclick = () => { const items = loadProducts(); items.splice(Number(btn.dataset.delProduct),1); saveProducts(items); renderLists(); });

    document.querySelectorAll('[data-save-stock]').forEach(btn => btn.onclick = () => {
      const index = Number(btn.dataset.saveStock);
      const input = document.querySelector(`[data-stock-input="${index}"]`);
      const value = Math.max(0, Math.floor(Number(input ? input.value : 0)));
      const items = loadProducts();
      if(!items[index]) return;
      items[index].stock = value;
      saveProducts(items);
      renderLists();
    });

    document.querySelectorAll('[data-del-promo]').forEach(btn => btn.onclick = () => { const items = loadPromos(); items.splice(Number(btn.dataset.delPromo),1); savePromos(items); renderLists(); });
    document.querySelectorAll('[data-del-reel]').forEach(btn => btn.onclick = () => { const items = loadReels(); items.splice(Number(btn.dataset.delReel),1); saveReels(items); renderLists(); });
  }

  async function sha256(value){
    if(!window.crypto || !window.crypto.subtle){
      throw new Error('Web Crypto indisponible. Lance l’outil via LANCER_LOCAL.bat / localhost.');
    }
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  document.getElementById('loginBtn').onclick = async function(){
    const pass = document.getElementById('adminPassword').value;
    try{
      const hash = await sha256(pass);
      if(hash !== DATA.ADMIN_PASSWORD_HASH){
        alert('Mot de passe admin incorrect.');
        return;
      }
      document.getElementById('adminPassword').value = '';
      localStorage.setItem(DATA.STORAGE_KEYS.admin, '1');
      showPanel();
    }catch(err){
      alert(err.message || 'Impossible de vérifier le mot de passe.');
    }
  };

  document.getElementById('logoutBtn').onclick = function(){
    localStorage.removeItem(DATA.STORAGE_KEYS.admin);
    location.reload();
  };

  form.onsubmit = function(e){
    e.preventDefault();
    const fd = new FormData(form);
    const file = document.getElementById('productImage').files[0];
    const product = {
      id:'p-' + Date.now(),
      name:fd.get('name'),
      category:fd.get('category'),
      price:Number(fd.get('price') || 30),
      stock:Math.max(0, Math.floor(Number(fd.get('stock') || 0))),
      sizes:String(fd.get('sizes') || '').split(',').map(s => s.trim()).filter(Boolean),
      description:fd.get('description'),
      image:'',
      gallery:[],
      visible:true
    };
    function finish(img){
      product.image = img || 'jersey_front_torso.png';
      product.gallery = [product.image, 'jersey_front_torso.png', 'jersey_back_clean.png'];
      const items = loadProducts();
      items.push(product); saveProducts(items); form.reset(); renderLists(); alert('Article ajouté.');
    }
    if(file){
      const reader = new FileReader();
      reader.onload = () => finish(reader.result);
      reader.readAsDataURL(file);
    }else finish(fd.get('imageUrl'));
  };

  promoForm.onsubmit = function(e){
    e.preventDefault();
    const fd = new FormData(promoForm);
    const items = loadPromos();
    items.push({code:fd.get('code'), type:fd.get('type'), value:Number(fd.get('value')), active:true});
    savePromos(items); promoForm.reset(); renderLists(); alert('Code promo ajouté.');
  };

  reelForm.onsubmit = function(e){
    e.preventDefault();
    const fd = new FormData(reelForm);
    const items = loadReels();
    items.push({title:fd.get('title'), url:fd.get('url'), video:fd.get('video')});
    saveReels(items); reelForm.reset(); renderLists(); alert('Lien Reel ajouté.');
  };

  if(localStorage.getItem(DATA.STORAGE_KEYS.admin) === '1') showPanel();
})();
