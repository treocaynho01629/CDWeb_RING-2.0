import styled from "styled-components";
import CustomProgress from '../custom/CustomProgress';
import ProductPreview from "./ProductPreview";

//#region styled
const Container = styled.div`
    position: relative;
    max-height: 100%;
    border: .5px solid ${props => props.theme.palette.divider};
`

const ProductContainer = styled.div`
`

const SliderContainer = styled.div`
    -ms-overflow-style: none;
    scrollbar-width: none; 

    &::-webkit-scrollbar {display: none;}
    
    ${props => props.theme.breakpoints.down("md")} {
        display: flex;
        width: 100%;
        overflow-y: hidden;
    }
`
//#endregion

const tempItems = [
    <ProductPreview key={'temp1'} />,
    <ProductPreview key={'temp2'} />,
    <ProductPreview key={'temp3'} />,
    <ProductPreview key={'temp4'} />
];

const ProductsScroll = ({ data, isError, isLoading, isFetching, isSuccess, isUninitialized = false, scrollPosition }) => {
    let productsScroll;
    const loading = (isLoading || isFetching || isError || isUninitialized);

    if (loading) {
        productsScroll = tempItems;
    } else if (isSuccess) {
        const { ids, entities } = data;

        productsScroll = ids?.length
            ?
            [
                ids?.map((id, index) => {
                    const book = entities[id];

                    return (
                        <ProductContainer key={`${id}-${index}`}>
                            <ProductPreview {...{ book, scrollPosition }} />
                        </ProductContainer>
                    )
                })
            ] : tempItems
    } else {
        productsScroll = tempItems;
    }

    return (
        <Container>
            <p>Sản phẩm liên quan</p>
            {(loading) && <CustomProgress color={`${isError || isUninitialized ? 'error' : 'primary'}`} />}
            <SliderContainer>
                {productsScroll}
            </SliderContainer>
        </Container>
    )
}

export default ProductsScroll