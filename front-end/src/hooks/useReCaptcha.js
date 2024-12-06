import { useCallback, useEffect, useState } from 'react'

const showBadge = () => {
    if (!window.grecaptcha) return

    window.grecaptcha.ready(() => {
        const badge = document.getElementsByClassName('grecaptcha-badge')[0];
        if (!badge) return;
        badge.style.display = 'block';
        badge.style.zIndex = '1';
    })
}

const hideBadge = () => { //FIX
    if (!window.grecaptcha) return;

    window.grecaptcha.ready(() => {
        const badge = document.getElementsByClassName('grecaptcha-badge')[0];
        if (!badge) return;
        badge.style.display = 'none';
    })
}

const useReCaptcha = () => {
    const [reCaptchaLoaded, setReCaptchaLoaded] = useState(false);
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    // Load ReCaptcha script
    useEffect(() => {
        if (typeof window === 'undefined' || reCaptchaLoaded) return;
        if (window.grecaptcha) {
            showBadge();
            setReCaptchaLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
        script.addEventListener('load', () => {
            setReCaptchaLoaded(true);
            showBadge();
        })
        document.body.appendChild(script);
    }, [reCaptchaLoaded])

    // Hide badge when unmount
    useEffect(() => hideBadge, []);

    // Get token
    const generateReCaptchaToken = useCallback(async (action) => {
        if (!reCaptchaLoaded) return null;

        if (typeof window === 'undefined' || !window.grecaptcha) {
            setReCaptchaLoaded(false);
            return null;
        }

        return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
    }, [reCaptchaLoaded])

    return { reCaptchaLoaded, generateReCaptchaToken }
}

export default useReCaptcha