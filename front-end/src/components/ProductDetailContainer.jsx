import styled from 'styled-components'
import { lazy, Suspense } from 'react'
import { styled as muiStyled } from '@mui/system';
import { Link } from 'react-router-dom';
import { Box, Skeleton, Tab, TextareaAutosize } from '@mui/material';
import { useGetBooksByFilterQuery } from '../features/books/booksApiSlice';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ProductsSlider from '../components/ProductsSlider';
import CustomProgress from './custom/CustomProgress';

const ReviewTab = lazy(() => import('../components/ReviewTab'));

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
      backgroundColor: theme.palette.secondary.main,
    },
  }),
);

const StyledTab = muiStyled((props) => <Tab {...props} />)(
  ({ theme }) => ({
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      fontWeight: 'bold',
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      outline: 'none',
      border: 'none',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'transparent',
      outline: 'none',
      border: 'none',
    },
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
  }),
);

const DetailContainer = styled.div`
    margin: 50px 0px;
`
//#endregion

const ProductDetailContainer = (props) => {
  const { loading, book, tab, onTabChange } = props;

  //Fetch retalted books
  const { data: relatedBooks, isLoading: loadRelated, isSuccess: doneRelated, isError: errorRelated } = useGetBooksByFilterQuery({ 
    cateId: book?.cateId 
  }, { skip: (!book?.cateId || tab !== "3") });

  //Change tab
  const handleChange = (e, newValue) => {if (onTabChange) onTabChange(newValue)};

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
        <TextareaAutosize
          value={book?.description}
          cols={100}
          rows={20}
          readOnly
          disabled
          style={{ width: '95%', marginTop: '50px', padding: '0', backgroundColor: 'white', resize: 'none', border: 'none' }}
        />
      </div>
  }

  return (
    <DetailContainer>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tab}>
          <Box sx={{ color: '#1eff00', backgroundColor: '#272727' }}>
            <StyledTabList onChange={handleChange} aria-label="tab">
              <StyledTab label="THÔNG TIN CHI TIẾT" value="1" />
              <StyledTab label="ĐÁNH GIÁ" value="2" />
              <StyledTab label="SẢN PHẨM LIÊN QUAN" value="3" />
            </StyledTabList>
          </Box>
          <TabPanel value="1">
            {fullInfo}
          </TabPanel>
          <TabPanel value="2">
            <Suspense fallback={<CustomProgress color="secondary" />}>
              <ReviewTab id={book?.id} rateAmount={book?.rateAmount} />
            </Suspense>
          </TabPanel>
          <TabPanel value="3">
            <div>
              <ProductsSlider {...{ loading: loadRelated, data: relatedBooks, isSuccess: doneRelated, isError: errorRelated }} />
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </DetailContainer>
  )
}

export default ProductDetailContainer