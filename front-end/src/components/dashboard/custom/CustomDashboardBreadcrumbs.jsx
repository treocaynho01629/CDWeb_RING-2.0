import { Link } from 'react-router';
import { Breadcrumbs } from '@mui/material';
import styled from '@emotion/styled';

const BreadcrumbsContainer = styled.div`
    display: block;

    a.active {
        font-weight: 450;
        text-decoration: underline;
        color: ${props => props.theme.palette.primary.dark};
        pointer-events: none;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

export default function CustomDashboardBreadcrumbs(props) {
    const { children } = props;

    return (
        <BreadcrumbsContainer>
            <Breadcrumbs {...props}>
                <Link to={'/dashboard'}>
                    Trang chủ
                </Link>
                {children}
            </Breadcrumbs>
        </BreadcrumbsContainer>
    )
}