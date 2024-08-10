import styled from 'styled-components'
import { lazy, Suspense } from 'react'
import { styled as muiStyled } from '@mui/system';
import { Link } from 'react-router-dom';
import { Box, Skeleton, Tab } from '@mui/material';
import { useGetBooksByFilterQuery } from '../../features/books/booksApiSlice';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ProductsSlider from './ProductsSlider';
import CustomProgress from '../custom/CustomProgress';

const ReviewTab = lazy(() => import('./ReviewTab'));

//#region styled
const StyledTabList = muiStyled((props) => (
  <TabList
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(
  ({ theme }) => ({
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'red',
    },
    '& .MuiTabs-indicatorSpan': {
      width: '100%',
      height: 100,
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

const StyledTab = muiStyled((props) => <Tab {...props} />)(
  ({ theme }) => ({
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      fontWeight: 'bold',
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'transparent',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

const DetailContainer = styled.div`
    margin: 50px 0px;
`

const StyledTextarea = styled.textarea`
  width: 95%;
  margin-top: 50px;
  padding: 0;
  background-color: ${props => props.theme.palette.background.default};
  resize: none;
  border: none;

  -ms-overflow-style: none;
  scrollbar-width: none; 

  &::-webkit-scrollbar {
      display: none;
  }
`
//#endregion

const ProductDetailContainer = ({ loading, book, tab, handleTabChange }) => {
  //Fetch related books
  const { data: relatedBooks, isLoading: loadRelated, isSuccess: doneRelated, isError: errorRelated, isUninitialized } = useGetBooksByFilterQuery({
    cateId: book?.cateId
  }, { skip: (!book?.cateId || tab !== "related") });

  //Change tab
  const handleChangeTab = (e, newTab) => {
    if (handleTabChange) handleTabChange(newTab)
  };

  let fullInfo;

  if (loading || !book) {
    fullInfo =
      <div>
        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="50%" />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="40%" />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="60%" />
        <br /><br />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="80%" />
      </div>
  } else {
    fullInfo =
      <div>
        <h3>Thông tin chi tiết: </h3>
        <p><b>Mã hàng:</b> {book?.id}</p>
        <p><b>Tác giả:&nbsp;</b>
          <Link to={`/filters?keyword=${book?.author}`}>
            {book?.author}
          </Link>
        </p>
        <p><b>NXB:&nbsp;</b>
          <Link to={`/filters?pubId=${book?.publisher?.id}`}>
            {book?.publisher?.pubName}
          </Link>
        </p>
        <p><b>Trọng lượng (gr):</b> {book?.weight} gr</p>
        <p><b>Kích thước:</b> {book?.size} cm</p>
        <p><b>Số trang:</b> {book?.pages ?? '~'}</p>
        <p><b>Hình thức:&nbsp;</b>
          <Link to={`/filters?type=${book?.type}`}>
            {book?.type}
          </Link>
        </p>
        <StyledTextarea
          value={book?.description}
          cols={100}
          rows={20}
          readOnly
          disabled
        />
      </div>
  }

  return (
    <DetailContainer>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tab}>
          <Box sx={{ color: '#1eff00', backgroundColor: '#272727' }}>
            <StyledTabList onChange={handleChangeTab} aria-label="tab">
              <StyledTab label="THÔNG TIN CHI TIẾT" value="detail" />
              <StyledTab label="ĐÁNH GIÁ" value="reviews" />
              <StyledTab label="SẢN PHẨM LIÊN QUAN" value="related" />
            </StyledTabList>
          </Box>
          <TabPanel value="detail">
            {fullInfo}
          </TabPanel>
          <TabPanel value="reviews">
            <Suspense fallback={<CustomProgress color="primary" />}>
              <ReviewTab id={book?.id} rateAmount={book?.rateAmount} />
            </Suspense>
          </TabPanel>
          <TabPanel value="related">
            <div>
              <ProductsSlider {...{ loading: loadRelated, data: relatedBooks, isSuccess: doneRelated, isError: errorRelated, isUninitialized }} />
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </DetailContainer>
  )
}

export default ProductDetailContainer