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
import { Link } from "react-router";

//#region styled
const ReviewContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

const Profile = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 0.5px solid transparent;
  padding: 15px 0 5px;

  &.active {
    border-color: ${(props) => props.theme.palette.primary.main};
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: 10px 0 5px;
  }
`;

const RateContent = styled.div`
  margin: ${(props) => props.theme.spacing(1)} 0
    ${(props) => props.theme.spacing(2)};
  font-size: 15px;

  ${(props) => props.theme.breakpoints.down("sm")} {
    margin: ${(props) => props.theme.spacing(0.5)} 0
      ${(props) => props.theme.spacing(2)};
  }
`;

const ActionButton = styled.span`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.palette.text.secondary};
  opacity: 0.9;
  font-size: 14px;
  cursor: pointer;

  &.mobile {
    display: none;
  }

  svg {
    color: ${(props) => props.theme.palette.text.secondary};
    font-size: 20px;
  }

  &:hover {
    color: ${(props) => props.theme.palette.warning.main};

    svg {
      color: ${(props) => props.theme.palette.warning.main};
    }
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
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
  margin-right: ${(props) => props.theme.spacing(1)};
  font-weight: 400;
  display: flex;
  align-items: center;

  ${(props) => props.theme.breakpoints.down("sm")} {
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
  padding: ${(props) => props.theme.spacing(0.5)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
  color: ${(props) => props.theme.palette.text.secondary};
  border: 0.5px solid ${(props) => props.theme.palette.warning.main};
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
                {date.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </RatingInfo>
              <RatingInfo>
                <CalendarMonth
                  sx={{
                    fontSize: 18,
                    marginRight: "5px",
                    color: "primary.main",
                  }}
                />
                {date.toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
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
