import styled from '@emotion/styled'
import { useState, lazy, Suspense } from "react";
import { useParams } from 'react-router';
import SimpleNavbar from "../components/navbar/SimpleNavbar";
import useReCaptchaV3 from '../hooks/useReCaptchaV3';

const PendingModal = lazy(() => import('../components/layout/PendingModal'));
const ForgotTab = lazy(() => import('../components/authorize/ForgotTab'));
const ResetTab = lazy(() => import('../components/authorize/ResetTab'));

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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    ${props => props.theme.breakpoints.down("md")} {
        margin-top: -${props => props.theme.spacing(8)};
    }
`

const ContentContainer = styled.div`
    position: relative;
    width: 90%;
    max-width: 350px;
`
//#endregion

function ResetPage() {
    const { token } = useParams();
    const [pending, setPending] = useState(false);

    //Recaptcha
    const { reCaptchaLoaded, generateReCaptchaToken} = useReCaptchaV3();

    return (
        <Wrapper>
            {pending &&
                <Suspense fallBack={null}>
                    <PendingModal open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
            }
            <SimpleNavbar />
            <Container>
                <Suspense fallback={null}>
                    <ContentContainer>
                        {token ? <ResetTab {...{ pending, setPending, reCaptchaLoaded, generateReCaptchaToken }} />
                            : <ForgotTab resetToken={token} {...{ pending, setPending, reCaptchaLoaded, generateReCaptchaToken }} />}
                    </ContentContainer>
                </Suspense>
            </Container>
        </Wrapper>
    )
}

export default ResetPage