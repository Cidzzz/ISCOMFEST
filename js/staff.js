'use strict';
    /* =============== Render: petugas =============== */
    function renderStats(){
      var orders = state.orders;
      var revenue = orders.filter(function(o){ return o.status==='selesai'; }).reduce(function(s,o){ return s + orderTotal(o); }, 0)
        + orders.filter(function(o){ return o.status!=='selesai'; }).reduce(function(s,o){ return s + orderTotal(o); }, 0);
      var ready = orders.filter(function(o){ return o.status==='siap'; }).length;
      var active = orders.filter(function(o){ return o.status!=='selesai'; }).length;
      var best = state.menus.slice().sort(function(a,b){ return b.sold-a.sold; })[0];
      var icOrder = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>';
      var icReady = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
      var icMoney = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>';
      var icFire = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>';
      $('#stats').innerHTML =
        '<div class="stat"><div class="ic">'+icOrder+'</div><div class="num">'+orders.length+'</div><div class="cap">Pesanan hari ini ('+active+' aktif)</div></div>'
        + '<div class="stat"><div class="ic">'+icReady+'</div><div class="num">'+ready+'</div><div class="cap">Siap diambil</div></div>'
        + '<div class="stat"><div class="ic">'+icMoney+'</div><div class="num">'+rp(revenue)+'</div><div class="cap">Total nilai pesanan hari ini</div></div>'
        + '<div class="stat"><div class="ic">'+icFire+'</div><div class="num" style="font-size:1.15rem;line-height:1.3">'+esc(best?best.name:'-')+'</div><div class="cap">Menu terlaris · '+ (best?best.sold:0) +' porsi</div></div>';
    }
    function renderStaffOrders(){
      var q = ui.osearch.trim().toLowerCase();
      var list = state.orders.filter(function(o){
        if (ui.ostatus!=='semua' && o.status!==ui.ostatus) return false;
        if (q && o.code.toLowerCase().indexOf(q)===-1 && o.nama.toLowerCase().indexOf(q)===-1) return false;
        return true;
      });
      $('#staff-orders-empty').hidden = list.length>0;
      $('#staff-orders').innerHTML = list.slice().reverse().map(function(o){
        var next = NEXT_LABEL[o.status];
        return '<article class="order-card"><div class="order-top"><div>'
          + '<span class="order-code">Kode <span class="gold">'+esc(o.code)+'</span></span>'
          + '<div class="order-meta">'+esc(o.nama)+' · '+esc(o.kelas)+' · dipesan '+esc(o.time)+' WIB · Ambil: '+esc(o.pickup)+'</div></div>'
          + '<span class="status-pill st-'+o.status+'">'+STATUS_LABEL[o.status]+'</span></div>'
          + orderItemsHtml(o)
          + (o.catatan ? '<p style="margin:8px 0 0;font-size:.88rem"><b>Catatan:</b> '+esc(o.catatan)+'</p>' : '')
          + '<div class="order-total"><span>Total</span><span>'+rp(orderTotal(o))+'</span></div>'
          + (next ? '<div class="order-actions"><button class="btn btn-primary" data-advance="'+esc(o.code)+'" style="padding:8px 16px;font-size:.9rem">'+next+'</button></div>' : '<div class="order-actions"><span class="rated-note">Pesanan selesai — pembayaran tunai diterima di loket.</span></div>')
          + '</article>';
      }).join('');
    }
    function renderStaffMenus(){
      $('#staff-menus').innerHTML = state.menus.map(function(m){
        return '<div class="staff-menu-row"><img src="'+esc(m.img)+'" alt="" />'
          + '<div class="info"><b>'+esc(m.name)+'</b><span>'+CAT_LABEL[m.cat]+' · rating '+m.rating.toFixed(1)+' · terjual '+m.sold+'</span></div>'
          + '<div class="mini-field"><label for="sp-'+m.id+'">Harga (Rp)</label><input type="number" id="sp-'+m.id+'" data-price="'+m.id+'" value="'+m.price+'" min="0" step="500" /></div>'
          + '<div class="mini-field"><label for="ss-'+m.id+'">Stok</label><input type="number" id="ss-'+m.id+'" data-stock="'+m.id+'" value="'+m.stock+'" min="0" step="1" /></div>'
          + '<div class="mini-field"><label>Tersedia</label><span class="switch"><input type="checkbox" data-avail="'+m.id+'" '+(m.available?'checked':'')+' aria-label="Ketersediaan '+esc(m.name)+'" /><span class="tr"></span></span></div>'
          + '<button class="icon-btn" data-edit="'+m.id+'" aria-label="Edit '+esc(m.name)+'"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
          + '<button class="icon-btn danger" data-del="'+m.id+'" aria-label="Hapus '+esc(m.name)+'"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>'
          + '</div>';
      }).join('');
    }
    function renderRekap(){
      var counts = {diterima:0, disiapkan:0, siap:0, selesai:0};
      var revenueDone = 0, itemsSold = {};
      state.orders.forEach(function(o){
        counts[o.status]++;
        if (o.status==='selesai') revenueDone += orderTotal(o);
        o.items.forEach(function(it){ itemsSold[it.name] = (itemsSold[it.name]||0) + it.qty; });
      });
      var top = Object.keys(itemsSold).map(function(k){ return {name:k, n:itemsSold[k]}; }).sort(function(a,b){ return b.n-a.n; }).slice(0,5);
      var max = top.length ? top[0].n : 1;
      $('#rekap-body').innerHTML =
        '<div class="sum-row"><span>Pesanan selesai</span><span>'+counts.selesai+' dari '+state.orders.length+' pesanan</span></div>'
        + '<div class="sum-row"><span>Pemasukan dari pesanan selesai</span><span>'+rp(revenueDone)+'</span></div>'
        + '<div class="sum-row"><span>Dalam proses (diterima / disiapkan / siap)</span><span>'+counts.diterima+' / '+counts.disiapkan+' / '+counts.siap+'</span></div>'
        + '<h3 style="font-family:Karla,sans-serif;font-size:1rem;margin:16px 0 4px">Menu terjual hari ini (dari semua pesanan)</h3>'
        + (top.length ? top.map(function(t){ return '<div class="bar-row"><span>'+esc(t.name)+'</span><div class="bar-track"><div class="bar-fill" style="width:'+Math.round(t.n/max*100)+'%"></div></div><span>'+t.n+' porsi</span></div>'; }).join('') : '<p class="empty-note">Belum ada penjualan.</p>');
    }
    function renderStaff(){ renderStats(); renderStaffOrders(); renderStaffMenus(); renderRekap(); }
    function renderAll(){ renderCatalog(); renderCart(); renderMyOrders(); if (ui.role==='petugas') renderStaff(); }

    /* =============== Overlay =============== */
    function openOverlay(id){ $(id).classList.add('open'); }
    function closeOverlay(el){ el.classList.remove('open'); }
    document.querySelectorAll('.overlay').forEach(function(ov){
      ov.addEventListener('click', function(e){ if (e.target===ov) closeOverlay(ov); });
      ov.querySelectorAll('[data-close]').forEach(function(b){
        b.addEventListener('click', function(){
          closeOverlay(ov);
          if (ov.id==='overlay-success') document.getElementById('pesanan-saya').scrollIntoView({behavior:'smooth'});
        });
      });
    });
    document.addEventListener('keydown', function(e){
      if (e.key==='Escape') document.querySelectorAll('.overlay.open').forEach(closeOverlay);
    });

    /* =============== Checkout =============== */
    function placeOrder(){
      var nama = $('#co-nama').value.trim(), kelas = $('#co-kelas').value.trim();
      var ok = true;
      $('#err-nama').classList.toggle('show', !nama); if (!nama) ok = false;
      $('#err-kelas').classList.toggle('show', !kelas); if (!kelas) ok = false;
      if (!ok) return;
      var entries = cartEntries(); if (!entries.length) return;
      var code = 'KNT-' + String(state.seq).padStart(3,'0'); state.seq++;
      var now = new Date();
      var time = String(now.getHours()).padStart(2,'0') + '.' + String(now.getMinutes()).padStart(2,'0');
      var order = { code: code, nama: nama, kelas: kelas, pickup: ui.pickup, time: time, status:'diterima', mine:true,
        catatan: $('#co-catatan').value.trim(),
        items: entries.map(function(e){ return { menuId: e.menu.id, name: e.menu.name, price: e.menu.price, qty: e.qty }; }) };
      entries.forEach(function(e){ e.menu.stock = Math.max(0, e.menu.stock - e.qty); e.menu.sold += e.qty; });
      state.orders.push(order); save();
      cart = {}; renderAll();
      closeOverlay($('#overlay-cart'));
      $('#success-code').textContent = code;
      $('#success-detail').textContent = 'Ambil ' + order.pickup + ' · Total ' + rp(orderTotal(order)) + ' dibayar tunai di loket';
      openOverlay('#overlay-success');
    }

    /* =============== Form menu (tambah/edit) =============== */
    function fillPhotoOptions(selected){
      $('#mf-foto').innerHTML = PHOTOS.map(function(p){
        return '<option value="'+p.v+'"'+(p.v===selected?' selected':'')+'>'+p.t+'</option>';
      }).join('');
    }
    function openMenuForm(m){
      $('#menu-form-title').textContent = m ? 'Edit Menu' : 'Tambah Menu';
      $('#mf-id').value = m ? m.id : '';
      $('#mf-nama').value = m ? m.name : '';
      $('#mf-kat').value = m ? m.cat : 'makanan';
      $('#mf-harga').value = m ? m.price : 10000;
      $('#mf-stok').value = m ? m.stock : 10;
      $('#mf-desc').value = m ? m.desc : '';
      fillPhotoOptions(m ? m.img : PHOTOS[0].v);
      document.querySelectorAll('#mf-tastes .chip').forEach(function(c){
        c.classList.toggle('on', !!m && m.tastes.indexOf(c.dataset.mtaste)>-1);
      });
      $('#err-mf-nama').classList.remove('show');
      openOverlay('#overlay-menu');
    }

    /* =============== Wiring =============== */
    function setRole(role){
      ui.role = role;
      $('#role-siswa').classList.toggle('active', role==='siswa');
      $('#role-petugas').classList.toggle('active', role==='petugas');
      $('#role-siswa').setAttribute('aria-selected', role==='siswa');
      $('#role-petugas').setAttribute('aria-selected', role==='petugas');
      $('#view-siswa').hidden = role!=='siswa';
      $('#view-petugas').hidden = role!=='petugas';
      $('#btn-cart-top').style.display = role==='siswa' ? '' : 'none';
      if (role==='petugas') renderStaff();
      renderCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    $('#role-siswa').addEventListener('click', function(){ setRole('siswa'); });
    $('#role-petugas').addEventListener('click', function(){ setRole('petugas'); });

    // Chip groups generik
    function chipToggle(containerSel, cb){
      document.querySelectorAll(containerSel + ' .chip').forEach(function(c){
        c.addEventListener('click', function(){ c.classList.toggle('on'); if (cb) cb(); });
      });
    }
    function chipSingle(containerSel, attr, cb){
      document.querySelectorAll(containerSel + ' .chip').forEach(function(c){
        c.addEventListener('click', function(){
          document.querySelectorAll(containerSel + ' .chip').forEach(function(x){ x.classList.remove('on'); });
          c.classList.add('on'); cb(c.dataset[attr]);
        });
      });
    }
    chipToggle('#ai-tastes'); chipToggle('#ai-avoid'); chipToggle('#mf-tastes');
    chipSingle('#cat-chips', 'cat', function(v){ ui.cat = v; renderCatalog(); });
    chipSingle('#ord-chips', 'ostatus', function(v){ ui.ostatus = v; renderStaffOrders(); });
    chipSingle('#co-pickup', 'pickup', function(v){ ui.pickup = v; });
    document.querySelectorAll('[data-budget]').forEach(function(b){
      b.addEventListener('click', function(){
        $('#ai-budget').value = b.dataset.budget;
        $('#cart-budget').value = b.dataset.budget;
        document.querySelectorAll('[data-budget]').forEach(function(x){ x.classList.remove('on'); });
        b.classList.add('on'); checkBudget();
      });
    });
    $('#ai-budget').addEventListener('input', function(){ $('#cart-budget').value = this.value; });
    $('#cart-budget').addEventListener('input', checkBudget);
    $('#btn-recommend').addEventListener('click', recommend);
    $('#cat-search').addEventListener('input', function(){ ui.search = this.value; renderCatalog(); });
    $('#cat-sort').addEventListener('change', function(){ ui.sort = this.value; renderCatalog(); });
    $('#ord-search').addEventListener('input', function(){ ui.osearch = this.value; renderStaffOrders(); });

    // Klik dinamis: tambah/kurang/pesan lagi/rating/maju status/edit/hapus
    document.addEventListener('click', function(e){
      var t = e.target.closest('[data-add],[data-inc],[data-dec],[data-reorder],[data-rate],[data-advance],[data-edit],[data-del]');
      if (!t) return;
      if (t.dataset.add){ var m = menuById(t.dataset.add); setQty(t.dataset.add, (cart[t.dataset.add]||0)+1); if (m) toast(m.name + ' masuk keranjang'); }
      else if (t.dataset.inc){ setQty(t.dataset.inc, (cart[t.dataset.inc]||0)+1); }
      else if (t.dataset.dec){ setQty(t.dataset.dec, (cart[t.dataset.dec]||0)-1); }
      else if (t.dataset.reorder){
        var o = state.orders.filter(function(x){ return x.code===t.dataset.reorder; })[0];
        if (o){ var added = 0;
          o.items.forEach(function(it){ var mm = menuById(it.menuId); if (mm && !isOut(mm)){ setQty(it.menuId, Math.min((cart[it.menuId]||0)+it.qty, mm.stock)); added++; } });
          toast(added ? 'Pesanan '+o.code+' dimasukkan lagi ke keranjang' : 'Semua menu di pesanan itu sedang habis');
        }
      }
      else if (t.dataset.rate){
        var parts = t.dataset.rate.split('|');
        state.ratings[parts[0]+':'+parts[1]] = parseInt(parts[2],10);
        var mm2 = menuById(parts[1]);
        if (mm2){ mm2.rating = (mm2.rating*mm2.ratingCount + parseInt(parts[2],10)) / (mm2.ratingCount+1); mm2.ratingCount++; }
        save(); renderMyOrders(); renderCatalog();
        toast('Rating tersimpan — ikut menentukan rekomendasi AI');
      }
      else if (t.dataset.advance){
        var o2 = state.orders.filter(function(x){ return x.code===t.dataset.advance; })[0];
        if (o2){ var i = STATUSES.indexOf(o2.status); if (i < STATUSES.length-1){ o2.status = STATUSES[i+1]; save(); renderStaff(); renderMyOrders(); toast(o2.code + ' sekarang: ' + STATUS_LABEL[o2.status]); } }
      }
      else if (t.dataset.edit){ var m3 = menuById(t.dataset.edit); if (m3) openMenuForm(m3); }
      else if (t.dataset.del){
        if (t.dataset.confirm==='1'){
          state.menus = state.menus.filter(function(x){ return x.id!==t.dataset.del; });
          delete cart[t.dataset.del]; save(); renderStaff(); renderCatalog(); renderCart();
          toast('Menu dihapus');
        } else {
          t.dataset.confirm = '1'; t.classList.add('confirm'); t.innerHTML = 'Yakin?';
          setTimeout(function(){ if (t.isConnected){ t.dataset.confirm=''; t.classList.remove('confirm'); renderStaffMenus(); } }, 2600);
        }
      }
    });

    // Edit inline harga/stok/tersedia di kelola menu
    document.addEventListener('change', function(e){
      var el = e.target;
      if (el.dataset.price){ var m = menuById(el.dataset.price); var v = parseInt(el.value,10); if (m && !isNaN(v) && v>=0){ m.price = v; save(); renderCatalog(); toast('Harga ' + m.name + ' → ' + rp(v)); } }
      else if (el.dataset.stock){ var m2 = menuById(el.dataset.stock); var v2 = parseInt(el.value,10); if (m2 && !isNaN(v2) && v2>=0){ m2.stock = v2; save(); renderCatalog(); renderStaffMenus(); toast('Stok ' + m2.name + ' → ' + v2); } }
      else if (el.dataset.avail){ var m3 = menuById(el.dataset.avail); if (m3){ m3.available = el.checked; save(); renderCatalog(); toast(m3.name + (el.checked ? ' sekarang tersedia' : ' ditandai tidak tersedia')); } }
    });

    $('#btn-cart-top').addEventListener('click', function(){ openOverlay('#overlay-cart'); });
    $('#cart-bar').addEventListener('click', function(){ openOverlay('#overlay-cart'); });
    $('#checkout-form').addEventListener('submit', function(e){ e.preventDefault(); placeOrder(); });
    $('#btn-add-menu').addEventListener('click', function(){ openMenuForm(null); });
    $('#menu-form').addEventListener('submit', function(e){
      e.preventDefault();
      var nama = $('#mf-nama').value.trim();
      $('#err-mf-nama').classList.toggle('show', !nama); if (!nama) return;
      var tastes = Array.prototype.map.call(document.querySelectorAll('#mf-tastes .chip.on'), function(c){ return c.dataset.mtaste; });
      var data = { name: nama, cat: $('#mf-kat').value,
        price: Math.max(0, parseInt($('#mf-harga').value,10)||0), stock: Math.max(0, parseInt($('#mf-stok').value,10)||0),
        tastes: tastes, img: $('#mf-foto').value, desc: $('#mf-desc').value.trim() || 'Menu kantin pilihan petugas.' };
      var id = $('#mf-id').value;
      if (id){ var m = menuById(id); if (m) Object.assign(m, data); toast('Menu diperbarui'); }
      else { data.id = 'm' + Date.now(); data.available = true; data.allergens = []; data.rating = 5.0; data.ratingCount = 0; data.sold = 0; state.menus.push(data); toast('Menu baru ditambahkan'); }
      save(); closeOverlay($('#overlay-menu')); renderStaff(); renderCatalog();
    });
    $('#btn-reset').addEventListener('click', function(){
      try { localStorage.removeItem(LS_KEY); } catch(e){}
      state = fresh(); cart = {}; save(); renderAll();
      toast('Data demo direset ke kondisi awal');
    });

    renderAll();
