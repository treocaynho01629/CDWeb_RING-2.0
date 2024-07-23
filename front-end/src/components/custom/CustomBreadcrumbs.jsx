import styled from 'styled-components'
import { NavLink } from 'react-router-dom';
import { Breadcrumbs, useTheme } from '@mui/material';

const BreadcrumbsContainer = styled.div`
    margin: 20px 10px;
    display: block;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

export default function CustomBreadcrumbs(props) {
    const { children } = props;
    const theme = useTheme();

    return (
        <BreadcrumbsContainer>
            <Breadcrumbs {...props}>
                <NavLink to={`/`} style={{ backgroundColor: theme.palette.secondary.main, padding: '5px 15px', color: theme.palette.secondary.contrastText }}>
                    Trang chủ
                </NavLink>
                {children}
            </Breadcrumbs>
        </BreadcrumbsContainer>
    )
}