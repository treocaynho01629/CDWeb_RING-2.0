import { useState, useEffect, Fragment } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControlLabel,
  Switch,
  Collapse,
  TextField,
  MenuItem,
  Avatar,
  Checkbox,
  Skeleton,
  Chip,
  Badge,
  Grid2 as Grid,
  TableFooter,
  Toolbar,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  MoreHoriz,
  Search,
} from "@mui/icons-material";
import { Link } from "react-router";
import { useGetReceiptsQuery } from "../../features/orders/ordersApiSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FooterContainer, FooterLabel, ItemTitle } from "../custom/Components";
import { idFormatter } from "@ring/shared";
import { Progress } from "@ring/ui";
import CustomTableHead from "../table/CustomTableHead";
import CustomTablePagination from "../table/CustomTablePagination";

const headCells = [
  {
    id: "id",
    align: "center",
    width: "70px",
    disablePadding: false,
    sortable: true,
    hideOnMinimize: true,
    label: "ID",
  },
  {
    id: "user.username",
    align: "left",
    width: "200px",
    disablePadding: false,
    sortable: true,
    label: "Khách hàng",
  },
  {
    id: "oAddress",
    align: "left",
    disablePadding: false,
    sortable: true,
    hideOnMinimize: true,
    label: "Thông tin",
  },
  {
    id: "oDate",
    align: "left",
    width: "150px",
    disablePadding: false,
    sortable: true,
    label: "Thời gian",
  },
  {
    id: "total",
    align: "left",
    width: "150px",
    disablePadding: false,
    sortable: true,
    label: "Tổng thống kê",
  },
];

const detailHeadCells = [
  {
    id: "item",
    align: "left",
    label: "Sản phẩm",
  },
  {
    id: "price",
    align: "left",
    width: "120px",
    label: "Giá(đ)",
  },
  {
    id: "total",
    align: "left",
    width: "150px",
    label: "Thành tiền(đ)",
  },
  {
    id: "status",
    align: "left",
    width: "120px",
    label: "Trạng thái",
  },
];

//Item status
const getOrderStatus = (status) => {
  switch (status) {
    case "REFUNDED":
      return { status: "Hoàn trả", color: "default" };
    case "CANCELED":
      return { status: "Đã huỷ", color: "error" };
    case "PENDING":
      return { status: "Đang chờ", color: "warning" };
    case "SHIPPING":
      return { status: "Đang giao", color: "info" };
    case "COMPLETED":
      return { status: "Đã giao", color: "primary" };
    default:
      return { status: "Không xác định", color: "error" };
  }
};

function FilterContent({}) {
  return (
    <Grid container spacing={1} sx={{ width: "80vw", padding: "10px" }}>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Temp"
          // value={currAddress?.city || ''}
          // onChange={(e) => setCurrAddress({ ...currAddress, city: e.target.value, ward: '' })}
          select
          defaultValue=""
          fullWidth
          size="small"
        >
          <MenuItem disabled value="">
            <em>--Tất cả--</em>
          </MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={1}>1</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          placeholder="Tìm kiếm... "
          // onChange={(e) => setSearchField(e.target.value)}
          // value={searchField}
          id="search-review"
          size="small"
          fullWidth
          InputProps={{ startAdornment: <Search sx={{ marginRight: 1 }} /> }}
        />
      </Grid>
    </Grid>
  );
}

function OrderRow({
  isSelected,
  isOrderSelected,
  index,
  id,
  order,
  dense,
  handleClick,
  onSelectAllDetail,
  colSpan,
  mini,
}) {
  const [open, setOpen] = useState(false);
  const isItemSelected = isOrderSelected(id);
  const labelId = `enhanced-table-checkbox-${index}`;
  const date = new Date(order.date);

  //Total items in order
  let totalItems = 0;
  order.details.forEach(function (detail) {
    detail?.items.forEach(function (item) {
      totalItems += item.amount;
    });
  });

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Fragment key={index}>
      <TableRow
        hover
        tabIndex={-1}
        key={id}
        aria-checked={isItemSelected}
        selected={isItemSelected}
      >
        {!mini && (
          <>
            <TableCell align="left">
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={toggleOpen}
              >
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={!isItemSelected}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </Badge>
              </IconButton>
            </TableCell>
            <TableCell
              component="th"
              id={labelId}
              scope="row"
              padding="none"
              align="center"
            >
              {idFormatter(id)}
            </TableCell>
          </>
        )}
        <TableCell align="left">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ marginRight: 1 }}>
              {order?.username?.charAt(0) ?? ""}
            </Avatar>
            <Box>
              <ItemTitle>{order.fullName}</ItemTitle>
              <ItemTitle className="secondary">{order.email}</ItemTitle>
            </Box>
          </Box>
        </TableCell>
        {!mini && (
          <TableCell align="left">
            <Box>
              <ItemTitle className="address">{order.address}</ItemTitle>
              <ItemTitle className="secondary">SĐT: {order.phone}</ItemTitle>
            </Box>
          </TableCell>
        )}
        <TableCell align="left">
          <Box>
            <ItemTitle>{`${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`}</ItemTitle>
            <ItemTitle className="secondary">{`${("0" + date?.getHours()).slice(-2)}:${("0" + date?.getMinutes()).slice(-2)}`}</ItemTitle>
          </Box>
        </TableCell>
        <TableCell align="left">
          <Box>
            <ItemTitle>
              Thành tiền: {Math.round(order.total).toLocaleString()}đ
            </ItemTitle>
            <ItemTitle className="secondary">Số lượng: {totalItems}</ItemTitle>
          </Box>
        </TableCell>
      </TableRow>
      {!mini && (
        <TableRow sx={{ display: open ? "table-row" : "none" }}>
          <TableCell
            sx={{ padding: 1, backgroundColor: "action.hover" }}
            colSpan={colSpan()}
          >
            <Collapse in={open} timeout={250} unmountOnExit>
              <Table
                aria-label="order-details"
                size={dense ? "small" : "medium"}
              >
                <TableHead
                  sx={{ backgroundColor: "background.default", height: "58px" }}
                >
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={isItemSelected}
                        onChange={(e) => onSelectAllDetail(e, order)}
                        inputProps={{ "aria-label": "Chọn tất cả" }}
                      />
                    </TableCell>
                    {detailHeadCells.map((headCell, index) => (
                      <TableCell
                        key={`${headCell.id}-${index}`}
                        align={headCell.align}
                        style={{ width: headCell.width }}
                      >
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.details.map((temp, tempIndex) => {
                    return temp?.items.map((detail, index) => {
                      const itemStatus = getOrderStatus(detail.status);
                      const isDetailSelected = isSelected(detail.id);
                      const detailLabelId = `table-checkbox-${index}`;

                      return (
                        <TableRow
                          key={`${detail.id}-${index}`}
                          hover
                          tabIndex={-1}
                          aria-checked={isDetailSelected}
                          selected={isDetailSelected}
                          sx={{ backgroundColor: "background.default" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              onChange={() => handleClick(order, detail.id)}
                              checked={isDetailSelected}
                              inputProps={{
                                "aria-labelledby": detailLabelId,
                              }}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Link
                              to={`/product/${detail.bookId}`}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <LazyLoadImage
                                src={`${detail.image}?size=small`}
                                height={45}
                                width={45}
                                style={{ marginRight: "10px" }}
                                placeholder={
                                  <Skeleton
                                    width={45}
                                    height={45}
                                    animation={false}
                                    variant="rectangular"
                                  />
                                }
                              />
                              <Box>
                                <ItemTitle>{detail.bookTitle}</ItemTitle>
                                <ItemTitle className="secondary">
                                  ID: {idFormatter(detail.bookId)}
                                </ItemTitle>
                              </Box>
                            </Link>
                          </TableCell>
                          <TableCell>
                            {detail.price.toLocaleString()}đ
                          </TableCell>
                          <TableCell align="left">
                            <Box>
                              <ItemTitle>
                                Thành tiền:{" "}
                                {Math.round(
                                  detail.amount * detail.price,
                                ).toLocaleString()}
                                đ
                              </ItemTitle>
                              <ItemTitle className="secondary">
                                Số lượng: {detail.amount}
                              </ItemTitle>
                            </Box>
                          </TableCell>
                          <TableCell align="left">
                            <Chip
                              label={itemStatus.status}
                              color={itemStatus.color}
                              sx={{ fontWeight: "bold" }}
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}

export default function TableOrders({ setOrderCount, mini = false }) {
  //#region construct
  const [selected, setSelected] = useState([]);
  const [deselected, setDeseletected] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]); //For counting elements in table toolbar
  const [deselectedOrder, setDeselectedOrder] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [dense, setDense] = useState(true);
  const [pagination, setPagination] = useState({
    currPage: 0,
    pageSize: mini ? 5 : 10,
    totalPages: 0,
    sortBy: "id",
    sortDir: "asc",
  });

  //Fetch receipts
  const { data, isLoading, isSuccess, isError, error } = useGetReceiptsQuery({
    page: pagination?.number,
    size: pagination?.size,
    sortBy: pagination?.sortBy,
    sortDir: pagination?.sortDir,
  });

  //Set pagination after fetch
  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      setPagination({
        ...pagination,
        totalPages: data?.page?.totalPages,
        currPage: data?.page?.number,
        pageSize: data?.page?.size,
      });
      if (setOrderCount) setOrderCount(data?.page?.totalElements);
    }
  }, [data]);

  const handleRequestSort = (e, property) => {
    const isAsc =
      pagination.sortBy === property && pagination.sortDir === "asc";
    const sortDir = isAsc ? "desc" : "asc";
    setPagination({ ...pagination, sortBy: property, sortDir: sortDir });
  };

  const handleSelectAllClick = (e) => {
    setSelected([]);
    setDeseletected([]);
    setSelectedOrder([]);
    setDeselectedOrder([]);

    if (e.target.checked) {
      //Selected all
      setSelectedAll(true);
    } else {
      //Unselected all
      setSelectedAll(false);
    }
  };

  const onSelectAllDetail = (e, order) => {
    //A coding disaster T_T
    //Determines which boxes gonna change
    let newSelected = [];
    let newDeselected = [];
    let changed = order?.details;
    changed = changed
      .filter((detail) => e.target.checked !== isSelected(detail.id))
      .map((detail) => detail.id);

    if (e.target.checked) {
      //If check all the empty boxes
      if (selectedAll) {
        //Remove boxes from deselected[]
        newDeselected = deselected;
        newDeselected = newDeselected.filter(
          (id) => changed.indexOf(id) === -1,
        );

        setDeseletected(newDeselected);
      } else {
        //Add new boxes to selected[]
        newSelected = selected.concat(changed);
        newSelected = [...new Set(newSelected)];

        setSelected(newSelected);
      }
    } else {
      //Uncheck all selected boxes
      if (selectedAll) {
        //Add boxes to deselected[]
        newDeselected = deselected.concat(changed);
        newDeselected = [...new Set(newDeselected)];

        setDeseletected(newDeselected);
      } else {
        //Remove boxes from selected[]
        let newSelected = selected;
        newSelected = newSelected.filter((id) => changed.indexOf(id) === -1);

        setSelected(newSelected);
      }
    }

    const isOrderSelected =
      order?.details.forEach(function (detail) {
        detail?.items.some((detail) => newSelected?.includes(detail.id));
      }) ||
      (selectedAll &&
        order?.details.forEach(function (detail) {
          detail?.items.some((detail) => !newDeselected?.includes(detail.id));
        }));
    handleSelectedOrder(order.id, isOrderSelected);
  };

  const handleClick = (order, id) => {
    let newDeselected = [];
    let newSelected = [];

    if (selectedAll) {
      //Set unselected elements for reverse
      const deselectedIndex = deselected?.indexOf(id);

      if (deselectedIndex === -1) {
        newDeselected = newDeselected.concat(deselected, id);
      } else if (deselectedIndex === 0) {
        newDeselected = newDeselected.concat(deselected.slice(1));
      } else if (deselectedIndex === deselected?.length - 1) {
        newDeselected = newDeselected.concat(deselected.slice(0, -1));
      } else if (deselectedIndex > 0) {
        newDeselected = newDeselected.concat(
          deselected.slice(0, deselectedIndex),
          deselected.slice(deselectedIndex + 1),
        );
      }
      setDeseletected(newDeselected);
    } else {
      //Set main selected elements
      const selectedIndex = selected?.indexOf(id);

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected?.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      setSelected(newSelected);
    }

    const isOrderSelected =
      order?.details.forEach(function (detail) {
        detail?.items.some((detail) => newSelected?.includes(detail.id));
      }) ||
      (selectedAll &&
        order?.details.forEach(function (detail) {
          detail?.items.some((detail) => !newDeselected?.includes(detail.id));
        }));
    handleSelectedOrder(order.id, isOrderSelected);
  };

  const handleSelectedOrder = (orderId, isOrderSelected) => {
    if (selectedAll) {
      const deselectedIndex = deselectedOrder?.indexOf(orderId);
      let newDeselected = [];

      if (isOrderSelected) {
        if (deselectedIndex === 0) {
          newDeselected = newDeselected.concat(deselectedOrder.slice(1));
        } else if (deselectedIndex === deselectedOrder?.length - 1) {
          newDeselected = newDeselected.concat(deselectedOrder.slice(0, -1));
        } else if (deselectedIndex > 0) {
          newDeselected = newDeselected.concat(
            deselectedOrder.slice(0, deselectedIndex),
            deselectedOrder.slice(deselectedIndex + 1),
          );
        } else {
          newDeselected = newDeselected.concat(deselectedOrder);
        }
      } else {
        newDeselected = newDeselected.concat(deselectedOrder, orderId);
      }

      setDeselectedOrder(newDeselected);
      if (newDeselected.length == data?.page?.totalElements) {
        setDeselectedOrder([]);
        setSelectedAll(false);
      }
    } else {
      const selectedIndex = selectedOrder?.indexOf(orderId);
      let newSelected = [];

      if (isOrderSelected) {
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selectedOrder, orderId);
        } else {
          newSelected = newSelected.concat(selectedOrder);
        }
      } else {
        if (selectedIndex === 0) {
          newSelected = newSelected.concat(selectedOrder.slice(1));
        } else if (selectedIndex === selectedOrder?.length - 1) {
          newSelected = newSelected.concat(selectedOrder.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selectedOrder.slice(0, selectedIndex),
            selectedOrder.slice(selectedIndex + 1),
          );
        } else {
          newSelected = newSelected.concat(selectedOrder);
        }
      }

      setSelectedOrder(newSelected);
      if (newSelected.length == data?.page?.totalElements) {
        setSelectedOrder(true);
        setSelected([]);
      }
    }
  };

  const handleChangePage = (page) => {
    setPagination({ ...pagination, currPage: page });
  };

  const handleChangeRowsPerPage = (size) => {
    handleChangePage(0);
    const newValue = parseInt(size, 10);
    setPagination({ ...pagination, pageSize: newValue });
  };

  const handleChangeDense = (e) => {
    setDense(e.target.checked);
  };

  const isSelected = (id) =>
    selected?.indexOf(id) !== -1 ||
    (selectedAll && deselected?.indexOf(id) === -1);
  const isOrderSelected = (orderId) =>
    selectedOrder?.indexOf(orderId) !== -1 ||
    (selectedAll && deselectedOrder?.indexOf(orderId) === -1);
  const numSelected = () =>
    selectedAll
      ? data?.page?.totalElements - [...new Set(deselectedOrder)]?.length
      : [...new Set(selectedOrder)]?.length;
  const colSpan = () =>
    mini
      ? headCells.filter((h) => !h.hideOnMinimize).length
      : headCells.length + 1;
  //#endregion

  let orderRows;

  if (isLoading) {
    orderRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan()}
          sx={{ position: "relative", height: "40dvh" }}
        >
          <Progress color="primary" />
        </TableCell>
      </TableRow>
    );
  } else if (isSuccess) {
    const { ids, entities } = data;

    orderRows = ids?.length ? (
      ids?.map((id, index) => {
        const order = entities[id];

        return (
          <OrderRow
            key={index}
            {...{
              index,
              id,
              order,
              isSelected,
              isOrderSelected,
              dense,
              handleClick,
              onSelectAllDetail,
              colSpan,
              mini,
            }}
          />
        );
      })
    ) : (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan()}
          sx={{ height: "40dvh" }}
        >
          <Box>Không tìm thấy đơn hàng nào!</Box>
        </TableCell>
      </TableRow>
    );
  } else if (isError) {
    orderRows = (
      <TableRow>
        <TableCell
          scope="row"
          padding="none"
          align="center"
          colSpan={colSpan()}
          sx={{ height: "40dvh" }}
        >
          <Box>{error?.error || "Đã xảy ra lỗi"}</Box>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        {" "}
        <FilterContent />
      </Toolbar>
      <TableContainer sx={{ maxHeight: mini ? 330 : "auto" }}>
        <Table
          stickyHeader
          sx={{ minWidth: mini ? 500 : 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <CustomTableHead
            headCells={headCells}
            numSelected={numSelected()}
            sortBy={pagination.sortBy}
            sortDir={pagination.sortDir}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            selectedAll={selectedAll}
            mini={mini}
          />
          <TableBody>{orderRows}</TableBody>
        </Table>
      </TableContainer>
      <FooterContainer>
        {mini ? (
          <Link to={"/order"}>Xem tất cả</Link>
        ) : (
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label={<FooterLabel>Thu gọn</FooterLabel>}
          />
        )}
        <CustomTablePagination
          pagination={pagination}
          onPageChange={handleChangePage}
          onSizeChange={handleChangeRowsPerPage}
          count={data?.page?.totalElements ?? 0}
        />
      </FooterContainer>
    </TableContainer>
  );
}
