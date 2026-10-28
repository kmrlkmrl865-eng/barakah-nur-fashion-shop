let initialProducts = [
  { id: "p1", title: "Naviforce VIP Quartz Leather Watch", regPrice: 2800, offerPrice: 2200, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500", warranty: "১ বছরের মেশিন ওয়ারেন্টি", durability: "30M Water Resistant" },
  { id: "p2", title: "100% Original Cow Leather Wallet", regPrice: 1500, offerPrice: 990, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500", warranty: "২ বছরের চামড়া গ্যারান্টি", durability: "Genuine Cow Leather" }
];

let products = JSON.parse(localStorage.getItem('bnf_products')) || initialProducts;
let cart = [];

function renderProducts(items = products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = items.map(p => `
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between">
      <div>
        <div class="relative">
          <img src="${p.img}" alt="${p.title}" class="w-full h-56 object-cover rounded-t-2xl" />
          <span class="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">৳${p.regPrice - p.offerPrice} ছাড়</span>
          <button onclick="shareProduct('${p.id}', '${p.title}')" class="absolute top-3 right-3 bg-white/95 text-gray-700 p-2 rounded-full shadow hover:bg-white" title="লিংক কপি করুন">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 text-base mb-2 line-clamp-1">${p.title}</h3>
          <div class="space-y-1 mb-3 text-xs text-gray-500">
            <p class="text-emerald-600 font-medium"><i class="fas fa-shield-alt"></i> ${p.warranty}</p>
            <p class="text-indigo-600 font-medium"><i class="fas fa-check-circle"></i> ${p.durability}</p>
          </div>
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-xl font-extrabold text-indigo-600">৳${p.offerPrice}</span>
            <span class="text-sm text-gray-400 line-through">৳${p.regPrice}</span>
          </div>
        </div>
      </div>
      <div class="p-4 pt-0">
        <button onclick="addToCart('${p.id}')" class="w-full py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
          <i class="fas fa-cart-plus"></i> কার্টে যোগ করুন
        </button>
      </div>
    </div>
  `).join('');
}

function shareProduct(id, title) {
  const shareUrl = `${window.location.origin}${window.location.pathname}?pid=${id}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    alert(`"${title}" এর ডিরেক্ট লিংক কপি হয়েছে! ফেসবুকে শেয়ার করতে পারেন।`);
  });
}

function addToCart(id) {
  cart.push(products.find(p => p.id === id));
  updateCartUI();
  toggleCart(true);
}

function updateCartUI() {
  document.getElementById('cartCount').innerText = cart.length;
  document.getElementById('cartItems').innerHTML = cart.map((item, index) => `
    <div class="flex justify-between items-center py-3">
      <div>
        <p class="font-bold text-sm text-gray-900">${item.title}</p>
        <p class="text-xs text-indigo-600 font-semibold">৳${item.offerPrice}</p>
      </div>
      <button onclick="cart.splice(${index},1);updateCartUI()" class="text-rose-500 text-sm"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
  document.getElementById('cartTotal').innerText = `৳${cart.reduce((s, i) => s + i.offerPrice, 0)}`;
}

function toggleCart(force = false) {
  const m = document.getElementById('cartModal');
  force ? m.classList.remove('hidden') : m.classList.toggle('hidden');
}

function handleCheckout(e) {
  e.preventDefault();
  if (!cart.length) return alert('কার্ট খালি!');
  const secCode = Math.floor(1000 + Math.random() * 9000);
  let text = `*👑 নতুন অর্ডার - Barakah Nur Fashion*\n*সিকিউরিটি কোড:* #${secCode}\n---------------------------\n`;
  cart.forEach(i => text += `• ${i.title} (৳${i.offerPrice})\n`);
  text += `---------------------------\n*নাম:* ${document.getElementById('custName').value}\n*ফোন:* ${document.getElementById('custPhone').value}\n*ঠিকানা:* ${document.getElementById('custAddress').value}`;
  window.open(`https://wa.me/8801812418091?text=${encodeURIComponent(text)}`, '_blank');
  cart = []; updateCartUI(); toggleCart();
}

function openAdminModal() { document.getElementById('adminModal').classList.remove('hidden'); }
function closeAdminModal() { document.getElementById('adminModal').classList.add('hidden'); }

function authenticateAdmin() {
  if (document.getElementById('adminPass').value === "barakah2026") {
    document.getElementById('adminAuth').classList.add('hidden');
    document.getElementById('adminPostForm').classList.remove('hidden');
  } else { alert('ভুল পাসওয়ার্ড!'); }
}

function uploadProduct(e) {
  e.preventDefault();
  products.unshift({
    id: "p_" + Date.now(),
    title: document.getElementById('prodTitle').value,
    regPrice: Number(document.getElementById('prodRegPrice').value),
    offerPrice: Number(document.getElementById('prodOfferPrice').value),
    img: document.getElementById('prodImgUrl').value,
    warranty: document.getElementById('prodWarranty').value,
    durability: document.getElementById('prodDurability').value
  });
  localStorage.setItem('bnf_products', JSON.stringify(products));
  renderProducts(); closeAdminModal(); alert('সফলভাবে পোস্ট হয়েছে!');
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  renderProducts(products.filter(p => p.title.toLowerCase().includes(q)));
}

renderProducts();
