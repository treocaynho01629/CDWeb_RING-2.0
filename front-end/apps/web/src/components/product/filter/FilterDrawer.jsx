import styled from "@emotion/styled";
import {
  Fragment,
  useState,
  useEffect,
  memo,
  useRef,
  useCallback,
} from "react";
import {
  Button,
  Skeleton,
  Stack,
  DialogContent,
  DialogActions,
  DialogTitle,
  SwipeableDrawer,
  Collapse,
  Badge,
} from "@mui/material";
import {
  Check,
  FilterAltOff,
  CategoryOutlined,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { bookTypeItems } from "@ring/shared";
import { useGetCategoriesQuery } from "../../../features/categories/categoriesApiSlice";
import { useGetPublishersQuery } from "../../../features/publishers/publishersApiSlice";
import { suggestPrices } from "../../../ultils/filters";
import PriceRangeSlider from "./PriceRangeSlider";

//#region styled
const DrawerContainer = styled.div`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 550px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    max-width: 350px;
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  max-width: 250px;
`;

const Filter = styled.div``;

const FilterText = styled.h3`
  font-size: 16px;
  text-transform: capitalize;
  margin: 8px 0px;
  color: inherit;
  display: flex;
  align-items: center;
`;

const ContentText = styled.span`
  width: 100%;
  font-size: 14px;
  text-align: center;
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
`;

const SliderContainer = styled.div`
  width: 100%;
  padding: 0 8px;
`;

const StyledButton = styled.span`
  width: 48%;
  padding: 6px;
  background-color: ${({ theme }) => theme.palette.action.focus};
  border: 1px solid transparent;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: width 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }

  &.filled {
    width: calc(96% + ${({ theme }) => theme.spacing(1)});
  }

  &.expanded {
    width: calc(96% + ${({ theme }) => theme.spacing(1)});
    border-color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => theme.palette.action.hover};
  }

  &.checked {
    color: ${({ theme }) => theme.palette.primary.dark};
    background-color: ${({ theme }) => theme.palette.action.selected};
    border-color: ${({ theme }) => theme.palette.primary.main};
    border-style: dashed;
    font-weight: 450;
  }

  &.active {
    color: ${({ theme }) => theme.palette.primary.dark};
    background-color: ${({ theme }) => theme.palette.action.selected};
    border-color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 450;
  }
`;

const Showmore = styled.div`
  font-size: 14px;
  font-weight: 500;
  padding-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.info.main};
  cursor: pointer;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: 0;
  }
`;
//#endregion

const LIMIT_CATES = 4;
const LIMIT_PUBS = 4;

const CateFilter = memo(({ cateId, onChangeCate }) => {
  const [open, setOpen] = useState(false); //Open sub cate
  const [showmore, setShowmore] = useState(false);
  const childContainedRef = useRef(null);
  const [pagination, setPagination] = useState({
    isMore: true, //Merge new data
    number: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetCategoriesQuery({
      include: "children",
      page: pagination?.number,
      loadMore: pagination?.isMore,
    });

  useEffect(() => {
    if (data && !isLoading && isSuccess) {
      setPagination({
        ...pagination,
        number: data.page.number,
        totalPages: data.page.totalPages,
        totalElements: data.page.totalElements,
      });
    }
  }, [data]);

  //Open sub cate
  const handleCateChange = (cate) => {
    onChangeCate({ id: cate?.id ?? "", slug: cate?.slug ?? "" });
  };

  const handleClick = (e, id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    e.stopPropagation();
  };

  const handleShowMore = () => {
    let currPage = (pagination?.number || 0) + 1;
    if (pagination?.totalPages <= currPage) {
      setShowmore((prev) => !prev);
    } else {
      setPagination({ ...pagination, number: currPage });
      setShowmore(true);
    }
  };

  let isMore = pagination?.totalPages > (pagination?.number || 0) + 1;
  let isCollapsable = pagination?.totalElements > LIMIT_CATES;
  let containedSelected = () => {
    let checkId = childContainedRef.current || cateId;
    let cateIndex = data?.ids.indexOf(+checkId);
    return checkId && (cateIndex < 0 || cateIndex >= LIMIT_CATES);
  };
  let catesContent;

  if (isLoading || isError) {
    catesContent = [...Array(LIMIT_CATES)].map((item, index) => (
      <Fragment key={`temp-cate-${index}`}>
        <Skeleton variant="rectangular" height={38} width="48%" />
      </Fragment>
    ));
  } else if (isSuccess) {
    const { ids, entities } = data;

    if (ids?.length) {
      let limitContent = [];
      let collapseContent = [];

      ids?.forEach((id, index) => {
        const cate = entities[id];
        const containedSelected =
          cate?.children && cate?.children.some((child) => child.id == cateId);
        if (containedSelected) childContainedRef.current = id;
        const item = (
          <Fragment key={`cate-${id}-${index}`}>
            <StyledButton
              className={`${cateId == id ? "active" : ""}${open[id] ? " expanded" : ""}`}
              onClick={() => handleCateChange(cate)}
            >
              <ContentText>{cate?.name}</ContentText>
              {cate.children?.length ? (
                open[id] ? (
                  <ExpandLess onClick={(e) => handleClick(e, id)} />
                ) : (
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!containedSelected}
                  >
                    <ExpandMore onClick={(e) => handleClick(e, id)} />
                  </Badge>
                )
              ) : null}
            </StyledButton>
            {cate?.children && (
              <Collapse
                in={open[id]}
                sx={{ width: "100%" }}
                timeout="auto"
                unmountOnExit
              >
                <Stack
                  spacing={{ xs: 1 }}
                  direction="row"
                  useFlexGap
                  flexWrap="wrap"
                >
                  {cate.children?.map((child, subIndex) => (
                    <StyledButton
                      key={`${child?.id}-${subIndex}`}
                      className={cateId == child?.id ? "active" : ""}
                      onClick={() => handleCateChange(child)}
                    >
                      <ContentText>{child?.name}</ContentText>
                    </StyledButton>
                  ))}
                </Stack>
              </Collapse>
            )}
          </Fragment>
        );

        if (index < LIMIT_CATES) {
          limitContent.push(item);
        } else {
          collapseContent.push(item);
        }
      });

      catesContent = (
        <>
          {limitContent}
          <Collapse
            in={showmore}
            sx={{ width: "100%" }}
            timeout="auto"
            unmountOnExit
          >
            <Stack
              spacing={{ xs: 1 }}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              {collapseContent}
            </Stack>
          </Collapse>
        </>
      );
    } else {
      catesContent = [...Array(LIMIT_CATES)].map((item, index) => (
        <Fragment key={`temp-cate-${index}`}>
          <Skeleton variant="rectangular" height={38} width="48%" />
        </Fragment>
      ));
    }
  }

  return (
    <Filter>
      <TitleContainer>
        <FilterText>
          <CategoryOutlined />
          &nbsp;Danh mục
        </FilterText>
      </TitleContainer>
      <Stack spacing={{ xs: 1 }} direction="row" useFlexGap flexWrap="wrap">
        {catesContent}
        {isFetching && !isLoading && (
          <>
            <Skeleton variant="rectangular" height={38} width="48%" />
            <Skeleton variant="rectangular" height={38} width="48%" />
          </>
        )}
      </Stack>
      {!isFetching && isCollapsable && (
        <Showmore onClick={handleShowMore}>
          {!showmore || isMore ? (
            <>
              Xem thêm
              <Badge
                color="primary"
                variant="dot"
                invisible={!containedSelected()}
              >
                <ExpandMore />
              </Badge>
            </>
          ) : (
            <>
              Ẩn bớt <ExpandLess />
            </>
          )}
        </Showmore>
      )}
    </Filter>
  );
});

const PublisherFilter = memo(({ pubs, onChangePub }) => {
  const [selectedPub, setSelectedPub] = useState(pubs || []);
  const [showmore, setShowmore] = useState(false);
  const [pagination, setPagination] = useState({
    isMore: true, //Merge new data
    number: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetPublishersQuery({
      page: pagination?.number,
      loadMore: pagination?.isMore,
    });

  useEffect(() => {
    setSelectedPub(pubs);
  }, [pubs]);

  useEffect(() => {
    if (data && !isLoading && isSuccess) {
      setPagination({
        ...pagination,
        number: data.page.number,
        totalPages: data.page.totalPages,
        totalElements: data.page.totalElements,
      });
    }
  }, [data]);

  //Change pub
  const handleChangePub = (id) => {
    const selectedIndex = selectedPub.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedPub, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedPub.slice(1));
    } else if (selectedIndex === selectedPub.length - 1) {
      newSelected = newSelected.concat(selectedPub.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedPub.slice(0, selectedIndex),
        selectedPub.slice(selectedIndex + 1)
      );
    }

    setSelectedPub(newSelected);
    handleUpdatePubs(newSelected);
  };

  const handleUpdatePubs = (newSelected) => {
    if (onChangePub) onChangePub(newSelected);
  };

  const handleShowMore = () => {
    let currPage = (pagination?.number || 0) + 1;
    if (pagination?.totalPages <= currPage) {
      setShowmore((prev) => !prev);
    } else {
      setPagination({ ...pagination, number: currPage });
      setShowmore(true);
    }
  };

  const isSelected = (id) => selectedPub.indexOf(id) !== -1;
  let isMore = pagination?.totalPages > (pagination?.number || 0) + 1;
  let isCollapsable = pagination?.totalElements > LIMIT_PUBS;
  let containedSelected = false;
  let isContained = (id) => {
    let pubIndex = data?.ids?.indexOf(id);
    return selectedPub?.length && (pubIndex < 0 || pubIndex >= LIMIT_PUBS);
  };
  let pubsContent;

  if (isLoading || isError) {
    pubsContent = [...Array(LIMIT_PUBS)].map((item, index) => (
      <Fragment key={`pub-temp-${index}`}>
        <Skeleton variant="rectangular" height={38} width="48%" />
      </Fragment>
    ));
  } else if (isSuccess) {
    const { ids, entities } = data;

    if (ids?.length) {
      let limitContent = [];
      let collapseContent = [];

      ids?.forEach((id, index) => {
        const pub = entities[id];
        const isItemSelected = isSelected(id);
        if (isItemSelected && !containedSelected)
          containedSelected = isContained(id);

        const item = (
          <StyledButton
            key={`pub-${id}-${index}`}
            className={isItemSelected ? "checked" : ""}
            onClick={() => handleChangePub(id)}
          >
            <ContentText>{pub?.name}</ContentText>
          </StyledButton>
        );

        if (index < LIMIT_PUBS) {
          limitContent.push(item);
        } else {
          collapseContent.push(item);
        }
      });

      pubsContent = (
        <>
          {limitContent}
          <Collapse
            in={showmore}
            sx={{ width: "100%" }}
            timeout="auto"
            unmountOnExit
          >
            <Stack
              spacing={{ xs: 1 }}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              {collapseContent}
            </Stack>
          </Collapse>
        </>
      );
    } else {
      pubsContent = [...Array(LIMIT_PUBS)].map((item, index) => (
        <Fragment key={`temp-pub-${index}`}>
          <Skeleton variant="rectangular" height={38} width="48%" />
        </Fragment>
      ));
    }
  }

  return (
    <Filter>
      <TitleContainer>
        <FilterText>Nhà xuất bản</FilterText>
      </TitleContainer>
      <Stack spacing={{ xs: 1 }} direction="row" useFlexGap flexWrap="wrap">
        {pubsContent}
        {isFetching && !isLoading && (
          <>
            <Skeleton variant="rectangular" height={38} width="48%" />
            <Skeleton variant="rectangular" height={38} width="48%" />
          </>
        )}
      </Stack>
      {!isFetching && isCollapsable && (
        <Showmore onClick={handleShowMore}>
          {!showmore || isMore ? (
            <>
              Xem thêm
              <Badge
                color="primary"
                variant="dot"
                invisible={!containedSelected}
              >
                <ExpandMore />
              </Badge>
            </>
          ) : (
            <>
              Ẩn bớt <ExpandLess />
            </>
          )}
        </Showmore>
      )}
    </Filter>
  );
});

const RangeFilter = memo(({ value, onChangeRange }) => {
  const [valueInput, setValueInput] = useState(value || [0, 10000000]);

  //Change
  const handleUpdateRange = (newValue) => {
    if (onChangeRange) onChangeRange(newValue);
  };
  const handleTouchDrag = (e) => {
    e.nativeEvent.defaultMuiPrevented = true;
  }; //Prevent drag slider along with drawer
  const handleChangeRange = (value) => {
    setValueInput(value);
    handleUpdateRange(value);
  };

  const isSelected = (currValue) =>
    valueInput[0] == currValue[0] && valueInput[1] == currValue[1];

  return (
    <Filter>
      <TitleContainer>
        <FilterText>Khoảng giá</FilterText>
      </TitleContainer>
      <Stack spacing={{ xs: 1 }} direction="row" useFlexGap flexWrap="wrap">
        {suggestPrices.map((option, index) => {
          const isItemSelected = isSelected(option.value);

          return (
            <StyledButton
              key={`range-${index}`}
              className={`${isItemSelected ? "active" : ""}${index + 1 == suggestPrices.length ? " filled" : ""}`}
              onClick={() => handleChangeRange(option.value)}
            >
              <ContentText>{option.label}</ContentText>
            </StyledButton>
          );
        })}
        <SliderContainer onTouchStart={handleTouchDrag}>
          <PriceRangeSlider
            {...{
              value: valueInput,
              onChange: handleChangeRange,
              disabledLabel: true,
            }}
          />
        </SliderContainer>
      </Stack>
    </Filter>
  );
});

const TypeFilter = memo(({ types, onChangeType }) => {
  const [selectedType, setSelectedType] = useState(types || []);

  const handleChangeType = (value) => {
    const selectedIndex = selectedType.indexOf(value);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedType, value);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedType.slice(1));
    } else if (selectedIndex === selectedType.length - 1) {
      newSelected = newSelected.concat(selectedType.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedType.slice(0, selectedIndex),
        selectedType.slice(selectedIndex + 1)
      );
    }

    setSelectedType(newSelected);
    handleUpdateType(newSelected);
  };

  const handleUpdateType = (newSelected) => {
    if (onChangeType) onChangeType(newSelected);
  };
  const isSelected = (type) => selectedType.indexOf(type) !== -1;

  return (
    <Filter>
      <TitleContainer>
        <FilterText>Hình thức bìa</FilterText>
      </TitleContainer>
      <Stack spacing={{ xs: 1 }} direction="row" useFlexGap flexWrap="wrap">
        {bookTypeItems.map((option, index) => {
          const isItemSelected = isSelected(option.value);

          return (
            <StyledButton
              key={`type-${index}`}
              className={isItemSelected ? "checked" : ""}
              onClick={() => handleChangeType(option.value)}
            >
              <ContentText>{option.label}</ContentText>
            </StyledButton>
          );
        })}
      </Stack>
    </Filter>
  );
});

const RateFilter = memo(({ rating, onChangeRate }) => {
  const handleChangeRate = (value) => {
    if (onChangeRate) onChangeRate(value);
  };

  return (
    <Filter>
      <TitleContainer>
        <FilterText>Đánh giá</FilterText>{" "}
      </TitleContainer>
      <Stack spacing={{ xs: 1 }} direction="row" useFlexGap flexWrap="wrap">
        {[...Array(5)].map((item, index) => {
          const isItemSelected = index + 1 == rating;

          return (
            <StyledButton
              key={`type-${index}`}
              className={isItemSelected ? "active" : ""}
              onClick={() => handleChangeRate(index + 1)}
            >
              <ContentText>{`${index < 4 ? "Từ" : ""} ${index + 1} sao`}</ContentText>
            </StyledButton>
          );
        })}
      </Stack>
    </Filter>
  );
});

const FilterDrawer = ({
  filters,
  setFilters,
  resetFilter,
  open,
  handleClose,
  handleOpen,
}) => {
  const [currFilters, setCurrFilters] = useState(filters);

  //Update
  useEffect(() => {
    setCurrFilters(filters);
  }, [filters]);

  const onChangeCate = useCallback((newValue) => {
    setCurrFilters((prev) => ({
      ...prev,
      cate: prev.cate.id == newValue?.id ? { id: "", slug: "" } : newValue,
    }));
  }, []);
  const onChangePub = useCallback((newValue) => {
    setCurrFilters((prev) => ({ ...prev, pubIds: newValue }));
  }, []);
  const onChangeRange = useCallback((newValue) => {
    setCurrFilters((prev) => ({ ...prev, value: newValue }));
  }, []);
  const onChangeType = useCallback((newValue) => {
    setCurrFilters((prev) => ({ ...prev, types: newValue }));
  }, []);
  const onChangeRate = useCallback((newValue) => {
    setCurrFilters((prev) => ({
      ...prev,
      rating: prev.rating == newValue ? "" : newValue,
    }));
  }, []);

  //Apply
  const applyFilter = () => {
    handleClose();
    setFilters(currFilters);
  };

  const handleResetFilter = () => {
    handleClose();
    resetFilter();
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      disableBackdropTransition
      disableDiscovery
      swipeAreaWidth={8}
      disableSwipeToOpen={false}
    >
      <DrawerContainer>
        <DialogTitle>BỘ LỌC</DialogTitle>
        <DialogContent
          dividers
          sx={{ px: 2, py: 1, flex: "1 1 auto", overflowY: "auto" }}
        >
          <CateFilter {...{ cateId: currFilters?.cate.id, onChangeCate }} />
          <PublisherFilter {...{ pubs: currFilters?.pubIds, onChangePub }} />
          <RangeFilter {...{ value: currFilters?.value, onChangeRange }} />
          <TypeFilter {...{ types: currFilters?.types, onChangeType }} />
          <RateFilter {...{ rating: currFilters?.rating, onChangeRate }} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={handleResetFilter}
            startIcon={<FilterAltOff />}
          >
            Xoá bộ lọc
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={applyFilter}
            startIcon={<Check />}
          >
            Áp dụng
          </Button>
        </DialogActions>
      </DrawerContainer>
    </SwipeableDrawer>
  );
};

export default FilterDrawer;
