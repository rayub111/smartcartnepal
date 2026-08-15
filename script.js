// Public-site rendering. Reads PRODUCTS (products.js) plus anything you've
// added on the admin page and saved in this browser (shared.js handles
// the merge). Viewers never see the admin page or its data unless you
// export it into products.js and redeploy.

const grid = document.getElementById('productGrid');
const filtersBar = document.querySelector('.filters-inner');

function buildFilterChips() {
  const categories = getAllCategories();
  const extraChips = Object.keys(categories).map(key =>
    `<button class="chip" data-filter="${escapeHTML(key)}">${escapeHTML(categories[key])}</button>`
  ).join('');
  filtersBar.innerHTML = `<button class="chip is-active" data-filter="all">All</button>${extraChips}`;
}

function cardHTML(p) {
  const categories = getAllCategories();
  const image = safeImageSource(p.image);
  const visual = image
    ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(p.name)}" class="card-photo">`
    : `<div class="card-visual">${ICONS[p.icon] || ICONS.tag}</div>`;
  return `
    <article class="card" data-category="${escapeHTML(p.category)}">
      ${p.pick ? '<span class="badge">Curator\u2019s Pick</span>' : ''}
      ${visual}
      <h3>${escapeHTML(p.name)}</h3>
      <p class="blurb">${escapeHTML(p.blurb)}</p>
      <div class="meta">
        <span class="price mono">${escapeHTML(p.price)}</span>
        <span class="category-tag mono">${escapeHTML(categories[p.category] || p.category)}</span>
      </div>
      <p class="why">${escapeHTML(p.why)}</p>
      <a class="buy-btn" href="${escapeHTML(safeLink(p.link))}" target="_blank" rel="nofollow sponsored noopener">Get it \u2192</a>
    </article>
  `;
}

function render(filter) {
  const all = getAllProducts();
  const items = filter === 'all' ? all : all.filter(p => p.category === filter);
  grid.innerHTML = items.map(cardHTML).join('');
  grid.classList.toggle('is-empty', items.length === 0);
}

buildFilterChips();

filtersBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  render(btn.dataset.filter);
});

render('all');
