import styled from "@emotion/styled";
import { Paper, Rating, Skeleton, Stack } from "@mui/material";
import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";
import { Star, StarBorder, StarRounded } from "@mui/icons-material";
import { Link } from "react-router";
import { Message } from "../../custom/GlobalComponents";
import { currencyFormat, numFormatter } from "../../../ultils/covert";
import { Title } from "../custom/ShareComponents";
import CustomProgress from "../../custom/CustomProgress";

//#region styled
const MessageContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Rank = styled.span`
    display: grid;
    place-content: center;
    padding: 5px;

    * {
        grid-area: 1 / 1;
        width: 50px;
        height: 50px;
    }

    b {
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${props => props.theme.palette.grey[900]};
        z-index: 1;
    }

    svg {
        font-size: 40px;
        color: ${props => props.theme.palette.grey[400]};
    }

    &.first {
        svg { color: ${props => props.theme.palette.success.light}; }
    }

    &.second {
        svg { color: ${props => props.theme.palette.warning.light}; }
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 12px;

        * {
            width: 40px;
            height: 40px;
        }
    }
`

const ProductContainer = styled.div`
    display: flex;
    cursor: pointer;
    padding-right: ${props => props.theme.spacing(1)};

    ${props => props.theme.breakpoints.up("md_lg")} {
        &.selected {
            border-right: 3px solid ${props => props.theme.palette.primary.main};
        }
    }
`

const ProductTitle = styled.span`
    width: 100%;
    font-size: 14px;
    font-weight: 450;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp:2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    display: inline-block;
    height: 45px;
    width: 45px;
    border: .5px solid ${props => props.theme.palette.action.focus};
`

const StyledSkeleton = styled(Skeleton)`
    display: inline-block;
    height: 45px;
    width: 45px;
`

const ItemContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    flex-grow: 1;
    margin-left: 10px;
`

const MoreInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Stat = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`

const TextMore = styled.b`
    margin-left: 5px;
    padding-left: 5px;
    font-size: 12px;
    border-left: .5px solid ${props => props.theme.palette.action.focus};
    color: ${props => props.theme.palette.info.main};
`

const StyledRating = styled(Rating)`
    font-size: 14px;
    display: flex;
    align-items: center;
`

const ProductShop = styled.span`
    font-size: 14px;
    color: ${props => props.theme.palette.text.secondary};

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 12px;
    }
`
//#endregion

const ProductItem = ({ book, scrollPosition }) => {
    return (
        <ItemContainer>
            {book ?
                <StyledLazyImage
                    src={`${book?.image}?size=small`}
                    alt={`Top item: ${book?.title}`}
                    scrollPosition={scrollPosition}
                    placeholder={<StyledSkeleton variant="rectangular" animation={false} />}
                />
                : <StyledSkeleton variant="rectangular" animation={false} />
            }
            <ItemInfo>
                <ProductTitle>
                    {book
                        ? book?.title
                        : <>
                            <Skeleton variant="text" width="100%" />
                            <Skeleton variant="text" width="60%" />
                        </>
                    }
                </ProductTitle>
                {book ?
                    <MoreInfo>
                        <ProductShop>{currencyFormat.format(book?.price)}</ProductShop>
                        <Stat>
                            <StyledRating
                                name="product-rating"
                                value={book?.rating ?? 0}
                                getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}`}
                                precision={0.5}
                                icon={<Star style={{ fontSize: 14 }} />}
                                emptyIcon={<StarBorder style={{ fontSize: 14 }} />}
                                readOnly
                            />
                            <TextMore>Đã bán {numFormatter(book?.totalOrders)}</TextMore>
                        </Stat>
                    </MoreInfo>
                    :
                    <Skeleton variant="text" width="40%" />
                }
            </ItemInfo>
        </ItemContainer>
    )
}

const ProductsShowcase = ({ title, data, isError, isLoading, isSuccess, scrollPosition }) => {
    const tempProducts = (
        [...Array(5)].map((item, index) => (
            <ProductContainer key={`temp-top-${index}`}>
                <Rank className={index == 0 ? 'first' : index == 1 ? 'second' : ''}>
                    <b>{index + 1}</b>
                    <StarRounded />
                </Rank>
                <ProductItem />
            </ProductContainer>
        ))
    )

    let products;

    if (isLoading) {
        products = tempProducts;
    } else if (isSuccess) {
        const { ids, entities } = data;

        products = ids?.length
            ? ids?.map((id, index) => {
                const book = entities[id];
                return (
                    <Link to={`/product/${book?.slug}`} key={`top-${id}-${index}`}>
                        <ProductContainer>
                            <Rank className={index == 0 ? 'first' : index == 1 ? 'second' : ''}>
                                <b>{index + 1}</b>
                                <StarRounded />
                            </Rank>
                            <ProductItem {...{ book, scrollPosition }} />
                        </ProductContainer>
                    </Link>
                )
            })
            : <MessageContainer>
                <Message color="warning">
                    Không có sản phẩmn nào
                </Message>
            </MessageContainer>
    } else {
        products = tempProducts;
    }

    return (
        <Paper elevation={3} sx={{ padding: 1 }}>
            {isLoading && <CustomProgress color={`${isError ? 'error' : 'primary'}`} />}
            <Title>{title}</Title>
            <Stack spacing={.5} pb={1}>
                {products}
            </Stack>
        </Paper>
    )
}

export default trackWindowScroll(ProductsShowcase)