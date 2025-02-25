import styled from "@emotion/styled";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  useCancelOrderMutation,
  useGetOrdersByUserQuery,
} from "../../features/orders/ordersApiSlice";
import { KeyboardArrowLeft, Receipt, Search } from "@mui/icons-material";
import { CircularProgress, DialogContent, TextField } from "@mui/material";
import { StyledDialogTitle } from "../custom/ProfileComponents";
import { Link, useSearchParams } from "react-router";
import { booksApiSlice } from "../../features/books/booksApiSlice";
import { CustomTab, CustomTabs } from "../custom/CustomTabs";
import { debounce } from "lodash-es";
import { ReactComponent as EmptyIcon } from "@ring/shared/assets/empty";
import { Message } from "@ring/ui/Components";
import { useDeepEffect, orderItems } from "@ring/shared";
import { LoadContainer, PlaceholderContainer } from "../custom/OrderComponents";
import useCart from "../../hooks/useCart";
import OrderItem from "./OrderItem";

//#region styled
const MessageContainer = styled.div`
  min-height: 60dvh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrdersContainer = styled.div`
  min-height: 70dvh;
`;

const ToggleGroupContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  white-space: nowrap;
  position: sticky;
  top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16.5}px;
  z-index: 1;

  ${({ theme }) => theme.breakpoints.down("md")} {
    top: 0;

    &::before,
    ::after {
      display: none;
    }
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: -16px;
    width: 100%;
    height: calc(100% + 16px);
    background-color: ${({ theme }) => theme.palette.background.paper};
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.action.hover};
    z-index: -1;
  }
`;

const StyledEmptyIcon = styled(EmptyIcon)`
  height: 70px;
  width: 70px;
  margin: ${({ theme }) => theme.spacing(1)} 0;
  fill: ${({ theme }) => theme.palette.text.icon};
`;
//#endregion

const defaultSize = 5;

const OrdersList = ({ pending, setPending, setContextOrder, confirm }) => {
  const { addProduct } = useCart();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get("status") ?? "",
    keyword: searchParams.get("q") ?? "",
  });
  const [pagination, setPagination] = useState({
    number: 0,
    size: defaultSize,
    totalPages: 0,
    isMore: true,
  });

  //Fetch orders
  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetOrdersByUserQuery({
      status: filters?.status,
      keyword: filters?.keyword,
      page: pagination?.number,
      size: pagination?.size,
      loadMore: pagination?.isMore,
    });
  const [getBought, { isLoading: fetching }] =
    booksApiSlice.useLazyGetBooksByIdsQuery();
  const [cancel, { isLoading: canceling }] = useCancelOrderMutation();

  useDeepEffect(() => {
    updatePath();
  }, [filters]);

  useEffect(() => {
    if (data && !isLoading && isSuccess) {
      setPagination({
        ...pagination,
        number: data.page.number,
        totalPages: data.page.totalPages,
      });
    }
  }, [data]);

  const scrollToTop = useCallback(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  //Change tab
  const handleChangeStatus = useCallback((e, newValue) => {
    setFilters((prev) => ({ ...prev, status: newValue }));
    handleResetPagination();
  }, []);

  const handleChangeKeyword = useCallback((e) => {
    e.preventDefault();
    if (inputRef)
      setFilters((prev) => ({ ...prev, keyword: inputRef.current.value }));
    handleResetPagination();
  }, []);

  const handleResetPagination = useCallback(() => {
    setPagination((prev) => ({ ...prev, number: 0 }));
    scrollToTop();
  }, []);

  //Search params
  const updatePath = () => {
    filters?.status == ""
      ? searchParams.delete("status")
      : searchParams.set("status", filters.status);
    filters?.keyword == ""
      ? searchParams.delete("q")
      : searchParams.set("q", filters.keyword);
    setSearchParams(searchParams);
  };

  //Rebuy
  const handleAddToCart = async (detail) => {
    if (canceling || fetching || pending) return;
    setPending(true);

    const { enqueueSnackbar } = await import("notistack");

    const ids = detail?.items?.map((item) => item.bookId);
    getBought(ids) //Fetch books with new info
      .unwrap()
      .then((books) => {
        const { ids, entities } = books;

        ids.forEach((id) => {
          const book = entities[id];
          if (book.amount > 0) {
            //Check for stock
            addProduct(book, 1);
          } else {
            enqueueSnackbar("Sản phẩm đã hết hàng!", { variant: "error" });
          }
        });
        setPending(false);
      })
      .catch((rejected) => {
        console.error(rejected);
        enqueueSnackbar("Mua lại sản phẩm thất bại!", { variant: "error" });
        setPending(false);
      });
  };

  //Cancel
  const handleCancelOrder = async (order) => {
    setContextOrder(order);
    const confirmation = await confirm();
    if (confirmation) {
      if (canceling || fetching || pending) return;
      setPending(true);

      const { enqueueSnackbar } = await import("notistack");

      cancel(order?.id)
        .unwrap()
        .then((data) => {
          enqueueSnackbar("Huỷ đơn hàng thành công!", { variant: "success" });
          setPending(false);
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar("Huỷ đơn hàng thất bại!", { variant: "error" });
          setPending(false);
        });
    } else {
      setContextOrder(null);
      console.log("Cancel");
    }
  };

  //Show more
  const handleShowMore = () => {
    if (
      isFetching ||
      typeof data?.page?.number !== "number" ||
      data?.page?.number < pagination?.number
    )
      return;
    const nextPage = data?.page?.number + 1;
    if (nextPage < data?.page?.totalPages)
      setPagination((prev) => ({ ...prev, number: nextPage }));
  };

  const handleWindowScroll = (e) => {
    const trigger =
      document.body.scrollHeight - 300 < window.scrollY + window.innerHeight;
    if (trigger) handleShowMore();
  };

  const handleScroll = (e) => {
    const trigger =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (trigger) handleShowMore();
  };

  const windowScrollListener = useCallback(debounce(handleWindowScroll, 500), [
    data,
  ]);
  const scrollListener = useCallback(debounce(handleScroll, 500), [data]);

  window.addEventListener("scroll", windowScrollListener);

  let ordersContent;

  if (isLoading || (isFetching && pagination.number == 0)) {
    ordersContent = (
      <PlaceholderContainer>
        <LoadContainer>
          <CircularProgress color="primary" />
        </LoadContainer>
      </PlaceholderContainer>
    );
  } else if (isSuccess) {
    const { ids, entities } = data;

    ordersContent = ids?.length ? (
      ids?.map((id, index) => {
        const order = entities[id];

        return (
          <Fragment key={`order-${id}-${index}`}>
            <OrderItem {...{ order, handleAddToCart, handleCancelOrder }} />
          </Fragment>
        );
      })
    ) : (
      <MessageContainer>
        <Message>
          <StyledEmptyIcon />
          Chưa có đơn hàng nào
        </Message>
      </MessageContainer>
    );
  } else if (isError) {
    ordersContent = (
      <MessageContainer>
        <Message color="error">{error?.error || "Đã xảy ra lỗi"}</Message>
      </MessageContainer>
    );
  }

  return (
    <>
      <StyledDialogTitle>
        <Link to={"/profile/detail"}>
          <KeyboardArrowLeft />
        </Link>
        <Receipt />
        &nbsp;Đơn hàng của bạn
      </StyledDialogTitle>
      <ToggleGroupContainer>
        <CustomTabs
          value={filters.status}
          onChange={handleChangeStatus}
          variant="scrollable"
          scrollButtons={false}
        >
          <CustomTab label="Tất cả" value="" />
          {orderItems.map((tab, index) => (
            <CustomTab
              key={`tab-${index}`}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </CustomTabs>
      </ToggleGroupContainer>
      <DialogContent
        sx={{ py: 0, px: { xs: 0, sm: 2, md: 0 } }}
        onScroll={scrollListener}
      >
        <form ref={scrollRef} onSubmit={handleChangeKeyword}>
          <TextField
            placeholder="Tìm theo Mã, Tên Shop hoặc Tên sản phẩm"
            autoComplete="order"
            id="order"
            size="small"
            defaultValue={searchParams.get("q")}
            inputRef={inputRef}
            fullWidth
            error={inputRef?.current?.value != filters.keyword}
            sx={{ py: { xs: 1, md: 2 } }}
            slotProps={{
              input: {
                startAdornment: <Search sx={{ marginRight: 1 }} />,
              },
            }}
          />
        </form>
        <OrdersContainer>
          {ordersContent}
          {pagination.number > 0 && isFetching && (
            <LoadContainer>
              <CircularProgress size={30} color="primary" />
            </LoadContainer>
          )}
          {data?.ids?.length > 0 &&
            data?.ids?.length == data?.page?.totalElements && (
              <Message color="warning">Không còn đơn hàng nào!</Message>
            )}
        </OrdersContainer>
      </DialogContent>
    </>
  );
};

export default OrdersList;
