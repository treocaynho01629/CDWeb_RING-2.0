import React, { useState, useEffect } from 'react';

import styled from 'styled-components'
import PropTypes from 'prop-types';
import { styled as muiStyled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { visuallyHidden } from '@mui/utils';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import usePrivateFetch from '../../hooks/usePrivateFetch'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

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

const RECEIPTS_URL = 'api/orders';

const headCells = [
  {
    id: 'user.userName',
    align: 'center',
    width: '200px',
    disablePadding: false,
    sortable: true,
    label: 'Thành viên',
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
    align: 'left',
    width: '250px',
    disablePadding: false,
    sortable: true,
    label: 'Tổng tiền',
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selectedAll } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{height: '58px'}}>
        <TableCell/>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            style={{ width: headCell.width}}
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

function EnhancedTableToolbar(props) {
  const { numSelected, selectedAll, refetch } = props;
  const [openNew, setOpenNew] = useState(false);
 
  const handleClickOpenNew = () => {
    setOpenNew(true);
  };

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
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' , fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center'}}
          variant="h6"
          component="div"
        >
        <AutoStoriesIcon sx={{marginRight: '10px'}}/>
        {selectedAll ? "Chọn tất cả" : `Chọn ${numSelected} đánh giá`}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' , fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <AutoStoriesIcon sx={{color: 'white', marginRight: '10px'}}/>
          Danh sách đánh giá
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xoá đánh giá đã chọn">
          <IconButton>
            <DeleteIcon sx={{color: 'white', "&:hover": {transform: 'scale(1.05)', color: '#e66161'}}} />
          </IconButton>
        </Tooltip>
      ) : (<></>)}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedAll: PropTypes.bool.isRequired,
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
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
        <TableCell align="left"><ItemTitle>{row.userName}</ItemTitle></TableCell>
        <TableCell align="left"><ItemTitle>{row.email}</ItemTitle></TableCell>
        <TableCell align="left"><ItemAddress>{row.address}</ItemAddress></TableCell>
        <TableCell align="left"><ItemDate>{row.date}</ItemDate></TableCell>
        <TableCell align="right">{Math.round(row.total).toLocaleString()}đ</TableCell>
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
                  {row.orderDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {detail.bookId}
                      </TableCell>
                      <TableCell>{detail.price.toLocaleString()}đ</TableCell>
                      <TableCell align="right">{detail.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(detail.amount * detail.price).toLocaleString()}đ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
//#endregion

export default function TableReceipts(props) {
  //#region construct
  const { setReceiptCount } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { loading, data: rows , refetch} = usePrivateFetch(RECEIPTS_URL
    + "?pageNo=" + page
    + "&pSize=" + rowsPerPage
    + "&sortDir=" + order
    + "&sortBy=" + orderBy);

  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{
    if (!loading){
      setReceiptCount(rows?.totalElements);
    }
  }, [loading]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows?.content?.map((n) => n.id);
      setSelected(newSelected);
      setSelectedAll(true);
      return;
    }
    setSelected([]);
    setSelectedAll(false);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelectedAll(false);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleDelete = async (id) => {
    try {
        const response = await axiosPrivate.delete(REVIEWS_URL + "/" + id,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );

        //Bỏ selected
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
          setSelected(newSelected);
        }

        refetch();
    } catch (err) {
        console.log(err);
        if (!err?.response) {
        } else if (err.response?.status === 409) {
        } else if (err.response?.status === 400) {
        } else {
        }
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.totalElements) : 0;
  //#endregion

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: '2px' }}>
        <EnhancedTableToolbar 
        numSelected={selected.length} 
        selectedAll={selectedAll} 
        refetch={refetch}/>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.totalElements}
              selectedAll={selectedAll}
            />
            <TableBody>
              {rows?.content?.map((row, index) => (
                <Row key={index} row={row} />
              ))}
              {loading && (
                <TableRow>
                  <TableCell 
                  scope="row"
                  padding="none"
                  align="center"
                  colSpan={6}>
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{height: (dense ? 63 : 83) * emptyRows}}>
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
          count={rows?.totalElements ? rows?.totalElements : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          showFirstButton
          showLastButton
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <div style={{height: '10px'}}>
        {loading && (<CustomLinearProgress/>)}  
      </div>
      <FormControlLabel
        control={<Switch sx={{'& .MuiSwitch-switchBase.Mui-checked': {
          color: '#63e399',
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#63e399',
        },}} 
        checked={dense} onChange={handleChangeDense} />}
        label="Thu gọn"
      />
    </Box>
  );
}