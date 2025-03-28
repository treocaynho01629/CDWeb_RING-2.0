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
  useUnfollowShopMutation,
} from "../../features/shops/shopsApiSlice";
import { Link, useLocation, useNavigate } from "react-router";
import { numFormat } from "@ring/shared";
import { useAuth } from "@ring/auth";
import {
  ShopContainer,
  ShopInfo,
  ShopName,
  Verified,
  ShopDetail,
} from "./ShopComponents";

const ShopDisplay = ({ shop, name }) => {
  //Fetch reviews
  const { username } = useAuth();
  const [followShop, { isLoading: following }] = useFollowShopMutation();
  const [unfollowShop, { isLoading: unfollowing }] = useUnfollowShopMutation();

  const location = useLocation();
  const navigate = useNavigate();

  const handleClickFollow = () => {
    if (!username) navigate("/auth/login", { state: { from: location } });
    if (!shop || following || unfollowing || !username) return;

    if (shop?.followed) {
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
      <Grid container spacing={1} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, md: 4.5 }}>
          {!shop ? (
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
              <Link to={`/store?shopId=${shop?.id}`}>
                <Avatar
                  alt={`${name || shop?.name} shop avatar`}
                  sx={{
                    width: { xs: 50, md: 75 },
                    height: { xs: 50, md: 75 },
                    marginRight: { xs: 0.5, md: 2 },
                  }}
                  src={shop?.image ?? null}
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
                <Link to={`/store?shopId=${shop?.id}`}>
                  <Box mb={{ xs: 0, md: 1 }}>
                    <ShopName>{shop?.name}</ShopName>
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
                  disabled={!shop || following || unfollowing}
                  onClick={handleClickFollow}
                  color={shop?.followed ? "warning" : "primary"}
                  startIcon={shop?.followed ? <Check /> : <Add />}
                >
                  {shop?.followed ? "Đang theo dõi" : "Theo dõi"}
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
            {!shop ? (
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
                  <LocalActivity />
                  Đánh giá:<b>{numFormat.format(shop?.totalReviews)}</b>
                </ShopDetail>
                <ShopDetail>
                  <AutoStories />
                  Sản phẩm:<b>{numFormat.format(shop?.totalProducts)}</b>
                </ShopDetail>
                <ShopDetail>
                  <PersonAddAlt1 />
                  Theo dõi:
                  <b>{numFormat.format(shop?.totalFollowers)}</b>
                </ShopDetail>
                <ShopDetail className="hide-on-mobile">
                  <Today />
                  Tham gia:
                  <b>
                    {new Date(shop?.joinedDate).toLocaleDateString("en-GB", {
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
