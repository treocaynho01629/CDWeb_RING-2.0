import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { Button, LinearProgress, Rating, Skeleton } from "@mui/material";
import { EditOutlined, Star, StarBorder } from "@mui/icons-material";
import { numFormat } from "@ring/shared";

//#region styled
const ReviewsInfoContainer = styled.div`
  display: flex;
  margin-top: 15px;
  text-transform: none;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-bottom: 10px;
    justify-content: center;
    border-bottom: 0.5px solid ${({ theme }) => theme.palette.divider};
  }
`;

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 0;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 3;
  padding-left: 20px;
  margin-left: 10px;
  max-width: 600px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;

const Score = styled.h1`
  margin: 0;
  b {
    font-size: 30px;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    font-size: 40px;
    b {
      display: none;
    }
  }
`;

const TotalLabel = styled.span`
  margin: 5px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ProgressLabel = styled.span`
  font-size: 14px;
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressLabelContainer = styled.div`
  min-width: 45px;
  &.percent {
    min-width: 35px;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  margin-right: 6px;
  color: ${({ theme }) => theme.palette.warning.light};
`;
//#endregion

function LinearProgressWithLabel(props) {
  const { label, value, ...otherProps } = props;

  return (
    <Progress>
      <ProgressLabelContainer>
        <ProgressLabel>{label}</ProgressLabel>
      </ProgressLabelContainer>
      <ProgressBarContainer>
        <LinearProgress
          sx={{ height: 5 }}
          color="inherit"
          variant="determinate"
          value={Math.round(value)}
          {...otherProps}
        />
      </ProgressBarContainer>
      <ProgressLabelContainer className="percent">
        <ProgressLabel>{`${Math.round(value)}%`}</ProgressLabel>
      </ProgressLabelContainer>
    </Progress>
  );
}

LinearProgressWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

const ReviewInfo = ({ handleClick, book, disabled, editable }) => {
  const reviewPercent = (value) => {
    const total = book?.reviewsInfo?.total;
    const result = value == 0 || total == 0 ? 0 : (value / total) * 100;
    return result;
  };

  return (
    <ReviewsInfoContainer>
      <ScoreContainer>
        {book ? (
          <>
            <Score>
              {(book?.reviewsInfo?.rating ?? 0).toFixed(1)}
              <b>/5</b>
            </Score>
            <Rating
              name="product-rating"
              value={book?.reviewsInfo?.rating ?? 0}
              readOnly
              sx={{ fontSize: { xs: 18, md: 24 } }}
              icon={<Star fontSize="inherit" />}
              emptyIcon={<StarBorder fontSize="inherit" />}
            />
            <TotalLabel>
              ({numFormat.format(book?.reviewsInfo?.total ?? 0)} đánh giá)
            </TotalLabel>
          </>
        ) : (
          <>
            <Score>
              <Skeleton
                variant="text"
                sx={{ fontSize: "inherit", width: { xs: 60, md: 100 } }}
              />
            </Score>
            <Skeleton
              variant="text"
              sx={{ fontSize: { xs: 18, md: 24 }, width: { xs: 90, md: 120 } }}
            />
            <TotalLabel>
              <Skeleton
                variant="text"
                sx={{ fontSize: "inherit", width: { xs: 80, md: 100 } }}
              />
            </TotalLabel>
          </>
        )}
      </ScoreContainer>
      <ProgressContainer>
        {[...Array(5)].map((item, index) =>
          book ? (
            <LinearProgressWithLabel
              key={`progress-${index + 1}`}
              label={`${index + 1} sao`}
              value={reviewPercent(book?.reviewsInfo?.rates[index])}
            />
          ) : (
            <Skeleton
              key={`temp-${index + 1}`}
              variant="rectangular"
              sx={{
                height: 10,
                width: "90%",
                ml: "5%",
                my: { xs: "8px", md: "10px" },
              }}
            />
          )
        )}
      </ProgressContainer>
      <ButtonContainer>
        {book ? (
          <Button
            variant="outlined"
            size="large"
            disabled={disabled}
            onClick={handleClick}
            startIcon={<EditOutlined />}
          >
            {disabled
              ? "Mua sản phẩm"
              : editable
                ? "Sửa đánh giá"
                : "Viết đánh giá"}
          </Button>
        ) : (
          <Skeleton variant="rectangular" sx={{ height: 42, width: 160 }} />
        )}
      </ButtonContainer>
    </ReviewsInfoContainer>
  );
};

export default ReviewInfo;
