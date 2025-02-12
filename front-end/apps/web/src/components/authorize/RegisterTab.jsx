import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Grow, Paper, Stack, TextField } from "@mui/material";
import { useRegisterMutation } from "../../features/auth/authApiSlice";
import { USER_REGEX, EMAIL_REGEX } from "@ring/shared/regex";
import {
  AuthHighlight,
  AuthText,
  AuthTitle,
  ConfirmButton,
  TermText,
} from "@ring/ui/AuthComponents";
import { Link } from "react-router";
import { Instruction } from "@ring/ui/Components";
import PasswordInput from "@ring/ui/PasswordInput";
import PasswordEvaluate from "../custom/PasswordEvaluate";

const ReCaptcha = lazy(() => import("@ring/auth/ReCaptcha"));

const RegisterTab = ({
  pending,
  setPending,
  reCaptchaLoaded,
  generateReCaptchaToken,
}) => {
  const userRef = useRef();
  const errRef = useRef();

  //User validation
  const [username, setUsername] = useState(""); //user input
  const [validName, setValidName] = useState(false); //check name validate or not
  const [userFocus, setUserFocus] = useState(false); //focus on field or not

  //Password validation
  const [password, setPassword] = useState("");
  const [validPass, setValidPass] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const [matchPass, setMatchPass] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  //Email validation
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  //Error and success message
  const [errMsg, setErrMsg] = useState("");
  const [err, setErr] = useState([]);

  //Recaptcha v2
  const [challenge, setChallenge] = useState(false); //Toggle if marked suspicious by v3
  const [token, setToken] = useState("");

  //Register mutation
  const [register, { isLoading }] = useRegisterMutation();

  //Focus username
  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  //Username
  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidName(result);
  }, [username]);

  //Password
  useEffect(() => {
    const match = password === matchPass;
    setValidMatch(match);
  }, [matchPass]);

  //Email
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  //Error message reset when reinput stuff
  useEffect(() => {
    setErrMsg("");
  }, [username, email, password, matchPass]);

  //Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending || !reCaptchaLoaded) return;

    // //Validation
    const v1 = USER_REGEX.test(username);
    const v2 = EMAIL_REGEX.test(email);

    if (!v1 || !v2) {
      setErrMsg("Sai định dạng thông tin!");
      return;
    }
    setPending(true);

    const { enqueueSnackbar } = await import("notistack");

    const recaptchaToken = challenge
      ? token
      : await generateReCaptchaToken("register");
    register({
      token: recaptchaToken,
      source: challenge ? "v2" : "v3",
      user: {
        username,
        pass: password,
        email,
      },
    })
      .unwrap()
      .then((data) => {
        //Reset input
        setUsername("");
        setPassword("");
        setMatchPass("");
        setEmail("");
        setErr([]);
        setErrMsg("");
        setChallenge(false);

        //Queue snack
        enqueueSnackbar("Đăng ký thành công!", { variant: "success" });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        setErr(err);
        if (!err?.status) {
          setErrMsg("Server không phản hồi");
        } else if (err?.status === 409) {
          setErrMsg(err?.data?.message);
        } else if (err?.status === 400) {
          setErrMsg(err?.data?.message ?? "Sai định dạng thông tin!");
        } else if (err?.status === 403) {
          setErrMsg("Lỗi xác thực!");
        } else if (err?.status === 412) {
          setChallenge(true);
          setErrMsg("Yêu cầu của bạn cần xác thực lại!");
        } else {
          setErrMsg("Đăng ký thất bại!");
        }
        errRef.current.focus();
        setPending(false);
      });
  };

  const validRegister = [validName, validPass, validMatch, validEmail].every(
    Boolean,
  );

  return (
    <form style={{ maxHeight: 560 }} onSubmit={handleSubmit}>
      <AuthTitle>Đăng ký tài khoản mới</AuthTitle>
      <Stack spacing={{ xs: 0.75, md: 1.5 }} direction="column">
        <Instruction
          ref={errRef}
          display={errMsg ? "block" : "none"}
          aria-live="assertive"
        >
          {errMsg}
        </Instruction>
        <TextField
          label="Tên đăng nhập"
          type="text"
          id="new-username"
          autoComplete="username"
          size="small"
          ref={userRef}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          aria-invalid={validName ? "false" : "true"}
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
          error={
            (userFocus && username && !validName) ||
            err?.data?.errors?.username != null
          }
          helperText={
            userFocus && username && !validName
              ? "4 đến 24 kí tự."
              : err?.data?.errors?.username
          }
        />
        <TextField
          label="Địa chỉ email"
          type="email"
          id="email"
          autoComplete="off"
          size="small"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          aria-invalid={validEmail ? "false" : "true"}
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
          error={
            (emailFocus && email && !validEmail) ||
            err?.data?.errors?.email != null
          }
          helperText={
            emailFocus && email && !validEmail
              ? "Sai định dạng email."
              : err?.data?.errors?.email
          }
        />
        <Stack
          spacing={{ xs: 0.75, md: 1.5 }}
          direction={challenge ? "row" : "column"}
          position="relative"
        >
          <div style={{ width: "100%s" }}>
            <PasswordInput
              label="Mật khẩu"
              size="small"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              aria-describedby="new password"
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              fullWidth
              error={err?.data?.errors?.pass != null}
              helperText={err?.data?.errors?.pass}
            />
            <Grow in={passFocus} style={{ transformOrigin: "0 100%" }}>
              <Paper
                elevation={16}
                sx={{
                  position: "absolute",
                  bgcolor: "background.paper",
                  padding: 1,
                  marginBottom: 1,
                  left: 0,
                  bottom: "100%",
                  zIndex: 1,
                }}
              >
                <PasswordEvaluate
                  {...{ password, onValid: (value) => setValidPass(value) }}
                />
              </Paper>
            </Grow>
          </div>
          <PasswordInput
            label="Nhập lại mật khẩu"
            size="small"
            onChange={(e) => setMatchPass(e.target.value)}
            value={matchPass}
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirm new password"
            error={
              (matchPass && !validMatch) || err?.data?.errors?.pass != null
            }
            helperText={matchPass && !validMatch ? "Không trùng mật khẩu." : ""}
          />
        </Stack>
        {reCaptchaLoaded && challenge && (
          <Suspense fallback={null}>
            <ReCaptcha onVerify={(token) => setToken(token)} />
          </Suspense>
        )}
        <TermText>
          Được bảo vệ bởi reCAPTCHA và Google thông qua
          <br />
          <a href="https://policies.google.com/terms">
            <AuthHighlight color="warning">Điều khoản dịch vụ</AuthHighlight>
          </a>
          &nbsp;&&nbsp;
          <a href="https://policies.google.com/privacy">
            <AuthHighlight color="warning">Chính sách bảo mật</AuthHighlight>
          </a>
        </TermText>
        <ConfirmButton
          variant="contained"
          color="primary"
          type="submit"
          aria-label="submit register"
          disabled={!validRegister || isLoading || !reCaptchaLoaded}
        >
          Đăng ký
        </ConfirmButton>
      </Stack>
      <AuthText>
        Đã có tài khoản?&nbsp;
        <Link to={"/auth/login"}>
          <AuthHighlight>Đăng nhập</AuthHighlight>
        </Link>
      </AuthText>
    </form>
  );
};

export default RegisterTab;
