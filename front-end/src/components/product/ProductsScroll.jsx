import styled from '@emotion/styled';
import CustomProgress from '../custom/CustomProgress';
import ProductPreview from "./ProductPreview";
import { trackWindowScroll } from 'react-lazy-load-image-component';

//#region styled
const Container = styled.div`
    position: relative;
    max-height: 100%;
    width: 200px;
    background-color: ${props => props.theme.palette.background.paper};

    ${props => props.theme.breakpoints.down("md")} {
        width: auto;
    }
`

const ProductContainer = styled.div`
`

const SliderContainer = styled.div`
    -ms-overflow-style: none;
    scrollbar-width: none; 
    display: flex;
    flex-direction: ${props => props.direction || 'column'};

    &::-webkit-scrollbar {display: none;}
    
    ${props => props.theme.breakpoints.down("md")} {
        width: 100%;
        flex-direction: row;
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

const ProductsScroll = ({ data, isError, isLoading, isFetching, isSuccess, isUninitialized = false, direction, scrollPosition }) => {
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
            {(loading) && <CustomProgress color={`${isError || isUninitialized ? 'error' : 'primary'}`} />}
            <SliderContainer direction={direction}>
                {productsScroll}
            </SliderContainer>
        </Container>
    )
}

export default trackWindowScroll(ProductsScroll)