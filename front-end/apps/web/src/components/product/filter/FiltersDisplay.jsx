import styled from "@emotion/styled";
import {
  Close,
  FilterAltOff,
  TipsAndUpdatesOutlined,
} from "@mui/icons-material";
import { isEqual } from "lodash-es";
import { memo, useMemo } from "react";
import { alpha } from "@mui/material";
import { currencyFormat } from "@ring/shared";

//#region styled
const DisplayContainer = styled.div`
  width: 100%;
`;

const FilterTitle = styled.span`
  margin-right: 15px;
  font-weight: 450;
  white-space: nowrap;
`;

const ChipsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ChipsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterChip = styled.span`
  padding: 6px 10px;
  margin: ${({ theme }) => theme.spacing(0.5)} 0;
  margin-right: ${({ theme }) => theme.spacing(1)};
  border: 1px solid
    ${({ theme, color }) =>
      theme.palette[color]?.main || theme.palette.warning.main};
  color: ${({ theme, color }) =>
    theme.palette[color]?.light || theme.palette.warning.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme, color }) =>
      theme.palette[color]?.light || theme.palette.warning.light};
    background-color: ${({ theme, color }) =>
      alpha(theme.palette[color]?.light || theme.palette.warning.light, 0.1)};
  }

  svg {
    margin-left: ${({ theme }) => theme.spacing(1)};
  }
`;

const ClearButton = styled.div`
  cursor: pointer;
  transition: all 0.2s ease;
  height: 24px;

  &:hover {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

const Keyword = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0;

  span {
    display: flex;
    align-items: center;

    b {
      color: ${({ theme }) => theme.palette.warning.main};
    }
  }
`;
//#endregion

const FiltersDisplay = memo(
  ({
    filters,
    onResetFilters,
    onChangeKeyword,
    onChangePubs,
    onChangeInputRange,
    onChangeTypes,
    onChangeRating,
    defaultFilters,
    isChanged,
    pubsRef,
    typesRef,
    valueRef,
    rateRef,
  }) => {
    const { keyword, cate, shopId, ...leftFilters } = filters;
    let filtersApplied = [];

    //Scroll
    const scrollToPubs = () => {
      pubsRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const scrollToTypes = () => {
      typesRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const scrollToValue = () => {
      valueRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const scrollToRating = () => {
      rateRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    //Remove
    const handleRemovePubs = (e) => {
      e.stopPropagation();
      if (onChangePubs) onChangePubs(defaultFilters.pubIds);
    };
    const handleRemoveTypes = (e) => {
      e.stopPropagation();
      if (onChangeTypes) onChangeTypes(defaultFilters.types);
    };
    const handleRemoveValue = (e) => {
      e.stopPropagation();
      if (onChangeInputRange) onChangeInputRange(defaultFilters.value);
    };
    const handleRemoveRating = (e) => {
      e.stopPropagation();
      if (onChangeRating) onChangeRating(defaultFilters.value);
    };
    const handleRemoveKeyword = (e) => {
      e.stopPropagation();
      if (onChangeKeyword) onChangeKeyword(defaultFilters.keyword);
    };

    const createChips = () => {
      let content = [];

      if (isChanged) {
        if (!isEqual(filters.pubIds, defaultFilters.pubIds)) {
          content.push(
            <FilterChip key={"chip-pubs"} onClick={scrollToPubs}>
              Nhà xuất bản ({filters.pubIds.length})
              <Close onClick={handleRemovePubs} />
            </FilterChip>
          );
        }
        if (!isEqual(filters.types, defaultFilters.types)) {
          content.push(
            <FilterChip key={"chip-types"} onClick={scrollToTypes}>
              Hình thức bìa ({[].concat([], filters.types).length})
              <Close onClick={handleRemoveTypes} />
            </FilterChip>
          );
        }
        if (!isEqual(filters.value, defaultFilters.value)) {
          content.push(
            <FilterChip key={"chip-value"} onClick={scrollToValue}>
              Giá:{" "}
              {`${currencyFormat.format(filters.value[0])} - ${currencyFormat.format(filters.value[1])}`}
              <Close onClick={handleRemoveValue} />
            </FilterChip>
          );
        }
        if (filters.rating != defaultFilters.rating) {
          content.push(
            <FilterChip key={"chip-rate"} onClick={scrollToRating}>
              Đánh giá:{" "}
              {`${filters.rating < 5 ? "Từ" : ""} ${filters.rating} sao`}
              <Close onClick={handleRemoveRating} />
            </FilterChip>
          );
        }
      }

      return content;
    };
    filtersApplied = useMemo(() => createChips(), [leftFilters]);

    return (
      <DisplayContainer>
        {keyword && (
          <Keyword>
            <span>
              <TipsAndUpdatesOutlined />
              &nbsp;Kết quả từ khoá: '<b>{keyword}</b>'
            </span>
            <ClearButton onClick={handleRemoveKeyword}>
              <Close />
            </ClearButton>
          </Keyword>
        )}
        <ChipsWrapper>
          {filtersApplied.length ? (
            <>
              <FilterTitle>Lọc theo</FilterTitle>
              <ChipsContainer>
                {filtersApplied}
                <FilterChip color="error" onClick={onResetFilters}>
                  Xoá bộ lọc
                  <FilterAltOff />
                </FilterChip>
              </ChipsContainer>
            </>
          ) : null}
        </ChipsWrapper>
      </DisplayContainer>
    );
  }
);

export default FiltersDisplay;
