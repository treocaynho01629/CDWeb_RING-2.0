import styled from '@emotion/styled'
import { LinearProgress } from '@mui/material'

export const ItemTitle = styled.p`
    font-size: 12px;
    margin: 5px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
	
    @supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    &.secondary {
      color: ${props => props.theme.palette.text.secondary};
    }
`

export const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${props => props.theme.spacing(4)};
`

export const FooterContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    ${props => props.theme.breakpoints.down("md")} {
        flex-direction: column-reverse;
        align-items: flex-end;
    }
`

export const FooterLabel = styled.p`
    font-size: 14px;
    margin: 0;
`

export const StyledStockBar = styled(LinearProgress)`
    height: 6px;
    width: 60px;
`