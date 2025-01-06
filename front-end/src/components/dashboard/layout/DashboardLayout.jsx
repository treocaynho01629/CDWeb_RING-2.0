import { useState } from 'react';
import { Outlet } from 'react-router';
import { useMediaQuery, useTheme } from "@mui/material";
import DashboardNavbar from "./DashboardNavbar";
import DashboardDrawer from "./DashboardDrawer";
import styled from '@emotion/styled';

//#region styled
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

const LayoutContainer = styled.div`
    position: relative;
    min-height: 60dvh;
    padding-bottom: ${props => props.theme.spacing(4)};

    ${props => props.theme.breakpoints.up("sm_md")} {
        padding-right: ${props => props.theme.spacing(2)};
        padding-left: ${props => props.theme.spacing(2)};
        margin-right: auto;
        margin-left: auto;
        max-width: ${props => props.theme.breakpoints.values['lg']}px;
    }
`
//#endregion

export default function DashboardLayout() {
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);

    return (
        <LayoutWrapper>
            <DashboardDrawer {...{ open, setOpen, mobileMode }} />
            <MainContainer component="main">
                <DashboardNavbar {...{ open, setOpen, mobileMode }} />
                <LayoutContainer>
                    <Outlet />
                </LayoutContainer>
            </MainContainer>
        </LayoutWrapper>
    )
}