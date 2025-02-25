import { Outlet } from "react-router";
import ScrollToTopButton from "@ring/ui/ScrollToTopButton";
import Navbar from "../navbar/Navbar";
import Footer from "./Footer";
import styled from "@emotion/styled";

const LayoutWrapper = styled.div`
  position: relative;
  min-height: 60dvh;

  ${({ theme }) => theme.breakpoints.up("sm_md")} {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    width: 750px;
  }

  ${({ theme }) => theme.breakpoints.up("md_lg")} {
    width: 970px;
  }

  ${({ theme }) => theme.breakpoints.up("lg")} {
    width: 1170px;
  }
`;

const buttonHeightMap = {
  "/cart": "high",
  "/checkout": "high",
  "/product": "medium",
};

export default function PageLayout() {
  return (
    <>
      <Navbar />
      <ScrollToTopButton heightMap={buttonHeightMap} />
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
      <Footer />
    </>
  );
}
