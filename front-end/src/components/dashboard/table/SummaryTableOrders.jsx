import { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Skeleton, Toolbar, TableHead, Avatar
} from '@mui/material';
import { Link } from 'react-router';
import { ItemTitle, LinkButton, Title } from '../custom/ShareComponents';
import { currencyFormat, idFormatter, numFormat } from '../../../ultils/covert';
import { useGetSummariesQuery } from '../../../features/orders/ordersApiSlice';
import useAuth from '../../../hooks/useAuth';
import CustomProgress from '../../custom/CustomProgress';

const headCells = [
  {
    id: 'user',
    align: 'left',
    width: 'auto',
    disablePadding: false,
    label: 'Thông tin',
  },
  {
    id: 'info',
    align: 'right',
    width: '110px',
    disablePadding: false,
    label: 'Thành tiền',
  },
];

export default function SummaryTableOrders({ title, shopId, bookId }) {
  //#region construct
  const { roles } = useAuth();
  const isAdmin = useState(roles?.find(role => ['ROLE_ADMIN'].includes(role)));

  //Fetch order summaries
  const { data, isLoading, isSuccess, isError, error } = useGetSummariesQuery({
    size: 5,
    sortBy: 'createdDate',
    sortDir: 'desc',
    shopId: shopId ?? '',
    bookId: bookId ?? ''
  })
  //#endregion

  const colSpan = headCells.length + 1;
  let orderRows;

  if (isLoading) {
    orderRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan}
          sx={{ position: 'relative', height: '40dvh' }}
        >
          <CustomProgress color="primary" />
        </TableCell>
      </TableRow>
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    orderRows = ids?.length
      ? ids?.map((id, index) => {
        const order = entities[id];
        const date = new Date(order?.date);

        return (
          <TableRow hover tabIndex={-1} key={id}>
            <TableCell align="left">
              <Link to={`/dashboard/product/${id}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }} src={order?.image ? order.image + '?size=tiny' : null}>{order?.name?.charAt(0) ?? ''}</Avatar>
                <Box>
                  <ItemTitle>{order.name}</ItemTitle>
                  <Box display="flex">
                    <ItemTitle>{idFormatter(order.id)}</ItemTitle>
                    <ItemTitle className="secondary">&emsp;{
                      date.toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }</ItemTitle>
                  </Box>
                </Box>
              </Link>
            </TableCell>
            <TableCell align="right">
              <ItemTitle>{currencyFormat.format(order.totalPrice)}</ItemTitle>
              <ItemTitle className="secondary">Tổng SL: {numFormat.format(order.totalItems)}</ItemTitle>
            </TableCell>
          </TableRow>
        )
      })
      :
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan}
          sx={{ height: '40dvh' }}
        >
          <Box>Không tìm thấy đơn hàng nào!</Box>
        </TableCell>
      </TableRow >
  } else if (isError) {
    orderRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan}
          sx={{ height: '40dvh' }}
        >
          <Box>{error?.error || 'Đã xảy ra lỗi'}</Box>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper sx={{ width: '100%', height: '100%' }} elevation={3}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Giao dịch mới nhất</Title>
        <Link to={'/dashboard/order'}><LinkButton>Xem tất cả</LinkButton></Link>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow className="header" tabIndex={-1}>
              {headCells.map((headCell, index) => (
                <TableCell
                  key={`headcell-${headCell.id}-${index}`}
                  align={headCell.align}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sx={{ width: headCell.width, bgcolor: 'action.hover' }}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead >
          <TableBody>
            {orderRows}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
