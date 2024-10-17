import { TableCell, tableCellClasses, TableHead, TableRow } from '@mui/material'
import styled from 'styled-components'

export const StyledTableCell = styled(TableCell)`
    transition: opacity .2s ease;

    &.${tableCellClasses.root} {
        border: none;
    }

    &.${tableCellClasses.head} {
        font-weight: bold;
        padding: 2px 8px;
    }

    &.${tableCellClasses.paddingCheckbox} {
        padding-left: 4px;
    }

    &.hidden {
        opacity: 0;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        &.${tableCellClasses.body} {
            padding: 8px 8px 8px 4px;
        }

        &.${tableCellClasses.head} {
            padding: 4px;
        }

        &.${tableCellClasses.paddingCheckbox} {
            padding: 0;
        }
    }
`

export const ActionTableCell = styled(TableCell)`
    &.${tableCellClasses.root} {
        position: absolute;
        right: 0;
        top: 0;
        padding: 0;
        width: 0;
        height: 100%;
        display: flex;
        align-items: center;
        border: none;
    }
`

export const StyledTableHead = styled(TableHead)`
    position: sticky; 
    top: ${props => props.theme.mixins.toolbar.minHeight + 16}px;
    background-color: ${props => props.theme.palette.background.default};
    z-index: 2;

    &:before{
        content: "";
        position: absolute;
        left: -10px;
        top: -16px;
        width: calc(100% + 20px);
        height: calc(100% + 16px);
        background-color: ${props => props.theme.palette.background.default};
        z-index: -1;
    }

    &:after{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: calc(100% + 0.5px);
        height: 100%;
        border: .5px solid ${props => props.theme.palette.action.focus};

        ${props => props.theme.breakpoints.down("sm")} {
            border-left: none;
            border-right: none;
        }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        top: ${props => props.theme.mixins.toolbar.minHeight + 4}px;

        &:before{ display: none;}
        &:after { width: 100%;}
    }
`

export const StyledTableRow = styled(TableRow)`
    position: relative;

    &:after{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: .5px solid ${props => props.theme.palette.action.focus};
        z-index: -1;

        &.shop {
            border-bottom: none;
        }

        ${props => props.theme.breakpoints.down("sm")} {
            border-left: none;
            border-right: none;
        }
    }
`

export const StyledItemTableRow = styled(TableRow)`
    position: relative;

    &:after{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: .5px solid ${props => props.theme.palette.action.focus};
        border-top: none;
        border-bottom: none;
        z-index: -1;

        ${props => props.theme.breakpoints.down("sm")} {
            border: none;
        }
    }

    &.error {
        &:after{
            border: .5px solid ${props => props.theme.palette.error.light};
        }
    }
`

export const SpaceTableRow = styled(TableRow)`
    height: 16px;

    ${props => props.theme.breakpoints.down("sm")} {
        height: 8px;
    }
`