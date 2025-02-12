import { useCallback } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useLocation } from "react-router";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import styled from "@emotion/styled";

//#region styled
const ButtonContainer = styled.div`
  position: fixed;
  bottom: ${(props) => props.theme.spacing(3)};
  right: ${(props) => props.theme.spacing(3)};
  transition: ${(props) =>
    props.theme.transitions.create(["transform"], {
      duration: props.theme.transitions.duration.shortest,
      easing: props.theme.transitions.easing.easeInOut,
    })};
  z-index: 10;

  &.hidden {
    transform: scale(0);
  }

  ${(props) => props.theme.breakpoints.down("md")} {
    &.medium {
      bottom: ${(props) => props.theme.spacing(8)};
    }
  }

  ${(props) => props.theme.breakpoints.down("sm_md")} {
    bottom: ${(props) => props.theme.spacing(2)};
    right: ${(props) => props.theme.spacing(2)};

    &.high {
      bottom: ${(props) => props.theme.spacing(17)};
    }
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    bottom: ${(props) => props.theme.spacing(1.5)};
    right: ${(props) => props.theme.spacing(1.5)};

    &.medium {
      bottom: ${(props) => props.theme.spacing(7.5)};
    }

    &.high {
      bottom: ${(props) => props.theme.spacing(14)};
    }
  }
`;

const StyledButton = styled.button`
  border-radius: 0;
  border: none;
  outline: none;
  width: 48px;
  height: 48px;
  color: ${(props) => props.theme.palette.primary.contrastText};
  background-color: ${(props) => props.theme.palette.primary.main};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.palette.grey[300]};
    color: ${(props) => props.theme.palette.text.primary};
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
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
