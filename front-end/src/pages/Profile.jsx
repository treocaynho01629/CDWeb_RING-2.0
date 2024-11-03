import styled from "styled-components"
import { useState, lazy, Suspense } from 'react'
import { Skeleton } from '@mui/material';
import { Title, TabContentContainer } from "../components/custom/GlobalComponents";
import { useOutletContext, useParams } from 'react-router-dom';
import CustomPlaceholder from '../components/custom/CustomPlaceholder';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import useTitle from '../hooks/useTitle';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));
const ProfileDetail = lazy(() => import('../components/profile/ProfileDetail'));
const AddressComponent = lazy(() => import('../components/address/AddressComponent'));
const ResetPassComponent = lazy(() => import('../components/profile/ResetPassComponent'));

//#region styled
const StyledTabPanel = styled(TabPanel)`
    padding: 0;
`

const PlaceholderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40dvh;
`
//#endregion

const tempLoad = (
    <>
        <Title className="primary"><Skeleton variant="text" sx={{ fontSize: '19px' }} width="50%" /></Title>
        <PlaceholderContainer><CustomPlaceholder /></PlaceholderContainer>
    </>
)

const Profile = () => {
    const { tab } = useParams();
    const { profile, loading, isSuccess, tabletMode } = useOutletContext();
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
                    <TabContentContainer>
                        <Suspense fallback={tempLoad}>
                            <ProfileDetail {...{ pending, setPending, profile, loading, isSuccess, tabletMode }} />
                        </Suspense>
                    </TabContentContainer>
                </StyledTabPanel>
                <StyledTabPanel value="address">
                    <TabContentContainer>
                        <Suspense fallback={tempLoad}>
                            <AddressComponent {...{ pending, setPending }} />
                        </Suspense>
                    </TabContentContainer>
                </StyledTabPanel>
                <StyledTabPanel value="password" >
                    <TabContentContainer>
                        <Suspense fallback={tempLoad}>
                            <ResetPassComponent {...{ pending, setPending }} />
                        </Suspense>
                    </TabContentContainer>
                </StyledTabPanel>
            </TabContext>
        </ >
    )
}

export default Profile  