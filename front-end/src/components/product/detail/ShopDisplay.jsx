import styled from "styled-components";
import { Avatar, Box, Button, Grid2 as Grid, Stack } from "@mui/material";
import { AutoStories, LocalActivity, PersonAddAlt1, Store, Storefront, Today, Verified as VerifiedIcon } from "@mui/icons-material";
import { useGetShopQuery } from "../../../features/shops/shopsApiSlice";
import { Link } from "react-router-dom";

//#region styled
const ShopContainer = styled.div`
    padding: 20px;
    border: .5px solid ${props => props.theme.palette.divider};
    display: flex;
    flex-wrap: wrap;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 10px 12px;
    }
`

const ShopInfo = styled.div`
    display: flex;
    align-items: center;
    border-right: .5px solid ${props => props.theme.palette.divider};
    padding-right: 15px;

    ${props => props.theme.breakpoints.down("md")} {
        border: none;
        padding-right: 0;
    }
`

const ShopName = styled.h3`
    margin: 0;

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 15px;
    }
`

const Verified = styled.p`
    font-size: 13px;
    margin: 0;
    display: flex;
    color: ${props => props.theme.palette.text.secondary};
`

const ShopDetail = styled.span`
    flex-grow: 1;
    font-size: 14px;
    display: flex;
    align-items: center;
    /* min-width: 250px; */
    width: 40%;

    svg {
        font-size: 15px;
        margin-right: 3px;
    }

    b { 
        margin-left: 10px;
        color: ${props => props.theme.palette.warning.main}; 
    }

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 12px;
        width: auto;

        b { margin-left: 5px; }
        &.hide-on-mobile {display: none}
    }
`
//#endregion

const ShopDisplay = ({ id, name }) => {

    //Fetch reviews
    const { data, isLoading, isSuccess, isError, error } = useGetShopQuery(id, { skip: !id })

    return (
        <ShopContainer>
            <Grid container size={12} spacing={1}>
                <Grid size={{ xs: 12, md: 4.5 }}>
                    <ShopInfo>
                        <Avatar
                            alt={`${name || data?.name} shop avatar`}
                            sx={{
                                width: { xs: 50, md: 75 },
                                height: { xs: 50, md: 75 },
                                marginRight: { xs: .5, md: 2 }
                            }}
                            src={data?.image ?? null}
                        >
                            <Store fontSize="large"/>
                        </Avatar>
                        <Box
                            display={{ xs: 'flex', md: 'block' }}
                            justifyContent="space-between"
                            alignItems="center"
                            flexGrow={1}
                        >
                            <Box mb={{ xs: 0, md: 1 }}>
                                <ShopName>{data?.name}</ShopName>
                                <Verified><VerifiedIcon sx={{ fontSize: '16px', marginRight: 1 }} color="primary" />Đối tác RING!</Verified>
                            </Box>
                            <Link to={`/filters?shopId=${id}`}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ height: 35 }}
                                    startIcon={<Storefront />}
                                >
                                    Xem cửa hàng
                                </Button>
                            </Link>
                        </Box>
                    </ShopInfo>
                </Grid>
                <Grid
                    size={{ xs: 12, md: 'grow' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding={{ xs: 0, md: '0 25px' }}
                >
                    <Stack
                        spacing={2}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap', width: '100%' }}
                    >
                        <ShopDetail><LocalActivity color="warning" />Đánh giá:<b>{data?.totalReviews}</b></ShopDetail>
                        <ShopDetail><AutoStories color="warning" />Sản phẩm:<b>{data?.totalProducts}</b></ShopDetail>
                        <ShopDetail><PersonAddAlt1 color="warning" />Người theo dõi:<b>{data?.totalFollowers}</b></ShopDetail>
                        <ShopDetail className="hide-on-mobile">
                            <Today color="warning" />Tham gia:<b>
                                {new Date(data?.joinedDate).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </b>
                        </ShopDetail>
                    </Stack>
                </Grid>
            </Grid>
        </ShopContainer>
    )
}

export default ShopDisplay