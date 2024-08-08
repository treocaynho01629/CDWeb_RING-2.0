import styled from "styled-components"
import { useEffect, lazy, Suspense } from 'react'
import { Box, Skeleton, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import useTitle from '../hooks/useTitle';

const OrdersList = lazy(() => import('../components/profile/OrdersList'));

//#region styled
const Wrapper = styled.div`
`

const ContentContainer = styled.div`
    position: relative;
    padding: 0px 15px;
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    min-height: 60dvh;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0;
    }
`

const Title = styled.h3`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    border-bottom: 0.5px solid ${props => props.theme.palette.secondary.main};
    padding-bottom: 15px;
    color: ${props => props.theme.palette.secondary.main};

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 15px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        margin: 20px 15px;
    }
`

const Profiler = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    background-color: #f7f7f7;
    border-bottom: 0.5px solid ${props => props.theme.palette.secondary.main};
`

const RatingInfo = styled.p`
    font-size: 14px;
    margin-right: 10px;
    font-weight: 400;
    padding: 0;
    display: flex;
    align-items: center;
    text-transform: uppercase;
`
//#endregion

const tempLoad = (
    <>
        <Title><Skeleton variant="text" sx={{ fontSize: '19px' }} width="50%" /></Title>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'40dvh'}>
            <CircularProgress
                color="secondary"
                size={40}
                thickness={5}
            />
        </Box>
    </>
)

const Orders = () => {
    const { id } = useParams();

    //Set title
    useTitle('Đơn hàng');
    useEffect(() => { window.scrollTo(0, 0) }, [id])

    return (
        <Wrapper>
            <TabContext value={id != null ? 'detail' : ''}>
                <TabPanel value="" sx={{ px: 0 }}>
                    <ContentContainer>
                        <Suspense fallback={tempLoad}>
                            <OrdersList {...{ Title }} />
                        </Suspense>
                    </ContentContainer>
                </TabPanel>
                <TabPanel value="detail" sx={{ px: 0 }}>
                    {/* <ReviewsDetail /> */}
                </TabPanel>
            </TabContext>
        </Wrapper >
    )
}

export default Orders  