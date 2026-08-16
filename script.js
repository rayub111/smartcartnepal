// Public-site rendering. Reads live product data from Supabase so
// every visitor, on every device, sees the same up-to-date list.

const grid = document.getElementById('productGrid');
const filtersBar = document.querySelector('.filters-inner');
let allProducts = [];

function buildFilterChips() {
  const categories = [...new Set(allProducts.map(p => p.category))];
  const chips = categories.map(key =>
    `<button class="chip" data-filter="${escapeHTML(key)}">${escapeHTML(prettifyCategory(key))}</button>`
  ).join('');
  filtersBar.innerHTML = `<button class="chip is-active" data-filter="all">All</button>${chips}`;
}

function cardHTML(p) {
  const img = safeImageSource(p.image);
  const visual = img
    ? `<img src="${escapeHTML(img)}" alt="${escapeHTML(p.name)}" class="card-photo">`
    : `<div class="card-visual">${ICONS[p.icon] || ICONS.tag}</div>`;
  return `
    <article class="card" data-category="${escapeHTML(p.category)}">
      ${p.pick ? '<span class="badge">Curator\u2019s Pick</span>' : ''}
      ${visual}
      <h3>${escapeHTML(p.name)}</h3>
      <p class="blurb">${escapeHTML(p.blurb)}</p>
      <div class="meta">
        <span class="price mono">${escapeHTML(p.price)}</span>
        <span class="category-tag mono">${escapeHTML(prettifyCategory(p.category))}</span>
      </div>
      <p class="why">${escapeHTML(p.why)}</p>
      <a class="buy-btn" href="${escapeHTML(safeLink(p.link))}" target="_blank" rel="nofollow sponsored noopener">Get it \u2192</a>
    </article>
  `;
}

function renderGrid(filter) {
  const items = filter === 'all' ? allProducts : allProducts.filter(p => p.category === filter);
  grid.innerHTML = items.map(cardHTML).join('');
  grid.classList.toggle('is-empty', items.length === 0);
}

async function init() {
  grid.innerHTML = '<p class="loading-note mono">Loading picks\u2026</p>';
  const { data, error } = await fetchProducts();
  if (error) {
    grid.innerHTML = `<p class="loading-note mono">Couldn\u2019t load products. ${escapeHTML(error.message)}</p>`;
    return;
  }
  allProducts = data || [];
  buildFilterChips();
  renderGrid('all');
}

filtersBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  renderGrid(btn.dataset.filter);
});

init();
