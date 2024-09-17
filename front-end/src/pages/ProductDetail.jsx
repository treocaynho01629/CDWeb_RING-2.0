import styled from 'styled-components'
import { useState, useRef } from 'react'
import { Box, Skeleton } from '@mui/material';
import { useParams, Navigate, NavLink, useSearchParams } from 'react-router-dom';
import { useGetBookQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import ProductsSlider from '../components/product/ProductsSlider';
import ProductDetailContainer from '../components/product/detail/ProductDetailContainer';
import CustomDivider from '../components/custom/CustomDivider';
import ProductContent from '../components/product/detail/ProductContent';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import useTitle from '../hooks/useTitle';

//#region styled
const Wrapper = styled.div`
    position: relative;
`
//#endregion

const ProductDetail = () => {
    const { id } = useParams(); //Book ids
    const [searchParams, setSearchParams] = useSearchParams();
    const [tab, setTab] = useState(searchParams.get("tab") ?? "detail"); //Current tab under detail
    const [pending, setPending] = useState(false); //For reviewing & changing address
    const ref = useRef(null); //Ref for scroll

    //Fetch data
    const { data: randomBooks, isLoading: loadRandom, isSuccess: doneRandom, isError: errorRandom } = useGetRandomBooksQuery({ amount: 10 });
    const { data, isLoading, isFetching, isSuccess, isError, error } = useGetBookQuery(id, { skip: !id });

    //Set title
    useTitle(`${data?.title ?? 'RING - Bookstore!'}`);

    //FIX LATER :v
    // useEffect(() => {
    //     const newTab = searchParams.get("tab");
    //     newTab ? handleTabChange(newTab) : handleTabChange("detail", false);
    // }, [searchParams]);

    //Change detail tab
    const handleTabChange = (tab, scroll = true) => {
        setTab(tab);
        if (tab == "reviews") {
            searchParams.delete("tab");
            setSearchParams(searchParams);
        } else {
            searchParams.set("tab", tab);
            setSearchParams(searchParams);
        }
        if (scroll) {
            console.log('scroll');

            scrollIntoTab();
        }
    }

    const scrollIntoTab = () => {
        ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    let product;

    if (isLoading || isFetching) {
        product = <ProductContent />
    } else if (isSuccess) {
        product = <ProductContent {...{ book: data, handleTabChange, pending, setPending }} />
    } else if (isError && error?.status === 404) {
        product = <Navigate to={'/missing'} />
    }

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                {data
                    ?
                    [
                        <NavLink to={`/filters`} key={'bread1'}>
                            Danh mục sản phẩm
                        </NavLink>,
                        <NavLink to={`/filters?cateId=${data?.category?.id}`} key={'bread2'}>
                            {data?.category?.categoryName}
                        </NavLink>,
                        <NavLink to={`/filters?pubId=${data?.publisher?.id}`} key={'bread3'}>
                            {data?.publisher?.pubName}
                        </NavLink>,
                        <strong style={{ textDecoration: 'underline' }} key={'bread4'}>{data?.title}</strong>
                    ]
                    :
                    <Skeleton variant="text" sx={{ fontSize: '16px' }} width={300} />
                }
            </CustomBreadcrumbs>
            {product}
            <Box my={1} ref={ref}>
                <LazyLoadComponent>
                    <ProductDetailContainer {...{ loading: (isLoading || isFetching), book: data, tab, handleTabChange, scrollIntoTab }} />
                </LazyLoadComponent>
            </Box>
            <CustomDivider>CÓ THỂ BẠN SẼ THÍCH</CustomDivider>
            <LazyLoadComponent>
                <ProductsSlider {...{ loading: loadRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
            </LazyLoadComponent>
            <br /><br />
        </Wrapper>
    )
}

export default ProductDetail