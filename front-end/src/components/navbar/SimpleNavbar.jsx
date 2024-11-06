import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { ContactSupportOutlined } from '@mui/icons-material';

//#region styled
const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px 25px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${props => props.theme.breakpoints.down("md")} {
        justify-content: center;
    }
`

const SupportButton = styled.div`
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.text.secondary};
    cursor: pointer;

    p {
        font-size: 13px;
        margin-left: 5px;
    }

    &:hover {
        color: ${props => props.theme.palette.primary.dark};
    }

    ${props => props.theme.breakpoints.down("md")} {
       display: none;
    }
`

const Logo = styled.img`
    height: 45px;
    padding: 4px;
`
//#endregion

const SimpleNavbar = () => {
    return (
        <Container>
            <Link to={`/`}>
                <Logo src="/full-logo.svg" alt="RING! Logo" />
            </Link>
            <Link>
                <SupportButton>
                    <ContactSupportOutlined />
                    <p>Trợ giúp</p>
                </SupportButton>
            </Link>
        </Container>
    )
}

export default SimpleNavbar