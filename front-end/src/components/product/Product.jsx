import styled from '@emotion/styled'
import { Star as StarIcon, ShoppingCart as ShoppingCartIcon, StarBorder } from '@mui/icons-material';
import { Divider, Skeleton, Rating } from '@mui/material'
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { numFormatter } from '../../ultils/covert';
import useCart from '../../hooks/useCart';

//#region styled
const StyledLazyImage = styled(LazyLoadImage)`
    aspect-ratio: 1/1;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: filter .25s ease;
    z-index: -1;
    background-color: ${props => props.theme.palette.action.disabledBackground};

    ${props => props.theme.breakpoints.down("sm")} {
        margin-bottom: 0;
    }
`

const StyledSkeleton = styled(Skeleton)`
    aspect-ratio: 1/1;
    width: 100%;
    height: 100%;
`

const ImageContainer = styled.div`
    aspect-ratio: 1/1;
    width: 100%;
    height: 100%;
    max-height: 180px;
    max-width: 180px;
    margin-bottom: 10px;
`

const Container = styled.div`
    min-width: 172px;
    min-height: 350px;
    max-width: 290px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border: .5px solid ${props => props.theme.palette.action.hover};
    overflow: hidden;
    transition: all .25s ease;

    
    &:hover {
        border-color: ${props => props.theme.palette.action.focus};
        box-shadow: ${props => props.theme.shadows[1]};
        ${ImageContainer} { filter: saturate(120%); }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        min-height: 317px;
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
`

const ItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const Info = styled.div`
    position: relative;
    width: 94%;
    height: 100%;

    &.extra {height: auto}
`

const MainInfo = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Title = styled('h5')`
    width: 100%;
    line-height: 1.5;
    font-size: 14px;
    margin: 0;
    margin-top: 5px;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
`

const PriceContainer = styled.div`
    display: flex;
    margin-bottom: 5px;

    ${props => props.theme.breakpoints.up("sm")} {
        flex-direction: column;
    }
`

const Price = styled.span`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.palette.primary.main};
    margin-right: 5px;

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 14px;
    }
`

const DiscountContainer = styled.span`
    font-size: 14px;
    color: ${props => props.theme.palette.text.secondary};
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`

const Discount = styled.p`
    margin-top: 0;
    margin-bottom: 0;
    text-decoration: line-through;
`

const Percentage = styled.span`
    padding: 1px 5px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.theme.palette.primary.contrastText};
    background-color: ${props => props.theme.palette.primary.main};

    ${props => props.theme.breakpoints.down("sm")} {
        margin-left: 5px;
        font-size: 10px;
    }
`

const AddToCart = styled.p`
    font-size: 11px;
    font-weight: bold;
    display: flex;
    align-items: center;
    transition: all .25s ease;
    margin: 9px 0;
    cursor: pointer;

    &:hover {color: ${props => props.theme.palette.primary.main} }
    &:after {content: " THÊM VÀO GIỎ";}
`

const ProductInfo = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const MoreInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`

const TextMore = styled.b`
    margin-left: 5px;
    padding-left: 5px;
    font-size: 12px;
    border-left: .5px solid ${props => props.theme.palette.action.focus};

    &.secondary {color: ${props => props.theme.palette.text.secondary}}
`

const StyledRating = styled(Rating)`
    font-size: 14;
    display: flex;
    align-items: center;
`

const ProductTag = styled.span`
    position: absolute;
    top: ${props => props.theme.spacing(1)};
    left: ${props => props.theme.spacing(1)};
    padding: ${props => props.theme.spacing(.25)} ${props => props.theme.spacing(1)};
    background-color: ${props => props.theme.palette.info.light};
    color: ${props => props.theme.palette.info.dark};
    font-size: 12px;
    font-weight: 500px;
    z-index: 1;

    &.error {
        background-color: ${props => props.theme.palette.error.light};
        color: ${props => props.theme.palette.error.dark};
    }

    &.warning {
        background-color: ${props => props.theme.palette.warning.light};
        color: ${props => props.theme.palette.warning.dark};
    }
`
//#endregion

const Product = ({ book, scrollPosition }) => {
    const { addProduct } = useCart();
    const handleAddToCart = (book) => { addProduct(book, 1) };

    return (
        <Container>
            <Wrapper>
                {book
                    ?
                    <Link to={`/product/${book.slug}`} style={{ width: '100%', height: '100%' }}>
                        <ItemContainer>
                            {book?.amount < 30 &&
                                <ProductTag className={book?.amount <= 0 ? "error" : "warning"}>
                                    {book?.amount <= 0 ? 'Hết hàng' : 'Cháy hàng'}
                                </ProductTag>
                            }
                            <ImageContainer>
                                <StyledLazyImage
                                    src={`${book?.image}?size=small`}
                                    alt={`${book?.title} Thumbnail`}
                                    scrollPosition={scrollPosition}
                                    placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                                />
                            </ImageContainer>
                            <Info>
                                <MainInfo>
                                    <ProductInfo>
                                        <Title>{book.title}</Title>
                                        <PriceContainer>
                                            <Price>{Math.round(book.price * (1 - book.discount)).toLocaleString()}đ</Price>
                                            <DiscountContainer>
                                                {book.discount > 0
                                                    ? <>
                                                        <Discount>{book.price.toLocaleString()}đ</Discount>
                                                        <Percentage>-{book.discount * 100}%</Percentage>
                                                    </>
                                                    : <br />
                                                }
                                            </DiscountContainer>
                                        </PriceContainer>
                                    </ProductInfo>
                                    <MoreInfo>
                                        <StyledRating
                                            name="product-rating"
                                            value={book?.rating ?? 0}
                                            getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}`}
                                            precision={0.5}
                                            icon={<StarIcon style={{ fontSize: 14 }} />}
                                            emptyIcon={<StarBorder style={{ fontSize: 14 }} />}
                                            readOnly
                                        />
                                        <TextMore className="secondary">Đã bán {numFormatter(book?.totalOrders)}</TextMore>
                                    </MoreInfo>
                                </MainInfo>
                            </Info>
                        </ItemContainer>
                    </Link>
                    :
                    <>
                        <ImageContainer>
                            <StyledSkeleton variant="rectangular" />
                        </ImageContainer>
                        <Info>
                            <Skeleton variant="text" sx={{ fontSize: '16px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '16px' }} width="60%" />
                            <Skeleton
                                variant="text"
                                sx={{
                                    fontSize: '20px',
                                    width: { xs: '90%', sm: '40%' }
                                }}
                            />
                            <Skeleton variant="text" sx={{ fontSize: '16px', display: { xs: 'none', sm: 'block' } }} />
                            <Skeleton variant="text" sx={{ fontSize: '14px' }} width="60%" />
                        </Info>
                    </>
                }
            </Wrapper>
            <Info className="extra">
                <Divider />
                <AddToCart onClick={() => handleAddToCart(book)} disabled={!book}>
                    <ShoppingCartIcon style={{ fontSize: 14 }} />&nbsp;
                </AddToCart>
            </Info>
        </Container>
    )
}

export default Product