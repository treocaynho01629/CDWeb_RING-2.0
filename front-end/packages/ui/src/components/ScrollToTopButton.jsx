import { useCallback } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useLocation } from "react-router";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import styled from "@emotion/styled";

//#region styled
const ButtonContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing(3)};
  right: ${({ theme }) => theme.spacing(3)};
  transition: ${({ theme }) =>
    theme.transitions.create(["transform"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    })};
  z-index: 10;

  &.hidden {
    transform: scale(0);
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    &.medium,
    &.high {
      bottom: ${({ theme }) => theme.spacing(8)};
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm_md")} {
    bottom: ${({ theme }) => theme.spacing(2)};
    right: ${({ theme }) => theme.spacing(2)};

    &.high {
      bottom: ${({ theme }) => theme.spacing(17)};
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    bottom: ${({ theme }) => theme.spacing(1.5)};
    right: ${({ theme }) => theme.spacing(1.5)};

    &.medium {
      bottom: ${({ theme }) => theme.spacing(7.5)};
    }

    &.high {
      bottom: ${({ theme }) => theme.spacing(14)};
    }
  }
`;

const StyledButton = styled.button`
  border-radius: 0;
  border: none;
  outline: none;
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  background-color: ${({ theme }) => theme.palette.primary.main};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey[300]};
    color: ${({ theme }) => theme.palette.text.primary};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 35px;
    height: 35px;
    opacity: 0.9;
  }
`;
//#endregion

const ScrollToTopButton = ({ heightMap }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });
  const location = useLocation();
  const pathname = `/${location.pathname.split("/")[1]}`;

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <ButtonContainer
      role="presentation"
      className={`${heightMap[pathname]} ${trigger ? "" : "hidden"}`}
    >
      <StyledButton onClick={scrollToTop} aria-label="scroll back to top">
        <KeyboardArrowUp sx={{ fontSize: 30 }} />
      </StyledButton>
    </ButtonContainer>
  );
};

export default ScrollToTopButton;
