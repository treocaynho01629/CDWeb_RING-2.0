import styled from 'styled-components'
import { Close, FilterAltOff, Search } from '@mui/icons-material'
import { isEqual } from 'lodash-es'
import { memo, useMemo } from 'react'
import { alpha } from '@mui/material'

//#region styled
const DisplayContainer = styled.div`
    width: 100%;
`

const FilterTitle = styled.span`
    margin-right: 15px;
    font-weight: 450;
    white-space: nowrap;
`

const ChipsWrapper = styled.div`
    display: flex;
    align-items: center;
`

const ChipsContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`

const FilterChip = styled.span`
    padding: 6px 10px;
    margin: ${props => props.theme.spacing(.5)} 0;
    margin-right: ${props => props.theme.spacing(1)};
    border: 1px solid ${props => props.theme.palette.warning.main};
    color: ${props => props.theme.palette.warning.light};
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    transition: all .2s ease;
    cursor: pointer;

    &.error {
        border-color: ${props => props.theme.palette.error.main};
        color: ${props => props.theme.palette.error.main};
    }

    &:hover {
        border-color: ${props => props.theme.palette.warning.light};
        background-color: ${props => alpha(props.theme.palette.warning.light, .1)};

        &.error {
            color: ${props => props.theme.palette.error.light};
            border-color: ${props => props.theme.palette.error.light};
            background-color: ${props => alpha(props.theme.palette.error.light, .1)};
        }
    }

    svg { margin-left: ${props => props.theme.spacing(1)}}
`

const Keyword = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;

    b { color: ${props => props.theme.palette.warning.main}; }
`
//#endregion

const FiltersDisplay = memo(({ filters, setFilters, defaultFilters, resetFilter, pubsRef, typesRef, valueRef, rateRef }) => {
    const { keyword, cate, shopId, ...leftFilters } = filters;
    let filtersApplied = [];

    //Scroll
    const scrollToPubs = () => { pubsRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    const scrollToTypes = () => { typesRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    const scrollToValue = () => { valueRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    const scrollToRating = () => { rateRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

    //Remove
    const handleRemovePubs = () => { setFilters(prev => ({ ...prev, pubIds: defaultFilters.pubIds })) }
    const handleRemoveTypes = () => { setFilters(prev => ({ ...prev, types: defaultFilters.types })) }
    const handleRemoveValue = () => { setFilters(prev => ({ ...prev, value: defaultFilters.value })) }
    const handleRemoveRating = () => { setFilters(prev => ({ ...prev, rating: defaultFilters.rating })) }

    const createChips = () => {
        let content = [];

        if (!isEqual(filters, defaultFilters)) {
            if (!isEqual(filters.pubIds, defaultFilters.pubIds)) {
                content.push(<FilterChip key={'chip-pubs'} onClick={scrollToPubs}>
                    Nhà xuất bản ({filters.pubIds.length})
                    <Close onClick={handleRemovePubs} />
                </FilterChip>);
            }
            if (!isEqual(filters.types, defaultFilters.types)) {
                content.push(<FilterChip key={'chip-types'} onClick={scrollToTypes}>
                    Hình thức bìa ({[].concat([], filters.types).length})
                    <Close onClick={handleRemoveTypes} />
                </FilterChip>);
            }
            if (!isEqual(filters.value, defaultFilters.value)) {
                content.push(<FilterChip key={'chip-value'} onClick={scrollToValue}>
                    Giá: {`${filters.value[0].toLocaleString()}đ - ${filters.value[1].toLocaleString()}đ`}
                    <Close onClick={handleRemoveValue} />
                </FilterChip>);
            }
            if (filters.rating != defaultFilters.rating) {
                content.push(<FilterChip key={'chip-rate'} onClick={scrollToRating}>
                    Đánh giá: {`${filters.rating < 5 ? 'Từ' : ''} ${filters.rating} sao`}
                    <Close onClick={handleRemoveRating} />
                </FilterChip>);
            }
        }

        return content;
    };
    filtersApplied = useMemo(() => createChips(), [leftFilters]);

    return (
        <DisplayContainer>
            {keyword && <Keyword><Search />&nbsp;Kết quả từ khoá: '<b>{keyword}</b>'</Keyword>}
            <ChipsWrapper>
                {filtersApplied.length ?
                    <><FilterTitle>Lọc theo</FilterTitle>
                        <ChipsContainer>
                            {filtersApplied}
                            <FilterChip className="error" onClick={resetFilter}>
                                Xoá bộ lọc
                                <FilterAltOff />
                            </FilterChip>
                        </ChipsContainer>
                    </>
                    : null}
            </ChipsWrapper>
        </DisplayContainer>
    )
})

export default FiltersDisplay