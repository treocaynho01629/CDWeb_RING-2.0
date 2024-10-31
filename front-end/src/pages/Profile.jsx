import styled from "styled-components"
import { useState, useEffect, lazy, Suspense } from 'react'
import { Box, Skeleton, CircularProgress } from '@mui/material';
import { Title } from "../components/custom/GlobalComponents";
import { useOutletContext, useParams } from 'react-router-dom';
import { Person } from "@mui/icons-material";
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import useTitle from '../hooks/useTitle';
import Loadable from "../components/layout/Loadable";

const Dialog = Loadable(lazy(() => import('@mui/material/Dialog')));
const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));
const ProfileDetail = lazy(() => import('../components/profile/ProfileDetail'));
const AddressComponent = lazy(() => import('../components/address/AddressComponent'));
const ResetPassComponent = lazy(() => import('../components/profile/ResetPassComponent'));

//#region styled
const ContentContainer = styled.div`
    position: relative;
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    min-height: 60dvh;

    ${props => props.theme.breakpoints.down("md")} {
        border: none;
    }
`

const StyledTabPanel = styled(TabPanel)`
    padding: 0;
`
//#endregion

const tempLoad = (
    <>
        <Title className="primary"><Skeleton variant="text" sx={{ fontSize: '19px' }} width="50%" /></Title>
        <Box display="flex" alignItems="center" justifyContent="center" height={'40dvh'}>
            <CircularProgress color="primary" size={40} thickness={5} />
        </Box>
    </>
)

const Profile = () => {
    const { tab } = useParams();
    const { profile, loading, isSuccess, tabletMode, mobileMode } = useOutletContext();
    const [pending, setPending] = useState(false);

    //Set title
    useTitle('Hồ sơ');

    return (
        <>
            {pending &&
                <Suspense fallBack={null}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
            }
            <TabContext value={tab ? tab : tabletMode ? '' : 'info'}>
                <StyledTabPanel value="info">
                    <ContentContainer>
                        <Suspense fallback={tempLoad}>
                            <ProfileDetail {...{ pending, setPending, profile, loading, isSuccess, tabletMode }} />
                        </Suspense>
                    </ContentContainer>
                </StyledTabPanel>
                <StyledTabPanel value="address">
                    <ContentContainer>
                        <Suspense fallback={tempLoad}>
                            <AddressComponent {...{ pending, setPending }} />
                        </Suspense>
                    </ContentContainer>
                </StyledTabPanel>
                <StyledTabPanel value="password" >
                    <ContentContainer>
                        <Suspense fallback={tempLoad}>
                            <ResetPassComponent {...{ pending, setPending }} />
                        </Suspense>
                    </ContentContainer>
                </StyledTabPanel>
            </TabContext>
        </ >
    )
}

export default Profile  