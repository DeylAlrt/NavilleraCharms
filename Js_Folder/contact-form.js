const EMAILJS_PUBLIC_KEY = '-2tCjwFJUnT97N93w';
const EMAILJS_SERVICE_ID = 'service_vc0fhb9';
const EMAILJS_TEMPLATE_ID = 'template_ljnicp3';

(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const statusEl = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.submit-btn');

    function setStatus(message, isError) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.toggle('form-status--error', !!isError);
        statusEl.classList.toggle('form-status--success', !isError && !!message);
    }

    const isConfigured = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
        && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID'
        && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

    if (isConfigured && typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!isConfigured || typeof emailjs === 'undefined') {
            setStatus("This form isn't connected yet — please email us directly for now.", true);
            return;
        }

        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        setStatus('', false);

        const firstName = (form.first_name && form.first_name.value || '').trim();
        const lastName = (form.last_name && form.last_name.value || '').trim();

        const templateParams = {
            name: [firstName, lastName].filter(Boolean).join(' '),
            title: 'New Contact Form Message',
            time: new Date().toLocaleString(),
            email: form.email.value,
            message: form.message.value,
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                setStatus('Thanks! Your message has been sent.', false);
                form.reset();
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                setStatus('Something went wrong sending your message — please try again or email us directly.', true);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            });
    });
})();
