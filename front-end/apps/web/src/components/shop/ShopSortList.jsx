import { MenuItem, InputAdornment, IconButton } from "@mui/material";
import { Straight, TipsAndUpdatesOutlined } from "@mui/icons-material";
import { filterShopsBy, sortShopsBy } from "../../ultils/filters";
import {
  SortWrapper,
  SortContainer,
  MainContainer,
  AltContainer,
  FilterTitle,
  StyledInput,
  StyledSortButton,
} from "../custom/SortComponents";
import QuickPagination from "../custom/QuickPagination";

const ShopSortList = ({
  mobileMode,
  pagination,
  keyword,
  onOpenPagination,
  onChangeOrder,
  onChangeDir,
  onChangeFollowed,
  onPageChange,
  onClearKeyword,
}) => {
  const handleChangeOrder = (e) => {
    if (onChangeOrder) onChangeOrder(e.target.value);
  };
  const handleChangeDir = () => {
    let newValue = pagination?.sortDir == "desc" ? "asc" : "desc";
    if (onChangeDir) onChangeDir(newValue);
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
  };
  const handleChangeFollowed = (e) => {
    if (onChangeFollowed) onChangeFollowed(e.target.value);
  };
  const handleClearKeyword = () => {
    if (onClearKeyword) onClearKeyword();
  };

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle sort direction"
        onClick={handleChangeDir}
        onMouseDown={handleMouseDown}
        sx={{ padding: 0, mr: -0.5 }}
        edge="end"
      >
        <Straight
          style={{
            transform:
              pagination?.sortDir == "desc" ? "scaleY(-1)" : "scaleY(1)",
          }}
        />
      </IconButton>
    </InputAdornment>
  );

  return (
    <SortWrapper>
      <SortContainer>
        <MainContainer>
          <FilterTitle>Xếp theo</FilterTitle>
          <StyledInput
            size="small"
            select
            className="sort"
            fullWidth={mobileMode}
            value={pagination?.sortBy}
            onChange={handleChangeOrder}
            slotProps={{
              input: { endAdornment },
              select: { IconComponent: () => null },
            }}
          >
            {sortShopsBy.map((option, index) => (
              <MenuItem
                key={`sort-${option.label}-${index}`}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledInput>
          <StyledInput
            size="small"
            select
            fullWidth={mobileMode}
            value={pagination?.followed}
            onChange={handleChangeFollowed}
          >
            {filterShopsBy.map((option, index) => (
              <MenuItem
                key={`filter-${option.label}-${index}`}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledInput>
          <StyledSortButton
            fullWidth={mobileMode}
            onClick={handleClearKeyword}
            endIcon={<TipsAndUpdatesOutlined color={keyword && "warning"} />}
          >
            Từ khoá
          </StyledSortButton>
        </MainContainer>
        <AltContainer>
          <QuickPagination
            {...{ pagination, onPageChange, onOpenPagination }}
          />
        </AltContainer>
      </SortContainer>
    </SortWrapper>
  );
};

export default ShopSortList;
