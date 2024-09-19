import styled from "styled-components";
import { Avatar, Box, Button, Grid2 as Grid, Stack } from "@mui/material";
import { Storefront, Verified as VerifiedIcon } from "@mui/icons-material";

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

    b { 
        margin-left: 10px;
        color: ${props => props.theme.palette.warning.main}; 
    }

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 12px;

        b { margin-left: 5px; }
        &.hide-on-mobile {display: none}
    }
`
//#endregion

const ShopDisplay = () => {
    return (
        <ShopContainer>
            <Grid container size={12} spacing={1}>
                <Grid size={{ xs: 12, md: 'auto' }}>
                    <ShopInfo>
                        <Avatar
                            alt="Shop name"
                            sx={{
                                width: { xs: 50, md: 75 },
                                height: { xs: 50, md: 75 },
                                marginRight: { xs: .5, md: 2 }
                            }}
                        />
                        <Box
                            display={{ xs: 'flex', md: 'block' }}
                            justifyContent="space-between"
                            alignItems="center"
                            flexGrow={1}
                        >
                            <Box mb={{ xs: 0, md: 1 }}>
                                <ShopName>Tên shop</ShopName>
                                <Verified><VerifiedIcon sx={{ fontSize: '16px', marginRight: 1 }} color="primary" />Đối tác RING!</Verified>
                            </Box>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ height: 35 }}
                                startIcon={<Storefront />}
                            >
                                Xem cửa hàng
                            </Button>
                        </Box>
                    </ShopInfo>
                </Grid>
                <Grid
                    size={{ xs: 12, md: 'grow' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    pl={{ xs: 0, md: 1 }}
                >
                    <Stack
                        spacing={2}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}
                    >
                        <ShopDetail>Đánh giá<b>9999</b></ShopDetail>
                        <ShopDetail>Sản phẩm<b>9999</b></ShopDetail>
                        <ShopDetail>Người theo dõi<b>9999</b></ShopDetail>
                        <ShopDetail className="hide-on-mobile">Tham gia<b>9999</b></ShopDetail>
                    </Stack>
                </Grid>
            </Grid>
        </ShopContainer>
    )
}

export default ShopDisplay