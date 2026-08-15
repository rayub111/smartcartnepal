// ============================================================
// ADMIN PAGE LOGIC
// This static page is intentionally unlinked and marked noindex.
// Use real server-side authentication before exposing admin access online.
// ============================================================

// This is a static, client-side-only admin page. A passphrase embedded in its
// JavaScript is publicly visible and provides no real protection, so load the
// editor directly instead of presenting an unreliable fake login gate.
initAdmin();

// ------------------------------------------------------------
// ADMIN PANEL
// ------------------------------------------------------------
let editingId = null;
let currentImageData = '';

function initAdmin() {
  populateCategorySelect();
  renderList();

  document.getElementById('showNewCategory').addEventListener('click', () => {
    document.getElementById('newCategoryRow').hidden = false;
  });

  document.getElementById('addCategoryConfirm').addEventListener('click', () => {
    const label = document.getElementById('f_newCategoryLabel').value.trim();
    if (!label) return;
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!key) {
      document.getElementById('formStatus').textContent = 'Use at least one letter or number in the category name.';
      return;
    }
    const custom = loadAdminCategories();
    custom[key] = label;
    if (!saveAdminCategories(custom)) {
      document.getElementById('formStatus').textContent = 'Could not save the category because browser storage is unavailable.';
      return;
    }
    populateCategorySelect();
    document.getElementById('f_category').value = key;
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
  document.getElementById('exportBtn').addEventListener('click', exportProducts);
}

function showPreview(src) {
  const img = document.getElementById('imagePreview');
  img.src = src;
  img.hidden = false;
}

function populateCategorySelect() {
  const select = document.getElementById('f_category');
  const categories = getAllCategories();
  select.innerHTML = Object.keys(categories)
    .map(key => `<option value="${escapeHTML(key)}">${escapeHTML(categories[key])}</option>`)
    .join('');
}

function onSubmitProduct(e) {
  e.preventDefault();

  const product = {
    id: editingId || ('p_' + Date.now()),
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

  const list = loadAdminProducts();
  if (editingId) {
    const idx = list.findIndex(p => p.id === editingId);
    if (idx > -1) list[idx] = product;
  } else {
    list.push(product);
  }
  if (!saveAdminProducts(list)) {
    document.getElementById('formStatus').textContent = 'Could not save the product because browser storage is unavailable.';
    return;
  }

  document.getElementById('formStatus').textContent = editingId ? 'Product updated.' : 'Product added — check the live site tab to see it.';
  resetForm();
  renderList();
}

function resetForm() {
  editingId = null;
  currentImageData = '';
  document.getElementById('productForm').reset();
  document.getElementById('imagePreview').hidden = true;
  document.getElementById('formTitle').textContent = 'Add a product';
  document.getElementById('cancelEdit').hidden = true;
}

function renderList() {
  const list = getAllProducts();
  const container = document.getElementById('adminList');
  document.getElementById('countTag').textContent = list.length ? `(${list.length})` : '';

  if (!list.length) {
    container.innerHTML = '<p class="admin-list-empty">Nothing added yet — use the form to add your first product.</p>';
    return;
  }

  const categories = getAllCategories();
  container.innerHTML = list.map(p => `
    <div class="admin-row">
      ${safeImageSource(p.image) ? `<img src="${escapeHTML(safeImageSource(p.image))}" alt="">` : `<div class="admin-row-icon"></div>`}
      <div class="admin-row-body">
        <div class="admin-row-name">${escapeHTML(p.name)}${p.pick ? ' ★' : ''}</div>
        <div class="admin-row-meta">${escapeHTML(categories[p.category] || p.category)} · ${escapeHTML(p.price)}</div>
      </div>
      <div class="admin-row-actions">
        ${p.id ? `<button data-action="edit" data-key="${escapeHTML(productKey(p))}">Edit</button>` : ''}
        <button data-action="delete" data-key="${escapeHTML(productKey(p))}">Remove</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      if (btn.dataset.action === 'delete') {
        if (!confirm('Remove this product?')) return;
        const addedProducts = loadAdminProducts();
        const isAddedProduct = addedProducts.some(p => productKey(p) === key);
        const saved = isAddedProduct
          ? saveAdminProducts(addedProducts.filter(p => productKey(p) !== key))
          : saveHiddenProductKeys([...new Set([...loadHiddenProductKeys(), key])]);
        if (!saved) {
          document.getElementById('formStatus').textContent = 'Could not remove the product because browser storage is unavailable.';
          return;
        }
        renderList();
      } else {
        loadProductIntoForm(key);
      }
    });
  });
}

function loadProductIntoForm(key) {
  const p = loadAdminProducts().find(p => productKey(p) === key);
  if (!p) return;
  editingId = p.id;
  document.getElementById('f_name').value = p.name;
  document.getElementById('f_category').value = p.category;
  document.getElementById('f_price').value = p.price;
  document.getElementById('f_blurb').value = p.blurb;
  document.getElementById('f_why').value = p.why;
  document.getElementById('f_link').value = p.link;
  document.getElementById('f_imageUrl').value = p.image && p.image.startsWith('data:') ? '' : (p.image || '');
  currentImageData = p.image && p.image.startsWith('data:') ? p.image : '';
  document.getElementById('f_pick').checked = !!p.pick;
  if (safeImageSource(p.image)) showPreview(safeImageSource(p.image)); else document.getElementById('imagePreview').hidden = true;
  document.getElementById('formTitle').textContent = 'Edit product';
  document.getElementById('cancelEdit').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ------------------------------------------------------------
// EXPORT — generates a full products.js you can use to replace
// the file on your host, making your additions visible to
// everyone (not just this browser).
// ------------------------------------------------------------
function exportProducts() {
  const merged = getAllProducts();
  const body = merged.map(p => `  {
    name: ${JSON.stringify(p.name)},
    category: ${JSON.stringify(p.category)},
    price: ${JSON.stringify(p.price)},
    blurb: ${JSON.stringify(p.blurb)},
    why: ${JSON.stringify(p.why)},
    link: ${JSON.stringify(p.link)},
    image: ${JSON.stringify(p.image || '')},
    icon: ${JSON.stringify(p.icon || 'tag')},
    pick: ${!!p.pick}
  }`).join(',\n');

  const fileText = `// Auto-exported from admin.html — replace your existing products.js with this file.\nconst PRODUCTS = [\n${body}\n];\n`;

  const blob = new Blob([fileText], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.js';
  a.click();
  URL.revokeObjectURL(url);
}
