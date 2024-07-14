import { Outlet } from "react-router-dom";
import styled from 'styled-components'
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const LayoutWrapper = styled.div`
    padding-top: 70px;
    overflow-x: hidden;

    @media (min-width: 768px) {
        overflow-x: visible;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        width: 750px;
    }
    @media (min-width: 900px) {
        padding-top: 115px;
    }
    @media (min-width: 992px) {
        width: 970px;
    }
    @media (min-width: 1200px) {
        width: 1170px;
    }
`

export default function PageLayout() {
    return (
        <>
            <Navbar />
            <ScrollToTop />
            <LayoutWrapper>
                <Outlet />
            </LayoutWrapper>
            <Footer />
        </>
    )
}