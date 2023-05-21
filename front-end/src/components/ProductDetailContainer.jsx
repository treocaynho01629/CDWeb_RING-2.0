import React, { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

const ReviewTab = lazy(() => import('../components/ReviewTab')) ;

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab, TextareaAutosize} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import ProductsSlider from '../components/ProductsSlider';
import useFetch from '../hooks/useFetch'

//#region styled
const FullInfoTab = styled.div``

const RelatedTab = styled.div``

const StyledTabList = muiStyled((props) => (
    <TabList
      {...props}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
  ))({
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'red',
    },
    '& .MuiTabs-indicatorSpan': {
      width: '100%',
      height: 100,
      backgroundColor: '#63e399',
    },
  });
  
const StyledTab = muiStyled((props) => <Tab {...props} />)(
    ({ theme }) => ({
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-selected': {
        fontWeight: 'bold',
        backgroundColor: '#63e399',
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

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'white',
  },
  [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 0,
      backgroundColor: '#63e399',
  },
}));
//#endregion

const BOOKS_RELATED_URL = 'api/books/filters?pSize=10&cateId=';

const ProductDetailContainer = (props) => {
  const {loading, book, tab, onTabChange} = props;
  const { loading: loadingRelated, data: booksRelated } = useFetch(BOOKS_RELATED_URL + (book ? book?.cateId : ""));

  //Change Tab
  const handleChange = (event, newValue) => {
    if (onTabChange){
      onTabChange(newValue);
    }
  };

  let fullInfo;

  if (loading){
    fullInfo = <CustomLinearProgress/>
  } else {
    fullInfo =
        <FullInfoTab>
            <h3>Thông tin chi tiết: </h3>
            <p><b>Mã hàng:</b> {book?.id}</p>
            <p><b>Tác giả:</b> {book?.author}</p>
            <p><b>NXB:</b> {book?.publisher?.pubName}</p>
            <p><b>Trọng lượng (gr):</b> {book?.weight} gr</p>
            <p><b>Kích thước:</b> {book?.size} cm</p>
            <p><b>Số trang:</b> {book?.pages}</p>
            <p><b>Hình thức:</b> {book?.type}</p>
            <TextareaAutosize
                value={book?.description}
                cols={100}
                rows={20}
                readOnly
                disabled
                style={{ marginTop: '50px', padding: '0', backgroundColor: 'white', resize: 'none', border: 'none'}}
            />
        </FullInfoTab>
  }

  return (
    <DetailContainer>
      <Box sx={{ width: '100%', typography: 'body1'}}>
          <TabContext value={tab}>
              <Box sx={{color: 'rgb(30, 255, 0)', backgroundColor: 'rgb(39, 39, 39)'}}>
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
                <Suspense fallback={<CustomLinearProgress/>}>
                  <ReviewTab id={book?.id} rateAmount={book?.rateAmount}/>
                </Suspense>
              </TabPanel>
              <TabPanel value="3">
                  <RelatedTab>
                      <ProductsSlider booksList={booksRelated?.content} loading={loadingRelated}/>
                  </RelatedTab>
              </TabPanel>
          </TabContext>
      </Box>
  </DetailContainer>
  )
}

export default ProductDetailContainer