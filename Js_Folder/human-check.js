// Spam protection for the order and contact forms:
//   - a hidden "website" field people never see, so only bots fill it in
//   - Cloudflare Turnstile, the "I'm human" check (shows once SITE_KEY is filled in)
// The charm builder's server (navillera.vercel.app) checks both before
// sending any order or message.
window.NavilleraHumanCheck = (function () {
    // Cloudflare Turnstile site key (public). Leave empty to turn the check off.
    const SITE_KEY = '';

    let scriptLoading = null;

    function loadTurnstile() {
        if (window.turnstile) return Promise.resolve(window.turnstile);
        if (!scriptLoading) {
            scriptLoading = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing')));
                script.onerror = () => { scriptLoading = null; reject(new Error('Could not load Turnstile')); };
                document.head.appendChild(script);
            });
        }
        return scriptLoading;
    }

    /** The hidden field, to put inside a form. */
    function honeypotHtml() {
        return '<div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;">'
            + '<label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>';
    }

    /**
     * Shows the "I'm human" check inside `container`.
     * Returns { enabled, getToken(), reset() }; a token is good for one send, so call reset() after each.
     */
    function mount(container) {
        let token = '';
        let widgetId = null;
        const check = {
            enabled: !!SITE_KEY,
            getToken: () => token,
            reset() {
                token = '';
                if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
            },
        };
        if (!SITE_KEY || !container) return check;

        container.style.minHeight = '65px';
        loadTurnstile()
            .then(turnstile => {
                widgetId = turnstile.render(container, {
                    sitekey: SITE_KEY,
                    size: 'flexible',
                    theme: 'light',
                    callback: t => { token = t; },
                    'expired-callback': () => { token = ''; },
                    'error-callback': () => { token = ''; },
                });
            })
            .catch(err => console.error(err));
        return check;
    }

    return { honeypotHtml, mount };
})();
