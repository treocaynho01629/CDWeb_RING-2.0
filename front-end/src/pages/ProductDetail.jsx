import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import { Skeleton } from '@mui/material';
import { useParams, Navigate, NavLink, useSearchParams } from 'react-router-dom';
import { useGetBookQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import ProductsSlider from '../components/product/ProductsSlider';
import ProductDetailContainer from '../components/product/ProductDetailContainer';
import CustomDivider from '../components/custom/CustomDivider';
import ProductContent from '../components/product/ProductContent';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import useTitle from '../hooks/useTitle';

//#region styled
const Wrapper = styled.div`
`
//#endregion

const ProductDetail = () => {
    const { id } = useParams(); //Book ids
    const [searchParams, setSearchParams] = useSearchParams();
    const [tab, setTab] = useState(searchParams.get("tab") ?? "detail"); //Current tab under detail
    const ref = useRef(null); //Ref for scroll

    //Fetch data
    const { data: randomBooks, isLoading: loadRandom, isSuccess: doneRandom, isError: errorRandom } = useGetRandomBooksQuery({ amount: 10 });
    const { data, isLoading, isSuccess, isError, error } = useGetBookQuery({ id }, { skip: !id });

    //Set title
    useTitle(`${data?.title ?? 'RING - Bookstore!'}`);

    useEffect(() => {
        const newTab = searchParams.get("tab");
        if (newTab) {
            handleTabChange(newTab)
        } else {
            handleTabChange("detail", false);
        }
    }, [searchParams]);

    //Change detail tab
    const handleTabChange = (tab, scroll = true) => {
        setTab(tab);
        if (tab == "detail") {
            searchParams.delete("tab");
            setSearchParams(searchParams);
        } else {
            searchParams.set("tab", tab);
            setSearchParams(searchParams);
        }
        if (scroll) scrollIntoTab();
    }

    const scrollIntoTab = () => {
        ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    let product;

    if (isError && error?.status === 404) {
        product = <Navigate to={'/missing'} />
    } else {
        product = <ProductContent {...{ book: data, handleTabChange }} />
    }

    return (
        <Wrapper>
            <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                {data
                    ?
                    [
                        <NavLink to={`/filters`}>
                            Danh mục sản phẩm
                        </NavLink>,
                        <NavLink to={`/filters?cateId=${data?.cateId}`}>
                            {data?.cateName}
                        </NavLink>,
                        <NavLink to={`/filters?pubId=${data?.publisher?.id}`}>
                            {data?.publisher?.pubName}
                        </NavLink>,
                        <strong style={{ textDecoration: 'underline' }}>{data?.title}</strong>
                    ]
                    :
                    <Skeleton variant="text" sx={{ fontSize: '16px' }} width={300} />
                }
            </CustomBreadcrumbs>
            {product}
            <div ref={ref}>
                <ProductDetailContainer {...{ loading: isLoading, book: data, tab, handleTabChange, scrollIntoTab }} />
            </div>
            <CustomDivider>CÓ THỂ BẠN SẼ THÍCH</CustomDivider>
            <ProductsSlider {...{ loading: loadRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
            <br /><br />
        </Wrapper>
    )
}

export default ProductDetail