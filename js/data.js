
    'use strict';
    /* =============== Data awal (seed) =============== */
    var PHOTOS = [
      {v:'assets/img/ayam-geprek.jpg', t:'Ayam geprek'}, {v:'assets/img/mie-goreng.jpg', t:'Mie goreng'},
      {v:'assets/img/nasi-goreng.jpg', t:'Nasi goreng'}, {v:'assets/img/ayam-bakar.jpg', t:'Ayam bakar'},
      {v:'assets/img/soto-ayam.jpg', t:'Soto ayam'}, {v:'assets/img/chicken-katsu.jpg', t:'Chicken katsu'},
      {v:'assets/img/bakso.jpg', t:'Bakso'}, {v:'assets/img/dimsum.jpg', t:'Dimsum'},
      {v:'assets/img/pisang-goreng.jpg', t:'Pisang goreng'}, {v:'assets/img/kentang-goreng.jpg', t:'Kentang goreng'},
      {v:'assets/img/roti-bakar.jpg', t:'Roti bakar'}, {v:'assets/img/es-teh.jpg', t:'Es teh'},
      {v:'assets/img/es-jeruk.jpg', t:'Es jeruk'}, {v:'assets/img/jus-alpukat.jpg', t:'Jus alpukat'},
      {v:'assets/img/es-kopi-susu.jpg', t:'Es kopi susu'}
    ];
    function seedMenus(){ return [
      {id:'m1', name:'Nasi Ayam Geprek', cat:'makanan', price:12000, stock:18, available:true, img:'assets/img/ayam-geprek.jpg', desc:'Ayam crispy digeprek sambal bawang, nasi hangat, lalap timun.', tastes:['pedas','gurih'], allergens:[], rating:4.8, ratingCount:214, sold:132},
      {id:'m2', name:'Nasi Ayam Bakar Lalapan', cat:'makanan', price:13000, stock:12, available:true, img:'assets/img/ayam-bakar.jpg', desc:'Ayam bakar kecap di atas daun pisang, sambal terasi, lalapan segar.', tastes:['gurih','pedas'], allergens:[], rating:4.7, ratingCount:156, sold:98},
      {id:'m3', name:'Nasi Goreng Spesial', cat:'makanan', price:11000, stock:15, available:true, img:'assets/img/nasi-goreng.jpg', desc:'Nasi goreng telur mata sapi, ayam suwir, kerupuk udang.', tastes:['gurih','manis'], allergens:[], rating:4.6, ratingCount:141, sold:87},
      {id:'m4', name:'Mie Goreng Telur', cat:'makanan', price:10000, stock:20, available:true, img:'assets/img/mie-goreng.jpg', desc:'Mie goreng sayur dengan telur mata sapi dan bawang goreng.', tastes:['gurih'], allergens:[], rating:4.5, ratingCount:168, sold:110},
      {id:'m5', name:'Chicken Katsu Sambal Matah', cat:'makanan', price:14000, stock:10, available:true, img:'assets/img/chicken-katsu.jpg', desc:'Ayam katsu renyah, nasi pulen, sambal matah segar khas Bali.', tastes:['gurih','pedas'], allergens:[], rating:4.7, ratingCount:119, sold:76},
      {id:'m6', name:'Soto Ayam Lamongan', cat:'makanan', price:10000, stock:0, available:true, img:'assets/img/soto-ayam.jpg', desc:'Kuah soto bening gurih, suwiran ayam, telur, koya dan jeruk nipis.', tastes:['gurih','segar'], allergens:[], rating:4.6, ratingCount:98, sold:64},
      {id:'m7', name:'Bakso Sapi Komplit', cat:'makanan', price:11000, stock:14, available:true, img:'assets/img/bakso.jpg', desc:'Bakso sapi besar-kecil, mie bihun, kuah kaldu, saus kacang terpisah.', tastes:['gurih'], allergens:['kacang'], rating:4.5, ratingCount:133, sold:92},
      {id:'m8', name:'Dimsum Ayam Isi 4', cat:'snack', price:8000, stock:25, available:true, img:'assets/img/dimsum.jpg', desc:'Siomay ayam kukus lembut dengan saus dimsum pedas manis.', tastes:['gurih'], allergens:[], rating:4.6, ratingCount:87, sold:88},
      {id:'m9', name:'Pisang Goreng Crispy', cat:'snack', price:5000, stock:30, available:true, img:'assets/img/pisang-goreng.jpg', desc:'Pisang kepok goreng tepung renyah, manis alami, taburan wijen.', tastes:['manis'], allergens:[], rating:4.7, ratingCount:176, sold:120},
      {id:'m10', name:'Kentang Goreng Saus Keju', cat:'snack', price:7000, stock:22, available:true, img:'assets/img/kentang-goreng.jpg', desc:'Kentang goreng golden renyah dengan saus keju creamy.', tastes:['gurih'], allergens:[], rating:4.4, ratingCount:92, sold:73},
      {id:'m11', name:'Roti Bakar Coklat Keju', cat:'snack', price:8000, stock:16, available:true, img:'assets/img/roti-bakar.jpg', desc:'Roti bakar tebal isi coklat lumer dan parutan keju melimpah.', tastes:['manis'], allergens:[], rating:4.5, ratingCount:74, sold:59},
      {id:'m12', name:'Es Teh Manis', cat:'minuman', price:4000, stock:40, available:true, img:'assets/img/es-teh.jpg', desc:'Teh melati diseduh pekat, disajikan dingin menyegarkan.', tastes:['manis','segar'], allergens:[], rating:4.8, ratingCount:260, sold:210},
      {id:'m13', name:'Es Jeruk Peras', cat:'minuman', price:6000, stock:28, available:true, img:'assets/img/es-jeruk.jpg', desc:'Jeruk peras asli tanpa pengawet, asam-manis segar.', tastes:['segar','manis'], allergens:[], rating:4.7, ratingCount:121, sold:95},
      {id:'m14', name:'Jus Alpukat', cat:'minuman', price:8000, stock:15, available:true, img:'assets/img/jus-alpukat.jpg', desc:'Alpukat mentega diblender susu segar, creamy dan mengenyangkan.', tastes:['manis'], allergens:[], rating:4.6, ratingCount:88, sold:67},
      {id:'m15', name:'Es Kopi Susu Gula Aren', cat:'minuman', price:9000, stock:18, available:true, img:'assets/img/es-kopi-susu.jpg', desc:'Espresso, susu segar, dan gula aren asli. Penambah fokus sebelum kelas.', tastes:['manis'], allergens:[], rating:4.5, ratingCount:103, sold:81}
    ];}
    function seedOrders(){ return [
      {code:'KNT-001', nama:'Sinta Maharani', kelas:'XI RPL 2', pickup:'Istirahat 1 · 09.30', time:'08.12', status:'siap', mine:false, catatan:'', items:[{menuId:'m1', name:'Nasi Ayam Geprek', price:12000, qty:1},{menuId:'m12', name:'Es Teh Manis', price:4000, qty:1}]},
      {code:'KNT-002', nama:'Agung Dwi Saputra', kelas:'XII TJAT 5', pickup:'Istirahat 1 · 09.30', time:'08.20', status:'disiapkan', mine:true, catatan:'Mie-nya jangan terlalu lembek.', items:[{menuId:'m4', name:'Mie Goreng Telur', price:10000, qty:1},{menuId:'m13', name:'Es Jeruk Peras', price:6000, qty:1}]},
      {code:'KNT-003', nama:'Bagas Pratama', kelas:'X TJAT 1', pickup:'Istirahat 2 · 12.00', time:'08.26', status:'diterima', mine:false, catatan:'', items:[{menuId:'m7', name:'Bakso Sapi Komplit', price:11000, qty:2}]},
      {code:'KNT-004', nama:'Nadia Putri', kelas:'XII TJAT 3', pickup:'Istirahat 1 · 09.30', time:'07.58', status:'selesai', mine:false, catatan:'', items:[{menuId:'m9', name:'Pisang Goreng Crispy', price:5000, qty:2},{menuId:'m15', name:'Es Kopi Susu Gula Aren', price:9000, qty:1}]},
      {code:'KNT-005', nama:'Rizky Ramadhan', kelas:'XI TJAT 4', pickup:'Istirahat 2 · 12.00', time:'08.31', status:'disiapkan', mine:false, catatan:'Sambal matah dipisah.', items:[{menuId:'m5', name:'Chicken Katsu Sambal Matah', price:14000, qty:1},{menuId:'m12', name:'Es Teh Manis', price:4000, qty:1}]}
    ];}
    var STATUSES = ['diterima','disiapkan','siap','selesai'];
    var STATUS_LABEL = {diterima:'Diterima', disiapkan:'Disiapkan', siap:'Siap Diambil', selesai:'Selesai'};
    var NEXT_LABEL = {diterima:'Mulai Siapkan', disiapkan:'Tandai Siap Diambil', siap:'Selesaikan Pesanan'};
    var CAT_LABEL = {makanan:'Makanan Berat', snack:'Snack', minuman:'Minuman'};
