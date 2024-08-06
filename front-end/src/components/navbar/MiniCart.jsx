import styled from 'styled-components';
import { RemoveShoppingCart as RemoveShoppingCartIcon } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Box, Popover } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomButton from '../custom/CustomButton';

//#region styled
const MiniCartContainer = styled.div`
    width: 400px;
    padding: 10px 20px;
`

const ProductTitle = styled.h5`
    font-size: 14px;
    margin: 0;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const ProductPrice = styled.span`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.palette.secondary.main};
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`
//#endregion

const MiniCart = ({ openCart, anchorElCart, handleClose, products }) => {
    return (
        <Popover
            id="mouse-over-popover"
            open={openCart}
            anchorEl={anchorElCart}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            disableScrollLock
            sx={{ pointerEvents: 'none' }}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    borderRadius: 0,
                    pointerEvents: 'auto',

                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
                onMouseLeave: handleClose
            }}
        >
            <MiniCartContainer>
                <div style={{ margin: '20px 0px' }}><b>Sản phẩm trong giỏ hàng</b></div>
                {products?.length == 0 ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '250px' }}>
                        <RemoveShoppingCartIcon sx={{ fontSize: '50px' }} />
                        <b>GIỎ HÀNG TRỐNG</b>
                    </div>
                    :
                    <>
                        {products?.slice(0, 5).map((product, index) => (
                            <Card key={index + ":" + product?.id} mt={0} sx={{ display: 'flex', alignItems: 'center' }}>
                                <CardMedia
                                    loading="lazy"
                                    component="img"
                                    sx={{ width: 50, height: 50 }}
                                    image={`${product?.image}?size=small`}
                                    alt={`${product?.title} Cart item`}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent >
                                        <ProductTitle>{product?.title}</ProductTitle>
                                        <ProductPrice>{product?.price?.toLocaleString()} đ</ProductPrice>
                                    </CardContent>
                                </Box>
                            </Card>
                        ))}
                        <Box sx={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                            {products?.length <= 5 ? <p>&nbsp;</p> : <p>Và còn lại {products?.length - 5} trong giỏ</p>}
                            <Link to={'/cart'}>
                                <CustomButton
                                    variant="contained"
                                    color="secondary"
                                    size="medium"
                                >
                                    Xem giỏ hàng
                                </CustomButton>
                            </Link>
                        </Box>
                    </>
                }
            </MiniCartContainer>
        </Popover>
    )
}

export default MiniCart