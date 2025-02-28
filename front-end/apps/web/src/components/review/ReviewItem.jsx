import styled from "@emotion/styled";
import {
  AccessTime,
  CalendarMonth,
  Star,
  StarBorder,
  ReportGmailerrorred,
  BorderColorOutlined,
} from "@mui/icons-material";
import { Avatar, Rating, Skeleton } from "@mui/material";
import { dateFormatter, timeFormatter } from "@ring/shared";
import { Link } from "react-router";

//#region styled
const ReviewContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const Profile = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 0.5px solid transparent;
  padding: 15px 0 5px;

  &.active {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 10px 0 5px;
  }
`;

const RateContent = styled.div`
  margin: ${({ theme }) => theme.spacing(1)} 0
    ${({ theme }) => theme.spacing(2)};
  font-size: 15px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: ${({ theme }) => theme.spacing(0.5)} 0
      ${({ theme }) => theme.spacing(2)};
  }
`;

const ActionButton = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.9;
  font-size: 14px;
  cursor: pointer;

  &.mobile {
    display: none;
  }

  svg {
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 20px;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.warning.main};

    svg {
      color: ${({ theme }) => theme.palette.warning.main};
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
    &.mobile {
      display: flex;
    }
  }
`;

const RatingInfo = styled.p`
  font-size: 14px;
  padding: 0;
  margin: 0;
  margin-right: ${({ theme }) => theme.spacing(1)};
  font-weight: 400;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    max-width: 95px;
    &.time {
      display: none;
    }
  }

  &:last-child {
    margin-right: 0;
  }
`;

const InfoContainer = styled.div`
  display: flex;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
`;

const ProductContent = styled.div`
  font-size: 14px;
  padding: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.text.secondary};
  border: 0.5px dashed ${({ theme }) => theme.palette.warning.main};
`;
//#endregion

const ReviewItem = ({ review, username, isPreview, handleClick }) => {
  const date = new Date(review?.date);

  return (
    <ReviewContainer>
      <Profile
        className={username && username === review?.username ? "active" : ""}
      >
        <InfoContainer>
          {review ? (
            <>
              <Avatar
                sx={{
                  width: { xs: 30, md: 40 },
                  height: { xs: 30, md: 40 },
                  marginRight: 1,
                }}
              />
              <div>
                <RatingInfo>{review?.username}</RatingInfo>
                <Rating
                  name="product-rating"
                  value={review?.rating ?? 0}
                  readOnly
                  getLabelText={(value) =>
                    `${value} Star${value !== 1 ? "s" : ""}`
                  }
                  sx={{ fontSize: 16 }}
                  icon={<Star sx={{ fontSize: 16 }} />}
                  empty={<StarBorder sx={{ fontSize: 16 }} />}
                />
              </div>
            </>
          ) : (
            <>
              <Skeleton
                variant="circular"
                sx={{
                  width: { xs: 30, md: 40 },
                  height: { xs: 30, md: 40 },
                  marginRight: 1,
                }}
              />
              <div>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "14px" }}
                  width={150}
                />
                <Skeleton variant="text" sx={{ fontSize: "14px" }} width={80} />
              </div>
            </>
          )}
        </InfoContainer>
        <TimeContainer>
          {review ? (
            <>
              <RatingInfo className="time">
                <AccessTime
                  sx={{
                    fontSize: 18,
                    marginRight: "5px",
                    color: "primary.main",
                  }}
                />
                {timeFormatter(date)}
              </RatingInfo>
              <RatingInfo>
                <CalendarMonth
                  sx={{
                    fontSize: 18,
                    marginRight: "5px",
                    color: "primary.main",
                  }}
                />
                {dateFormatter(date)}
              </RatingInfo>
              {(username && username === review?.username) || isPreview ? (
                <ActionButton className="mobile" onClick={handleClick}>
                  <BorderColorOutlined />
                </ActionButton>
              ) : (
                <ActionButton className="mobile">
                  <ReportGmailerrorred />
                </ActionButton>
              )}
            </>
          ) : (
            <>
              <Skeleton
                variant="text"
                sx={{
                  fontSize: "14px",
                  marginRight: "10px",
                  display: { xs: "none", sm: "block" },
                }}
                width={50}
              />
              <Skeleton variant="text" sx={{ fontSize: "14px" }} width={100} />
              <Skeleton
                variant="circular"
                sx={{
                  display: {
                    xs: "block",
                    sm: "none",
                    height: 20,
                    width: 20,
                    marginLeft: "5px",
                  },
                }}
              />
            </>
          )}
        </TimeContainer>
      </Profile>
      <RateContent>
        {review ? (
          review?.content
        ) : (
          <>
            <Skeleton variant="text" sx={{ fontSize: "15px" }} width="100%" />
            <Skeleton variant="text" sx={{ fontSize: "15px" }} width="40%" />
          </>
        )}
      </RateContent>
      {isPreview && (
        <Link to={`/product/${review?.bookSlug}`} title="Đi đến sản phẩm">
          <ProductContent>{review?.bookTitle}</ProductContent>
        </Link>
      )}
      {review ? (
        (username && username === review?.username) || isPreview ? (
          <ActionButton onClick={handleClick}>
            <BorderColorOutlined />
            &nbsp;Chỉnh sửa
          </ActionButton>
        ) : (
          <ActionButton>
            <ReportGmailerrorred />
            &nbsp;Báo cáo
          </ActionButton>
        )
      ) : (
        <Skeleton variant="text" sx={{ fontSize: "14px" }} width={80} />
      )}
    </ReviewContainer>
  );
};

export default ReviewItem;
