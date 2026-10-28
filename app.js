let defaultProducts = [
  {
    id: "p1",
    title: "Naviforce VIP Quartz Leather Watch",
    regPrice: 2800,
    offerPrice: 2200,
    img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
    warranty: "১ বছরের মেশিন ওয়ারেন্টি",
    rating: "5.0",
    desc: "১০০% প্রিমিয়াম কোয়ালিটি ওয়াটারপ্রুফ লেদার വാচ।"
  },
  {
    id: "p2",
    title: "100% Original Cow Leather Wallet",
    regPrice: 1500,
    offerPrice: 990,
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    warranty: "২ বছরের চামড়া গ্যারান্টি",
    rating: "4.9",
    desc: "খাঁটি গরুর চামড়ার তৈরি লাক্সারি ম্যানস ওয়ালেট।"
  }
];

let products = JSON.parse(localStorage.getItem('bnf_products_v2')) || defaultProducts;
let cart = [];

function renderProducts(items = products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = items.map(p => `
    <div class="bg-slate-800/80 rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300">
      <div>
        <div class="relative bg-slate-900 overflow-hidden group">
          <img src="${p.img}" alt="${p.title}" class="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
          <span class="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
            ৳${p.regPrice - p.offerPrice} সাশ্রয়
          </span>
          <button onclick="shareProduct('${p.id}', '${p.title}')" class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-slate-200 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-indigo-600 transition-colors text-xs" title="ফেসবুক শেয়ার লিংক কপি">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>

        <div class="p-4">
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-emerald-400 text-xs font-bold flex items-center gap-1"><i class="fas fa-shield-alt"></i> ${p.warranty}</span>
            <span class="text-amber-400 text-xs font-black flex items-center gap-1"><i class="fas fa-star"></i> ${p.rating}</span>
          </div>

          <h3 class="font-bold text-white text-sm sm:text-base leading-snug line-clamp-1 mb-2">${p.title}</h3>
          <p class="text-xs text-slate-400 line-clamp-2 mb-3">${p.desc}</p>

          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-xl font-black text-indigo-400">৳${p.offerPrice}</span>
            <span class="text-xs text-slate-500 line-through">৳${p.regPrice}</span>
          </div>
        </div>
      </div>

      <div class="p-4 pt-0 grid grid-cols-2 gap-2">
        <button onclick="addToCart('${p.id}')" class="py-2.5 bg-slate-700 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-1.5">
          <i class="fas fa-cart-plus"></i> কার্ট
        </button>
        <button onclick="buyNow('${p.id}')" class="py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5">
          <i class="fas fa-bolt text-amber-300"></i> এখনই কিনুন
        </button>
      </div>
    </div>
  `).join('');
}

function shareProduct(id, title) {
  const url = `${window.location.origin}${window.location.pathname}?pid=${id}`;
  navigator.clipboard.writeText(url).then(() => {
    alert(`"${title}" এর ডিরেক্ট লিংক সফলভাবে কপি হয়েছে!\n\nএখন এটি ফেসবুকে শেয়ার করতে পারেন।`);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const exist = cart.find(i => i.id === id);
  if (exist) exist.qty += 1;
  else cart.push({ ...item, qty: 1 });
  
  updateCartUI();
  toggleCart(true);
}

function buyNow(id) {
  addToCart(id);
  toggleCart(true);
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').innerText = count;
  if(document.getElementById('mobileCartBadge')) document.getElementById('mobileCartBadge').innerText = count;

  const container = document.getElementById('cartItems');
  container.innerHTML = cart.map((i, idx) => `
    <div class="flex justify-between items-center py-3">
      <div>
        <p class="font-bold text-xs text-white line-clamp-1">${i.title}</p>
        <p class="text-xs text-indigo-400 font-bold">৳${i.offerPrice} × ${i.qty}</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <button onclick="adjustQty(${idx}, -1)" class="px-2 py-0.5 text-xs text-white font-bold">-</button>
          <span class="px-2 text-xs text-white font-bold">${i.qty}</span>
          <button onclick="adjustQty(${idx}, 1)" class="px-2 py-0.5 text-xs text-white font-bold">+</button>
        </div>
        <button onclick="cart.splice(${idx},1);updateCartUI()" class="text-rose-400 hover:text-rose-300 text-xs"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + (i.offerPrice * i.qty), 0);
  document.getElementById('cartTotal').innerText = `৳${total}`;
}

function adjustQty(idx, val) {
  cart[idx].qty += val;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
}

function toggleCart(force = false) {
  const m = document.getElementById('cartModal');
  force ? m.classList.remove('hidden') : m.classList.toggle('hidden');
}

// 4-Digit Security Code WhatsApp Order Integration
function handleCheckout(e) {
  e.preventDefault();
  if (!cart.length) return alert('আপনার কার্ট খালি!');

  const secCode = Math.floor(1000 + Math.random() * 9000);
  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const address = document.getElementById('custAddress').value;
  const total = cart.reduce((s, i) => s + (i.offerPrice * i.qty), 0);

  let msg = `*👑 নতুন অর্ডার - Barakah Nur Fashion*\n`;
  msg += `*সিকিউরিটি কোড:* #${secCode}\n`;
  msg += `---------------------------\n`;
  cart.forEach(i => {
    msg += `• ${i.title} (${i.qty} টি) - ৳${i.offerPrice * i.qty}\n`;
  });
  msg += `---------------------------\n`;
  msg += `*সর্বমোট বিল:* ৳${total} (ক্যাশ অন ডেলিভারি)\n`;
  msg += `*গ্রাহকের নাম:* ${name}\n`;
  msg += `*ফোন নম্বর:* ${phone}\n`;
  msg += `*পূর্ণ ঠিকানা:* ${address}\n\n`;
  msg += `*(দয়া করে এই অর্ডারটি সিকিউরিটি কোড #${secCode} যাচাই করে কনফার্ম করুন)*`;

  const waUrl = `https://wa.me/8801812418091?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');

  cart = [];
  updateCartUI();
  toggleCart();
  alert(`আপনার অর্ডার সফল হয়েছে! সিকিউরিটি কোড হলো: #${secCode}। হোয়াটসঅ্যাপে অর্ডার ডিটেইলস পাঠানো হয়েছে।`);
}

// Admin Panel Controller
function openAdminModal() { document.getElementById('adminModal').classList.remove('hidden'); }
function closeAdminModal() { document.getElementById('adminModal').classList.add('hidden'); }

function authenticateAdmin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === "barakah2026") {
    document.getElementById('adminAuth').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    renderAdminProductList();
  } else {
    alert('ভুল সিকিউরিটি পাসওয়ার্ড!');
  }
}

function addNewProduct(e) {
  e.preventDefault();
  const newProd = {
    id: "p_" + Date.now(),
    title: document.getElementById('pTitle').value,
    regPrice: Number(document.getElementById('pReg').value),
    offerPrice: Number(document.getElementById('pOffer').value),
    img: document.getElementById('pImg').value,
    warranty: document.getElementById('pWarranty').value,
    rating: document.getElementById('pRating').value,
    desc: document.getElementById('pDesc').value
  };

  products.unshift(newProd);
  localStorage.setItem('bnf_products_v2', JSON.stringify(products));
  renderProducts();
  renderAdminProductList();
  e.target.reset();
  alert('প্রোডাক্ট সফলভাবে লাইভ পাবলিশ করা হয়েছে!');
}

function renderAdminProductList() {
  const list = document.getElementById('adminProductList');
  list.innerHTML = products.map((p, index) => `
    <div class="flex justify-between items-center bg-slate-900 p-2.5 rounded-xl border border-slate-700 text-xs">
      <div class="flex items-center gap-2 truncate">
        <img src="${p.img}" class="w-8 h-8 rounded object-cover" />
        <span class="text-white font-bold truncate">${p.title}</span>
      </div>
      <button onclick="deleteProduct(${index})" class="text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-500/10 rounded"><i class="fas fa-trash"></i> ডিলিট</button>
    </div>
  `).join('');
}

function deleteProduct(index) {
  if (confirm('আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি ডিলিট করতে চান?')) {
    products.splice(index, 1);
    localStorage.setItem('bnf_products_v2', JSON.stringify(products));
    renderProducts();
    renderAdminProductList();
  }
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  renderProducts(products.filter(p => p.title.toLowerCase().includes(q)));
}

function filterProductsMobile() {
  const q = document.getElementById('searchInputMobile').value.toLowerCase();
  renderProducts(products.filter(p => p.title.toLowerCase().includes(q)));
}

renderProducts();
