import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";

export const SortWrapper = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16}px;
  background-color: ${({ theme }) => theme.palette.background.default};
  margin: 20px 0;
  z-index: 2;

  &:before {
    content: "";
    position: absolute;
    left: -10px;
    top: -16px;
    width: calc(100% + 20px);
    height: calc(100% + 16px);
    background-color: ${({ theme }) => theme.palette.background.default};
    z-index: -1;
  }

  ${({ theme }) => theme.breakpoints.down("sm_md")} {
    &:before {
      width: 100%;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    top: ${({ theme }) => theme.mixins.toolbar.minHeight + 4}px;
    border-bottom: 0.5px solid ${({ theme }) => theme.palette.divider};
    margin: 0 0 20px;

    &:before {
      display: none;
    }
  }
`;

export const SortContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const MainContainer = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

export const AltContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: fixed;
    bottom: ${({ theme }) => theme.spacing(1)};
    left: ${({ theme }) => theme.spacing(1)};
  }
`;

export const FilterTitle = styled.span`
  display: block;
  margin-right: 15px;
  font-weight: 450;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

export const StyledInput = styled(TextField)`
  margin-right: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ theme }) => theme.palette.background.paper};

  &.sort {
    .MuiSelect-select {
      padding-right: 0 !important;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-right: 0;

    .MuiSelect-select {
      font-size: 14px;
    }

    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

export const StyledSortButton = styled(Button)`
  padding-left: 0;
  padding-right: 0;
  display: none;
  max-width: 100px;
  color: ${({ theme }) => theme.palette.text.primary};

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    display: flex;
  }
`;
