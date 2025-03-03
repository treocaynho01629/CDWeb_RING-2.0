import styled from "@emotion/styled";
import {
  useState,
  useEffect,
  Fragment,
  memo,
  useCallback,
  useRef,
} from "react";
import {
  Button,
  Divider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  List,
  ListItemButton,
  Collapse,
  Skeleton,
  Stack,
  Badge,
  Radio,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  FilterAltOff,
  Star,
  StarBorder,
  CategoryOutlined,
} from "@mui/icons-material";
import { bookTypeItems } from "@ring/shared";
import { useGetCategoriesQuery } from "../../../features/categories/categoriesApiSlice";
import { useGetPublishersQuery } from "../../../features/publishers/publishersApiSlice";
import { debounce } from "lodash-es";
import { suggestPrices } from "../../../ultils/filters";
import CustomDivider from "../../custom/CustomDivider";
import PriceRangeSlider from "./PriceRangeSlider";

//#region styled
const FilterWrapper = styled.div``;

const TitleContainer = styled.div`
  width: 100%;
`;

const Filter = styled.div`
  padding: ${({ theme }) => theme.spacing(2)} 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-margin: ${({ theme }) => theme.mixins.toolbar.minHeight};
`;

const FilterText = styled.h3`
  font-size: 14px;
  text-transform: uppercase;
  margin: 5px 0px;
  color: inherit;
  display: flex;
  align-items: center;
`;

const LabelText = styled.span`
  font-size: 14px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;

  svg {
    color: ${({ theme }) => theme.palette.warning.light};
    font-size: 18px;
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  padding: 0;
  justify-content: space-between;

  &.secondary {
    padding-left: 16px;
    font-size: 13px;
    color: ${({ theme }) => theme.palette.text.secondary};

    &.Mui-selected {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  &.Mui-selected {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const CheckPlaceholder = styled.div`
  padding: ${({ theme }) => theme.spacing(1)} 0;
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

const LIMIT_CATES = 10;
const LIMIT_PUBS = 10;

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

  //Change cate
  const handleCateChange = (cate) => {
    onChangeCate({ id: cate?.id, slug: cate?.slug });
  };

  //Open sub cate
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
    let cateIndex = data?.ids?.indexOf(+checkId);
    return checkId && (cateIndex < 0 || cateIndex >= LIMIT_CATES);
  };
  let catesContent;

  if (isLoading || isError) {
    catesContent = [...Array(LIMIT_CATES)].map((item, index) => (
      <Fragment key={`temp-cate-${index}`}>
        <StyledListItemButton>
          <FilterText>
            <Skeleton variant="text" width={120} />
          </FilterText>
        </StyledListItemButton>
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
          cate?.children && cate.children.some((child) => child.id == cateId);
        if (containedSelected) childContainedRef.current = id;
        const item = (
          <Fragment key={`cate-${id}-${index}`}>
            <StyledListItemButton
              selected={cateId == id}
              onClick={() => handleCateChange(cate)}
            >
              <FilterText>{cate?.name}</FilterText>
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
            </StyledListItemButton>
            {cate?.children && (
              <Collapse in={open[id]} timeout="auto" unmountOnExit>
                {cate.children?.map((child, subIndex) => (
                  <List
                    key={`${child?.id}-${subIndex}`}
                    component="div"
                    disablePadding
                  >
                    <StyledListItemButton
                      className="secondary"
                      selected={cateId == child?.id}
                      onClick={() => handleCateChange(child)}
                    >
                      <FilterText>{child?.name}</FilterText>
                    </StyledListItemButton>
                  </List>
                ))}
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
          <Collapse in={showmore} timeout="auto" unmountOnExit>
            {collapseContent}
          </Collapse>
        </>
      );
    } else {
      catesContent = [...Array(LIMIT_CATES)].map((item, index) => (
        <Fragment key={`cate-${index}`}>
          <StyledListItemButton>
            <FilterText>
              <Skeleton variant="text" width={120} animation={false} />
            </FilterText>
          </StyledListItemButton>
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
      <List
        sx={{ width: "100%", py: 0 }}
        component="nav"
        aria-labelledby="nested-list-categories"
      >
        {catesContent}
        {isFetching && !isLoading && (
          <StyledListItemButton>
            <FilterText>
              <Skeleton variant="text" width={120} />
            </FilterText>
          </StyledListItemButton>
        )}
      </List>
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

const PublisherFilter = memo(({ pubs, onChangePub, pubsRef }) => {
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
  const handleChangePub = (e) => {
    const selectedIndex = selectedPub.indexOf(e.target.value);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedPub, e.target.value);
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
      <CheckPlaceholder key={`pub-temp-${index}`}>
        <Skeleton variant="text" sx={{ fontSize: "14px" }} width={200} />
      </CheckPlaceholder>
    ));
  } else if (isSuccess) {
    const { ids, entities } = data;

    if (ids?.length) {
      let limitContent = [];
      let collapseContent = [];

      ids?.forEach((id, index) => {
        const pub = entities[id];
        const isItemSelected = isSelected(`${id}`);
        if (isItemSelected && !containedSelected)
          containedSelected = isContained(id);

        const item = (
          <FormControlLabel
            key={`pub-${id}-${index}`}
            control={
              <Checkbox
                value={id}
                checked={isItemSelected}
                onChange={handleChangePub}
                disableRipple
                name={pub?.name}
                color="primary"
                size="small"
              />
            }
            sx={{ fontSize: "14px", width: "100%", marginRight: 0 }}
            label={<LabelText>{pub?.name}</LabelText>}
          />
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
          <Collapse in={showmore} timeout="auto" unmountOnExit>
            {collapseContent}
          </Collapse>
        </>
      );
    } else {
      pubsContent = [...Array(LIMIT_PUBS)].map((item, index) => (
        <CheckPlaceholder key={`pub-temp-${index}`}>
          <Skeleton variant="text" sx={{ fontSize: "14px" }} width={200} />
        </CheckPlaceholder>
      ));
    }
  }

  return (
    <Filter ref={pubsRef}>
      <TitleContainer>
        <FilterText>Nhà xuất bản</FilterText>
      </TitleContainer>
      <FormGroup sx={{ padding: 0, width: "100%" }}>
        {pubsContent}
        {isFetching && !isLoading && (
          <CheckPlaceholder>
            <Skeleton variant="text" sx={{ fontSize: "14px" }} width={200} />
          </CheckPlaceholder>
        )}
      </FormGroup>
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

const RangeFilter = memo(
  ({ value, onChangeInputRange, onChangeRange, valueRef }) => {
    const [valueInput, setValueInput] = useState(value || [0, 10000000]);

    useEffect(() => {
      setValueInput(value);
    }, [value]);

    //Change
    const handleSelect = (e) => {
      let newValue = e.target.value.split(",").map(Number);
      setValueInput(newValue);
      handleUpdateInputRange(newValue);
    };

    const handleChangeRange = (value) => {
      setValueInput(value);
      handleUpdateRange(value);
    };

    const handleUpdateInputRange = (newValue) => {
      if (onChangeInputRange) onChangeInputRange(newValue);
    };
    const handleUpdateRange = (newValue) => {
      if (onChangeRange) onChangeRange(newValue);
    };

    const isSelected = (currValue) =>
      valueInput[0] == currValue[0] && valueInput[1] == currValue[1];

    return (
      <Filter ref={valueRef}>
        <TitleContainer>
          <FilterText>Khoảng giá</FilterText>
        </TitleContainer>
        <FormGroup sx={{ padding: 0, width: "100%", mb: 1 }}>
          {suggestPrices.map((option, index) => {
            const isItemSelected = isSelected(option.value);

            return (
              <FormControlLabel
                key={`range-${index}`}
                control={
                  <Radio
                    value={option.value}
                    checked={isItemSelected}
                    onChange={handleSelect}
                    disableRipple
                    name={option.label}
                    color="primary"
                    size="small"
                  />
                }
                sx={{ fontSize: "14px", width: "100%", marginRight: 0 }}
                label={<LabelText>{option.label}</LabelText>}
              />
            );
          })}
        </FormGroup>
        <PriceRangeSlider
          {...{ value: valueInput, onChange: handleChangeRange }}
        />
      </Filter>
    );
  }
);

const TypeFilter = memo(({ types, onChangeType, typesRef }) => {
  const [selectedType, setSelectedType] = useState(types || []);

  useEffect(() => {
    setSelectedType(types);
  }, [types]);

  const handleChangeType = (e) => {
    const selectedIndex = selectedType.indexOf(e.target.value);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedType, e.target.value);
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
    <Filter ref={typesRef}>
      <TitleContainer>
        <FilterText>Hình thức bìa</FilterText>
      </TitleContainer>
      <FormGroup sx={{ padding: 0, width: "100%" }}>
        {bookTypeItems.map((option, index) => {
          const isItemSelected = isSelected(option.value);

          return (
            <FormControlLabel
              key={`type-${index}`}
              control={
                <Checkbox
                  value={option.value}
                  checked={isItemSelected}
                  onChange={handleChangeType}
                  disableRipple
                  name={option.label}
                  color="primary"
                  size="small"
                />
              }
              sx={{ fontSize: "14px", width: "100%", marginRight: 0 }}
              label={<LabelText>{option.label}</LabelText>}
            />
          );
        })}
      </FormGroup>
    </Filter>
  );
});

const RateFilter = memo(({ rating, onChangeRate, rateRef }) => {
  const handleChangeRate = (e) => {
    let newValue = e.target.value;
    if (onChangeRate) onChangeRate(newValue);
  };

  return (
    <Filter ref={rateRef}>
      <TitleContainer>
        <FilterText>Đánh giá</FilterText>
      </TitleContainer>
      <FormGroup sx={{ padding: 0, width: "100%", mb: 1 }}>
        {[...Array(5)].map((item, index) => {
          const isItemSelected = index + 1 == rating;

          return (
            <FormControlLabel
              key={`rating-${index + 1}`}
              control={
                <Radio
                  value={index + 1}
                  checked={isItemSelected}
                  onChange={handleChangeRate}
                  disableRipple
                  name={`${index + 1} Star${index + 1 !== 1 ? "s" : ""}`}
                  color="primary"
                  size="small"
                />
              }
              sx={{ fontSize: "14px", width: "100%", marginRight: 0 }}
              label={
                <LabelText>
                  {[...Array(index + 1)].map((item, i) => (
                    <Star key={`s-${index}-${i}`} />
                  ))}
                  {[...Array(5 - (index + 1))].map((item, j) => (
                    <StarBorder key={`sb-${index}-${j}`} />
                  ))}
                  {index < 4 && <>&nbsp;trở lên</>}
                </LabelText>
              }
            />
          );
        })}
      </FormGroup>
    </Filter>
  );
});

const FilterList = ({
  filters,
  setFilters,
  resetFilter,
  pubsRef,
  typesRef,
  valueRef,
  rateRef,
}) => {
  const onChangeCate = useCallback((newValue) => {
    setFilters((prev) => ({
      ...prev,
      cate: prev.cate.id == newValue?.id ? { id: "", slug: "" } : newValue,
    }));
  }, []);
  const onChangePub = useCallback(
    debounce((newValue) => {
      setFilters((prev) => ({ ...prev, pubIds: newValue }));
    }, 500),
    []
  );
  const onChangeInputRange = useCallback((newValue) => {
    setFilters((prev) => ({ ...prev, value: newValue }));
  }, []);
  const onChangeRange = useCallback(
    debounce((newValue) => {
      setFilters((prev) => ({ ...prev, value: newValue }));
    }, 1000),
    []
  );
  const onChangeType = useCallback(
    debounce((newValue) => {
      setFilters((prev) => ({ ...prev, types: newValue }));
    }, 500),
    []
  );
  const onChangeRate = useCallback((newValue) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating == newValue ? "" : newValue,
    }));
  }, []);

  return (
    <FilterWrapper>
      <CustomDivider>BỘ LỌC</CustomDivider>
      <Stack
        spacing={{ xs: 1 }}
        useFlexGap
        flexWrap="wrap"
        divider={<Divider flexItem />}
      >
        <CateFilter {...{ cateId: filters?.cate.id, onChangeCate }} />
        <PublisherFilter {...{ pubs: filters?.pubIds, onChangePub, pubsRef }} />
        <RangeFilter
          {...{
            value: filters?.value,
            onChangeInputRange,
            onChangeRange,
            valueRef,
          }}
        />
        <TypeFilter {...{ types: filters?.types, onChangeType, typesRef }} />
        <RateFilter {...{ rating: filters?.rating, onChangeRate, rateRef }} />
      </Stack>
      <Button
        variant="contained"
        color="error"
        size="large"
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={resetFilter}
        startIcon={<FilterAltOff />}
      >
        Xoá bộ lọc
      </Button>
    </FilterWrapper>
  );
};

export default FilterList;
