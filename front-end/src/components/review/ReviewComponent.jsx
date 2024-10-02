import styled from 'styled-components'
import { useEffect, useState, lazy, Suspense } from 'react'
import { useGetReviewsByBookIdQuery } from '../../features/reviews/reviewsApiSlice';
import { MobileExtendButton, Showmore, Title } from '../custom/GlobalComponents';
import { Button, DialogActions, DialogTitle, IconButton, Rating } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowLeft, Star, StarBorder, EditOutlined } from '@mui/icons-material';
import { numFormatter } from '../../ultils/covert';
import useAuth from "../../hooks/useAuth";
import CustomProgress from '../custom/CustomProgress';
import ReviewItem from './ReviewItem';

const ReviewSort = lazy(() => import('./ReviewSort'));
const ReviewForm = lazy(() => import('./ReviewForm'));
const ReviewInfo = lazy(() => import('./ReviewInfo'));
const AppPagination = lazy(() => import('../custom/AppPagination'));
const Dialog = lazy(() => import('@mui/material/Dialog'));
const DialogContent = lazy(() => import('@mui/material/DialogContent'));

//#region styled
const ReviewsWrapper = styled.div`
    position: relative;
    padding: 10px 20px;
    border: .5px solid ${props => props.theme.palette.divider};

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0 12px;
    }
`

const ReviewsContainer = styled.div`
    position: relative;
    
    ${props => props.theme.breakpoints.down("md")} {
        margin-bottom: 20px;
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

const EmptyImage = styled.img`
    height: 70px;
    margin: 10px 0;
`
//#endregion

const ReviewComponent = ({ book, scrollIntoTab, mobileMode, pending, setPending }) => {
    //#region construct
    const { username } = useAuth();
    const [openReview, setOpenReview] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    //Pagination & filter
    const [filterBy, setFilterBy] = useState('all');
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: 8,
        totalPages: 0,
        sortBy: 'createdDate',
    });

    //Fetch reviews
    const { data, isLoading, isFetching, isSuccess, isUninitialized, isError, error } = useGetReviewsByBookIdQuery({
        id: book?.id,
        page: pagination?.currPage,
        size: pagination?.pageSize,
        sortBy: pagination?.sortBy,
        sortDir: 'desc',
        rating: filterBy === 'all' ? null : filterBy
    }, { skip: (!book || (book?.reviewsInfo?.count[0] ?? 0) == 0) })
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

    if (isLoading) {
        reviewsContent = <>
            {(loading) && <CustomProgress color={`${isError || isUninitialized ? 'error' : 'primary'}`} />}
            {[...Array(pagination?.page)].map((item, index) =>
                <div key={`temp-review-${index}`}>
                    <ReviewItem />
                </div>
            )}
        </>
    } else if (isSuccess) {
        const { ids, entities } = data;

        reviewsContent = <>
            {ids?.length ?
                ids?.map((id, index) => {
                    const review = entities[id];

                    return (
                        <div key={`${id}-${index}`}>
                            <ReviewItem {...{ username, review }} />
                        </div>
                    )
                })
                : <MessageContainer>Không có đánh giá nào!</MessageContainer>
            }
            {(ids?.length > 0 && ids?.length < pagination.pageSize)
                && <MessageContainer>Không còn đánh giá nào!</MessageContainer>}
        </>

    } else if (isError) {
        reviewsContent = <MessageContainer>{error?.error}</MessageContainer>
    } else if (isUninitialized && (book?.reviewsInfo?.count[0] ?? 0) == 0) {
        reviewsContent = <MessageContainer>
            <EmptyImage src="/empty.svg" />
            Chưa có đánh giá nào, hãy trở thành người đầu tiên!
        </MessageContainer>
    }

    mainContent = (
        <>
            {book?.reviewsInfo?.count[0] > 0 &&
                <Suspense fallback={<p>LOADING</p>}>
                    <ReviewSort {...{
                        sortBy: pagination?.sortBy, handleChangeOrder,
                        filterBy, handleChangeFilter, count: book?.reviewsInfo?.count
                    }} />
                </Suspense>
            }
            {reviewsContent}
            {book?.reviewsInfo?.count[0] > pagination.pageSize &&
                <Suspense fallback={<p>LOADING</p>}>
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
                    Đánh giá sản phẩm
                    {mobileMode ?
                        <ReviewSummary>
                            <Rating
                                name="product-rating"
                                value={book?.reviewsInfo?.rating ?? 0}
                                readOnly
                                sx={{ fontSize: 16 }}
                                icon={<Star sx={{ fontSize: 16 }} />}
                                emptyIcon={<StarBorder sx={{ fontSize: 16 }} />}
                            />
                            <Label>{(book?.reviewsInfo?.rating ?? 0).toFixed(1)}/5</Label>
                            <Label className="secondary">({numFormatter(book?.reviewsInfo?.count[0] ?? 0)} đánh giá)</Label>
                        </ReviewSummary>
                        :
                        <Suspense fallback={<p>LOADING</p>}>
                            <ReviewInfo handleClick={handleOpenForm} rating={book?.reviewsInfo?.rating} count={book?.reviewsInfo?.count} />
                        </Suspense>
                    }
                </TitleContainer>
                {mobileMode &&
                    <MobileExtendButton disabled={!book} onClick={() => setOpenReview(true)}>
                        <Label>Xem tất cả <KeyboardArrowRight fontSize="small" /></Label>
                    </MobileExtendButton>
                }
            </Title>
            <ReviewsContainer>
                {mobileMode ? reviewsContent : mainContent}
            </ReviewsContainer>
            {(mobileMode && book?.reviewsInfo?.count[0] > 0) &&
                <Showmore onClick={() => setOpenReview(true)}>
                    <Label>Xem tất cả ({numFormatter(book?.reviewsInfo?.count[0] ?? 0)} đánh giá) <KeyboardArrowRight fontSize="small" /></Label>
                </Showmore>
            }
            {openReview &&
                <Suspense fallback={<p>LOADING</p>}>
                    <Dialog
                        fullScreen
                        scroll="paper"
                        open={openReview}
                        onClose={() => setOpenReview(false)}
                    >
                        <DialogTitle>
                            <IconButton onClick={() => setOpenReview(false)}><KeyboardArrowLeft /></IconButton> Đánh giá
                        </DialogTitle>
                        <Suspense fallback={<p>LOADING</p>}>
                            <DialogContent
                                dividers={true}
                                sx={{ padding: 1, paddingTop: 0 }}
                            >
                                <ReviewInfo rating={book?.reviewsInfo?.rating} count={book?.reviewsInfo?.count} />
                                {mainContent}
                            </DialogContent>
                        </Suspense>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                sx={{ marginY: '10px' }}
                                onClick={() => setOpenForm(true)}
                                startIcon={<EditOutlined />}
                            >
                                Viết đánh giá
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Suspense>
            }
            {openForm &&
                <Suspense fallback={null}>
                    <ReviewForm {...{ username, bookId: book?.id, open: openForm, handleClose: handleCloseForm, 
                        mobileMode, pending, setPending, handlePageChange }} />
                </Suspense>
            }
        </ReviewsWrapper>
    )
}

export default ReviewComponent