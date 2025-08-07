import type {} from "@mui/material/themeCssVarsAugmentation";
import { styled } from "@mui/material/styles";
// import ScrollToTop from "@ring/ui/ScrollToTop";
// import Navbar from "./Navbar";
// import NavDrawer from "./NavDrawer";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs_sm: true;
    sm_md: true;
    md_lg: true;
  }
}

//#region styled
const LayoutWrapper = styled("div")`
  display: flex;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: block;
  }
`;

const MainContainer = styled("div")`
  flex-grow: 1;
  position: relative;

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-grow: auto;
  }
`;

const LayoutContainer = styled("div")`
  position: relative;
  min-height: 60dvh;
  padding-bottom: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.up("sm_md")} {
    padding-right: ${({ theme }) => theme.spacing(2)};
    padding-left: ${({ theme }) => theme.spacing(2)};
    margin-right: auto;
    margin-left: auto;
    max-width: ${({ theme }) => theme.breakpoints.values["lg"]}px;
  }
`;
//#endregion

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <LayoutWrapper>
    //   {/* <ScrollToTop /> */}
    //   {/* <NavDrawer {...{ open, setOpen, tabletMode }} /> */}
    //   <MainContainer>
    //     {/* <Navbar /> */}
    //     <LayoutContainer>{children}</LayoutContainer>
    //   </MainContainer>
    // </LayoutWrapper>
    <div>{children}</div>
  );
}
