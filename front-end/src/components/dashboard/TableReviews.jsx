import { useState, useEffect } from 'react';

import styled from 'styled-components'
import PropTypes from 'prop-types';
import { styled as muiStyled } from '@mui/material/styles';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel
, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Try as TryIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { Link } from "react-router-dom";

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

const ItemContent = styled.p`
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

const headCells = [
  {
    id: 'id',
    align: 'center',
    width: '70px',
    disablePadding: false,
    sortable: true,
    label: 'ID',
  },
  {
    id: 'user.userName',
    align: 'left',
    width: '200px',
    disablePadding: false,
    sortable: true,
    label: 'Thành viên',
  },
  {
    id: 'rContent',
    align: 'left',
    width: '350px',
    disablePadding: false,
    sortable: true,
    label: 'Nội dung',
  },
  {
    id: 'rating',
    align: 'right',
    width: '70px',
    disablePadding: false,
    sortable: true,
    label: 'Đánh giá',
  },
  {
    id: 'rDate',
    align: 'left',
    width: '220px',
    disablePadding: false,
    sortable: true,
    label: 'Ngày',
  },
  {
    id: 'book.id',
    align: 'right',
    width: '70px',
    disablePadding: false,
    sortable: true,
    label: 'Sản phẩm',
  },
  {
    id: 'action',
    align: 'right',
    width: '70px',
    disablePadding: false,
    sortable: false,
    label: 'Hành động',
  },
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
        <TableCell padding="checkbox">
          <Checkbox
            sx={{
              '&.Mui-checked': {
              color: '#63e3a7',
              },
              '&.MuiCheckbox-indeterminate': {
              color: '#63e3a7',
              },
            }}
            indeterminate={numSelected > 0 && selectedAll == false}
            checked={selectedAll == true}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'Chọn tất cả',
            }}
          />
        </TableCell>
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
  const { numSelected, selectedAll, handleDeleteMultiples } = props;
 
  const handleDelete = () => {
    if (handleDeleteMultiples) {
      handleDeleteMultiples();
    }
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
        <TryIcon sx={{marginRight: '10px'}}/>
        {selectedAll ? "Chọn tất cả" : `Chọn ${numSelected} đánh giá`}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' , fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <TryIcon sx={{color: 'white', marginRight: '10px'}}/>
          Danh sách đánh giá
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xoá đánh giá đã chọn">
          <IconButton onClick={handleDelete}>
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
//#endregion

const REVIEWS_URL = 'api/reviews';

export default function TableReviews(props) {
  //#region construct
  const { setReviewCount, id, userId, mini } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(mini ? 5 : 10);
  const { loading, data: rows , refetch} = usePrivateFetch(REVIEWS_URL + (id ? `/${id}` : '') 
    + (userId ? `/user/${userId}` : '') 
    + "?pageNo=" + page
    + "&pSize=" + rowsPerPage
    + "&sortDir=" + order
    + "&sortBy=" + orderBy);

  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{
    if (!loading && setReviewCount){
      setReviewCount(rows?.totalElements);
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
    const { enqueueSnackbar } = await import('notistack');

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
        enqueueSnackbar('Xoá đánh giá thất bại!', { variant: 'error' });
    }
  };

  const handleDeleteMultiples = async () => {
    const { enqueueSnackbar } = await import('notistack');

    try {
        let DELETE_URL = ( selectedAll ? REVIEWS_URL + "/delete-all" : REVIEWS_URL + "/delete-multiples?ids=" + selected)
        const response = await axiosPrivate.delete(DELETE_URL,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );

        refetch();
        setSelected([]);
        setSelectedAll(false);
        enqueueSnackbar('Đã xoá đánh giá!', { variant: 'success' });
    } catch (err) {
        console.log(err);
        if (!err?.response) {
        } else if (err.response?.status === 409) {
        } else if (err.response?.status === 400) {
        } else {
        }
        enqueueSnackbar('Xoá đánh giá thất bại!', { variant: 'error' });
    }
  };

  const isSelected = (name) => (selected.indexOf(name) !== -1 || selectedAll);

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - rows?.totalElements);
  //#endregion

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: '2px' }}>
        <EnhancedTableToolbar 
        numSelected={selected.length} 
        selectedAll={selectedAll} 
        handleDeleteMultiples={handleDeleteMultiples}/>
        <TableContainer sx={{ maxHeight: mini ? 330 : 500 }}>
          <Table
            sx={{ minWidth: mini ? 500 : 750 }}
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
              {rows?.content?.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{
                          '&.Mui-checked': {
                          color: '#63e3a7',
                          },
                        }}
                        onChange={(event) => handleClick(event, row.id)}
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                      {row.id}
                    </TableCell>
                    <TableCell align="left"><ItemTitle>{row.userName}</ItemTitle></TableCell>
                    <TableCell align="left"><ItemContent>{row.content}</ItemContent></TableCell>
                    <TableCell align="center">{row.rating}</TableCell>
                    <TableCell align="left"><ItemDate>{row.date}</ItemDate></TableCell>
                    <TableCell align="center">{row.bookId}</TableCell>
                    <TableCell align="center"> 
                      <IconButton sx={{"&:hover": {transform: 'scale(1.05)', color: '#e66161'}}} 
                      onClick={(e) => handleDelete(row.id)}>
                        <DeleteIcon/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
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
      <Box sx={{height: '10px'}}>
        {loading && (<CustomLinearProgress/>)}  
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
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
        {mini ?
        <Link to={'/manage-reviews'} style={{display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 10}}>Xem tất cả</Link>
        : null
        }
      </Box>
    </Box>
  );
}

TableReviews.defaultProps = {
  mini: false,
};
