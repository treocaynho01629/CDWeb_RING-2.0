import styled from "styled-components"
import { Suspense, lazy } from "react";
import { Button, MenuItem, TextField, InputAdornment, IconButton, Badge } from '@mui/material';
import { Sort, Straight } from '@mui/icons-material';
import { sortBy } from "../../../ultils/filters";

const QuickPagination = lazy(() => import("../../custom/QuickPagination"));

//#region styled
const Container = styled.div`
    position: sticky; 
    top: ${props => props.theme.mixins.toolbar.minHeight + 16}px;
    background-color: ${props => props.theme.palette.background.default};
    margin: 20px 0;
    z-index: 2;

    &:before {
        content: "";
        position: absolute;
        left: -10px;
        top: -16px;
        width: calc(100% + 20px);
        height: calc(100% + 16px);
        background-color: ${props => props.theme.palette.background.default};
        z-index: -1;
    }

    ${props => props.theme.breakpoints.down("sm_md")} {
        &:before { width: 100%;}
    }

    ${props => props.theme.breakpoints.down("sm")} {
        top: ${props => props.theme.mixins.toolbar.minHeight + 4}px;
        border-bottom: .5px solid ${props => props.theme.palette.divider};
        margin: 0 0 20px;

        &:before { display: none; }
    }
`

const SortContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`

const MainContainer = styled.div`
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        width: 100%;
    }
`

const AltContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const FilterTitle = styled.span`
    display: block;
    margin-right: 15px;
    font-weight: 450;

    ${props => props.theme.breakpoints.down("sm")} {
        display: none;
    }
`

const StyledInput = styled(TextField)`
    margin-right: ${props => props.theme.spacing(1)};

    &.sort {
        .MuiSelect-select {
            padding-right: 0 !important;
        }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        margin-right: 0;

        .MuiSelect-select {
            font-size: 14px;
        }
        
        .MuiOutlinedInput-notchedOutline {
            border: none;
        }
    }
`

const StyledSortButton = styled(Button)`
    padding-left: 0;
    padding-right: 0;
    display: none;
    max-width: 100px;
    color: ${props => props.theme.palette.text.primary};

    ${props => props.theme.breakpoints.down("md_lg")} {
        display: flex;
    }
`
//#endregion

const SortList = ({ mobileMode, pagination, onChangeOrder, onChangeDir, onChangeAmount, onPageChange, setOpen, isChanged }) => {
    const handleChangeOrder = (e) => { if (onChangeOrder) onChangeOrder(e.target.value) };
    const handleChangeDir = () => {
        let newValue = pagination?.sortDir == 'desc' ? 'asc' : 'desc';
        if (onChangeDir) onChangeDir(newValue);
    };
    const handleMouseDown = (e) => { e.preventDefault() };
    const handleChangeAmount = (e) => { if (onChangeAmount) onChangeAmount(e.target.value) };
    const handleSetOpen = () => { if (setOpen) setOpen(true) };

    const endAdornment =
        <InputAdornment position="end">
            <IconButton
                aria-label="toggle sort direction"
                onClick={handleChangeDir}
                onMouseDown={handleMouseDown}
                sx={{ padding: 0, mr: -.5 }}
                edge="end"
            >
                <Straight style={{ transform: pagination?.sortDir == 'desc' ? 'scaleY(-1)' : 'scaleY(1)' }} />
            </IconButton>
        </InputAdornment>

    return (
        <Container>
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
                            select: { IconComponent: () => null }
                        }}
                    >
                        {sortBy.map((order, index) => (
                            <MenuItem key={`${order.label}-${index}`} value={order.value}>{order.label}</MenuItem>
                        ))}
                    </StyledInput>
                    <StyledInput
                        size="small"
                        select
                        fullWidth={mobileMode}
                        value={pagination?.amount}
                        onChange={handleChangeAmount}
                    >
                        <MenuItem value={1}>Còn hàng</MenuItem>
                        <MenuItem value={0}>Tất cả</MenuItem>
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
                {!mobileMode && <Suspense fallback={null}>
                    <AltContainer>
                        <QuickPagination {...{ pagination, onPageChange }} />
                    </AltContainer>
                </Suspense>
                }
            </SortContainer>
        </Container >
    )
}

export default SortList