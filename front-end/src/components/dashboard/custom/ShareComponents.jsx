import styled from 'styled-components'

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

export const FooterContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    padding-left: 15px;
`

export const FooterLabel = styled.p`
    font-size: 14px;
    margin: 0;
`