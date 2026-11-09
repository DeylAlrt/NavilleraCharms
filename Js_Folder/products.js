// Products come from the Supabase `products` table, so prices, sold out,
// hiding and new products are changed in the Supabase dashboard — no code
// change or redeploy. If Supabase can't be reached, the collection pages use
// Js_Folder/catalogue-data.js as a backup.
//
// NavilleraProducts.load() → a Promise of the rows (or null if unavailable).
// NavilleraProducts.toCatalogue(rows) → the same shape as CATALOGUE in
// catalogue-data.js, so the collection page draws them the same way.
window.NavilleraProducts = (function () {
    // Public on purpose: this key can only read products that aren't hidden.
    const SUPABASE_URL = 'https://bdmblwuvbcfosadnmskv.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_pJ9zqlsj92-PfgkMmntg3w_6Zz3h588';
    const COLUMNS = 'name,category,section,price_aed,image_path,image_url,sold_out,stock,sort_order';
    const CACHE_KEY = 'navillera-products';
    const CACHE_MS = 60 * 1000;       // a change in Supabase shows within about a minute
    const TIMEOUT_MS = 5000;

    let loading = null;

    function readCache() {
        try {
            const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
            if (cached && Date.now() - cached.at < CACHE_MS && Array.isArray(cached.rows)) return cached.rows;
        } catch {}
        return null;
    }

    function load() {
        if (loading) return loading;
        const cached = readCache();
        if (cached) return (loading = Promise.resolve(cached));

        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), TIMEOUT_MS) : null;
        loading = fetch(`${SUPABASE_URL}/rest/v1/products?select=${COLUMNS}&order=category,section,sort_order`, {
            headers: { apikey: SUPABASE_KEY },
            signal: controller ? controller.signal : undefined,
        })
            .then(res => {
                if (!res.ok) throw new Error('Supabase answered ' + res.status);
                return res.json();
            })
            .then(rows => {
                if (!Array.isArray(rows) || rows.length === 0) throw new Error('No products came back');
                try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rows })); } catch {}
                return rows;
            })
            .catch(err => {
                console.warn('Could not load products from Supabase — using catalogue-data.js:', err);
                return null;
            })
            .finally(() => { if (timer) clearTimeout(timer); });
        return loading;
    }

    const isSoldOut = row => !!row.sold_out || row.stock === 0;
    const fileOf = row => row.image_path || row.image_url;

    /**
     * Builds the collection pages' sections from the rows: in catalogue-data.js's
     * order (new sections after), with its per-section settings (unit, A–Z), and a
     * section's "Gold …" twin attached as its Silver/Gold toggle.
     */
    function toCatalogue(rows) {
        const shop = (typeof SHOP !== 'undefined') ? SHOP : {};
        const settings = {};      // section name → { unit, sortAZ, order }
        let order = 0;
        Object.values(shop).forEach(sections => sections.forEach(s => {
            settings[s.name] = { unit: s.unit, sortAZ: !!s.sortAZ, order: order++ };
            if (s.gold) settings[s.gold.name || `Gold ${s.name}`] = { unit: s.unit, sortAZ: !!s.sortAZ, order: order++ };
        }));

        // Group the rows into sections per category
        const byCategory = {};
        rows.forEach(row => {
            const sections = byCategory[row.category] || (byCategory[row.category] = {});
            const sec = sections[row.section] || (sections[row.section] = { name: row.section, rows: [] });
            sec.rows.push(row);
        });

        const catalogue = { links: [], bracelets: [], watch: [], keychain: [] };
        Object.entries(byCategory).forEach(([category, sections]) => {
            const defaultUnit = category === 'links' ? 'each link' : 'each';
            const build = sec => {
                const set = settings[sec.name] || {};
                const sorted = [...sec.rows].sort((a, b) => a.sort_order - b.sort_order);
                const prices = sorted.map(r => Number(r.price_aed));
                return {
                    name: sec.name,
                    price: Math.min(...prices),
                    samePrice: prices.every(p => p === prices[0]),
                    unit: set.unit || defaultUnit,
                    sortItems: !!set.sortAZ,
                    order: set.order ?? Infinity,
                    items: sorted.map(r => ({ label: r.name, file: fileOf(r), soldOut: isSoldOut(r), price: Number(r.price_aed) })),
                };
            };
            const all = Object.values(sections).map(build);
            const names = new Set(all.map(s => s.name));
            // "Gold X" with an "X" next to it becomes X's Gold toggle
            const golds = new Map(all.filter(s => s.name.startsWith('Gold ') && names.has(s.name.slice(5))).map(s => [s.name.slice(5), s]));
            catalogue[category] = all
                .filter(s => !(s.name.startsWith('Gold ') && names.has(s.name.slice(5))))
                .map(s => (golds.has(s.name) ? { ...s, gold: golds.get(s.name) } : s))
                .sort((a, b) => a.order - b.order);
        });
        return catalogue;
    }

    /** Latest price and sold out by cart key ("<section>::<file>"), for the cart. */
    function byCartKey(rows) {
        const map = new Map();
        rows.forEach(r => map.set(`${r.section}::${fileOf(r)}`, { price: Number(r.price_aed), soldOut: isSoldOut(r) }));
        return map;
    }

    return { load, toCatalogue, byCartKey };
})();
