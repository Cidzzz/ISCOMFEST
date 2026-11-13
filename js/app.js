'use strict';
/* =============== State + persistensi lokal =============== */
    var LS_KEY = 'kantinku-ai-v1';
    var state = load() || fresh();
    var cart = {};            // menuId -> qty (tidak disimpan, per sesi)
    var ui = { role:'siswa', cat:'semua', search:'', sort:'populer', ostatus:'semua', osearch:'', pickup:'Istirahat 1 · 09.30' };
    function fresh(){ return { menus: seedMenus(), orders: seedOrders(), seq: 6, ratings: {} }; }
    function load(){
      try { var raw = localStorage.getItem(LS_KEY); if(!raw) return null; var d = JSON.parse(raw);
        if(!d || !Array.isArray(d.menus) || !Array.isArray(d.orders)) return null; return d;
      } catch(e){ return null; }
    }
    function save(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch(e){} }

    /* =============== Helper =============== */
    function $(s){ return document.querySelector(s); }
    function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
    function rp(n){ return 'Rp' + Number(n||0).toLocaleString('id-ID'); }
    function menuById(id){ for (var i=0;i<state.menus.length;i++) if (state.menus[i].id===id) return state.menus[i]; return null; }
    function orderTotal(o){ return o.items.reduce(function(s,it){ return s + it.price*it.qty; }, 0); }
    function isOut(m){ return !m.available || m.stock<=0; }
    var toastTimer = null;
    function toast(msg){
      var t = $('#toast'); t.textContent = msg; t.classList.add('show');
      clearTimeout(toastTimer); toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2600);
    }
    function starSvg(fill){
      return '<svg width="17" height="17" viewBox="0 0 24 24" fill="'+(fill?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>';
    }
    var checkSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    /* =============== Render: katalog siswa =============== */
    function renderCatalog(){
      var q = ui.search.trim().toLowerCase();
      var list = state.menus.filter(function(m){
        if (ui.cat!=='semua' && m.cat!==ui.cat) return false;
        if (q && m.name.toLowerCase().indexOf(q)===-1 && m.desc.toLowerCase().indexOf(q)===-1) return false;
        return true;
      });
      list.sort(function(a,b){
        if (ui.sort==='murah') return a.price-b.price;
        if (ui.sort==='mahal') return b.price-a.price;
        if (ui.sort==='rating') return b.rating-a.rating;
        return b.sold-a.sold;
      });
      $('#menu-empty').hidden = list.length>0;
      $('#menu-grid').innerHTML = list.map(function(m){
        var out = isOut(m);
        var qty = cart[m.id]||0;
        var tags = m.tastes.map(function(t){ return '<span class="tag">'+esc(t)+'</span>'; }).join('')
          + m.allergens.map(function(a){ return '<span class="tag alg">mengandung '+esc(a)+'</span>'; }).join('');
        var action;
        if (out) action = '<button class="add-btn" disabled>Habis</button>';
        else if (qty>0) action = '<div class="stepper"><button data-dec="'+m.id+'" aria-label="Kurangi">−</button><span class="qty">'+qty+'</span><button data-inc="'+m.id+'" aria-label="Tambah">+</button></div>';
        else action = '<button class="add-btn" data-add="'+m.id+'">+ Tambah</button>';
        return '<article class="menu-card'+(out?' out':'')+'">'
          + '<div class="ph"><img src="'+esc(m.img)+'" alt="Foto '+esc(m.name)+'" loading="lazy" />'
          + (out ? '<span class="badge-habis">Habis</span>' : '<span class="badge-stok'+(m.stock<=5?' low':'')+'">Stok '+m.stock+'</span>')
          + '</div><div class="menu-body">'
          + '<h3>'+esc(m.name)+'</h3>'
          + '<div><span class="rating">'+starSvg(true)+' '+m.rating.toFixed(1)+'</span> <span style="color:var(--muted-fg);font-size:.82rem;font-weight:600">('+m.ratingCount+') · terjual '+m.sold+'</span></div>'
          + '<p class="desc">'+esc(m.desc)+'</p>'
          + '<div class="tags">'+tags+'</div>'
          + '<div class="menu-foot"><span class="price">'+rp(m.price)+'</span>'+action+'</div>'
          + '</div></article>';
      }).join('');
      var mc = $('#meta-menu-count'); if(mc) mc.textContent = state.menus.length + ' menu';
    }

    /* =============== Render: keranjang =============== */
    function cartEntries(){ return Object.keys(cart).map(function(id){ return {menu: menuById(id), qty: cart[id]}; }).filter(function(e){ return e.menu && e.qty>0; }); }
    function cartTotal(){ return cartEntries().reduce(function(s,e){ return s + e.menu.price*e.qty; }, 0); }
    function cartCount(){ return cartEntries().reduce(function(s,e){ return s + e.qty; }, 0); }
    function setQty(id, qty){
      var m = menuById(id); if(!m) return;
      qty = Math.max(0, Math.min(qty, m.stock));
      if (qty===0) delete cart[id]; else cart[id] = qty;
      renderCatalog(); renderCart();
    }
    function renderCart(){
      var n = cartCount(), total = cartTotal();
      var badge = $('#cart-count'); badge.hidden = n===0; badge.textContent = n;
      var bar = $('#cart-bar');
      bar.classList.toggle('show', n>0 && ui.role==='siswa');
      $('#cart-bar-total').textContent = rp(total);
      $('#cart-bar-count').textContent = n + ' item di keranjang';
      var entries = cartEntries();
      $('#cart-empty').hidden = entries.length>0;
      $('#cart-summary').style.display = entries.length? '' : 'none';
      $('#cart-lines').innerHTML = entries.map(function(e){
        return '<div class="cart-line"><img src="'+esc(e.menu.img)+'" alt="" />'
          + '<div class="nm"><b>'+esc(e.menu.name)+'</b><span>'+rp(e.menu.price)+' × '+e.qty+'</span></div>'
          + '<div class="stepper"><button data-dec="'+e.menu.id+'" aria-label="Kurangi">−</button><span class="qty">'+e.qty+'</span><button data-inc="'+e.menu.id+'" aria-label="Tambah">+</button></div>'
          + '<b style="min-width:76px;text-align:right">'+rp(e.menu.price*e.qty)+'</b></div>';
      }).join('');
      $('#cart-total').textContent = rp(total);
      checkBudget();
    }
    function checkBudget(){
      var b = parseInt($('#cart-budget').value, 10);
      var w = $('#cart-warn'), total = cartTotal();
      if (!isNaN(b) && total > b && total > 0){
        w.textContent = 'Total ' + rp(total) + ' melebihi budget ' + rp(b) + ' sebesar ' + rp(total-b) + '. Kurangi item atau naikkan budget.';
        w.classList.add('show');
      } else w.classList.remove('show');
    }

    /* =============== Rekomendasi AI (skor rule-based transparan) =============== */
    function scoreMenu(m, prefs){
      if (isOut(m)) return null;
      if (prefs.avoid.indexOf('pedas')>-1 && m.tastes.indexOf('pedas')>-1) return null;
      if (prefs.avoid.indexOf('kacang')>-1 && m.allergens.indexOf('kacang')>-1) return null;
      if (prefs.type!=='semua' && m.cat!==prefs.type) return null;
      var score = 0, reasons = [];
      var matched = m.tastes.filter(function(t){ return prefs.tastes.indexOf(t)>-1; });
      matched.forEach(function(t){ score += 26; reasons.push('Sesuai selera ' + t); });
      if (m.price <= prefs.budget){ score += 22; reasons.push('Di dalam budget (' + rp(m.price) + ')'); }
      else { score -= Math.min(30, Math.round((m.price-prefs.budget)/prefs.budget*60)); reasons.push('Sedikit di atas budget'); }
      score += Math.round(m.rating * 4);
      if (m.rating >= 4.6) reasons.push('Rating tinggi ' + m.rating.toFixed(1) + ' dari siswa');
      score += Math.min(16, Math.round(m.sold/9));
      if (m.sold >= 90) reasons.push('Favorit — terjual ' + m.sold + ' porsi');
      if (m.stock <= 5) reasons.push('Stok hampir habis (' + m.stock + ' tersisa), amankan sekarang');
      return { menu: m, score: Math.max(1, Math.min(99, score)), reasons: reasons.slice(0,3) };
    }
    function recommend(){
      var budget = parseInt($('#ai-budget').value, 10);
      if (isNaN(budget) || budget <= 0) budget = 15000;
      var tastes = Array.prototype.map.call(document.querySelectorAll('#ai-tastes .chip.on'), function(c){ return c.dataset.taste; });
      var avoid = Array.prototype.map.call(document.querySelectorAll('#ai-avoid .chip.on'), function(c){ return c.dataset.avoid; });
      var type = $('#ai-type').value;
      var prefs = { budget: budget, tastes: tastes, avoid: avoid, type: type };
      var scored = state.menus.map(function(m){ return scoreMenu(m, prefs); }).filter(Boolean)
        .sort(function(a,b){ return b.score-a.score; });
      var box = $('#ai-result'); box.hidden = false;
      if (!scored.length){
        box.innerHTML = '<p class="empty-note">Belum ada menu tersedia yang cocok dengan kriteria itu. Coba longgarkan pantangan atau naikkan budget.</p>';
        return;
      }
      var html = '';
      // Paket hemat: makanan/snack terbaik + minuman terbaik yang totalnya masuk budget
      if (type==='semua'){
        var food = scored.filter(function(s){ return s.menu.cat!=='minuman'; })[0];
        var drink = scored.filter(function(s){ return s.menu.cat==='minuman'; })[0];
        if (food && drink && food.menu.price + drink.menu.price <= budget){
          var total = food.menu.price + drink.menu.price;
          html += '<div class="paket"><h3>Paket Rekomendasi AI</h3>'
            + '<p class="items">'+esc(food.menu.name)+' + '+esc(drink.menu.name)+'</p>'
            + '<div class="row"><span style="font-weight:700">Total '+rp(total)+' · sisa budget '+rp(budget-total)+'</span>'
            + '<button class="btn btn-primary" id="btn-paket" style="padding:8px 16px">Tambah Paket ke Keranjang</button></div></div>';
        }
      }
      html += '<div class="rec-grid">' + scored.slice(0,3).map(function(s){
        return '<div class="rec-card"><div class="top"><h4>'+esc(s.menu.name)+'</h4><span class="score">Skor '+s.score+'</span></div>'
          + '<ul class="reasons">' + s.reasons.map(function(r){ return '<li>'+checkSvg+'<span>'+esc(r)+'</span></li>'; }).join('') + '</ul>'
          + '<div class="foot"><span class="price">'+rp(s.menu.price)+'</span><button class="add-btn" data-add="'+s.menu.id+'">+ Tambah</button></div></div>';
      }).join('') + '</div>';
      box.innerHTML = html;
      var pk = $('#btn-paket');
      if (pk) pk.addEventListener('click', function(){
        var f = scored.filter(function(s){ return s.menu.cat!=='minuman'; })[0];
        var d = scored.filter(function(s){ return s.menu.cat==='minuman'; })[0];
        if (f) setQty(f.menu.id, (cart[f.menu.id]||0)+1);
        if (d) setQty(d.menu.id, (cart[d.menu.id]||0)+1);
        toast('Paket rekomendasi ditambahkan ke keranjang');
      });
      box.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }

    /* =============== Render: pesanan (dipakai siswa & petugas) =============== */
    function stepsHtml(o){
      var idx = STATUSES.indexOf(o.status);
      return '<div class="stepper-track">' + STATUSES.map(function(s, i){
        var cls = i < idx ? 'done' : (i === idx ? (s==='selesai' ? 'done' : 'now') : '');
        var inner = i < idx || s==='selesai' && i===idx ? checkSvg.replace('width="14" height="14"','width="15" height="15"') : String(i+1);
        return '<div class="step '+cls+'"><div class="dotc">'+inner+'</div><span class="lbl">'+STATUS_LABEL[s]+'</span></div>';
      }).join('') + '</div>';
    }
    function orderItemsHtml(o){
      return '<ul class="order-items">' + o.items.map(function(it){
        return '<li><span>'+it.qty+' × '+esc(it.name)+'</span><span>'+rp(it.price*it.qty)+'</span></li>';
      }).join('') + '</ul>';
    }
    function renderMyOrders(){
      var mine = state.orders.filter(function(o){ return o.mine; });
      var box = $('#my-orders');
      if (!mine.length){
        box.innerHTML = '<div class="order-card"><p class="empty-note" style="padding:0">Belum ada pesanan. Buat pre-order pertamamu dari katalog di atas — statusnya akan muncul di sini.</p></div>';
        return;
      }
      box.innerHTML = mine.slice().reverse().map(function(o){
        var html = '<article class="order-card"><div class="order-top"><div>'
          + '<span class="order-code">Kode <span class="gold">'+esc(o.code)+'</span></span>'
          + '<div class="order-meta">'+esc(o.nama)+' · '+esc(o.kelas)+' · dipesan '+esc(o.time)+' WIB</div></div>'
          + '<span class="status-pill st-'+o.status+'">'+STATUS_LABEL[o.status]+'</span></div>'
          + stepsHtml(o) + orderItemsHtml(o)
          + '<div class="order-total"><span>Total bayar tunai</span><span>'+rp(orderTotal(o))+'</span></div>'
          + '<div class="order-actions"><span class="pickup-note"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Ambil: '+esc(o.pickup)+'</span>'
          + '<button class="btn btn-ghost" data-reorder="'+esc(o.code)+'" style="padding:7px 14px;font-size:.88rem">Pesan Lagi</button></div>';
        if (o.status==='selesai'){
          html += o.items.map(function(it){
            var r = state.ratings[o.code+':'+it.menuId] || 0;
            var stars = '';
            for (var i=1;i<=5;i++) stars += '<button data-rate="'+esc(o.code)+'|'+esc(it.menuId)+'|'+i+'" class="'+(i<=r?'filled':'')+'" aria-label="Beri '+i+' bintang">'+starSvg(i<=r)+'</button>';
            return '<div class="rate-row"><span class="nm">'+esc(it.name)+'</span>'
              + (r ? '<span class="rated-note">Kamu beri '+r+' bintang — terima kasih!</span>' : '<span class="stars">'+stars+'</span><span style="font-size:.83rem;color:var(--muted-fg);font-weight:600">Beri rating</span>')
              + '</div>';
          }).join('');
        }
        return html + '</article>';
      }).join('');
    }
