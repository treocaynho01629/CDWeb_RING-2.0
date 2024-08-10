import styled from 'styled-components'
import { useState, useEffect, Fragment } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch, Collapse } from '@mui/material';
import { Receipt as ReceiptIcon, KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { Link, useSearchParams } from "react-router-dom";
import { useGetOrdersQuery } from '../../../features/orders/ordersApiSlice';
import PropTypes from 'prop-types';
import CustomProgress from '../../custom/CustomProgress';

//#region preStyled
const ItemTitle = styled.p`
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    min-width: 100px;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const ItemDate = styled.p`
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    min-width: 150px;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const ItemAddress = styled.p`
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 500px;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const headCells = [
  {
    id: 'user.userName',
    align: 'left',
    width: '200px',
    disablePadding: false,
    sortable: true,
    label: 'Khách hàng',
  },
  {
    id: 'email',
    align: 'left',
    width: '200px',
    disablePadding: false,
    sortable: true,
    label: 'Email',
  },
  {
    id: 'oAddress',
    align: 'left',
    width: '350px',
    disablePadding: false,
    sortable: true,
    label: 'Địa chỉ',
  },
  {
    id: 'oDate',
    align: 'left',
    width: '220px',
    disablePadding: false,
    sortable: true,
    label: 'Ngày',
  },
  {
    id: 'total',
    align: 'right',
    width: '250px',
    disablePadding: false,
    sortable: true,
    label: 'Tổng tiền',
  }
];

function EnhancedTableHead({ order, orderBy, numSelected, rowCount, onRequestSort, selectedAll }) {
  const createSortHandler = (property) => (e) => {
    onRequestSort(e, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ height: '58px' }}>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            style={{ width: headCell.width }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <TableSortLabel hideSortIcon>
                {headCell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
};

function EnhancedTableToolbar({ numSelected }) {
  return (
    <Toolbar
      sx={{
        backgroundColor: '#63e399',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: '#63e3a7',
        }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <ReceiptIcon sx={{ color: 'white', marginRight: '10px' }} />
        Danh sách đơn hàng
      </Typography>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedAll: PropTypes.bool.isRequired,
};

function OrderRow({ order }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [order])

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left"><ItemTitle>{order.userName}</ItemTitle></TableCell>
        <TableCell align="left"><ItemTitle>{order.email}</ItemTitle></TableCell>
        <TableCell align="left"><ItemAddress>{order.address}</ItemAddress></TableCell>
        <TableCell align="left"><ItemDate>{order.date}</ItemDate></TableCell>
        <TableCell align="right">{Math.round(order.total).toLocaleString()} đ</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Chi tiết
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Giá(đ)</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Tổng giá(đ)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {detail.bookId}
                      </TableCell>
                      <TableCell>{detail.price.toLocaleString()} đ</TableCell>
                      <TableCell align="right">{detail.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(detail.amount * detail.price).toLocaleString()} đ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
//#endregion

export default function TableReceipts({ setReceiptCount, mini }) {
  //#region construct
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [dense, setDense] = useState(true);
  const [pagination, setPagination] = useState({
    currPage: searchParams.get("pageNo") ? searchParams.get("pageNo") - 1 : 0,
    pageSize: searchParams.get("pSize") ?? (mini ? 5 : 10),
    totalPages: 0,
    sortBy: searchParams.get("sortBy") ?? "id",
    sortDir: searchParams.get("sortDir") ?? "asc",
  })

  //Fetch receipts
  const { data, isLoading, isSuccess, isError } = useGetOrdersQuery({
    page: pagination?.currPage,
    size: pagination?.pageSize,
    sortBy: pagination?.sortBy,
    sortDir: pagination?.sortDir,
  });

  //Set pagination after fetch
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setPagination({
        ...pagination,
        totalPages: data?.info?.totalPages,
        currPage: data?.info?.currPage,
        pageSize: data?.info?.pageSize
      });
    }
  }, [data])

  const handleChangePage = (page) => {
    if (page == 1) {
      searchParams.delete("pageNo");
      setSearchParams(searchParams);
    } else {
      searchParams.set("pageNo", page);
      setSearchParams(searchParams);
    }
    setPagination({ ...pagination, currPage: page - 1 });
  };

  // useEffect(() => {
  //   if (!loading && setBookCount) {
  //     setBookCount(rows?.totalElements);
  //   }
  // }, [loading]);

  const handleChangeRowsPerPage = (e) => {
    const newValue = parseInt(e.target.value, 10);
    handleChangePage(1);
    if (newValue == 16) {
      searchParams.delete("pSize");
      setSearchParams(searchParams);
    } else {
      searchParams.set("pSize", newValue);
      setSearchParams(searchParams);
    }
    setPagination({ ...pagination, pageSize: newValue });
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeDense = (e) => {
    setDense(e.target.checked);
  };

  const emptyRows = Math.max(0, (pagination.currPage) * pagination.pageSize - data?.info?.totalElements);
  //#endregion

  let ordersRows;

  if (isLoading) {
    ordersRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={6}>
        </TableCell>
      </TableRow>
    )
  } else if (isSuccess) {
    const { ids, entities } = data;

    ordersRows = ids?.length
      ? ids?.map((id, index) => {
        const order = entities[id];

        return (
          <OrderRow key={index} order={order} />
        )
      })
      :
      <Box sx={{ marginTop: 5, marginBottom: '90dvh' }}>Không tìm thấy sản phẩm nào!</Box>
  } else if (isError) {
    ordersRows = (
      <Box sx={{ marginTop: 5, marginBottom: '90dvh' }}>{error?.error}</Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: '2px' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedAll={selectedAll} />
        <TableContainer sx={{ maxHeight: mini ? 330 : 500 }}>
          <Table
            sx={{ minWidth: mini ? 500 : 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead {...{
              numSelected: selected.length, pagination, rowCount: data?.info?.totalElements,
              selectedAll, onRequestSort: handleRequestSort
            }} />
            <TableBody>
              {ordersRows}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 63 : 83) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          labelRowsPerPage={"Hiển thị"}
          labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} trong số ${count !== -1 ? count : `Có hơn ${to}`}`; }}
          count={data?.info?.totalElements ?? 0}
          rowsPerPage={pagination?.pageSize}
          page={pagination?.currPage}
          showFirstButton
          showLastButton
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box sx={{ height: '10px' }}>
        {isLoading && (<CustomProgress color="primary" />)}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormControlLabel
          control={<Switch sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#63e399',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#63e399',
            },
          }}
            checked={dense} onChange={handleChangeDense} />}
          label="Thu gọn"
        />
        {mini ?
          <Link to={'/manage-receipts'} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 10 }}>Xem tất cả</Link>
          : null
        }
      </Box>
    </Box>
  );
}

TableReceipts.defaultProps = {
  mini: false,
};
