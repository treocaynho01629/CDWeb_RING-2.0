import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import { Skeleton, Breadcrumbs } from '@mui/material';
import { useParams, Navigate, NavLink } from 'react-router-dom';
import { useGetBookQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import ProductsSlider from '../components/ProductsSlider';
import ProductDetailContainer from '../components/ProductDetailContainer';
import CustomDivider from '../components/custom/CustomDivider';
import ProductContent from '../components/ProductContent';

//#region styled
const Wrapper = styled.div`
`

const BreadcrumbsContainer = styled.div`
    margin: 20px 10px;
    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`
//#endregion

const ProductDetail = () => {
    const { id } = useParams(); //Book ids
    const ref = useRef(null); //Ref for scroll
    const [tab, setTab] = useState("1"); //Current tab under detail

    //Fetch data
    const { data: randomBooks, isLoading: loadRandom, isSuccess: doneRandom, isError: errorRandom } = useGetRandomBooksQuery({ amount: 10 });
    const { data, isLoading, isSuccess, isError, error } = useGetBookQuery({ id }, { skip: !id });

    //Set title
    useEffect(() => {
        window.scrollTo(0, 0);
        handleTabChange("1");

        if (!isLoading) {
            document.title = `RING! - ${data?.title}`;
        }
    }, []);

    //Change detail tab
    const handleTabChange = (tab) => {
        setTab(tab);
    }

    let product;

    if (isError && error?.status === 404) {
        product = <Navigate to={'/missing'} />
    } else if (isLoading || isError) {
        product = <ProductContent />
    } else if (isSuccess) {
        product = <ProductContent book={data} />
    }

    return (
        <Wrapper>
            <BreadcrumbsContainer>
                {data
                    ?
                    <Breadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                        <NavLink to={`/`} sx={{ backgroundColor: '#63e399', padding: '5px 15px', color: 'white' }}>
                            Trang chủ
                        </NavLink>
                        <NavLink to={`/filters`}>
                            Danh mục sản phẩm
                        </NavLink>
                        <NavLink to={`/filters?cateId=${data?.cateId}`}>
                            {data?.cateName}
                        </NavLink>
                        <NavLink to={`/filters?pubId=${data?.publisher?.id}`}>
                            {data?.publisher?.pubName}
                        </NavLink>
                        <strong style={{ textDecoration: 'underline' }}>{data?.title}</strong>
                    </Breadcrumbs>
                    :
                    <Breadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                        <NavLink to={`/`} sx={{ backgroundColor: '#63e399', padding: '5px 15px', color: 'white' }}>
                            Trang chủ
                        </NavLink>
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width={300} />
                    </Breadcrumbs>
                }
            </BreadcrumbsContainer>
            {product}
            <div ref={ref} >
                <ProductDetailContainer loading={isLoading}
                    book={data}
                    tab={tab}
                    onTabChange={handleTabChange} />
            </div>
            <CustomDivider>CÓ THỂ BẠN SẼ THÍCH</CustomDivider>
            <ProductsSlider {...{ loading: loadRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
            <br /><br />
        </Wrapper>
    )
}

export default ProductDetail