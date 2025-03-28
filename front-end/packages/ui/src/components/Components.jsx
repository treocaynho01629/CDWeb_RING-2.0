import styled from "@emotion/styled";

export const Instruction = styled.p`
  font-size: 14px;
  font-style: italic;
  color: ${({ theme }) => theme.palette.error.main};
  display: ${({ display }) => display};
`;

export const LogoImage = styled.img`
  height: 40px;
  padding: 4px;
`;

export const LogoTitle = styled.span`
  font-family: abel;
  font-size: 27px;
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.main};
  text-shadow: 1.5px 1.5px ${({ theme }) => theme.palette.background.paper};
  margin-left: 10px;
  white-space: nowrap;
  transition: width 0.25s ease;
`;

export const LogoSubtitle = styled(LogoTitle)`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-left: 0;
`;

export const MobileExtendButton = styled.div`
  position: absolute;
  right: -1%;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: auto;
  width: 102%;
  height: 100%;
  max-height: 30px;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.text.disabled : theme.palette.text.secondary};
  pointer-events: ${({ theme, disabled }) => (disabled ? "none" : "all")};
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: -2%;
    right: 0;
    width: 100%;
    height: 104%;
    background-image: linear-gradient(
      to left,
      ${({ theme }) => theme.palette.background.paper},
      ${({ theme }) => theme.palette.background.paper} 5%,
      transparent 15%,
      transparent 100%
    );
    z-index: -1;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: none;
  }
`;

export const Title = styled.h3`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  margin: 0 0 20px;
  padding: 15px 0;
  border-bottom: 0.5px solid
    ${({ theme, color }) => theme.palette[color]?.main || theme.palette.divider};
  color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.text.primary};
  border-color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.primary.main};
  width: 100%;

  a {
    display: none;
    align-items: center;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    font-size: 16px;
    margin: 0 0 15px;
    text-transform: none;

    a {
      display: flex;
    }
  }
`;

export const Showmore = styled.div`
  font-size: 14px;
  font-weight: 500;
  flex-grow: 1;
  padding: 15px 0;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.info.main};
  cursor: pointer;

  &::after {
    content: "";
    z-index: 0;
    position: absolute;
    top: -55px;
    left: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
    border-bottom: 0.5px solid ${({ theme }) => theme.palette.divider};
    background-image: linear-gradient(
      180deg,
      transparent,
      transparent 60%,
      ${({ theme }) => theme.palette.background.paper} 100%
    );
  }

  &.expand {
    margin-top: 10px;

    &::after {
      background-image: none;
    }
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: 0;
  }
`;

export const Message = styled.span`
  margin: 20px 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: wrap;
  color: ${({ theme, color }) =>
    theme.palette[color]?.main || theme.palette.text.primary};
`;
