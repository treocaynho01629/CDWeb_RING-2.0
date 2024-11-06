import styled from 'styled-components'
import { useState, lazy, Suspense } from "react";
import { useParams } from 'react-router-dom';
import SimpleNavbar from "../components/navbar/SimpleNavbar";
import Loadable from '../components/layout/Loadable';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));
const ForgotTab = Loadable(lazy(() => import('../components/authorize/ForgotTab')));
const ResetTab = Loadable(lazy(() => import('../components/authorize/ResetTab')));

//#region styled
const Wrapper = styled.div`
    display: flex;
    overflow: hidden;
    height: 100dvh;

    ${props => props.theme.breakpoints.down("md")} {
        flex-direction: column-reverse;
    }
`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    
    ${props => props.theme.breakpoints.down("md")} {
        align-items: flex-start;
        margin-top: -${props => props.theme.spacing(8)};
    }
`
//#endregion

function ResetPage() {
    const { token } = useParams();
    const [pending, setPending] = useState(false);

    return (
        <Wrapper>
            {pending &&
                <Suspense fallBack={null}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
            }
            <SimpleNavbar />
            <Container>
                {token ? <ResetTab /> : <ForgotTab token={token} />}
            </Container>
        </Wrapper>
    )
}

export default ResetPage