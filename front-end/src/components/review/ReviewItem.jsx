import styled from 'styled-components'
import { AccessTime, CalendarMonth, Star, StarBorder, ReportGmailerrorred, BorderColor } from '@mui/icons-material';
import { Avatar, Rating, Skeleton } from '@mui/material';

//#region styled
const Profile = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: .5px solid transparent;
    padding: 15px 0 5px;

    &.active {
        border-color: ${props => props.theme.palette.primary.main};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 10px 0 5px;
    }
`

const RateContent = styled.div`
    margin: 10px 0 20px;
    font-size: 15px;

    ${props => props.theme.breakpoints.down("sm")} {
        margin: 5px 0 20px;
    }
`

const ActionButton = styled.span`
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.text.secondary};
    opacity: .9;
    font-size: 14px;
    cursor: pointer;

    &.mobile { display: none;}

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
        &.mobile { display: flex;} 
    }
`

const RatingInfo = styled.p`
    font-size: 14px;
    padding: 0;
    margin: 0;
    margin-right: 10px;
    font-weight: 400;
    display: flex;
    align-items: center;
    
    ${props => props.theme.breakpoints.down("sm")} {
        max-width: 95px;
        &.time {display: none;}
    }

    &:last-child {margin-right: 0;}
`

const InfoContainer = styled.div`
    display: flex;
`

const TimeContainer = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
`
//#endregion

const ReviewItem = ({ review, username }) => {
    const date = new Date(review?.date);

    return (
        <>
            <Profile className={(username && username === review?.username) ? 'active' : ''}>
                <InfoContainer>
                    {review ? <>
                        <Avatar sx={{ width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 }, marginRight: 1 }} />
                        <div>
                            <RatingInfo>{review?.username}</RatingInfo>
                            <Rating
                                name="product-rating"
                                value={review?.rating ?? 0}
                                readOnly
                                getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}`}
                                sx={{ fontSize: 16 }}
                                icon={<Star sx={{ fontSize: 16 }} />}
                                empty={<StarBorder sx={{ fontSize: 16 }} />}
                            />
                        </div>
                    </>
                        : <>
                            <Skeleton variant="circular" sx={{ width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 }, marginRight: 1 }} />
                            <div>
                                <Skeleton variant="text" sx={{ fontSize: '14px' }} width={150} />
                                <Skeleton variant="text" sx={{ fontSize: '14px' }} width={80} />
                            </div>
                        </>
                    }
                </InfoContainer>
                <TimeContainer>
                    {review ? <>
                        <RatingInfo className="time"><AccessTime sx={{ fontSize: 18, marginRight: '5px', color: 'primary.main' }} />
                            {date.toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </RatingInfo>
                        <RatingInfo><CalendarMonth sx={{ fontSize: 18, marginRight: '5px', color: 'primary.main' }} />
                            {date.toLocaleDateString("en-GB", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })}
                        </RatingInfo>
                        {username === review?.username ?
                            <ActionButton className="mobile">
                                <BorderColor sx={{ fontSize: 20, color: 'text.secondary' }} />
                            </ActionButton>
                            :
                            <ActionButton className="mobile">
                                <ReportGmailerrorred sx={{ fontSize: 20, color: 'text.secondary' }} />
                            </ActionButton>
                        }
                    </>
                        : <>
                            <Skeleton variant="text" sx={{ fontSize: '14px', marginRight: '10px', display: { xs: 'none', sm: 'block' } }} width={50} />
                            <Skeleton variant="text" sx={{ fontSize: '14px' }} width={100} />
                            <Skeleton variant="circular" sx={{ display: { xs: 'block', sm: 'none', height: 20, width: 20, marginLeft: '5px' } }} />
                        </>
                    }
                </TimeContainer>
            </Profile>
            <RateContent>
                {review ? review?.content
                    : <>
                        <Skeleton variant="text" sx={{ fontSize: '15px' }} width="100%" />
                        <Skeleton variant="text" sx={{ fontSize: '15px' }} width="40%" />
                    </>
                }
            </RateContent>
            {review ?
                (username && username === review?.username) ?
                    <ActionButton>
                        <BorderColor sx={{ fontSize: 20, color: 'text.secondary' }} />&nbsp;Chỉnh sửa
                    </ActionButton>
                    :
                    <ActionButton>
                        <ReportGmailerrorred sx={{ fontSize: 20, color: 'text.secondary' }} />&nbsp;Báo cáo
                    </ActionButton>
                : <Skeleton variant="text" sx={{ fontSize: '14px' }} width={80} />
            }
        </>
    )
}

export default ReviewItem