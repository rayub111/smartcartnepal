// ============================================================
// SHARED: Supabase client + icon set + helpers.
// Used by both index.html (public site) and admin.html.
// ============================================================

const ICONS = {
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="1.5"/><rect x="17" y="14" width="5" height="7" rx="1.5"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="15" r="4"/><circle cx="12" cy="6" r="1.3"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8Z"/><path d="M12 18v4"/></svg>',
  watch: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3h6M9 21h6M12 10v2.5l1.5 1"/></svg>',
  pot: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3Z"/><path d="M2 11h20M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  blender: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-1.5 9h-7L7 3Z"/><path d="M8.5 12h7L17 19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l1.5-7Z"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6M2 10v4M20 9v6M22 10v4M7 12h10"/><rect x="5" y="7.5" width="4" height="9" rx="1"/><rect x="15" y="7.5" width="4" height="9" rx="1"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="15" height="12" rx="2"/><circle cx="9.5" cy="12" r="3.2"/><path d="M17 10l5-3v10l-5-3"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 12.3 12.7 20.2a1.5 1.5 0 0 1-2.1 0l-7-7a1.5 1.5 0 0 1 0-2.1l7.9-7.9c.3-.3.6-.4 1-.4H18a2 2 0 0 1 2 2v5.6c0 .4-.1.7-.4 1Z"/><circle cx="15" cy="8" r="1.3"/></svg>',
  shoe: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17h20v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3Z"/><path d="M2 17V9.5c0-.5.3-.9.7-1.1l4-1.9 3 2.5 4-2 5.6 3.4c.4.3.7.8.7 1.3V17"/><path d="M6.5 6.5 9 4"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="13" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>',
  sunglasses: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="13" r="3.5"/><circle cx="17.5" cy="13" r="3.5"/><path d="M10 13h4M3 12l1.5-5.5A2 2 0 0 1 6.4 5h.6M21 12l-1.5-5.5A2 2 0 0 0 17.6 5H17"/></svg>',
  ring: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="m9 9 3-6 3 6-3 3-3-3Z"/></svg>',
  shirt: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4 4 7l2 3 2-1.5V20h8V8.5L18 10l2-3-4-3-2 2h-4L8 4Z"/></svg>'
};

// Turns a category slug like "smart-home" into "Smart Home" for display.
function prettifyCategory(key) {
  return key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function slugifyCategory(label) {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Prevents product text (name, blurb, etc.) from being interpreted as HTML.
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[char]);
}

// Only allow http(s) links (or "#placeholder" links) through to href attributes.
function safeLink(url) {
  const value = String(url ?? '').trim();
  if (value.startsWith('#')) return value;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch (e) {
    return '#';
  }
}

// Only allow data:image/* or http(s) image URLs through to src attributes.
function safeImageSource(url) {
  const value = String(url ?? '').trim();
  if (value.startsWith('data:image/')) return value;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
  } catch (e) {
    return '';
  }
}

// Supabase client, shared across pages.
const sb = (typeof supabase !== 'undefined' && SUPABASE_URL.startsWith('http'))
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

async function fetchProducts() {
  if (!sb) return { data: [], error: new Error('Supabase is not configured yet — check supabase-config.js') };
  return await sb.from('products').select('*').order('created_at', { ascending: true });
}

async function insertProduct(product) {
  return await sb.from('products').insert([product]);
}

async function updateProductById(id, product) {
  return await sb.from('products').update(product).eq('id', id);
}

async function deleteProductById(id) {
  return await sb.from('products').delete().eq('id', id);
}
