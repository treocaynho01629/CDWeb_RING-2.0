import styled from "@emotion/styled";
import { Grid2 as Grid } from "@mui/material";
import { Link } from "react-router";
import { suggest } from "../../ultils/suggest";

//#region styled
const ItemContainer = styled.div`
  padding: 4px 0;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;

  svg {
    padding: 5px;
    border-radius: 5px;
    font-size: 2.6rem;
    color: ${({ theme }) => theme.palette.common.white};
    background-color: ${({ color }) => color};
  }

  &:hover {
    transform: translateY(-1px);
  }

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    font-size: 12px;

    svg {
      font-size: 2.4rem;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 2px;
    width: 70px;
    height: 70px;
    font-size: 11px;

    svg {
      font-size: 2.2rem;
    }
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

const ItemName = styled.span`
  margin-top: 5px;
  font-weight: 400;
  text-transform: capitalize;
  width: 100%;
  text-align: center;
`;

const Wrapper = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing(1)} 0;
  margin-top: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 0.5px solid ${({ theme }) => theme.palette.divider};

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-top: 0;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-left: none;
    border-right: none;
  }
`;
//#endregion

const Suggest = () => {
  return (
    <Wrapper>
      <Grid
        container
        spacing={0.5}
        size={12}
        zIndex={2}
        position="relative"
        justifyContent="center"
        bgcolor={"background.paper"}
      >
        {suggest?.map((tab, index) => (
          <Grid
            key={`suggest-${index}`}
            size={{ xs: 2.4, md: 1.2 }}
            display="flex"
            justifyContent="center"
          >
            <ItemWrapper key={`suggest-tab-${index}`}>
              <Link to={tab.url} title={tab.label}>
                <ItemContainer color={tab.color}>
                  {tab.icon}
                  <ItemName>{tab.label}</ItemName>
                </ItemContainer>
              </Link>
            </ItemWrapper>
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default Suggest;
