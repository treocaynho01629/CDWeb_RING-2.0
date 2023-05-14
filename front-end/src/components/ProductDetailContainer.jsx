import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';

import ReviewTab from '../components/ReviewTab'

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import ProductsSlider from '../components/ProductsSlider';

import useFetch from '../hooks/useFetch'

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
  
  const StyledTab = muiStyled((props) => <Tab disableRipple {...props} />)(
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
      '&.Mui-focused': {
        outline: 'none',
        border: 'none',
      },
    }),
);

const DetailContainer = styled.div`
    margin: 50px 0px;
`

const BOOKS_RELATED_URL = 'api/books/filters?pSize=10&cateId=';

const ProductDetailContainer = (props) => {
  const {loading, book} = props;
  const [value, setValue] = useState('1');
  const { loading: loadingRelated, data: booksRelated } = useFetch(BOOKS_RELATED_URL + (book ? book?.cateId : ""));

  //Change Tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let fullInfo;

  if (loading){
    fullInfo = <p>loading</p>
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
          <TabContext value={value}>
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
                  <ReviewTab id={book?.id} rateAmount={book?.rateAmount}/>
              </TabPanel>
              <TabPanel value="3">
                  <RelatedTab>
                      {/* <ProductsSlider booksList={booksRelated?.content} loading={loadingRelated}/> */}
                  </RelatedTab>
              </TabPanel>
          </TabContext>
      </Box>
  </DetailContainer>
  )
}

export default ProductDetailContainer