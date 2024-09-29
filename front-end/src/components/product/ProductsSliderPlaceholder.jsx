import styled from 'styled-components'
import ProductSimple from './ProductSimple'

//#region styled
const PlaceholderContainer = styled.div`
  display: flex;
  width: 100%;
  border: .5px solid ${props => props.theme.palette.action.hover};
`

const Temp = styled.div`
  visibility: hidden;
`
//#endregion

const ProductsSliderPlaceholder = () => {
    return (
        <PlaceholderContainer><Temp><ProductSimple/></Temp></PlaceholderContainer>
    )
}

export default ProductsSliderPlaceholder