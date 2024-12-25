import { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Skeleton, Toolbar, TableHead
} from '@mui/material';
import { Link } from 'react-router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useGetBooksQuery } from '../../../features/books/booksApiSlice';
import { ItemTitle, StyledStockBar } from '../custom/ShareComponents';
import { currencyFormat } from '../../../ultils/covert';
import useAuth from '../../../hooks/useAuth';
import CustomProgress from '../../custom/CustomProgress';

const maxStocks = 199;

const headCells = [
  {
    id: 'title',
    align: 'left',
    width: '450px',
    disablePadding: false,
    sortable: true,
    label: 'Sản phẩm',
  },
  {
    id: 'price',
    align: 'left',
    width: '130px',
    disablePadding: false,
    sortable: true,
    label: 'Giá(đ)',
  },
  {
    id: 'amount',
    align: 'left',
    width: '75px',
    disablePadding: false,
    sortable: true,
    label: 'Số lượng',
  },
];

export default function SummaryTableProducts({ title, shopId }) {
  //#region construct
  const { roles } = useAuth();
  const isAdmin = useState(roles?.find(role => ['ROLE_ADMIN'].includes(role)));

  //Fetch books
  const { data, isLoading, isSuccess, isError, error } = useGetBooksQuery({
    size: 5,
    shopId: shopId ?? '',
    amount: 0
  })
  //#endregion

  const colSpan = headCells.length + 1;
  let booksRows;

  if (isLoading) {
    booksRows = (
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

    booksRows = ids?.length
      ? ids?.map((id, index) => {
        const book = entities[id];
        const stockProgress = Math.min((book.amount / maxStocks * 100), 100);
        const stockStatus = stockProgress == 0 ? 'error' : stockProgress < 20 ? 'warning' : stockProgress < 80 ? 'primary' : 'info';

        return (
          <TableRow hover tabIndex={-1} key={id}>
            <TableCell align="left">
              <Link to={`/detail/${id}`} style={{ display: 'flex', alignItems: 'center' }}>
                <LazyLoadImage
                  src={`${book.image}?size=tiny`}
                  height={45}
                  width={45}
                  style={{ marginRight: '10px' }}
                  placeholder={<Skeleton width={45} height={45} animation={false} variant="rectangular" />}
                />
                <Box>
                  <ItemTitle>{book.title}</ItemTitle>
                  <Box display="flex">
                    <ItemTitle className="secondary">Đã bán: {book.totalOrders}</ItemTitle>
                    <ItemTitle className="secondary">&emsp;Đánh giá: {book.rating.toFixed(1)}</ItemTitle>
                  </Box>
                </Box>
              </Link>
            </TableCell>
            <TableCell align="left">
              <ItemTitle>{currencyFormat.format(book.price * (1 - book.discount))}</ItemTitle>
              {book.discount > 0 && <ItemTitle className="secondary">-{book.discount * 100}%</ItemTitle>}
            </TableCell>
            <TableCell align="left">
              <Box>
                <StyledStockBar color={stockStatus} variant="determinate" value={stockProgress} />
                <ItemTitle className="secondary">{book.amount} trong kho</ItemTitle>
              </Box>
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
          <Box>Không tìm thấy sản phẩm nào!</Box>
        </TableCell>
      </TableRow >
  } else if (isError) {
    booksRows = (
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
      <Toolbar>
        {title}
      </Toolbar>
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow
              className="header"
              tabIndex={-1}
              sx={{ bgcolor: 'action.hover' }}
            >
              {headCells.map((headCell, index) => (
                <TableCell
                  key={`headcell-${headCell.id}-${index}`}
                  align={headCell.align}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sx={{ width: headCell.width }}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead >
          <TableBody>
            {booksRows}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
