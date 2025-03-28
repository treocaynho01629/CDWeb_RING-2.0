import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const AuthTitle = styled.h1`
  font-size: 30px;
  font-weight: 400;
`;

export const TermText = styled.p`
  font-size: 12px;
  margin: ${({ theme }) => theme.spacing(1)} 0;
  text-align: center;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const AuthText = styled.p`
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing(8)};
  text-align: center;
`;

export const AuthHighlight = styled.span`
  text-decoration: underline;
  color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.primary.main};
  cursor: pointer;

  &:hover {
    color: ${({ theme, color }) =>
      theme.palette[color]?.dark || theme.palette.primary.dark};
  }
`;

export const AuthActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ConfirmButton = styled(Button)`
  height: 44px;
  font-size: 16px;
`;
