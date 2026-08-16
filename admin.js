// ============================================================
// ADMIN PAGE LOGIC — backed by Supabase.
// Login uses the real admin account you created in Supabase
// (Authentication > Users), not a shared passphrase. Writes are
// only allowed for logged-in users because of the Row Level
// Security policies set up by supabase-setup.sql.
// ============================================================

const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

async function checkSession() {
  if (!sb) {
    loginError.textContent = 'Supabase is not configured yet — check supabase-config.js.';
    return;
  }
  const { data: { session } } = await sb.auth.getSession();
  if (session) showPanel();
}
checkSession();

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passInput').value;
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = error.message;
  } else {
    showPanel();
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await sb.auth.signOut();
  location.reload();
});

function showPanel() {
  loginScreen.hidden = true;
  adminPanel.hidden = false;
  initAdmin();
}

// ------------------------------------------------------------
// ADMIN PANEL
// ------------------------------------------------------------
let editingId = null;
let currentImageData = '';
let cachedProducts = [];

async function initAdmin() {
  populateCategorySelect([]);
  await refreshList();

  document.getElementById('showNewCategory').addEventListener('click', () => {
    document.getElementById('newCategoryRow').hidden = false;
  });

  document.getElementById('addCategoryConfirm').addEventListener('click', () => {
    const label = document.getElementById('f_newCategoryLabel').value.trim();
    if (!label) return;
    const key = slugifyCategory(label);
    const select = document.getElementById('f_category');
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = label;
    select.appendChild(opt);
    select.value = key;
    document.getElementById('newCategoryRow').hidden = true;
    document.getElementById('f_newCategoryLabel').value = '';
  });

  document.getElementById('f_imageFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      document.getElementById('formStatus').textContent = 'That image is quite large — consider a smaller file so the page stays fast.';
    }
    const reader = new FileReader();
    reader.onload = () => {
      currentImageData = reader.result;
      document.getElementById('f_imageUrl').value = '';
      showPreview(currentImageData);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('f_imageUrl').addEventListener('input', (e) => {
    currentImageData = '';
    if (e.target.value) {
      document.getElementById('f_imageFile').value = '';
      showPreview(e.target.value);
    }
  });

  document.getElementById('productForm').addEventListener('submit', onSubmitProduct);
  document.getElementById('cancelEdit').addEventListener('click', resetForm);
  document.getElementById('exportBtn').addEventListener('click', exportBackup);
  document.getElementById('seedBtn').addEventListener('click', seedStarterProducts);
}

function showPreview(src) {
  const img = document.getElementById('imagePreview');
  img.src = src;
  img.hidden = false;
}

function populateCategorySelect(products) {
  const select = document.getElementById('f_category');
  const known = [...new Set(products.map(p => p.category))];
  const fallback = ['audio', 'smart-home', 'wearables', 'footwear', 'accessories', 'streetwear', 'womens-fashion'];
  const all = [...new Set([...known, ...fallback])];
  select.innerHTML = all.map(key => `<option value="${key}">${prettifyCategory(key)}</option>`).join('');
}

async function onSubmitProduct(e) {
  e.preventDefault();
  const status = document.getElementById('formStatus');

  const product = {
    name: document.getElementById('f_name').value.trim(),
    category: document.getElementById('f_category').value,
    price: document.getElementById('f_price').value.trim(),
    blurb: document.getElementById('f_blurb').value.trim(),
    why: document.getElementById('f_why').value.trim(),
    link: document.getElementById('f_link').value.trim(),
    image: currentImageData || document.getElementById('f_imageUrl').value.trim() || '',
    icon: 'tag',
    pick: document.getElementById('f_pick').checked
  };

  status.textContent = 'Saving\u2026';
  const { error } = editingId
    ? await updateProductById(editingId, product)
    : await insertProduct(product);

  if (error) {
    status.textContent = 'Error: ' + error.message;
    return;
  }

  status.textContent = editingId ? 'Product updated.' : 'Product added \u2014 live on the site now.';
  resetForm();
  await refreshList();
}

function resetForm() {
  editingId = null;
  currentImageData = '';
  document.getElementById('productForm').reset();
  document.getElementById('imagePreview').hidden = true;
  document.getElementById('formTitle').textContent = 'Add a product';
  document.getElementById('cancelEdit').hidden = true;
}

async function refreshList() {
  const { data, error } = await fetchProducts();
  const container = document.getElementById('adminList');
  if (error) {
    container.innerHTML = `<p class="admin-list-empty">Couldn\u2019t load products: ${error.message}</p>`;
    return;
  }
  cachedProducts = data || [];
  populateCategorySelect(cachedProducts);
  document.getElementById('seedBtn').hidden = cachedProducts.length > 0;
  renderList();
}

function renderList() {
  const container = document.getElementById('adminList');
  document.getElementById('countTag').textContent = cachedProducts.length ? `(${cachedProducts.length})` : '';

  if (!cachedProducts.length) {
    container.innerHTML = '<p class="admin-list-empty">Nothing added yet — use the form to add your first product, or load the starter set above.</p>';
    return;
  }

  container.innerHTML = cachedProducts.map(p => {
    const img = safeImageSource(p.image);
    return `
    <div class="admin-row">
      ${img ? `<img src="${escapeHTML(img)}" alt="">` : `<div class="admin-row-icon"></div>`}
      <div class="admin-row-body">
        <div class="admin-row-name">${escapeHTML(p.name)}${p.pick ? ' \u2605' : ''}</div>
        <div class="admin-row-meta">${escapeHTML(prettifyCategory(p.category))} \u00b7 ${escapeHTML(p.price)}</div>
      </div>
      <div class="admin-row-actions">
        <button data-action="edit" data-id="${escapeHTML(p.id)}">Edit</button>
        <button data-action="delete" data-id="${escapeHTML(p.id)}">Delete</button>
      </div>
    </div>
  `;
  }).join('');

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.dataset.action === 'delete') {
        if (!confirm('Remove this product for everyone?')) return;
        const { error } = await deleteProductById(id);
        if (error) { alert('Error: ' + error.message); return; }
        await refreshList();
      } else {
        loadProductIntoForm(id);
      }
    });
  });
}

function loadProductIntoForm(id) {
  const p = cachedProducts.find(p => p.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('f_name').value = p.name;
  document.getElementById('f_category').value = p.category;
  document.getElementById('f_price').value = p.price || '';
  document.getElementById('f_blurb').value = p.blurb || '';
  document.getElementById('f_why').value = p.why || '';
  document.getElementById('f_link').value = p.link || '';
  document.getElementById('f_imageUrl').value = p.image && p.image.startsWith('data:') ? '' : (p.image || '');
  currentImageData = p.image && p.image.startsWith('data:') ? p.image : '';
  document.getElementById('f_pick').checked = !!p.pick;
  if (p.image) showPreview(p.image); else document.getElementById('imagePreview').hidden = true;
  document.getElementById('formTitle').textContent = 'Edit product';
  document.getElementById('cancelEdit').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ------------------------------------------------------------
// Backup export — just a safety net, not required for publishing
// (publishing now happens instantly when you save).
// ------------------------------------------------------------
function exportBackup() {
  const blob = new Blob([JSON.stringify(cachedProducts, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'smartcartnepal-products-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ------------------------------------------------------------
// One-time seed of the original starter products, only shown
// while the table is empty.
// ------------------------------------------------------------
const STARTER_PRODUCTS = [
  // Tech
  { name: "Anker Soundcore Life Q30", category: "audio", price: "Rs 8,500", blurb: "Over-ear ANC headphones that punch well above their price — 40hr battery, app EQ.", why: "The one we recommend to anyone asking for their first \"good\" pair of headphones.", link: "#REPLACE-LINK-1", icon: "headphones", pick: true },
  { name: "JBL Flip 6", category: "audio", price: "Rs 12,900", blurb: "Rugged, waterproof bluetooth speaker with surprisingly deep bass for its size.", why: "Survived two monsoons and a trekking bag on our end — genuinely tough.", link: "#REPLACE-LINK-2", icon: "speaker", pick: false },
  { name: "Philips Hue White & Color Starter Kit", category: "smart-home", price: "Rs 14,200", blurb: "Three smart bulbs + hub. Millions of colors, scheduling, voice control.", why: "Still the most reliable smart lighting ecosystem — setup takes under 10 minutes.", link: "#REPLACE-LINK-3", icon: "bulb", pick: true },
  { name: "Amazfit GTS 4 Mini", category: "wearables", price: "Rs 9,900", blurb: "Slim AMOLED smartwatch, 2-week battery, 120+ sport modes, SpO2 tracking.", why: "Battery life alone puts it ahead of watches twice the price.", link: "#REPLACE-LINK-5", icon: "watch", pick: true },
  { name: "Mi Band 8", category: "wearables", price: "Rs 4,300", blurb: "The budget fitness band that just keeps getting better — sharp display, solid tracking.", why: "Our default \"just get this\" answer for anyone starting out with fitness tracking.", link: "#REPLACE-LINK-6", icon: "watch", pick: false },
  { name: "TP-Link Tapo C200 Security Camera", category: "smart-home", price: "Rs 3,400", blurb: "Pan-tilt indoor WiFi camera with night vision and motion alerts on your phone.", why: "Best value indoor cam we've tested — the app is actually pleasant to use.", link: "#REPLACE-LINK-11", icon: "camera", pick: false },
  { name: "Fire-Boltt Ninja Call Pro Plus", category: "wearables", price: "Rs 3,800", blurb: "Bluetooth-calling smartwatch with a 1.83\" display at a genuinely low price.", why: "The best \"looks expensive, isn't\" pick on this whole shelf.", link: "#REPLACE-LINK-12", icon: "watch", pick: false },
  // Fashion
  { name: "Adidas Samba OG (Replica-Free, Verified Seller)", category: "footwear", price: "Rs 6,500", blurb: "The classic low-top sneaker everyone's wearing right now — true to size, genuine leather upper.", why: "Checked seller has 4.8★ across 2,000+ orders and a real return policy — rare for sneakers on Daraz.", link: "#REPLACE-LINK-13", icon: "shoe", pick: true },
  { name: "Men's Chunky Sole Sneakers", category: "footwear", price: "Rs 3,200", blurb: "Thick-sole streetwear sneakers, breathable mesh, good grip for Kathmandu's uneven pavements.", why: "Runs true to size — we confirmed with 6 buyer photos before listing this one.", link: "#REPLACE-LINK-14", icon: "shoe", pick: false },
  { name: "Crossbody Canvas Sling Bag", category: "accessories", price: "Rs 1,450", blurb: "Everyday sling bag, water-resistant canvas, fits a phone, wallet, and water bottle.", why: "Held up through three months of daily commuting on our end.", link: "#REPLACE-LINK-15", icon: "bag", pick: true },
  { name: "Polarized Aviator Sunglasses", category: "accessories", price: "Rs 990", blurb: "UV400 protection, polarized lenses that actually cut glare, not just tinted plastic.", why: "We checked — these are genuinely polarized, unlike most sub-Rs-1000 listings.", link: "#REPLACE-LINK-16", icon: "sunglasses", pick: false },
  { name: "Oversized Cotton Hoodie", category: "streetwear", price: "Rs 1,650", blurb: "Heavyweight cotton fleece, drop-shoulder fit, holds shape after washing.", why: "Fabric doesn't pill after a few washes — we asked buyers directly before listing.", link: "#REPLACE-LINK-17", icon: "shirt", pick: false },
  { name: "Cargo Pants, Straight Fit", category: "streetwear", price: "Rs 2,100", blurb: "Multi-pocket cargo pants in a straight cut, cotton-blend, doesn't sag after a day of wear.", why: "Size chart matches actual measurements — confirmed against 10+ buyer comments.", link: "#REPLACE-LINK-18", icon: "shirt", pick: true },
  { name: "Women's Wrap Kurti Set", category: "womens-fashion", price: "Rs 2,400", blurb: "Wrap-style kurti with matching palazzo, breathable rayon fabric, everyday office-to-evening wear.", why: "Color doesn't run in the wash, per verified buyer photos over several months.", link: "#REPLACE-LINK-19", icon: "shirt", pick: true },
  { name: "Layered Gold-Plated Bracelet Set", category: "womens-fashion", price: "Rs 1,100", blurb: "Set of 3 stackable bracelets, gold-plated, adjustable sizing.", why: "Doesn't tarnish after a month of daily wear, based on repeat buyer feedback.", link: "#REPLACE-LINK-20", icon: "ring", pick: false }
];

async function seedStarterProducts() {
  if (cachedProducts.length > 0) return;
  if (!confirm('Load 12 starter products into your live site? Edit or delete any of them afterward.')) return;
  const { error } = await sb.from('products').insert(STARTER_PRODUCTS);
  if (error) { alert('Error: ' + error.message); return; }
  await refreshList();
}
