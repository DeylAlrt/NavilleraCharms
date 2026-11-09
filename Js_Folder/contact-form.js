// The contact form on the FAQs and About Us pages. Messages are sent by the
// charm builder's server (navillera.vercel.app), which checks for spam first.
const CONTACT_ENDPOINT = 'https://navillera.vercel.app/api/contact';

(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const statusEl = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.submit-btn');

    // Spam protection (Js_Folder/human-check.js): a hidden field and the "I'm human" check.
    const tools = window.NavilleraHumanCheck;
    let humanCheck = { enabled: false, getToken: () => '', reset() {} };
    if (tools) {
        submitBtn.insertAdjacentHTML('beforebegin', tools.honeypotHtml() + '<div class="contact-human-check"></div>');
        humanCheck = tools.mount(form.querySelector('.contact-human-check'));
    }

    function setStatus(message, isError) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.toggle('form-status--error', !!isError);
        statusEl.classList.toggle('form-status--success', !isError && !!message);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (humanCheck.enabled && !humanCheck.getToken()) {
            setStatus('Please tick the "I\'m human" check.', true);
            return;
        }

        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        setStatus('', false);

        // FAQ page has one "Name" field; About Us has First + Last Name
        const fullName = (form.full_name && form.full_name.value || '').trim();
        const firstName = (form.first_name && form.first_name.value || '').trim();
        const lastName = (form.last_name && form.last_name.value || '').trim();
        const honeypot = form.querySelector('input[name="website"]');

        fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: fullName || [firstName, lastName].filter(Boolean).join(' '),
                email: form.email.value,
                message: form.message.value,
                website: honeypot ? honeypot.value : '',
                turnstileToken: humanCheck.getToken(),
            }),
        })
            .then(res => res.json().catch(() => ({ success: false })))
            .then(result => {
                if (!result.success) throw new Error(result.error || '');
                setStatus('Thanks! Your message has been sent.', false);
                form.reset();
            })
            .catch((err) => {
                console.error('Contact form error:', err);
                setStatus(err && err.message && err.message !== 'Failed to fetch'
                    ? err.message
                    : 'Something went wrong sending your message — please try again or email us directly.', true);
            })
            .finally(() => {
                humanCheck.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            });
    });
})();
