import styled from 'styled-components'
import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { Grid2 as Grid, Skeleton, Box, Stack } from '@mui/material';
import { useGetBooksQuery } from '../../../features/books/booksApiSlice';
import { MobileExtendButton, Title } from '../../custom/GlobalComponents';
import { KeyboardArrowDown, KeyboardArrowRight, KeyboardArrowUp } from '@mui/icons-material';
import { idFormatter } from '../../../ultils/covert';

const ShopDisplay = lazy(() => import('./ShopDisplay'));
const ProductsScroll = lazy(() => import('../ProductsScroll'));
const ReviewComponent = lazy(() => import('./ReviewComponent'));
const SwipeableDrawer = lazy(() => import('@mui/material/SwipeableDrawer'));

//#region styled
const DetailContainer = styled.div`
  height: 100%;
  padding: 10px 20px;
  border: .5px solid ${props => props.theme.palette.divider};

  ${props => props.theme.breakpoints.down("md")} {
    padding: 0 12px;
  }
`

const DescriptionContainer = styled.div`
  position: relative;
`

const Showmore = styled.div`
  font-size: 14px;
  flex-grow: 1;
  padding: 15px 0;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.palette.info.main};
  cursor: pointer;
  
  &::after {
    content: "";
    z-index: 0;
    position: absolute;
    top: -55px;
    left: 0;
    height: 100%;
    width: 100%;
    border-bottom: .5px solid ${props => props.theme.palette.divider};
    background-image: linear-gradient(180deg, 
        transparent, 
        transparent 60%,
        ${props => props.theme.palette.background.default} 100%);
  }

  &.expand {
    margin-top: 10px;

    &::after {
      background-image: none;
    }
  }

  ${props => props.theme.breakpoints.down("md")} {
    margin-top: 0;
  }
`

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

    ${props => props.theme.breakpoints.down("md")} {
      @supports (-webkit-line-clamp: 5) {
        overflow: hidden;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      }
    }
  }
`

const InfoTitle = styled.td`
  width: 25%;
  white-space: nowrap;
  display: flex;
`

const InfoStack = styled.td`
  padding-left: 10px;
`

const InfoText = styled.p`
  margin: 8px 0;
  font-size: 14px;

  &.secondary {
    color: ${props => props.theme.palette.text.secondary}
  }
`

const DescTitle = styled.h4`
  margin: 15px 0;
`
//#endregion

const ProductDetailContainer = ({ loading, book, reviewRef, scrollIntoTab, mobileMode }) => {
  const descRef = useRef(null);
  const [overflowed, setOverflowed] = useState(false);
  const [minimize, setMinimize] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);

  //Fetch related books
  const { data: relatedBooks, isLoading: loadRelated, isSuccess: doneRelated, isError: errorRelated, isUninitialized } = useGetBooksQuery({
    cateId: book?.category?.id,
    size: 4
  }, { skip: (!book?.category?.id) });

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

    window.addEventListener('resize', updateShowmore);
    updateShowmore();
    return () => window.removeEventListener('resize', updateShowmore);
  }, [descRef, minimize, book]);

  const toggleMinimize = () => { setMinimize(prev => !prev); }

  let details;

  if (!loading && book) {
    details =
      <table style={{ width: '100%', marginTop: '25px' }}>
        <tbody>
          <tr>
            <InfoTitle><InfoText className="secondary">Mã hàng: </InfoText></InfoTitle>
            <InfoStack><InfoText>{idFormatter(book?.id)}</InfoText></InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Tác giả: </InfoText></InfoTitle>
            <InfoStack>
              <Link to={`/filters?keyword=${book?.author}`}>
                <InfoText>{book?.author}</InfoText>
              </Link>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Nhà xuất bản: </InfoText></InfoTitle>
            <InfoStack>
              <Link to={`/filters?pubId=${book?.publisher?.id}`}>
                <InfoText>{book?.publisher?.pubName}</InfoText>
              </Link>
            </InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Năm xuất bản: </InfoText></InfoTitle>
            <InfoStack><InfoText>{new Date(book?.date).getFullYear()}</InfoText></InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Ngôn ngữ: </InfoText></InfoTitle>
            <InfoStack><InfoText>{book?.language ?? 'Đang cập nhật'}</InfoText></InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Trọng lượng (gr): </InfoText></InfoTitle>
            <InfoStack><InfoText>{book?.weight ? `${book.weight} gr` : 'Đang cập nhật'}</InfoText></InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Kích thước bao bì (cm): </InfoText></InfoTitle>
            <InfoStack><InfoText>{book?.size ? `${book.size} cm` : 'Đang cập nhật'}</InfoText></InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Số trang: </InfoText></InfoTitle>
            <InfoStack><InfoText>{book?.pages ?? 'Đang cập nhật'}</InfoText></InfoStack>
          </tr>
          <tr>
            <InfoTitle><InfoText className="secondary">Hình thức: </InfoText></InfoTitle>
            <InfoStack>
              <Link to={`/filters?type=${book?.type}`}>
                <InfoText>{book?.type}</InfoText>
              </Link>
            </InfoStack>
          </tr>
        </tbody>
      </table>
  } else {
    details = <table style={{ width: '100%' }}>
      <tbody>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="30%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="35%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="40%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="40%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="30%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="30%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="40%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="30%" /></td></tr>
        <tr><td><Skeleton variant="text" sx={{ fontSize: '14px', my: '8px' }} width="40%" /></td></tr>
      </tbody>
    </table>
  }

  return (
    <Stack spacing={1} direction={{ xs: 'column-reverse', md: 'column' }}>
      <Stack spacing={1}>
        <ShopDisplay id={book?.shopId} name={book?.shopName} />
        <Grid container size={12} spacing={1} display="flex" flexDirection={{ xs: 'column-reverse', md: 'row' }}>
          <Grid size={{ xs: 12, md: 'grow' }}>
            <DetailContainer>
              <Box position="relative" mb={-2}>
                <Title>Thông tin chi tiết</Title>
                <MobileExtendButton disabled={loading || !book} onClick={() => setOpenDetail(true)}>
                  Tác giả, Nhà xuất bản,... <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
              </Box>
              {mobileMode
                ?
                <Suspense fallback={<></>}>
                  {openDetail &&
                    <SwipeableDrawer
                      anchor="bottom"
                      open={openDetail}
                      onOpen={() => setOpenDetail(true)}
                      onClose={() => setOpenDetail(false)}
                    >
                      <Box sx={{ padding: '0 12px' }}>
                        <Title>Thông tin chi tiết</Title>
                        <Box mt={-2} mb={2}>
                          {details}
                        </Box>
                      </Box>
                    </SwipeableDrawer>
                  }
                </Suspense>
                : details
              }
              <Title>Mô tả sản phẩm</Title>
              <DescTitle>{book?.title}</DescTitle>
              <DescriptionContainer>
                <Description
                  ref={descRef}
                  className={minimize ? 'minimize' : ''}
                >
                  {book?.description}
                </Description>
                {overflowed && <Showmore
                  className={minimize ? '' : 'expand'}
                  onClick={toggleMinimize}
                >
                  {minimize ?
                    <>Xem thêm <KeyboardArrowDown /> </>
                    :
                    <>Ẩn bớt <KeyboardArrowUp /> </>
                  }
                </Showmore>}
              </DescriptionContainer>
            </DetailContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <ProductsScroll {...{ loading: loadRelated, data: relatedBooks, isSuccess: doneRelated, isError: errorRelated, isUninitialized }} />
          </Grid>
        </Grid>
      </Stack>
      <Box ref={reviewRef} sx={{ scrollMargin: '80px' }}>
        <ReviewComponent {...{ book, id: book?.id, reviewRef, scrollIntoTab }} />
      </Box>
    </Stack>
  )
}

export default ProductDetailContainer