import { useState, useEffect } from 'react';

import styled from 'styled-components'
import PropTypes from 'prop-types';
import { styled as muiStyled } from '@mui/material/styles';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel
, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Group as GroupIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

import { visuallyHidden } from '@mui/utils';
import useAuth from "../../hooks/useAuth";

import usePrivateFetch from '../../hooks/usePrivateFetch'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import AddProductDialog from './AddProductDialog';
import EditProductDialog from './EditProductDialog';

//#region preStyled
const ItemTitle = styled.p`
    font-size: 12px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
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

const ACCOUNTS_URL = 'api/accounts';

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
    id: 'userName',
    align: 'left',
    width: '200px',
    disablePadding: false,
    sortable: true,
    label: 'Tên đăng nhập',
  },
  {
    id: 'email',
    align: 'left',
    width: '250px',
    disablePadding: false,
    sortable: true,
    label: 'Email',
  },
  {
    id: 'authorities',
    align: 'right',
    width: '150px',
    disablePadding: false,
    sortable: false,
    label: 'Quyền',
  },
  {
    id: 'action',
    align: 'right',
    width: '250px',
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
        <GroupIcon sx={{marginRight: '10px'}}/>
        {selectedAll ? "Chọn tất cả" : `Chọn ${numSelected} thành viên`}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' , fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <GroupIcon sx={{color: 'white', marginRight: '10px'}}/>
          Danh sách thành viên
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xoá thành viên đã chọn">
          <IconButton>
            <DeleteIcon sx={{color: 'white', "&:hover": {transform: 'scale(1.05)', color: '#e66161'}}} />
          </IconButton>
        </Tooltip>
      ) : (
      <>
        <Tooltip title="Thêm thành viên mới">
          <IconButton sx={{borderRadius: '5px',
          "&:hover": {
            backgroundColor: '#50be7e',
          }}}
          onClick={handleClickOpenNew}>
            <Typography
            sx={{ flex: '1 1 100%' , fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center'}}
            variant="h6"
            id="tableTitle"
            component="div"
            >
              Thêm thành viên
            <AddIcon sx={{color: 'white', marginLeft: '10px'}}/>
            </Typography>
          </IconButton>
        </Tooltip>
        //<>Add dialog</>
      </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedAll: PropTypes.bool.isRequired,
};
//#endregion

export default function TableAccounts(props) {
  //#region construct
  const { setAccCount } = props;
  const { auth } = useAuth();
  const [id, setId] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState(false);
  const { loading, data: rows , refetch} = usePrivateFetch(ACCOUNTS_URL + (filter ? "/employees" : "") 
    + "?pageNo=" + page
    + "&pSize=" + rowsPerPage
    + "&sortDir=" + order
    + "&sortBy=" + orderBy);

  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{
    if (!loading){
      setAccCount(rows?.totalElements);
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

  const handleChangeFilter = (event) => {
    setFilter(event.target.checked);
    setPage(0);
  };

  const handleClickOpenEdit = (id) => {
    setId(id);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    try {
        const response = await axiosPrivate.delete(ACCOUNTS_URL + "/" + id,
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
        enqueueSnackbar('Xoá thành viên thất bại!', { variant: 'error' });
    }
  };

  const isSelected = (name) => (selected.indexOf(name) !== -1 || selectedAll);

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
                    <TableCell align="left"><ItemTitle>{row.username}</ItemTitle></TableCell>
                    <TableCell align="left"><ItemTitle>{row.email}</ItemTitle></TableCell>
                    <TableCell align="right">{row.authorities.length == 3 ? 'ADMIN' : row.authorities.length == 2 ? 'SELLER' : 'MEMBER'}</TableCell>
                    <TableCell align="right"> 
                      <IconButton sx={{"&:hover": {transform: 'scale(1.05)', color: '#63e399'}}}
                      onClick={(e) => handleClickOpenEdit(row.id)}>
                        <EditIcon/>
                      </IconButton>
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
      {auth?.roles?.find(role => ['ROLE_ADMIN'].includes(role.roleName))
        ? <FormControlLabel
          control={<Switch sx={{'& .MuiSwitch-switchBase.Mui-checked': {
            color: '#63e399',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#63e399',
          },}} 
          checked={filter} onChange={handleChangeFilter} />}
          label="Lọc nhân viên"
        />
        : null
      }
    </Box>
  );
}
