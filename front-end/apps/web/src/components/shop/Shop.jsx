import styled from "@emotion/styled";
import {
  Add,
  AutoStories,
  Check,
  LocalActivity,
  PersonAddAlt1,
  Store,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { Avatar, Box, Button } from "@mui/material";
import { numFormat } from "@ring/shared";
import { Link } from "react-router";

//#region styled
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border: 0.5px solid ${({ theme }) => theme.palette.action.hover};
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: ${({ theme }) => theme.spacing(1)};
`;

const Container = styled.div`
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: flex;
    justify-content: space-between;
  }
`;

const ShopName = styled.h3`
  margin: 0;
  white-space: nowrap;

  ${({ theme }) => theme.breakpoints.down("md")} {
    font-size: 15px;
  }
`;

const Verified = styled.p`
  font-size: 14px;
  margin: 0;
  display: flex;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const DateText = styled.span`
  font-size: 15px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: row;
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  border-top: 0.5px dashed ${({ theme }) => theme.palette.divider};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    border: none;
    padding-top: 0;
  }
`;

const ShopDetail = styled.span`
  flex-grow: 1;
  font-size: 14px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: row;
    font-size: 12px;
    width: auto;
  }
`;

const Stats = styled.span`
  display: flex;
  align-items: flex-start;
  color: ${({ theme }) => theme.palette.warning.main};

  svg {
    font-size: 18px;
    margin-right: 3px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    svg {
      font-size: 15px;
    }

    margin-left: 5px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing(1.5)} ${theme.spacing(1)} ${theme.spacing(1)}`};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: auto;
  }
`;
//#endregion

const Shop = ({ shop, onClickFollow, pending }) => {
  const handleClickFollow = () => {
    if (onClickFollow) onClickFollow(shop);
  };

  return (
    <Wrapper>
      <Container>
        <Link to={`/shop/${shop?.id}`}>
          <TopContainer>
            <Avatar
              alt={`${shop?.name} shop avatar`}
              sx={{
                width: { xs: 50, md: 60 },
                height: { xs: 50, md: 60 },
                mt: { xs: 0, sm: 3 },
                mb: { xs: 0, sm: 1 },
                mr: { xs: 1, sm: 0 },
              }}
              src={shop?.image ?? null}
            >
              <Store fontSize="large" />
            </Avatar>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
            >
              <ShopName>{shop?.name}</ShopName>
              <Verified>
                <VerifiedIcon
                  sx={{ fontSize: "16px", marginRight: 1 }}
                  color="primary"
                />
                Đối tác RING!
              </Verified>
              <DateText>
                Tham gia:&nbsp;
                <b>
                  {new Date(shop?.joinedDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </b>
              </DateText>
            </Box>
          </TopContainer>
        </Link>
        <ButtonContainer>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClickFollow}
            color={shop?.followed ? "warning" : "primary"}
            startIcon={shop?.followed ? <Check /> : <Add />}
          >
            {shop?.followed ? "Đang theo dõi" : "Theo dõi"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="info"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Link to={`/shop/${shop?.id}`}>Xem cửa hàng</Link>
          </Button>
        </ButtonContainer>
      </Container>
      <DetailsContainer>
        <ShopDetail>
          Đánh giá:
          <Stats>
            <LocalActivity color="warning" />
            <b>{numFormat.format(shop?.totalReviews)}</b>
          </Stats>
        </ShopDetail>
        <ShopDetail>
          Sản phẩm:
          <Stats>
            <AutoStories color="warning" />
            <b>{numFormat.format(shop?.totalProducts)}</b>
          </Stats>
        </ShopDetail>
        <ShopDetail>
          Theo dõi:
          <Stats>
            <PersonAddAlt1 color="warning" />
            <b>{numFormat.format(shop?.totalFollowers)}</b>
          </Stats>
        </ShopDetail>
      </DetailsContainer>
    </Wrapper>
  );
};

export default Shop;
