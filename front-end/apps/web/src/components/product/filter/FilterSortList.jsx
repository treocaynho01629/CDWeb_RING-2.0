import { booksAmount, sortBooksBy } from "../../../utils/filters";
import {
  SortWrapper,
  SortContainer,
  MainContainer,
  AltContainer,
  FilterTitle,
  StyledInput,
  StyledSortButton,
} from "../../custom/SortComponents";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Sort from "@mui/icons-material/Sort";
import Straight from "@mui/icons-material/Straight";
import QuickPagination from "../../custom/QuickPagination";

const FilterSortList = ({
  mobileMode,
  pagination,
  totalPages,
  onOpenPagination,
  onChangeOrder,
  onChangeDir,
  onChangeAmount,
  onPageChange,
  onOpenFilters,
  isChanged,
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
  const handleChangeAmount = (e) => {
    if (onChangeAmount) onChangeAmount(e.target.value);
  };
  const handleSetOpen = () => {
    if (onOpenFilters) onOpenFilters();
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
            {sortBooksBy.map((option, index) => (
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
            value={pagination?.amount}
            onChange={handleChangeAmount}
          >
            {booksAmount.map((option, index) => (
              <MenuItem
                key={`amount-${option.label}-${index}`}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledInput>
          <StyledSortButton
            fullWidth={mobileMode}
            onClick={handleSetOpen}
            endIcon={
              <Badge color="primary" variant="dot" invisible={!isChanged}>
                <Sort />
              </Badge>
            }
          >
            Lọc
          </StyledSortButton>
        </MainContainer>
        <AltContainer>
          <QuickPagination
            {...{
              page: pagination?.number,
              count: totalPages,
              onPageChange,
              onOpenPagination,
            }}
          />
        </AltContainer>
      </SortContainer>
    </SortWrapper>
  );
};

export default FilterSortList;
