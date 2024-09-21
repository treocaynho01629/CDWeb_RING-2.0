import styled from 'styled-components'
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';

//#region styled
const Container = styled.div`
    min-width: 110px;
    max-width: 220px;
    height: 100%;
    width: 100%;
    padding: 10px;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    border: .5px solid ${props => props.theme.palette.background.default};
    margin: ${props => props.theme.spacing(.1)} 0;

    &:hover {
        border-color: ${props => props.theme.palette.action.focus};
        box-shadow: ${props => props.theme.shadows[1]};
    }

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0;
        margin: 0 ${props => props.theme.spacing(.1)};
    }
`

const Info = styled.div`
    width: 100%;
    z-index: 4;

    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0 5px 5px;
    }
`

const Title = styled.h5`
    width: 100%;
    font-size: 14px;
    margin: 0;
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

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 12px;
    }
`

const Price = styled.span`
    font-size: 16px;
    font-weight: 400;
    color: ${props => props.theme.palette.primary.main};
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 12px;
    }
`

const Percentage = styled.span`
    padding: 1px 5px;
    margin-left: 10px;
    font-size: 14px;
    color: ${props => props.theme.palette.text.primary};
    background-color: ${props => props.theme.palette.action.focus};

    ${props => props.theme.breakpoints.down("sm")} {
        margin-left: 5px;
        padding: 1px 2px;
        font-size: 9px;
    }
`

const StyledLazyImage = styled(LazyLoadImage)`
    max-height: 140px;
    aspect-ratio: 1/1;
    z-index: -3;
    object-fit: contain;
`

const SkeletonContainer = styled.div`
    width: 100%;
    max-height: 140px;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
`
//#endregion

const ProductPreview = ({ book, scrollPosition }) => {
    return (
        <Container>
            {book
                ?
                <Link to={`/product/${book?.slug}`} style={{ width: '100%' }}>
                    <StyledLazyImage
                        src={`${book?.image}?size=small`}
                        alt={`${book?.title} Thumbnail`}
                        width={'100%'}
                        scrollPosition={scrollPosition}
                        placeholder={
                            <SkeletonContainer>
                                <Skeleton
                                    variant="rectangular"
                                    height={'100%'}
                                    sx={{ aspectRatio: '1/1' }}
                                />
                            </SkeletonContainer>
                        }
                    />
                    <Info>
                        <Title>{book.title}</Title>
                        <Price>{book.price.toLocaleString()}đ
                            {book.discount > 0 && <Percentage>-{book.discount * 100}%</Percentage>}
                        </Price>
                    </Info>
                </Link>
                :
                <>
                    <SkeletonContainer>
                        <Skeleton
                            variant="rectangular"
                            height={'100%'}
                            sx={{ aspectRatio: '1/1' }}
                        />
                    </SkeletonContainer>
                    <Info>
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="100%" />
                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="50%" />
                        <Skeleton variant="text" sx={{ fontSize: '20px' }} width="60%" />
                    </Info>
                </>
            }
        </Container>
    )
}

export default ProductPreview