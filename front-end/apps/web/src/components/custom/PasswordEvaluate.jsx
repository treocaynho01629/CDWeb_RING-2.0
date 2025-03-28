import styled from "@emotion/styled";
import { Rating, Box } from "@mui/material";
import { useEffect, useState } from "react";

//#region styled
const Indicator = styled.span`
  height: 3px;
  width: 36px;
  margin-right: ${({ theme }) => theme.spacing(1)};
  background-color: currentColor !important;

  &.empty {
    background-color: ${({ theme }) => theme.palette.action.hover};
    outline: 0.5px solid ${({ theme }) => theme.palette.divider};
  }
`;

const EvaluateLabel = styled.p`
  color: inherit;
  font-size: 16px;
  font-weight: 450;
  margin: ${({ theme }) => theme.spacing(0.5)} 0;
`;

const EvaluateHelperText = styled.span`
  font-size: 12px;
  line-height: 0.5;
  color: ${({ theme }) => theme.palette.text.secondary};
`;
//#endregion

const customEvaluate = {
  0: {
    color: "error",
    label: "Độ dài không hợp lệ",
  },
  1: {
    color: "error",
    label: "Mật khẩu cần kí tự thường và chữ số hoặc kí tự đặc biệt",
  },
  2: {
    color: "warning",
    label: "Mật khẩu thông dụng",
  },
  3: {
    color: "success",
    label: "Mật khẩu hợp lệ",
  },
};

const PasswordEvaluate = ({ password, onValid }) => {
  const [strength, setStrength] = useState(0);

  //Password
  useEffect(() => {
    setStrength(evaluatePasswordStrength(password));
  }, [password]);

  //Pass strength evaluate
  const evaluatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;

    //Length
    if (password.length > 24 || password.length < 8) return (score = 0);
    if (password.length > 8) score += 0.25;
    //Lowercase
    if (/[a-z]/.test(password)) score += 0.5;
    //Uppercase
    if (/[A-Z]/.test(password)) score += 1;
    //Numbers
    if (/\d/.test(password)) score += 0.5;
    //Special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    score = Math.ceil(score > 3 ? 3 : score);
    if (score >= 2) onValid(true);
    return score;
  };

  return (
    <Box mt={-1} sx={{ color: `${customEvaluate[strength].color}.main` }}>
      <Rating
        name="password-strength-indicator"
        value={strength}
        max={3}
        sx={{ color: `${customEvaluate[strength].color}.main` }}
        getLabelText={(value) => customEvaluate[value].label}
        icon={<Indicator />}
        emptyIcon={<Indicator className="empty" />}
        readOnly
      />
      <EvaluateLabel>{customEvaluate[strength].label}</EvaluateLabel>
      <EvaluateHelperText>
        Độ dài mật khẩu từ 8-24 kí tự bao gồm cả chữ cái thường và chữ số.
      </EvaluateHelperText>
    </Box>
  );
};

export default PasswordEvaluate;
