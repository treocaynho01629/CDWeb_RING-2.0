import styled from "@emotion/styled";
import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Grid2 as Grid, Skeleton, Box } from "@mui/material";
import { useGetBooksQuery } from "../../../features/books/booksApiSlice";
import { MobileExtendButton, Showmore, Title } from "@ring/ui/Components";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { idFormatter, bookTypes } from "@ring/shared";
import ProductsScroll from "../ProductsScroll";

const SwipeableDrawer = lazy(() => import("@mui/material/SwipeableDrawer"));

//#region styled
const DetailContainer = styled.div`
  height: 100%;
  padding: 10px 20px;
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 0 12px;
  }
`;

const ProductsContainer = styled.div`
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

const DescriptionContainer = styled.div`
  position: relative;
`;

const Description = styled.p`
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  height: auto;
  transition: all 1s ease;

  &.minimize {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-height: 300px;

    @supports (-webkit-line-clamp: 10) {
      overflow: hidden;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 10;
      -webkit-box-orient: vertical;
    }

    ${({ theme }) => theme.breakpoints.down("md")} {
      @supports (-webkit-line-clamp: 5) {
        overflow: hidden;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      }
    }
  }
`;

const InfoTitle = styled.td`
  width: 25%;
  white-space: nowrap;
  display: flex;
`;

const InfoStack = styled.td`
  padding-left: 10px;
`;

const InfoText = styled.p`
  margin: 8px 0;
  font-size: 14px;

  &.secondary {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

const DescTitle = styled.h4`
  margin: 15px 0;
`;

//#endregion

const ProductDetailContainer = ({ loading, book, tabletMode }) => {
  const descRef = useRef(null);
  const [overflowed, setOverflowed] = useState(false);
  const [minimize, setMinimize] = useState(true);
  const [openDetail, setOpenDetail] = useState(undefined);

  //Fetch related books
  const {
    data: relatedBooks,
    isLoading: loadRelated,
    isSuccess: doneRelated,
    isError: errorRelated,
    isUninitialized,
  } = useGetBooksQuery(
    {
      cateId: book?.category?.id,
      size: 8,
    },
    { skip: !book?.category?.id }
  );

  useLayoutEffect(() => {
    setMinimize(true);
  }, [book]);

  useLayoutEffect(() => {
    function updateShowmore() {
      if (descRef.current.offsetHeight < descRef.current.scrollHeight) {
        setOverflowed(true);
      } else {
        if (minimize) setOverflowed(false);
      }
    }

    window.addEventListener("resize", updateShowmore);
    updateShowmore();
    return () => window.removeEventListener("resize", updateShowmore);
  }, [descRef, minimize, book]);

  const toggleMinimize = () => {
    setMinimize((prev) => !prev);
  };

  let details;

  if (!loading && book) {
    details = (
      <table style={{ width: "100%", marginTop: "25px" }}>
        <tbody>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Mã hàng: </InfoText>
            </InfoTitle>
            <InfoStack>
              <InfoText>{idFormatter(book?.id)}</InfoText>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Tác giả: </InfoText>
            </InfoTitle>
            <InfoStack>
              <Link to={`/store?q=${book?.author}`}>
                <InfoText>{book?.author}</InfoText>
              </Link>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Nhà xuất bản: </InfoText>
            </InfoTitle>
            <InfoStack>
              <Link to={`/store?pubs=${book?.publisher?.id}`}>
                <InfoText>{book?.publisher?.name}</InfoText>
              </Link>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Năm xuất bản: </InfoText>
            </InfoTitle>
            <InfoStack>
              <InfoText>{new Date(book?.date).getFullYear()}</InfoText>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Ngôn ngữ: </InfoText>
            </InfoTitle>
            <InfoStack>
              <InfoText>{book?.language ?? "Đang cập nhật"}</InfoText>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Trọng lượng (gr): </InfoText>
            </InfoTitle>
            <InfoStack>
              <InfoText>
                {book?.weight ? `${book.weight} gr` : "Đang cập nhật"}
              </InfoText>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">
                Kích thước bao bì (cm):{" "}
              </InfoText>
            </InfoTitle>
            <InfoStack>
              <InfoText>
                {book?.size ? `${book.size} cm` : "Đang cập nhật"}
              </InfoText>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Số trang: </InfoText>
            </InfoTitle>
            <InfoStack>
              <InfoText>{book?.pages ?? "Đang cập nhật"}</InfoText>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle>
              <InfoText className="secondary">Hình thức: </InfoText>
            </InfoTitle>
            <InfoStack>
              <Link to={`/store?types=${book?.type}`}>
                <InfoText>{bookTypes[book?.type]}</InfoText>
              </Link>
            </InfoStack>
          </tr>
        </tbody>
      </table>
    );
  } else {
    details = (
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="30%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="35%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="40%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="40%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="30%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="30%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="40%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="30%"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Skeleton
                variant="text"
                sx={{ fontSize: "14px", my: "8px" }}
                width="40%"
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <Grid
      container
      size={12}
      spacing={1}
      display="flex"
      flexDirection={{ xs: "column-reverse", md: "row" }}
    >
      <Grid size={{ xs: 12, md: "grow" }}>
        <DetailContainer>
          <Box position="relative" mb={-2}>
            <Title>
              {book ? (
                "Thông tin chi tiết"
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "inherit" }}
                  width="40%"
                />
              )}
            </Title>
            <MobileExtendButton
              disabled={loading || !book}
              onClick={() => setOpenDetail(true)}
            >
              {book ? (
                <>
                  Tác giả, Nhà xuất bản,...{" "}
                  <KeyboardArrowRight fontSize="small" />
                </>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "inherit" }}
                  width="35%"
                />
              )}
            </MobileExtendButton>
          </Box>
          {tabletMode ? (
            <Suspense fallback={<></>}>
              {openDetail !== undefined && (
                <SwipeableDrawer
                  anchor="bottom"
                  open={openDetail}
                  onOpen={() => setOpenDetail(true)}
                  onClose={() => setOpenDetail(false)}
                  disableSwipeToOpen={true}
                >
                  <Box sx={{ padding: "0 12px" }}>
                    <Title>Thông tin chi tiết</Title>
                    <Box mt={-2} mb={2}>
                      {details}
                    </Box>
                  </Box>
                </SwipeableDrawer>
              )}
            </Suspense>
          ) : (
            details
          )}
          <Title>
            {book ? (
              "Mô tả sản phẩm"
            ) : (
              <Skeleton
                variant="text"
                sx={{ fontSize: "inherit" }}
                width="40%"
              />
            )}
          </Title>
          <DescTitle>{book?.title}</DescTitle>
          <DescriptionContainer>
            <Description ref={descRef} className={minimize ? "minimize" : ""}>
              {book ? (
                book?.description
              ) : (
                <>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "16px", mb: "15px" }}
                    width="60%"
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "inherit" }}
                    width="100%"
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "inherit" }}
                    width="100%"
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "inherit" }}
                    width="100%"
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "inherit" }}
                    width="40%"
                  />
                </>
              )}
            </Description>
            {overflowed && (
              <Showmore
                className={minimize ? "" : "expand"}
                onClick={toggleMinimize}
              >
                {minimize ? (
                  <>
                    Xem thêm <KeyboardArrowDown />
                  </>
                ) : (
                  <>
                    Ẩn bớt <KeyboardArrowUp />
                  </>
                )}
              </Showmore>
            )}
          </DescriptionContainer>
        </DetailContainer>
      </Grid>
      <Grid size={{ xs: 12, md: "auto" }}>
        <ProductsContainer>
          <Box padding={{ xs: "0 12px", md: "10px 20px 0" }}>
            <Title>
              {book ? (
                "Sản phẩm khác"
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "inherit" }}
                  width={150}
                />
              )}
            </Title>
          </Box>
          <ProductsScroll
            {...{
              loading: loadRelated,
              data: relatedBooks,
              isSuccess: doneRelated,
              isError: errorRelated,
              isUninitialized,
            }}
          />
        </ProductsContainer>
      </Grid>
    </Grid>
  );
};

export default ProductDetailContainer;
