import {
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "@emotion/styled";

export const StyledTableCell = styled(TableCell)`
  transition: opacity 0.2s ease;

  &.${tableCellClasses.root} {
    border: none;
  }

  &.${tableCellClasses.head} {
    font-weight: bold;
    padding: 2px 8px;
  }

  &.${tableCellClasses.paddingCheckbox} {
    padding-left: 4px;
  }

  &.hidden {
    opacity: 0;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    &.${tableCellClasses.body} {
      padding: 8px 8px 8px 4px;
    }

    &.${tableCellClasses.head} {
      padding: 4px;
    }

    &.${tableCellClasses.paddingCheckbox} {
      padding: 0;
    }
  }

  &.preview {
    &.${tableCellClasses.body} {
      padding: 12px 16px;
    }

    &.${tableCellClasses.head} {
      padding: 4px;
    }

    &.${tableCellClasses.paddingCheckbox} {
      padding: 0;
    }

    ${({ theme }) => theme.breakpoints.down("sm")} {
      &.${tableCellClasses.body} {
        padding: 8px 8px 8px 4px;
      }

      &.${tableCellClasses.head} {
        padding: 4px;
      }

      &.${tableCellClasses.paddingCheckbox} {
        padding: 0;
      }
    }
  }
`;

export const ActionTableCell = styled(TableCell)`
  &.${tableCellClasses.root} {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0;
    width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    border: none;
  }
`;

export const StyledTableHead = styled(TableHead)`
  position: sticky;
  top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16}px;
  background-color: ${({ theme }) => theme.palette.background.default};
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

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% + 0.5px);
    height: 100%;
    border: 0.5px solid ${({ theme }) => theme.palette.action.focus};

    ${({ theme }) => theme.breakpoints.down("sm")} {
      border-left: none;
      border-right: none;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm_md")} {
    &:before {
      width: 100%;
    }
    &:after {
      width: 100%;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    top: ${({ theme }) => theme.mixins.toolbar.minHeight + 4}px;

    &:before {
      display: none;
    }
    &:after {
      width: 100%;
    }
  }
`;

export const StyledTableRow = styled(TableRow)`
  position: relative;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 0.5px solid ${({ theme }) => theme.palette.action.focus};
    background-color: ${({ theme }) => theme.palette.background.paper};
    z-index: -1;

    ${({ theme }) => theme.breakpoints.down("sm")} {
      border-left: none;
      border-right: none;
    }
  }

  &.shop {
    &:after {
      border-bottom: none;
    }
  }
`;

export const StyledItemTableRow = styled(TableRow)`
  position: relative;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 0.5px solid ${({ theme }) => theme.palette.action.focus};
    border-top: none;
    border-bottom: none;
    background-color: ${({ theme }) => theme.palette.background.paper};
    z-index: -1;

    ${({ theme }) => theme.breakpoints.down("sm")} {
      border: none;
    }
  }

  &.error {
    &:after {
      border: 0.5px solid ${({ theme }) => theme.palette.error.light};
    }
  }
`;

export const SpaceTableRow = styled(TableRow)`
  height: 16px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 8px;
  }
`;
