import { Outlet } from "react-router-dom";
import styled from 'styled-components'
import Navbar from "../navbar/Navbar";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";

const LayoutWrapper = styled.div`
    @media (min-width: 768px) {
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        width: 750px;
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
            <ScrollToTopButton />
            <LayoutWrapper>
                <Outlet />
            </LayoutWrapper>
            <Footer />
        </>
    )
}