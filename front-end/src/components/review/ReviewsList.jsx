import { Fragment, Suspense, useCallback, useState, lazy } from "react";
import { KeyboardArrowLeft, Try } from "@mui/icons-material";
import { useGetMyReviewsQuery } from "../../features/reviews/reviewsApiSlice";
import { Message, Title } from "../custom/GlobalComponents";
import { Link } from 'react-router';
import { ReactComponent as EmptyIcon } from '../../assets/empty.svg';
import { CircularProgress, DialogContent } from "@mui/material";
import { debounce } from "lodash-es";
import ReviewItem from "./ReviewItem";
import styled from '@emotion/styled';
import useAuth from "../../hooks/useAuth";

const PendingModal = lazy(() => import('../layout/PendingModal'));
const ReviewForm = lazy(() => import('./ReviewForm'));

//#region styled
const MessageContainer = styled.span`
    min-height: 60dvh;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ReviewsContainer = styled.div`
    padding-bottom: ${props => props.theme.spacing(2)};
`

const PlaceholderContainer = styled.div`
    padding: ${props => props.theme.spacing(16)};
`

const LoadContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: ${props => props.theme.spacing(2)};
`

const StyledEmptyIcon = styled(EmptyIcon)`
    height: 70px;
    width: 70px;
    margin: ${props => props.theme.spacing(1)} 0;
    fill: ${props => props.theme.palette.text.icon};
`
//#endregion

const defaultSize = 5;

const ReviewsList = ({ mobileMode }) => {
    const { username } = useAuth();
    const [pending, setPending] = useState(false);
    const [openForm, setOpenForm] = useState(undefined);
    const [contextReview, setContextReview] = useState(null);
    const [pagination, setPagination] = useState({
        number: 0,
        size: defaultSize,
        isMore: true,
    })

    //Fetch orders
    const { data, isLoading, isFetching, isSuccess, isError, error } = useGetMyReviewsQuery({
        page: pagination?.number,
        size: pagination?.size,
        loadMore: pagination?.isMore
    });

    //Show more
    const handleShowMore = () => {
        if (isFetching || typeof data?.page?.number !== 'number') return;
        if (data?.page?.number < pagination?.number) return;
        const nextPage = data?.page?.number + 1;
        if (nextPage < data?.page?.totalPages) setPagination(prev => ({ ...prev, number: nextPage }));
    }

    const handleOpenEdit = (review) => {
        setContextReview(review);
        setOpenForm(true)
    };
    const handleCloseForm = () => { setOpenForm(false) };

    const handleWindowScroll = (e) => {
        const trigger = document.body.scrollHeight - 300 < window.scrollY + window.innerHeight;
        if (trigger) handleShowMore();
    }

    const handleScroll = (e) => {
        const trigger = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (trigger) handleShowMore();
    }

    const windowScrollListener = useCallback(debounce(handleWindowScroll, 500), [data]);
    const scrollListener = useCallback(debounce(handleScroll, 500), [data]);

    window.addEventListener("scroll", windowScrollListener);

    let reviewsContent;

    if (isLoading || (isFetching && pagination.number == 0)) {
        reviewsContent = <PlaceholderContainer>
            <LoadContainer>
                <CircularProgress color="primary" />
            </LoadContainer>
        </PlaceholderContainer>
    } else if (isSuccess) {
        const { ids, entities } = data;

        reviewsContent = <>
            {ids?.length ?
                ids?.map((id, index) => {
                    const review = entities[id];

                    return (
                        <Fragment key={`${id}-${index}`}>
                            <ReviewItem review={review} isPreview={true} handleClick={() => handleOpenEdit(review)} />
                        </Fragment>
                    )
                })
                : <MessageContainer>
                    <Message>
                        <StyledEmptyIcon />
                        Chưa có đánh giá nào
                    </Message>
                </MessageContainer>
            }
        </>
    } else if (isError) {
        reviewsContent = <MessageContainer>
            <Message className="error">{error?.error || 'Đã xảy ra lỗi'}</Message>
        </MessageContainer>
    }

    return (
        <>
            {pending &&
                <Suspense fallBack={null}>
                    <PendingModal open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
            }
            <Title className="primary">
                <Link to={'/profile/detail'}><KeyboardArrowLeft /></Link>
                <Try />&nbsp;ĐÁNH GIÁ CỦA BẠN
            </Title>
            <DialogContent sx={{ py: 0, px: { xs: 1, sm: 2, md: 0 } }} onScroll={scrollListener}>
                <ReviewsContainer>
                    {reviewsContent}
                    {(pagination.number > 0 && isFetching) && <LoadContainer><CircularProgress size={30} color="primary" /></LoadContainer>}
                    {(data?.ids?.length > 0 && data?.ids?.length == data?.page?.totalElements)
                        && <Message className="warning">Không còn đánh giá nào!</Message>}
                </ReviewsContainer>
            </DialogContent>
            {openForm !== undefined &&
                <Suspense fallback={null}>
                    <ReviewForm {...{
                        username, open: openForm, handleClose: handleCloseForm,
                        mobileMode, pending, setPending, review: contextReview
                    }} />
                </Suspense>
            }
        </>
    )
}

export default ReviewsList