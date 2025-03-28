import styled from "@emotion/styled";
import { Link } from "react-router";
import {
  ContactSupportOutlined,
  ContrastOutlined,
  LightModeOutlined,
  NightlightOutlined,
} from "@mui/icons-material";
import { useColorScheme } from "@mui/material";

//#region styled
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  margin: auto;
  z-index: ${({ theme }) => theme.zIndex.appBar};

  ${({ theme }) => theme.breakpoints.down("md")} {
    text-align: center;
    padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
  }
`;

const SimpleButton = styled.span`
  height: 46px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.text.secondary};
  float: right;
  cursor: pointer;

  p {
    font-size: 13px;
    margin-left: 5px;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    p {
      display: none;
    }
    &:last-of-type {
      float: left;
    }
  }
`;

const Logo = styled.img`
  height: 45px;
  padding: 4px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    filter: drop-shadow(
      0px -1000px 0 ${({ theme }) => theme.palette.text.primary}
    );
    transform: translateY(1000px);
  }
`;
//#endregion

const SimpleNavbar = () => {
  const { mode, setMode } = useColorScheme();

  //Toggle color mode
  const toggleMode = () => {
    if (!mode) {
      return;
    } else if (mode === "system") {
      setMode("light");
    } else if (mode === "light") {
      setMode("dark");
    } else if (mode === "dark") {
      setMode("system");
    }
  };

  return (
    <Container>
      <Link to="/" tabIndex={-1}>
        <Logo src="/full-logo.svg" alt="RING! Logo" />
      </Link>
      <SimpleButton>
        <ContactSupportOutlined />
        <p>Trợ giúp</p>
      </SimpleButton>
      {mode && (
        <SimpleButton aria-label="toggle-mode" onClick={toggleMode}>
          {mode === "dark" ? (
            <NightlightOutlined />
          ) : mode === "light" ? (
            <LightModeOutlined />
          ) : mode === "system" ? (
            <ContrastOutlined />
          ) : (
            ""
          )}
          &nbsp;
        </SimpleButton>
      )}
    </Container>
  );
};

export default SimpleNavbar;
