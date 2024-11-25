import { Outlet } from 'react-router';
import Navbar from "../navbar/Navbar";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";
import styled from "@emotion/styled";

const LayoutWrapper = styled.div`
    position: relative;
    min-height: 60dvh;

    ${props => props.theme.breakpoints.up("sm_md")} {
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        width: 750px;
    }

    ${props => props.theme.breakpoints.up("md_lg")} {
        width: 970px;
    }

    ${props => props.theme.breakpoints.up("lg")} {
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