import { useState } from 'react';
import { Outlet } from 'react-router';
import { Container, useMediaQuery, useTheme } from "@mui/material";
import DashboardNavbar from "./DashboardNavbar";
import DashboardDrawer from "./DashboardDrawer";
import styled from '@emotion/styled';

const LayoutWrapper = styled.div`
    display: flex;

    ${props => props.theme.breakpoints.down('md')} {
        display: block;
    }
`

const MainContainer = styled.div`
    flex-grow: 1;
    position: relative;

    ${props => props.theme.breakpoints.down('md')} {
        flex-grow: auto;
    }
`

export default function DashboardLayout() {
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);

    return (
        <LayoutWrapper>
            <DashboardDrawer {...{ open, setOpen, mobileMode }} />
            <MainContainer component="main">
                <DashboardNavbar {...{ open, setOpen, mobileMode }} />
                <Container maxWidth="xl" sx={{ pb: 4 }}>
                    <Outlet />
                </Container>
            </MainContainer>
        </LayoutWrapper>
    )
}