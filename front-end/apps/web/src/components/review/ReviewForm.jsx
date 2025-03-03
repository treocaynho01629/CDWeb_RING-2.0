import styled from "@emotion/styled";
import { Close, Edit, Star, StarBorder } from "@mui/icons-material";
import {
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
} from "@mui/material";
import { Link, useLocation } from "react-router";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../../features/reviews/reviewsApiSlice";
import { useEffect, useState } from "react";
import { rateLabels } from "../../ultils/filters";

//#region styled
const RatingSelect = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 10px;
`;
const RateSelect = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SuggestText = styled.b`
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text.primary};

  &.error {
    color: ${({ theme }) => theme.palette.error.main};
  }

  &.label {
    font-size: 18px;
    font-weight: 400;
    margin: 5px 0;
    color: ${({ theme }) => theme.palette.warning.main};
  }
`;
//#endregion

const ReviewForm = ({
  username,
  bookId,
  review,
  open,
  handleClose,
  mobileMode,
  handlePageChange,
  pending,
  setPending,
}) => {
  const location = useLocation();

  //Initial value
  const [content, setContent] = useState(review?.content ?? "");
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [hover, setHover] = useState(-1);

  //Error
  const [err, setErr] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  //Review hook
  const [sendReview, { isLoading: reviewing }] = useCreateReviewMutation();
  const [editReview, { isLoading: editing }] = useUpdateReviewMutation();

  useEffect(() => {
    setContent(review?.content ?? "");
    setRating(review?.rating ?? 5);
  }, [review]);

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  //Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewing || editing || pending) return;

    setPending(true);
    const { enqueueSnackbar } = await import("notistack");

    if (review?.content) {
      //Edit
      editReview({
        id: review?.id,
        updateReview: {
          content: content,
          rating: rating,
        },
      })
        .unwrap()
        .then((data) => {
          enqueueSnackbar("Chỉnh sửa thành công!", { variant: "success" });
          setErr([]);
          setErrMsg("");
          handleClose();
        })
        .catch((err) => {
          console.error(err);
          setErr(err);
          if (!err?.status) {
            setErrMsg("Server không phản hồi!");
          } else if (err?.status === 400) {
            setErrMsg(err.data.errors.content);
          } else if (err?.status === 409) {
            setErrMsg(err.data.message);
          } else {
            setErrMsg("Chỉnh sửa thất bại!");
          }
          enqueueSnackbar("Chỉnh sửa thất bại!", { variant: "error" });
        });
    } else {
      //New review
      sendReview({
        id: bookId,
        newReview: {
          content: content,
          rating: rating,
        },
      })
        .unwrap()
        .then((data) => {
          enqueueSnackbar("Đánh giá thành công!", { variant: "success" });
          setContent("");
          setErr([]);
          setErrMsg("");
          setRating(5);
          handlePageChange(1);
          handleClose();
        })
        .catch((err) => {
          console.error(err);
          setErr(err);
          if (!err?.status) {
            setErrMsg("Server không phản hồi!");
          } else if (err?.status === 400) {
            setErrMsg(err.data.errors.content);
          } else if (err?.status === 409) {
            setErrMsg(err.data.message);
          } else {
            setErrMsg("Đánh giá thất bại!");
          }
          enqueueSnackbar("Đánh giá thất bại!", { variant: "error" });
        });
    }

    setPending(false);
  };

  return (
    <Dialog
      open={open ?? false}
      scroll={"paper"}
      maxWidth={"md"}
      fullWidth
      onClose={handleClose}
      fullScreen={mobileMode}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Edit />
        &nbsp;
        {review?.content ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
      </DialogTitle>
      <DialogContent sx={{ pt: 0, px: { xs: 1, sm: 3 } }}>
        {username ? (
          <div>
            <form onSubmit={handleSubmitReview}>
              <RatingSelect>
                <SuggestText>Chất lượng sản phẩm: </SuggestText>
                <RateSelect>
                  <Rating
                    name="product-rating"
                    value={rating}
                    onChange={(e, newValue) => {
                      setRating(newValue);
                    }}
                    onChangeActive={(e, newHover) => {
                      setHover(newHover);
                    }}
                    getLabelText={(value) =>
                      `${value} Star${value !== 1 ? "s" : ""}`
                    }
                    sx={{ fontSize: { xs: 28, md: 36 } }}
                    icon={<Star sx={{ fontSize: "inherit" }} />}
                    emptyIcon={<StarBorder sx={{ fontSize: "inherit" }} />}
                  />
                  {rating !== null && (
                    <SuggestText className="label">
                      {rateLabels[hover !== -1 ? hover : rating]}
                    </SuggestText>
                  )}
                </RateSelect>
              </RatingSelect>
              <SuggestText className={`${errMsg ? "error" : ""}`}>
                {errMsg ? "Đánh giá thất bại!" : "Nhận xét của bạn:"}
              </SuggestText>
              <TextField
                required
                margin="dense"
                id="content"
                placeholder="Nhận xét của bạn"
                fullWidth
                multiline
                minRows={6}
                slotProps={{
                  inputComponent: TextareaAutosize,
                  inputProps: {
                    minRows: 6,
                    style: { resize: "auto" },
                  },
                }}
                variant="outlined"
                value={content}
                onChange={handleChangeContent}
                error={err.length > 0 || errMsg != ""}
                helperText={errMsg}
              />
            </form>
          </div>
        ) : (
          <div>
            <div>
              <SuggestText>
                Bạn chưa đăng nhập, hãy Đăng nhập để đánh giá
              </SuggestText>
            </div>
            <br />
            <Link
              to={"/auth/login"}
              state={{ from: location }}
              title="Đăng nhập"
            >
              <Button variant="contained" color="primary">
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          size="large"
          sx={{ marginY: "10px" }}
          onClick={handleClose}
          startIcon={<Close />}
        >
          Huỷ
        </Button>
        {username ? (
          err?.data?.code === 208 ? (
            <Link to={"/profile"} title="Xem đánh giá">
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ marginY: "10px" }}
              >
                Xem đánh giá
              </Button>
            </Link>
          ) : err?.data?.code === 204 ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ marginY: "10px" }}
              onClick={() => {
                handleClose();
                scrollTo(0, 0);
              }}
            >
              Mua ngay
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ marginY: "10px" }}
              onClick={handleSubmitReview}
            >
              {review?.content ? "Sửa đánh giá" : "Gửi đánh giá"}
            </Button>
          )
        ) : (
          <Link to={"/auth/login"} state={{ from: location }} title="Đăng nhập">
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ marginY: "10px" }}
            >
              Đăng nhập ngay
            </Button>
          </Link>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;
