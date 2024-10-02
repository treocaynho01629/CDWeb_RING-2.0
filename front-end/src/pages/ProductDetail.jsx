import { useState, useRef, lazy, Suspense } from 'react'
import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { useParams, Navigate, NavLink, useSearchParams } from 'react-router-dom';
import { useGetBookQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import useTitle from '../hooks/useTitle';
import CustomDivider from '../components/custom/CustomDivider';
import ProductContent from '../components/product/detail/ProductContent';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import ProductsSliderPlaceholder from '../components/product/ProductsSliderPlaceholder';
import ProductDetailContainer from '../components/product/detail/ProductDetailContainer';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));
const ProductsSlider = lazy(() => import('../components/product/ProductsSlider'));

const ProductDetail = () => {
    const { slug, id } = useParams(); //Book ids
    const [searchParams, setSearchParams] = useSearchParams();
    const [isReview, setIsReview] = useState(searchParams.get("review") ?? false); //Is open review tab
    const [pending, setPending] = useState(false); //For reviewing & changing address
    const reviewRef = useRef(null); //Ref for scroll
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));

    //Fetch data
    const { data: randomBooks, isLoading: loadRandom, isSuccess: doneRandom, isError: errorRandom } = useGetRandomBooksQuery({ amount: 10 });
    const { data, isLoading, isFetching, isSuccess, isError, error } = useGetBookQuery(slug ? { slug } : id ? { id } : null, { skip: (!slug && !id) });

    //Set title
    useTitle(`${data?.title ?? 'RING - Bookstore!'}`);

    //Toggle review
    const handleToggleReview = (value) => {
        setIsReview(value);
        if (!value) {
            searchParams.delete("review");
            setSearchParams(searchParams);
        } else {
            searchParams.set("review", true);
            setSearchParams(searchParams);
        }
        scrollIntoTab();
    }

    const scrollIntoTab = () => {
        reviewRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    let product;

    if (isLoading || isFetching) {
        product = <ProductContent />
    } else if (isSuccess) {
        product = <ProductContent {...{ book: data, handleToggleReview, pending, setPending }} />
    } else if (isError && error?.status === 404) {
        product = <Navigate to={'/missing'} />
    }

    return (
        <>
            {(pending) ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
                : null
            }
            <div style={{ display: 'relative' }}>
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
                <Box my={1}>
                    <ProductDetailContainer {...{ loading: (isLoading || isFetching), book: data, 
                        reviewRef, scrollIntoTab, mobileMode, pending, setPending }} />
                </Box>
                <CustomDivider>Có thể bạn sẽ thích</CustomDivider>
                <LazyLoadComponent>
                    <Suspense fallback={<ProductsSliderPlaceholder />}>
                        <ProductsSlider {...{ loading: loadRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
                    </Suspense>
                </LazyLoadComponent>
            </div>
        </>
    )
}

export default ProductDetail