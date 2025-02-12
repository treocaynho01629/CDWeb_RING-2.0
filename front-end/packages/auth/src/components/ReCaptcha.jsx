import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

//ReCaptcha v2
//Only usable after v3 script already loaded
const ReCaptcha = ({ onVerify, onExpire }) => {
  const effectRan = useRef(false);
  const recaptchaId = useRef(null);
  const containerRef = useRef(null);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Render the reCAPTCHA widget
  useEffect(() => {
    if (effectRan.current) return;
    if (window.grecaptcha && containerRef.current && !recaptchaId.current) {
      render();
    }
    return () => (effectRan.current = true);
  }, [onVerify, onExpire]);

  const render = () => {
    recaptchaId.current = window.grecaptcha.render(containerRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: mode,
      callback: onVerify,
      "expired-callback": onExpire,
    });
  };

  //Reset widget
  const reset = () => {
    if (window.grecaptcha && recaptchaId.current !== null) {
      window.grecaptcha.reset(recaptchaId.current);
    }
  };

  return (
    <Box display="flex" justifyContent="center" my={2}>
      <Box
        bgcolor="white"
        p={0.1}
        sx={{ borderRadius: "3px", overflow: "hidden" }}
        ref={containerRef}
      ></Box>
    </Box>
  );
};

export default ReCaptcha;
