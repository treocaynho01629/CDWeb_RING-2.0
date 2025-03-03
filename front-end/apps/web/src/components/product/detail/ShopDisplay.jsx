import styled from "@emotion/styled";
import {
  Avatar,
  Box,
  Button,
  Grid2 as Grid,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  Add,
  AutoStories,
  Check,
  LocalActivity,
  PersonAddAlt1,
  Store,
  Today,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import {
  useFollowShopMutation,
  useGetShopQuery,
  useUnfollowShopMutation,
} from "../../../features/shops/shopsApiSlice";
import { Link } from "react-router";
import { numFormat } from "@ring/shared";

//#region styled
const ShopContainer = styled.div`
  padding: 20px;
  border: 0.5px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};
  display: flex;
  flex-wrap: wrap;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 10px 12px;
  }
`;

const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  border-right: 0.5px solid ${({ theme }) => theme.palette.divider};
  padding-right: 15px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    border: none;
    padding-right: 0;
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
  font-size: 13px;
  margin: 0;
  display: flex;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ShopDetail = styled.span`
  flex-grow: 1;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: 40%;

  svg {
    font-size: 15px;
    margin-right: 3px;
  }

  b {
    margin-left: 10px;
    color: ${({ theme }) => theme.palette.warning.main};
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    font-size: 12px;
    width: auto;
    justify-content: center;

    b {
      margin-left: 5px;
    }

    &.hide-on-mobile {
      display: none;
    }
  }
`;
//#endregion

const ShopDisplay = ({ id, name }) => {
  //Fetch reviews
  const { data, isLoading, isSuccess } = useGetShopQuery(id, { skip: !id });
  const [followShop, { isLoading: following }] = useFollowShopMutation();
  const [unfollowShop, { isLoading: unfollowing }] = useUnfollowShopMutation();
  let loading = (!id && !data && !isSuccess) || isLoading;

  const handleClickFollow = () => {
    if (isLoading || following || unfollowing) return;

    if (data?.followed) {
      unfollowShop(id)
        .unwrap()
        .catch((err) => {
          console.error(err);
        });
    } else {
      followShop(id)
        .unwrap()
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <ShopContainer>
      <Grid container size={12} spacing={1}>
        <Grid size={{ xs: 12, md: 4.5 }}>
          {loading ? (
            <ShopInfo>
              <Skeleton
                variant="circular"
                sx={{
                  width: { xs: 50, md: 75 },
                  height: { xs: 50, md: 75 },
                  marginRight: { xs: 0.5, md: 2 },
                }}
              />
              <Box
                display={{ xs: "flex", md: "block" }}
                justifyContent="space-between"
                alignItems="center"
                flexGrow={1}
              >
                <Box mb={{ xs: 0, md: 1 }}>
                  <Skeleton
                    variant="text"
                    sx={{
                      fontSize: { xs: "15px", md: "18px" },
                      width: { xs: 110, md: "90%" },
                    }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "13px" }}
                    width={100}
                  />
                </Box>
                <Skeleton
                  variant="rectangular"
                  sx={{ height: 35, width: { xs: 100, md: "100%" } }}
                />
              </Box>
            </ShopInfo>
          ) : (
            <ShopInfo>
              <Link to={`/store?shopId=${id}`}>
                <Avatar
                  alt={`${name || data?.name} shop avatar`}
                  sx={{
                    width: { xs: 50, md: 75 },
                    height: { xs: 50, md: 75 },
                    marginRight: { xs: 0.5, md: 2 },
                  }}
                  src={data?.image ?? null}
                >
                  <Store fontSize="large" />
                </Avatar>
              </Link>
              <Box
                display={{ xs: "flex", md: "block" }}
                justifyContent="space-between"
                alignItems="center"
                flexGrow={1}
              >
                <Link to={`/store?shopId=${id}`}>
                  <Box mb={{ xs: 0, md: 1 }}>
                    <ShopName>{data?.name}</ShopName>
                    <Verified>
                      <VerifiedIcon
                        sx={{ fontSize: "16px", marginRight: 1 }}
                        color="primary"
                      />
                      Đối tác RING!
                    </Verified>
                  </Box>
                </Link>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ height: 35, width: { xs: "auto", md: "100%" } }}
                  disabled={isLoading || following || unfollowing}
                  onClick={handleClickFollow}
                  color={data?.followed ? "warning" : "primary"}
                  startIcon={data?.followed ? <Check /> : <Add />}
                >
                  {data?.followed ? "Đang theo dõi" : "Theo dõi"}
                </Button>
              </Box>
            </ShopInfo>
          )}
        </Grid>
        <Grid
          size={{ xs: 12, md: "grow" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={{ xs: 0, md: "0 25px" }}
        >
          <Stack
            spacing={2}
            direction="row"
            useFlexGap
            sx={{ flexWrap: "wrap", width: "100%" }}
          >
            {loading ? (
              <>
                <ShopDetail>
                  <Skeleton
                    variant="text"
                    sx={{
                      fontSize: { xs: "12px", md: "14px" },
                      width: { xs: 95, md: 100 },
                    }}
                  />
                </ShopDetail>
                <ShopDetail>
                  <Skeleton
                    variant="text"
                    sx={{
                      fontSize: { xs: "12px", md: "14px" },
                      width: { xs: 95, md: 110 },
                    }}
                  />
                </ShopDetail>
                <ShopDetail>
                  <Skeleton
                    variant="text"
                    sx={{
                      fontSize: { xs: "12px", md: "14px" },
                      width: { xs: 95, md: 150 },
                    }}
                  />
                </ShopDetail>
                <ShopDetail className="hide-on-mobile">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: { xs: "12px", md: "14px" } }}
                    width={170}
                  />
                </ShopDetail>
              </>
            ) : (
              <>
                <ShopDetail>
                  <LocalActivity color="warning" />
                  Đánh giá:<b>{numFormat.format(data?.totalReviews)}</b>
                </ShopDetail>
                <ShopDetail>
                  <AutoStories color="warning" />
                  Sản phẩm:<b>{numFormat.format(data?.totalProducts)}</b>
                </ShopDetail>
                <ShopDetail>
                  <PersonAddAlt1 color="warning" />
                  Theo dõi:
                  <b>{numFormat.format(data?.totalFollowers)}</b>
                </ShopDetail>
                <ShopDetail className="hide-on-mobile">
                  <Today color="warning" />
                  Tham gia:
                  <b>
                    {new Date(data?.joinedDate).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </b>
                </ShopDetail>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </ShopContainer>
  );
};

export default ShopDisplay;
