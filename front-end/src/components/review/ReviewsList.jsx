import { Fragment, useState } from "react";
import { KeyboardArrowLeft, Try } from "@mui/icons-material";
import { useGetMyReviewsQuery } from "../../features/reviews/reviewsApiSlice";
import { Title } from "../custom/GlobalComponents";
import { Link } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import styled from "styled-components";
import CustomProgress from "../custom/CustomProgress";

//#region styled
const MessageContainer = styled.span`
    margin: 20px 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    white-space: wrap;
`
//#endregion

const defaultSize = 5;

const ReviewsList = () => {
    const [pagination, setPagination] = useState({
        currPage: 0,
        pageSize: defaultSize,
        isMore: true,
    })

    //Fetch orders
    const { data, isLoading, isSuccess } = useGetMyReviewsQuery({
        page: pagination?.currPage,
        size: pagination?.pageSize,
        loadMore: pagination?.isMore
    });

    let reviewsContent;

    if (isLoading) {
        reviewsContent = <CustomProgress color="primary" />
    } else if (isSuccess) {
        const { ids, entities } = data;

        reviewsContent = <>
            {ids?.length ?
                ids?.map((id, index) => {
                    const review = entities[id];

                    return (
                        <Fragment key={`${id}-${index}`}>
                            <ReviewItem review={review} isPreview={true} />
                        </Fragment>
                    )
                })
                : <MessageContainer>Không có đánh giá nào!</MessageContainer>
            }
            {(ids?.length > 0 && ids?.length < pagination.pageSize)
                && <MessageContainer>Không còn đánh giá nào!</MessageContainer>}
        </>
    } else if (isError) {
        reviewsContent = <MessageContainer>{error?.error}</MessageContainer>
    }

    return (
        <>
            <Title className="primary">
                <Link to={'/profile/detail'}><KeyboardArrowLeft /></Link>
                <Try />&nbsp;ĐÁNH GIÁ CỦA BẠN
            </Title>
            {reviewsContent}
            {/* <div style={{
                display: more?.last ? 'none' : 'flex',
                justifyContent: 'center',
                margin: '20px 0px'
            }}>
                <Button onClick={handleShowMore}>Xem thêm</Button>
            </div> */}
        </>
    )
}

export default ReviewsList