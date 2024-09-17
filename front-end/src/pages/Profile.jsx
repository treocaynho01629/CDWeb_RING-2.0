import styled from "styled-components"
import { useState, useEffect, lazy, Suspense } from 'react'
import { Box, Skeleton, CircularProgress } from '@mui/material';
import { Title } from "../components/custom/GlobalComponents";
import { useParams } from 'react-router-dom';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import useTitle from '../hooks/useTitle';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));
const ProfileDetail = lazy(() => import('../components/profile/ProfileDetail'));
const AddressComponent = lazy(() => import('../components/address/AddressComponent'));
const ResetPassComponent = lazy(() => import('../components/profile/ResetPassComponent'));

const ContentContainer = styled.div`
    position: relative;
    padding: 0px 15px;
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    min-height: 60dvh;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0;
    }
`

const tempLoad = (
    <>
        <Title className="primary"><Skeleton variant="text" sx={{ fontSize: '19px' }} width="50%" /></Title>
        <Box display="flex" alignItems="center" justifyContent="center" height={'40dvh'}>
            <CircularProgress
                color="primary"
                size={40}
                thickness={5}
            />
        </Box>
    </>
)

const Profile = () => {
    const { tab } = useParams();
    const [pending, setPending] = useState(false);

    //Set title
    useTitle('Hồ sơ');
    useEffect(() => { window.scrollTo(0, 0) }, [tab]);

    return (
        <>
            {(pending) ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
                : null
            }
            <TabContext value={tab || ''}>
                <TabPanel value="" sx={{ px: 0 }}>
                    <ContentContainer>
                        <Suspense fallback={tempLoad}>
                            <ProfileDetail {...{ pending, setPending }} />
                        </Suspense>
                    </ContentContainer>
                </TabPanel>
                <TabPanel value="address" sx={{ px: 0 }}>
                    <ContentContainer>
                        <Suspense fallback={tempLoad}>
                            <AddressComponent {...{ pending, setPending }} />
                        </Suspense>
                    </ContentContainer>
                </TabPanel>
                <TabPanel value="password" sx={{ px: 0 }}>
                    <ContentContainer>
                        <Suspense fallback={tempLoad}>
                            <ResetPassComponent {...{ pending, setPending }} />
                        </Suspense>
                    </ContentContainer>
                </TabPanel>
            </TabContext>
        </ >
    )
}

export default Profile  