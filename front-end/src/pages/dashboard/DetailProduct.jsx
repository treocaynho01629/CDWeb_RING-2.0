import styled from 'styled-components'
import { useState, lazy, Suspense, useEffect } from 'react';
import { TextareaAutosize, Box, Card, CardContent, CardMedia, IconButton, Typography, Grid, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import TableReviews from "../../components/dashboard/table/TableReviews";
import TableReceipts from "../../components/dashboard/table/TableReceipts";
import EditIcon from '@mui/icons-material/Edit';
import useTitle from '../../hooks/useTitle'

const EditProductDialog = lazy(() => import('../../components/dashboard/dialog/EditProductDialog'));

//#region styled
const Button = styled.button`
    width: 250px;
    border-radius: 0;
    padding: 15px;
    margin-top: -15px;
    border: none;
    outline: none;
    background-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.contrastText};
    font-size: 18px;
    justify-content: center;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: gray;
    }
`

const Title = styled.h2`
    font-size: 29px;
    line-height: normal;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: break-word;
    width: 95%;
	
	@supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
`
//#endregion

const BOOK_URL = `/api/books/`;
const CATEGORIES_URL = 'api/categories';
const PUBLISHERS_URL = 'api/publishers';

const DetailProduct = () => {
    return(<p>TEMP</p>)
    // const { id } = useParams();
    // const [openEdit, setOpenEdit] = useState(false);
    // const { loading, data, refetch } = useFetch(BOOK_URL + id);
    // const { loading: loadingCate, data: dataCate } = useFetch(CATEGORIES_URL);
    // const { loading: loadingPub, data: dataPub } = useFetch(PUBLISHERS_URL);
    // const navigate = useNavigate();

    // const handleClickOpenEdit = () => {
    //     setOpenEdit(true);
    // };

    // //Set title
    // useTitle(`${data?.title ?? 'RING - Sản phẩm'}`);

    // return (
    //     <>
    //         <Card elevation={3} sx={{ display: 'flex', marginBottom: 3 }}>
    //             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    //                 <CardMedia
    //                     component="img"
    //                     sx={{ width: 400, height: 400, objectFit: 'contain', borderRadius: 5, margin: 3, padding: 1 }}
    //                     image={data?.image}
    //                 />
    //                 <Divider sx={{ marginLeft: 2, marginRight: 2 }} orientation="vertical" variant="middle" flexItem />
    //             </Box>
    //             <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    //                 <CardContent sx={{ padding: '50px' }}>
    //                     <Title>{data?.title}</Title>
    //                     <Typography my={2} component="div" variant="h6" sx={{ fontWeight: 'bold' }}>
    //                         Giá: {data?.price.toLocaleString()} đ
    //                     </Typography>
    //                     <Grid container spacing={3} sx={{ maxWidth: '600px' }}>
    //                         <Grid item xs={5}>
    //                             <Typography my={1} sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary" component="div">
    //                                 Thể loại:
    //                             </Typography>
    //                             <Typography my={1} sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary" component="div">
    //                                 Nhà xuất bản:
    //                             </Typography>
    //                             <Typography my={1} sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary" component="div">
    //                                 Tác giả:
    //                             </Typography>
    //                             <Typography my={1} sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary" component="div">
    //                                 Hình thức:
    //                             </Typography>
    //                             <Typography my={1} sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary" component="div">
    //                                 Người bán:
    //                             </Typography>
    //                         </Grid>
    //                         <Grid item xs={7}>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.cateName}
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.publisher?.pubName}
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.author}
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.type}
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 <a>{data?.sellerName}</a>
    //                             </Typography>
    //                         </Grid>
    //                     </Grid>
    //                     <Button style={{ marginTop: '10px' }} onClick={() => navigate(`/product/${id}`)}>Xem trang sản phẩm</Button>
    //                 </CardContent>
    //                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    //                     <Divider orientation="vertical" variant="middle" />
    //                     <IconButton sx={{ width: '100%', borderRadius: 0, "&:hover": { color: '#63e399' } }} onClick={handleClickOpenEdit}>
    //                         <EditIcon sx={{ height: 42, width: 42 }} />
    //                     </IconButton>
    //                 </Box>
    //             </Box>
    //         </Card>
    //         <Suspense fallback={<></>}>
    //             {openEdit ?
    //                 <EditProductDialog
    //                     id={id}
    //                     open={openEdit}
    //                     setOpen={setOpenEdit}
    //                     loadingCate={loadingCate}
    //                     dataCate={dataCate}
    //                     loadingPub={loadingPub}
    //                     dataPub={dataPub}
    //                     refetch={refetch} />
    //                 : null}
    //         </Suspense>
    //         <Card elevation={3} sx={{ padding: '10px 30px', mb: 3 }}>
    //             <Grid container spacing={3}>
    //                 <Grid item xs={12} lg={6}>
    //                     <Typography my={2} variant="h5" component="div" sx={{ fontWeight: 'bold' }}>Thông tin chi tiết: </Typography>
    //                     <Grid container spacing={3}>
    //                         <Grid item xs={4}>
    //                             <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{ fontWeight: 'bold' }}>
    //                                 Mã hàng:
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{ fontWeight: 'bold' }}>
    //                                 Trọng lượng (gr):
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{ fontWeight: 'bold' }}>
    //                                 Kích thước:
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{ fontWeight: 'bold' }}>
    //                                 Số trang:
    //                             </Typography>
    //                         </Grid>
    //                         <Grid item xs={8}>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.id ? data?.id : 'N/A'}
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.weight ? data?.weight : 'N/A'}
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.size ? data?.size : 'N/A'}
    //                             </Typography>
    //                             <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
    //                                 {data?.page ? data?.page : 'N/A'}
    //                             </Typography>
    //                         </Grid>
    //                     </Grid>
    //                 </Grid>
    //                 <Grid item xs={12} lg={6}>
    //                     <Typography my={2} variant="h5" component="div" sx={{ fontWeight: 'bold' }}>Mô tả</Typography>
    //                     <TextareaAutosize
    //                         value={data?.description}
    //                         readOnly
    //                         disabled
    //                         style={{ backgroundColor: 'white', resize: 'none', width: '95%', border: 'none' }}
    //                     />
    //                 </Grid>
    //             </Grid>
    //         </Card>
    //         <Grid container spacing={3}>
    //             <Grid item sm={12} lg={6}>
    //                 <TableReceipts mini={true} id={id} />
    //             </Grid>
    //             <Grid item sm={12} lg={6}>
    //                 <TableReviews mini={true} id={id} />
    //             </Grid>
    //         </Grid>
    //     </>

    // );
}

export default DetailProduct