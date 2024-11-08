import styled from 'styled-components'
import { useEffect, useState, lazy, Suspense } from 'react'
import { useGetReviewByBookIdQuery, useGetReviewsByBookIdQuery } from '../../features/reviews/reviewsApiSlice';
import { MobileExtendButton, Showmore, Title } from '../custom/GlobalComponents';
import { Button, DialogActions, DialogTitle, Rating, Box, Skeleton } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowLeft, Star, StarBorder, EditOutlined } from '@mui/icons-material';
import { ReactComponent as EmptyIcon } from '../../assets/empty.svg';
import { numFormatter } from '../../ultils/covert';
import useAuth from "../../hooks/useAuth";
import CustomProgress from '../custom/CustomProgress';
import ReviewItem from './ReviewItem';
import CustomPlaceholder from '../custom/CustomPlaceholder';

const ReviewSort = lazy(() => import('./ReviewSort'));
const ReviewForm = lazy(() => import('./ReviewForm'));
const ReviewInfo = lazy(() => import('./ReviewInfo'));
const AppPagination = lazy(() => import('../custom/AppPagination'));
const Dialog = lazy(() => import('@mui/material/Dialog'));
const DialogContent = lazy(() => import('@mui/material/DialogContent'));

//#region styled
const ReviewsWrapper = styled.div`
    position: relative;
    padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2.5)};
    border: .5px solid ${props => props.theme.palette.divider};

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0 ${props => props.theme.spacing(1.5)};
    }
`

const ReviewsContainer = styled.div`
    position: relative;
    
    ${props => props.theme.breakpoints.down("md")} {
        margin-bottom: ${props => props.theme.spacing(2.5)};
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-height: 200px;
  }
`

const MessageContainer = styled.span`
    margin: 20px 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    white-space: wrap;
`

const TitleContainer = styled.div`
    width: 100%;
    text-align: left;
`

const ReviewSummary = styled.div`
    display: flex;
    align-items: center;
`

const Label = styled.span`
    margin: 0;
    margin-left: 5px;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.warning.light};

    &.secondary {
        font-size: 14px;
        color: ${props => props.theme.palette.text.secondary};
    }
`

const StyledEmptyIcon = styled(EmptyIcon)`
    height: 70px;
    width: 70px;
    margin: ${props => props.theme.spacing(1)} 0;
    fill: ${props => props.theme.palette.text.icon};
`
//#endregion

const ReviewComponent = ({ book, scrollIntoTab, mobileMode, pending, setPending, isReview, handleToggleReview }) => {
    //#region construct
    const { username } = useAuth();
    const [openForm, setOpenForm] = useState(undefined);

    //Pagination & filter
    const [filterBy, setFilterBy] = useState('all');
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 8,
        totalPages: 0,
        sortBy: 'createdDate',
    });

    //Fetch reviews
    const productReviewsCount = book?.reviewsInfo?.count[0] ?? 0;
    const haveReviews = !(!book || productReviewsCount == 0);
    const { data: userReview, isSuccess: doneReview, error: errorReview } = useGetReviewByBookIdQuery(book?.id, //User's review of this product
        { skip: !username || !haveReviews });
    const { data, isLoading, isFetching, isSuccess, isUninitialized, isError, error } = useGetReviewsByBookIdQuery({
        id: book?.id,
        page: pagination?.currPage,
        size: pagination?.pageSize,
        sortBy: pagination?.sortBy,
        sortDir: 'desc',
        rating: filterBy === 'all' ? null : filterBy
    }, { skip: !haveReviews })
    const loading = (isLoading || isFetching || isError || isUninitialized);

    //Set pagination after fetch
    useEffect(() => {
        if (!isLoading && isSuccess && data) {
            setPagination({
                ...pagination,
                totalPages: data?.info?.totalPages,
                currPage: data?.info?.currPage,
                pageSize: data?.info?.pageSize,
            });
        }
    }, [data])

    //Change page
    const handlePageChange = (page) => {
        setPagination({ ...pagination, currPage: page - 1 });
        scrollIntoTab();
    };

    const handleChangeOrder = (e) => {
        setPagination({ ...pagination, sortBy: e.target.value });
        scrollIntoTab();
    }

    const handleChangeFilter = (e) => { setFilterBy(e.target.value) };
    const handleChangeSize = (newValue) => { setPagination({ ...pagination, pageSize: newValue, currPage: 0 }) };
    const handleOpenForm = () => { setOpenForm(true) };
    const handleCloseForm = () => { setOpenForm(false) };

    let reviewsContent;
    let mainContent;

    if (isLoading && !isUninitialized) {
        reviewsContent = <>
            {(loading) && <CustomProgress color={`${isError || isUninitialized ? 'error' : 'primary'}`} />}
            {[...Array(productReviewsCount > pagination?.pageSize ? pagination?.pageSize : productReviewsCount)].map((item, index) =>
                <div key={`temp-review-${index}`}>
                    <ReviewItem />
                </div>
            )}
        </>
    } else if (isSuccess) {
        const { ids, entities } = data;

        reviewsContent = <>
            {(doneReview && userReview) && <ReviewItem {...{ username, review: userReview }} />}
            {ids?.length ?
                ids?.map((id, index) => {
                    const review = entities[id];

                    if (id != userReview?.id) { //User's review exclude cuz it already on top
                        return (
                            <div key={`${id}-${index}`}>
                                <ReviewItem {...{ username, review }} />
                            </div>
                        )
                    }
                })
                : <MessageContainer>Không có đánh giá nào!</MessageContainer>
            }
            {(ids?.length > 0 && ids?.length < pagination.pageSize)
                && <MessageContainer>Không còn đánh giá nào!</MessageContainer>}
        </>
    } else if (isError) {
        reviewsContent = <MessageContainer>{error?.error}</MessageContainer>
    } else if (isUninitialized && productReviewsCount == 0) {
        reviewsContent = <MessageContainer>
            <StyledEmptyIcon />
            Chưa có đánh giá nào, hãy trở thành người đầu tiên!
        </MessageContainer>
    }

    mainContent = (
        <>
            {book?.reviewsInfo?.count[0] > 0 &&
                <Suspense fallback={<Box display="flex">
                    <Skeleton variant="text" sx={{ mr: 2, fontSize: '16px', display: { xs: 'none', md: 'block' } }} width={64} />
                    <Skeleton variant="rectangular" sx={{ mr: 1, height: 40, width: 178 }} />
                    <Skeleton variant="rectangular" sx={{ height: 40, width: 115 }} />
                </Box>}>
                    <ReviewSort {...{
                        sortBy: pagination?.sortBy, handleChangeOrder,
                        filterBy, handleChangeFilter, count: book?.reviewsInfo?.count
                    }} />
                </Suspense>
            }
            {reviewsContent}
            {book?.reviewsInfo?.count[0] > pagination.pageSize &&
                <Suspense fallback={null}>
                    <AppPagination pagination={pagination}
                        onPageChange={handlePageChange}
                        onSizeChange={handleChangeSize} />
                </Suspense>
            }
        </>
    )
    //#endregion

    return (
        <ReviewsWrapper>
            <Title>
                <TitleContainer>
                    {book ? 'Đánh giá sản phẩm'
                        : <Skeleton variant="text" sx={{ fontSize: 'inherit' }} width="40%" />
                    }
                    {mobileMode ?
                        <ReviewSummary>
                            {book ? <>
                                <Rating
                                    name="product-rating"
                                    value={book?.reviewsInfo?.rating ?? 0}
                                    readOnly
                                    sx={{ fontSize: 16 }}
                                    icon={<Star sx={{ fontSize: 16 }} />}
                                    emptyIcon={<StarBorder sx={{ fontSize: 16 }} />}
                                />
                                <Label>{(book?.reviewsInfo?.rating ?? 0).toFixed(1)}/5</Label>
                                <Label className="secondary">({numFormatter(productReviewsCount)} đánh giá)</Label>
                            </>
                                : <Skeleton variant="text" sx={{ fontSize: '16px' }} width={200} />
                            }

                        </ReviewSummary>
                        :
                        <Suspense fallback={<CustomPlaceholder sx={{ height: { xs: 131, md: 140 } }} />}>
                            <ReviewInfo {...{
                                handleClick: handleOpenForm, book,
                                disabled: errorReview?.status == 409, editable: userReview != null
                            }} />
                        </Suspense>
                    }
                </TitleContainer>
                {mobileMode &&
                    <MobileExtendButton disabled={!book} onClick={() => handleToggleReview(true)}>
                        {book ? <Label>Xem tất cả <KeyboardArrowRight fontSize="small" /></Label>
                            : <Label><Skeleton variant="text" sx={{ fontSize: 'inherit' }} width={80} /></Label>
                        }
                    </MobileExtendButton>
                }
            </Title>
            <ReviewsContainer>
                {mobileMode ? reviewsContent : mainContent}
            </ReviewsContainer>
            {(mobileMode && book?.reviewsInfo?.count[0] > 0) && //View all
                <Showmore onClick={() => handleToggleReview(true)}>
                    <Label>Xem tất cả ({numFormatter(productReviewsCount)} đánh giá) <KeyboardArrowRight fontSize="small" /></Label>
                </Showmore>
            }
            {(isReview !== undefined && mobileMode) && //Mobile component
                <Suspense fallback={null}>
                    <Dialog
                        fullScreen
                        scroll="paper"
                        open={isReview}
                        onClose={() => handleToggleReview(false)}
                    >
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                            <KeyboardArrowLeft onClick={() => handleToggleReview(false)} style={{ marginRight: '4px' }} /> Đánh giá
                        </DialogTitle>
                        <Suspense fallback={<CustomPlaceholder />}>
                            <DialogContent
                                dividers={true}
                                sx={{ padding: 1, paddingTop: 0 }}
                            >
                                <ReviewInfo book={book} />
                                {mainContent}
                            </DialogContent>
                        </Suspense>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                sx={{ marginY: '10px' }}
                                disabled={!book || errorReview?.status == 409}
                                onClick={() => setOpenForm(true)}
                                startIcon={<EditOutlined />}
                            >
                                {errorReview?.status == 409 ? 'Phải mua sản phẩm' : userReview ? 'Sửa đánh giá' : 'Viết đánh giá'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Suspense>
            }
            {openForm !== undefined &&
                <Suspense fallback={null}>
                    <ReviewForm {...{
                        username, bookId: book?.id, open: openForm, handleClose: handleCloseForm,
                        mobileMode, pending, setPending, handlePageChange
                    }} />
                </Suspense>
            }
        </ReviewsWrapper>
    )
}

export default ReviewComponent