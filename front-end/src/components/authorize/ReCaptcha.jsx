import { useTheme } from '@emotion/react';
import { useEffect, useRef } from 'react';

//ReCaptcha v2
//Only usable after v3 script already loaded
const ReCaptcha = ({ onVerify, onExpire }) => {
    const effectRan = useRef(false);
    const recaptchaId = useRef(null);
    const containerRef = useRef(null);
    const theme = useTheme();
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    // Render the reCAPTCHA widget
    useEffect(() => {
        if (effectRan.current) return;
        if (window.grecaptcha && containerRef.current && !recaptchaId.current) {
            recaptchaId.current = window.grecaptcha.render(containerRef.current, {
                sitekey: RECAPTCHA_SITE_KEY,
                theme: theme.palette.mode,
                callback: onVerify,
                'expired-callback': onExpire,
            });
        }
        return () => effectRan.current = true;
    }, [onVerify, onExpire]);

    //Reset widget
    const reset = () => {
        if (window.grecaptcha && recaptchaId.current !== null) {
            window.grecaptcha.reset(recaptchaId.current);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }} ref={containerRef}></div>
    );
};

export default ReCaptcha;