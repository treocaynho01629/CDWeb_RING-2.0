import { useState, useRef, lazy, Suspense } from 'react'
import { Box, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useParams, Navigate, NavLink, useSearchParams } from 'react-router-dom';
import { useGetBookQuery, useGetRandomBooksQuery } from '../features/books/booksApiSlice';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import useTitle from '../hooks/useTitle';
import CustomDivider from '../components/custom/CustomDivider';
import ProductContent from '../components/product/detail/ProductContent';
import CustomBreadcrumbs from '../components/custom/CustomBreadcrumbs';
import CustomPlaceholder from '../components/custom/CustomPlaceholder';
import ProductSimple from '../components/product/ProductSimple';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));
const ProductsSlider = lazy(() => import('../components/product/ProductsSlider'));
const ShopDisplay = lazy(() => import('../components/product/detail/ShopDisplay'));
const ProductDetailContainer = lazy(() => import('../components/product/detail/ProductDetailContainer'));
const ReviewComponent = lazy(() => import('../components/review/ReviewComponent'));

const createCrumbs = (cate) => {
    if (cate) {
        return ([
            createCrumbs(cate?.parent),
            <NavLink to={`/store/${cate?.slug}?cate=${cate?.id}`} end key={`crumb-${cate?.id}`}>
                {cate?.categoryName}
            </NavLink>
        ])
    }
}

const ProductDetail = () => {
    const { slug, id } = useParams(); //Book ids
    const [searchParams, setSearchParams] = useSearchParams();
    const [isReview, setIsReview] = useState(searchParams.get("review") ?? undefined); //Is open review tab
    const [pending, setPending] = useState(false); //For reviewing & changing address
    const reviewRef = useRef(null); //Ref for scroll
    const theme = useTheme();
    const tabletMode = useMediaQuery(theme.breakpoints.down('md'));

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
    } else {
        product = <ProductContent />
    }

    return (
        <>
            {(pending) &&
                <Suspense fallBack={<></>}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
            }
            <Box display="relative">
                <CustomBreadcrumbs separator="›" maxItems={4} aria-label="breadcrumb">
                    {data
                        ? [
                            <NavLink to={'/store'} key={'store'}>
                                Danh mục sản phẩm
                            </NavLink>,
                            createCrumbs(data?.category),
                            <NavLink to={`/store?pubs=${data?.publisher?.id}`} key={'publisher'}>
                                {data?.publisher?.pubName}
                            </NavLink>,
                            <NavLink to="#" key={'book-title'}>{data?.title}</NavLink>
                        ]
                        :
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width={300} />
                    }
                </CustomBreadcrumbs>
                {product}
                <Stack my={1} spacing={1} direction={{ xs: 'column-reverse', md: 'column' }}>
                    <Stack spacing={1}>
                        <LazyLoadComponent>
                            <Suspense fallback={<CustomPlaceholder sx={{
                                width: '100%',
                                border: '.5px solid',
                                borderColor: 'divider',
                                height: { xs: 98, md: 133 }
                            }}
                            />}>
                                <ShopDisplay id={data?.shopId} name={data?.shopName} />
                            </Suspense>
                        </LazyLoadComponent>
                        <LazyLoadComponent>
                            <Suspense fallback={<CustomPlaceholder sx={{
                                width: '100%',
                                border: '.5px solid',
                                borderColor: 'divider',
                                height: { xs: 610, md: 980 }
                            }}
                            />}>
                                <ProductDetailContainer {...{
                                    loading: (isLoading || isFetching), book: data,
                                    reviewRef, scrollIntoTab, mobileMode: tabletMode, pending, setPending
                                }} />
                            </Suspense>
                        </LazyLoadComponent>
                    </Stack>
                    <Box ref={reviewRef} sx={{ scrollMargin: theme.mixins.toolbar.minHeight }}>
                        <LazyLoadComponent>
                            <Suspense fallback={<CustomPlaceholder sx={{
                                width: '100%',
                                border: '.5px solid',
                                borderColor: 'divider',
                                height: { xs: 310, md: 410 }
                            }}
                            />}>
                                <ReviewComponent {...{
                                    book: data, scrollIntoTab, mobileMode: tabletMode,
                                    pending, setPending, isReview, handleToggleReview
                                }} />
                            </Suspense>
                        </LazyLoadComponent>
                    </Box>
                </Stack>
                <CustomDivider>Có thể bạn sẽ thích</CustomDivider>
                <LazyLoadComponent>
                    <Suspense fallback={
                        <CustomPlaceholder sx={{
                            height: 'auto',
                            border: '.5px solid',
                            borderColor: 'action.hover',
                        }}
                        >
                            <ProductSimple />
                        </CustomPlaceholder>
                    }
                    >
                        <ProductsSlider {...{ loading: loadRandom, data: randomBooks, isSuccess: doneRandom, isError: errorRandom }} />
                    </Suspense>
                </LazyLoadComponent>
            </Box>
        </>
    )
}

export default ProductDetail