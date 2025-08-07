import { useCallback, useEffect, useRef, useState } from "react";

const useReCaptcha = (recaptchaSiteKey) => {
  const [reCaptchaLoaded, setReCaptchaLoaded] = useState(false);
  const effectRan = useRef(false); //Prevent React.StrictMode running useEffect twice

  // Load ReCaptcha script
  useEffect(() => {
    if (effectRan.current) return;

    const initiateScript = () => {
      if (typeof window === "undefined" || reCaptchaLoaded) return;
      if (window.grecaptcha) {
        showBadge();
        setReCaptchaLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}&badge=bottomleft&hl=vi`;
      script.addEventListener("load", () => {
        setReCaptchaLoaded(true);
        showBadge();
      });
      document.body.appendChild(script);
    };

    initiateScript();
    return () => (effectRan.current = true);
  }, [reCaptchaLoaded]);

  // Hide badge when unmount
  useEffect(() => hideBadge, []);

  const showBadge = useCallback(() => {
    if (!window.grecaptcha) return;

    window.grecaptcha.ready(() => {
      const badge = document.getElementsByClassName("grecaptcha-badge")[0];
      if (!badge) return;
      badge.style.visibility = "visible";
    });
  }, []);

  const hideBadge = useCallback(() => {
    if (!window.grecaptcha) return;

    window.grecaptcha.ready(() => {
      const badge = document.getElementsByClassName("grecaptcha-badge")[0];
      if (!badge) return;
      badge.style.visibility = "hidden";
    });
  }, []);

  // Get token
  const generateReCaptchaToken = useCallback(
    async (action) => {
      if (!reCaptchaLoaded) return null;

      if (typeof window === "undefined" || !window.grecaptcha) {
        setReCaptchaLoaded(false);
        return null;
      }

      return await window.grecaptcha.execute(recaptchaSiteKey, { action });
    },
    [reCaptchaLoaded]
  );

  return { reCaptchaLoaded, generateReCaptchaToken, hideBadge, showBadge };
};

export default useReCaptcha;
