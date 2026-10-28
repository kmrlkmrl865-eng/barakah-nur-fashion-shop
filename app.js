let defaultProducts = [
  {
    id: "p1",
    title: "Naviforce VIP Quartz Leather Watch",
    category: "watch",
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
    category: "wallet",
    regPrice: 1500,
    offerPrice: 990,
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    warranty: "২ বছরের চামড়া গ্যারান্টি",
    rating: "4.9",
    desc: "খাঁটি গরুর চামড়ার তৈরি লাক্সারি ম্যানস ওয়ালেট।"
  },
  {
    id: "p3",
    title: "Premium Cotton Printed Panjabi",
    category: "panjabi",
    regPrice: 2200,
    offerPrice: 1650,
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500",
    warranty: "রং পাকা ও সূক্ষ্ম সেলাই",
    rating: "4.8",
    desc: "আরামদায়ক প্রিমিয়াম কটন ফ্যাব্রিকে তৈরি এক্সক্লুসিভ পাঞ্জাবি।"
  }
];

let products = JSON.parse(localStorage.getItem('bnf_products_v3')) || defaultProducts;
let cart = [];

function renderProducts(items = products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = items.map(p => `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        <div class="relative bg-gray-50">
          <img src="${p.img}" alt="${p.title}" class="w-full h-40 sm:h-48 object-cover" />
          <span class="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
            ৳${p.regPrice - p.offerPrice} ছাড়
          </span>
          <button onclick="shareProduct('${p.id}', '${p.title}')" class="absolute top-2 right-2 bg-white/90 text-gray-700 w-7 h-7 rounded-full shadow flex items-center justify-center hover:bg-white text-xs" title="ফেসবুক শেয়ার লিংক কপি">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>

        <div class="p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-emerald-600 text-[10px] font-bold truncate"><i class="fas fa-shield-alt"></i> ${p.warranty}</span>
            <span class="text-amber-500 text-[10px] font-bold flex items-center gap-0.5"><i class="fas fa-star"></i> ${p.rating}</span>
          </div>

          <h3 class="font-bold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-1 mb-1">${p.title}</h3>
          <p class="text-[10px] text-gray-500 line-clamp-2 mb-2">${p.desc}</p>

          <div class="flex items-baseline gap-1.5 mb-2">
            <span class="text-base font-black text-orange-600">৳${p.offerPrice}</span>
            <span class="text-xs text-gray-400 line-through">৳${p.regPrice}</span>
          </div>
        </div>
      </div>

      <div class="p-3 pt-0 space-y-1.5">
        <button onclick="addToCart('${p.id}')" class="w-full py-1.5 bg-orange-600 text-white font-bold text-xs rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-1">
          <i class="fas fa-cart-plus"></i> কার্টে যোগ করুন
        </button>
        <button onclick="buyNow('${p.id}')" class="w-full py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1">
          <i class="fas fa-bolt text-amber-400"></i> এখনই কিনুন
        </button>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat) {
  toggleSidebar();
  if (cat === 'all') renderProducts(products);
  else renderProducts(products.filter(p => p.category === cat));
}

function shareProduct(id, title) {
  const url = `${window.location.origin}${window.location.pathname}?pid=${id}`;
  navigator.clipboard.writeText(url).then(() => {
    alert(`"${title}" এর ডিরেক্ট লিংক সফলভাবে কপি হয়েছে!\n\nফেসবুক পোস্টে বা মেসেজে শেয়ার করুন।`);
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
    <div class="flex justify-between items-center py-2.5">
      <div>
        <p class="font-bold text-xs text-gray-900 line-clamp-1">${i.title}</p>
        <p class="text-xs text-orange-600 font-bold">৳${i.offerPrice} × ${i.qty}</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center border rounded-lg overflow-hidden">
          <button onclick="adjustQty(${idx}, -1)" class="px-2 py-0.5 bg-gray-100 text-xs font-bold">-</button>
          <span class="px-2 text-xs font-bold">${i.qty}</span>
          <button onclick="adjustQty(${idx}, 1)" class="px-2 py-0.5 bg-gray-100 text-xs font-bold">+</button>
        </div>
        <button onclick="cart.splice(${idx},1);updateCartUI()" class="text-rose-500 text-xs"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + (i.offerPrice * i.qty), 0);
  const deliveryCharge = Number(document.getElementById('deliveryArea').value);
  const grandTotal = subtotal + (cart.length > 0 ? deliveryCharge : 0);

  document.getElementById('cartTotal').innerText = `৳${grandTotal} (ডেলিভারি চার্জ সহ)`;
}

function adjustQty(idx, val) {
  cart[idx].qty += val;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
}

function toggleSidebar() {
  document.getElementById('sideDrawer').classList.toggle('hidden');
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
  const deliveryCharge = Number(document.getElementById('deliveryArea').value);
  const subtotal = cart.reduce((s, i) => s + (i.offerPrice * i.qty), 0);
  const grandTotal = subtotal + deliveryCharge;

  let msg = `*👑 নতুন অর্ডার - Barakah Nur Fashion*\n`;
  msg += `*সিকিউরিটি কোড:* #${secCode}\n`;
  msg += `---------------------------\n`;
  cart.forEach(i => {
    msg += `• ${i.title} (${i.qty} টি) - ৳${i.offerPrice * i.qty}\n`;
  });
  msg += `---------------------------\n`;
  msg += `*সাবটোটাল:* ৳${subtotal}\n`;
  msg += `*ডেলিভারি চার্জ:* ৳${deliveryCharge}\n`;
  msg += `*সর্বমোট বিল:* ৳${grandTotal} (ক্যাশ অন ডেলিভারি)\n`;
  msg += `*গ্রাহকের নাম:* ${name}\n`;
  msg += `*ফোন নম্বর:* ${phone}\n`;
  msg += `*পূর্ণ ঠিকানা:* ${address}\n\n`;
  msg += `*(দয়া করে এই অর্ডারটি সিকিউরিটি কোড #${secCode} যাচাই করে কনফার্ম করুন)*`;

  const waUrl = `https://wa.me/8801812418091?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');

  cart = [];
  updateCartUI();
  toggleCart();
  alert(`আপনার অর্ডার সফল হয়েছে! সিকিউরিটি কোড: #${secCode}। হোয়াটসঅ্যাপে অর্ডার ডিটেইলস পাঠানো হয়েছে।`);
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
    category: document.getElementById('pCategory').value,
    regPrice: Number(document.getElementById('pReg').value),
    offerPrice: Number(document.getElementById('pOffer').value),
    img: document.getElementById('pImg').value,
    warranty: document.getElementById('pWarranty').value,
    rating: document.getElementById('pRating').value,
    desc: document.getElementById('pDesc').value
  };

  products.unshift(newProd);
  localStorage.setItem('bnf_products_v3', JSON.stringify(products));
  renderProducts();
  renderAdminProductList();
  e.target.reset();
  alert('প্রোডাক্ট সফলভাবে লাইভ পাবলিশ করা হয়েছে!');
}

function renderAdminProductList() {
  const list = document.getElementById('adminProductList');
  list.innerHTML = products.map((p, index) => `
    <div class="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200 text-xs shadow-sm">
      <div class="flex items-center gap-2 truncate">
        <img src="${p.img}" class="w-7 h-7 rounded object-cover" />
        <span class="font-bold text-gray-800 truncate">${p.title}</span>
      </div>
      <button onclick="deleteProduct(${index})" class="text-rose-500 hover:text-rose-700 px-2 py-1 bg-rose-50 rounded font-bold"><i class="fas fa-trash"></i> ডিলিট</button>
    </div>
  `).join('');
}

function deleteProduct(index) {
  if (confirm('আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি ডিলিট করতে চান?')) {
    products.splice(index, 1);
    localStorage.setItem('bnf_products_v3', JSON.stringify(products));
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
