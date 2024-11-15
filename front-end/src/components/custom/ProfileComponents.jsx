import styled from '@emotion/styled'
import { DialogTitle } from '@mui/material'

export const StyledDialogTitle = styled(DialogTitle)`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    font-size: 18px;
    margin-bottom: ${props => props.theme.spacing(2)};
    padding: ${props => props.theme.spacing(1.5)} 0px;
    border-bottom: .5px solid ${props => props.theme.palette.divider};
    color: ${props => props.theme.palette.primary.main};
        border-color: ${props => props.theme.palette.primary.main};
    width: 100%;

    a {
        display: none;
        align-items: center;
        color: ${props => props.theme.palette.text.primary};
    }

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 16px;
        padding: ${props => props.theme.spacing(2)} 10px;
        margin-bottom: 0;

        a { display: flex; }
    }
`

export const TabContentContainer = styled.div`
    position: relative;
    padding: 0 ${props => props.theme.spacing(2)};
    border: 0.5px solid ${props => props.theme.palette.action.focus};
    min-height: 60dvh;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0;
        border: none;
    }
`