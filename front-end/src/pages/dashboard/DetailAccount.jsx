import React, { useState, lazy, Suspense } from 'react';
import styled from 'styled-components'

import { Avatar, Box, Card, CardContent, IconButton, Typography, Grid, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import usePrivateFetch from '../../hooks/usePrivateFetch'
import { useNavigate, useParams } from 'react-router-dom';

const TableReviews = lazy(() => import('../../components/dashboard/TableReviews'));
const TableBooks = lazy(() => import('../../components/dashboard/TableBooks'));
const TableReceipts = lazy(() => import('../../components/dashboard/TableReceipts'));
const EditAccountDialog = lazy(() => import('../../components/dashboard/EditAccountDialog'));

//#region styled
const Title = styled.h2`
    font-size: 28px;
    line-height: normal;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: break-word;
`
//#endregion

const ACCOUNT_URL = `/api/accounts/`;

const DetailAccount = () => {
    const {id} = useParams();
    const [openEdit, setOpenEdit] = useState(false);
    const { loading, data, refetch } = usePrivateFetch(ACCOUNT_URL + id);

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    return (
    <>
    <Card elevation={3} sx={{ display: 'flex', marginBottom: 3}}>
        <Box sx={{display: 'flex', padding: 3, width: '40%'}}>
            <Avatar sx={{ width: 130, height: 130, mr: 3, mt: 3}}/>
            <Box>
                <Title>{data?.name ? data?.name : 'Người dùng RING!'}</Title>
                <Typography component="div" variant="subtitle1" color="text.secondary" sx={{fontWeight: 'bold'}}>
                    {data?.roles == 3 ? 'ADMIN' : data?.roles == 2 ? 'SELLER' : 'MEMBER'}
                </Typography>
                <Typography component="div" variant="subtitle1" sx={{fontWeight: 'bold'}}>
                    {data?.userName}
                </Typography>
                <Typography component="div" variant="subtitle1" color="text.secondary" sx={{fontWeight: '500'}}>
                    Giới tính: {data?.gender == '' ? 'Không' : data?.gender}
                </Typography>
            </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '60%'}}>
            <CardContent sx={{ flex: '1 1 auto', display: 'flex'}}>
                <Divider sx={{marginLeft: 2, marginRight: 2}} orientation="vertical" variant="middle" flexItem/>
                <Grid container spacing={3} sx={{padding: '35px 0 35px 15px'}}>
                    <Grid item xs={3}>
                        <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{fontWeight: 'bold'}}>
                        Số điện thoại:
                        </Typography>
                        <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{fontWeight: 'bold'}}>
                        Email:
                        </Typography>
                        <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{fontWeight: 'bold'}}>
                        Sinh nhật: 
                        </Typography>
                        <Typography my={1} variant="subtitle1" color="text.primary" component="div" sx={{fontWeight: 'bold'}}>
                        Địa chỉ: 
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
                        {data?.phone ? data?.phone : 'N/A'}
                        </Typography>
                        <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
                        {data?.email ? data?.email : 'N/A'}
                        </Typography>
                        <Typography my={1} variant="subtitle1" color="text.secondary" component="div">
                        {data?.dob ? data?.dob : 'N/A'}
                        </Typography>
                        <Typography my={1} variant="subtitle1" color="text.secondary" component="div" 
                            sx={{textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'break-word'}}>
                        {data?.address ? data?.address : 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <Box sx={{display: 'flex'}}>
                <Divider orientation="vertical" variant="middle"/>
                <IconButton sx={{width: '100%', borderRadius: 0, "&:hover": {color: '#63e399'}}} onClick={handleClickOpenEdit}>
                    <EditIcon sx={{ height: 42, width: 42 }} />
                </IconButton>
            </Box>
        </Box>
    </Card>
    <Suspense fallback={<></>}>
    {openEdit ?
        <EditAccountDialog 
        id={id}
        open={openEdit} 
        setOpen={setOpenEdit}
        refetch={refetch}/>
    : null}
    
    <Grid container spacing={3}>
        {data?.roles >= 2 ?
        <Grid item lg={12}>
        <TableBooks mini={true} sellerName={data?.userName}/>
        </Grid>
        : null
        }
        <Grid item sm={12} lg={6}>
        <TableReceipts mini={true}/>
        </Grid>
        <Grid item sm={12} lg={6}>
        <TableReviews mini={true} userId={id}/>
        </Grid>
    </Grid>
    </Suspense>
    </>
      
    );
}

export default DetailAccount