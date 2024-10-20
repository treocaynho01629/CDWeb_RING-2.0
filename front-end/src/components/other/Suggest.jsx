import styled from "styled-components"
import { Grid2 as Grid } from "@mui/material";
import { Link } from "react-router-dom"
import { suggest } from '../../ultils/suggest';

//#region styled
const ItemContainer = styled.div`
    padding: 4px 0;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all .25s ease;

    svg {
        padding: 5px;
        border-radius: 5px;
        font-size: 2.6rem;
        color: ${props => props.theme.palette.common.white};
        background-color: ${props => props.$color};
    }

    &:hover {
      transform: translateY(-1px);
    }

    ${props => props.theme.breakpoints.down("md_lg")} {
        font-size: 12px;
        
        svg {
            font-size: 2.4rem;
        }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 2px;
        width: 70px;
        height: 70px;
        font-size: 11px;

        svg {
            font-size: 2.2rem;
        }
    }
`

const ItemWrapper = styled.div`
    display: flex;
`

const ItemName = styled.span`
    margin-top: 5px;
    font-weight: 400;
    text-transform: capitalize;
    width: 100%;
    text-align: center;
`
//#endregion

const Suggest = () => {
    return (
        <Grid container spacing={.5} size={12} mt={{ xs: 0, md: 3}} position="relative" zIndex={2} justifyContent="center">
            {suggest?.map((tab, index) => (
                <Grid key={`suggest-${index}`} size={{ xs: 2.4, md: 1.2 }} display="flex" justifyContent="center">
                    <ItemWrapper key={`suggest-tab-${index}`}>
                        <Link to={tab.url} title={tab.label}>
                            <ItemContainer $color={tab.color}>
                                {tab.icon}
                                <ItemName>{tab.label}</ItemName>
                            </ItemContainer>
                        </Link>
                    </ItemWrapper>
                </Grid>
            ))}
        </Grid>
    )
}

export default Suggest