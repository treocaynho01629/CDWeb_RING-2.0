import styled from "@emotion/styled";
import { DialogTitle } from "@mui/material";

export const StyledDialogTitle = styled(DialogTitle)`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  font-size: 18px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1.5)} 0px;
  border-bottom: 0.5px solid ${({ theme }) => theme.palette.divider};
  color: ${({ theme }) => theme.palette.primary.main};
  border-color: ${({ theme }) => theme.palette.primary.main};
  width: 100%;

  a {
    display: none;
    align-items: center;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    font-size: 16px;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: ${({ theme }) => theme.spacing(2)} 10px;
    margin-bottom: 0;

    a {
      display: flex;
    }
  }
`;

export const TabContentContainer = styled.div`
  position: relative;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};
  min-height: 60dvh;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 0;
    border: none;
  }
`;
