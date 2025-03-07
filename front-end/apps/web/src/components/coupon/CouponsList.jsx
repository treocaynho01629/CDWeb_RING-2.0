import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardArrowLeft,
  LocalActivityOutlined,
  Loyalty,
} from "@mui/icons-material";
import {
  CircularProgress,
  DialogContent,
  TextField,
  Grid2 as Grid,
} from "@mui/material";
import {
  MessageContainer,
  StyledDialogTitle,
  LoadContainer,
  PlaceholderContainer,
  MainContainer,
  StyledEmptyIcon,
  ToggleGroupContainer,
} from "../custom/ProfileComponents";
import { Link, useSearchParams } from "react-router";
import { CustomTab, CustomTabs } from "../custom/CustomTabs";
import { debounce } from "lodash-es";
import { Message } from "@ring/ui/Components";
import { useDeepEffect, couponTypes, couponTypeItems } from "@ring/shared";
import { useGetCouponsQuery } from "../../features/coupons/couponsApiSlice";
import { trackWindowScroll } from "react-lazy-load-image-component";
import CouponItem from "./CouponItem";
import useCoupon from "../../hooks/useCoupon";

const defaultSize = 10;
const couponItems = [
  {
    label: "Đã lưu",
    filter: {
      saved: true,
    },
  },
  {
    label: "RING!",
    filter: {
      byShop: false,
    },
  },
  {
    label: "Cửa hàng",
    filter: {
      byShop: true,
    },
  },
];

couponTypeItems.forEach((item) => {
  couponItems.push({
    label: item.label,
    filter: {
      types: [item.value],
    },
  });
});

const CouponsList = ({ scrollPosition, tabletMode }) => {
  const { coupons: savedCoupons } = useCoupon();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  //Filters
  const [tab, setTab] = useState(searchParams.get("tab") ?? "");
  const [filters, setFilters] = useState({
    ...couponItems[tab]?.filter,
    code: searchParams.get("q") ?? "",
  });
  const [pagination, setPagination] = useState({
    number: 0,
    size: defaultSize,
    totalPages: 0,
    isMore: true,
  });

  //Fetch coupons
  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetCouponsQuery({
      byShop: filters.byShop,
      code: filters.code,
      types: filters.types ?? "",
      codes: filters.saved
        ? savedCoupons?.length > 0
          ? savedCoupons
          : ["temp"]
        : [],
      page: pagination?.number,
      size: pagination?.size,
      loadMore: pagination?.isMore,
    });

  useDeepEffect(() => {
    updatePath();
  }, [filters]);

  useEffect(() => {
    setFilters((prev) => ({
      ...couponItems[tab]?.filter,
      code: prev.code,
    }));
    updatePath();
  }, [tab]);

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
  const handleChangeTab = useCallback((e, newValue) => {
    setTab(newValue);
    handleResetPagination();
  }, []);

  const handleChangeCode = useCallback((e) => {
    e.preventDefault();
    if (inputRef)
      setFilters((prev) => ({ ...prev, code: inputRef.current.value }));
    handleResetPagination();
  }, []);

  const handleResetPagination = useCallback(() => {
    setPagination((prev) => ({ ...prev, number: 0 }));
    scrollToTop();
  }, []);

  //Search params
  const updatePath = () => {
    tab === "" ? searchParams.delete("tab") : searchParams.set("tab", tab);
    filters?.code == ""
      ? searchParams.delete("q")
      : searchParams.set("q", filters.code);
    setSearchParams(searchParams, { replace: true });
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

  useEffect(() => {
    if (tabletMode) {
      window.removeEventListener("scroll", windowScrollListener);
    } else {
      window.addEventListener("scroll", windowScrollListener);
    }

    return () => {
      window.removeEventListener("scroll", windowScrollListener);
    };
  }, [tabletMode]);

  let couponsContent;

  if (isLoading || (isFetching && pagination.number == 0)) {
    couponsContent = (
      <PlaceholderContainer>
        <LoadContainer>
          <CircularProgress color="primary" />
        </LoadContainer>
      </PlaceholderContainer>
    );
  } else if (isSuccess) {
    const { ids, entities } = data;

    couponsContent = ids?.length ? (
      ids?.map((id, index) => {
        const coupon = entities[id];
        const summary = couponTypes[coupon?.type];
        const isSaved = savedCoupons?.indexOf(coupon?.code) != -1;

        return (
          <Grid key={`coupon-${id}-${index}`} size={{ xs: 12, md_lg: 6 }}>
            <CouponItem
              {...{
                coupon,
                summary,
                isSaved,
                className: "display",
                scrollPosition,
              }}
            />
          </Grid>
        );
      })
    ) : (
      <MessageContainer>
        <Message>
          <StyledEmptyIcon />
          Không có mã giảm giá nào
        </Message>
      </MessageContainer>
    );
  } else if (isError) {
    couponsContent = (
      <MessageContainer>
        <Message color="error">{error?.error || "Đã xảy ra lỗi"}</Message>
      </MessageContainer>
    );
  }

  return (
    <>
      <StyledDialogTitle>
        <Link to={-1}>
          <KeyboardArrowLeft />
        </Link>
        <Loyalty />
        &nbsp;Mã giảm giá
      </StyledDialogTitle>
      <ToggleGroupContainer>
        <CustomTabs
          value={tab}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
        >
          <CustomTab label="Tất cả" value="" />
          {couponItems.map((tab, index) => (
            <CustomTab key={`tab-${index}`} label={tab.label} value={index} />
          ))}
        </CustomTabs>
      </ToggleGroupContainer>
      <DialogContent
        sx={{ py: 0, px: { xs: 0, sm: 2, md: 0 } }}
        onScroll={tabletMode ? scrollListener : undefined}
      >
        <form ref={scrollRef} onSubmit={handleChangeCode}>
          <TextField
            placeholder="Nhập mã giảm giá"
            autoComplete="code"
            id="code"
            size="small"
            defaultValue={searchParams.get("q")}
            inputRef={inputRef}
            fullWidth
            error={inputRef?.current?.value != filters.code}
            sx={{ py: { xs: 1, md: 2 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <LocalActivityOutlined
                    style={{ color: "gray", marginRight: "5px" }}
                  />
                ),
              },
            }}
          />
        </form>
        <MainContainer>
          <Grid container spacing={1}>
            {couponsContent}
          </Grid>
          {pagination.number > 0 && isFetching && (
            <LoadContainer>
              <CircularProgress size={30} color="primary" />
            </LoadContainer>
          )}
          {data?.ids?.length > 0 &&
            data?.ids?.length == data?.page?.totalElements && (
              <Message color="warning">Không còn mã giảm giá nào!</Message>
            )}
        </MainContainer>
      </DialogContent>
    </>
  );
};

export default trackWindowScroll(CouponsList);
