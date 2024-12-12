import styled from '@emotion/styled'
import { useRef } from "react"
import { IconButton, Skeleton } from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';
import { Link } from 'react-router'
import { useGetPublishersQuery } from "../../features/publishers/publishersApiSlice";
import { LazyLoadImage } from 'react-lazy-load-image-component';

//#region styled
const StyledLazyImage = styled(LazyLoadImage)`
    aspect-ratio: 1/1;
    height: 100px;
    width: 100px;
    object-fit: contain;

    ${props => props.theme.breakpoints.down("md_lg")} {
        height: 55px;
        width: 55px;
    }

    ${props => props.theme.breakpoints.down("sm")} {
        height: 45px;
        width: 45px;
    }
`

const ItemContainer = styled.div`
    padding: 4px;
    margin-right: ${props => props.theme.spacing(2)};
`

const PubContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    background-color: ${props => props.theme.palette.background.paper};

    &:hover {
        .button-container {
            opacity: 1;
            visibility: visible;
        }
    }
`

const Wrapper = styled.div`
    position: relative;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    overflow-x: scroll;
    scroll-behavior: smooth;

    -ms-overflow-style: none;
    scrollbar-width: none; 

    &::-webkit-scrollbar {display: none;}

    ${props => props.theme.breakpoints.up("md")} {
        ${ItemContainer}:first-of-type {margin-left: 20px;}
        ${ItemContainer}:last-of-type { margin-right: 40px; }
    }
`

const ButtonContainer = styled.div`
    position: absolute;
    right: 0;
    padding-left: 20px;
    height: 100%;
    background-image: linear-gradient(
        to left, 
        ${props => props.theme.palette.background.paper}, 
        ${props => props.theme.palette.background.paper} 80%,
        transparent 100%);
    display: flex;
    align-items: center;
    transition: all .25s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 2;

    &:hover {
        opacity: 1;
        visibility: visible;
    }

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`
//#endregion

const Publishers = () => {
    const { data: publishers, isLoading, isSuccess, isError } = useGetPublishersQuery();
    const slideRef = useRef();

    //Scroll
    const scrollSlide = (n) => { slideRef.current.scrollLeft += n }

    let pubsContent;

    if (isLoading || isError) {
        pubsContent = (
            Array.from(new Array(15)).map((item, index) => (
                <ItemContainer key={`pub-${index}`}>
                    <Skeleton
                        variant="rectangular"
                        height={40}
                        width={100}
                        sx={{ mx: '3px' }}
                    />
                </ItemContainer>
            ))
        )
    } else if (isSuccess) {
        const { ids, entities } = publishers;

        pubsContent = ids?.length
            ? ids?.map((pubId, index) => {
                const pub = entities[pubId];

                return (
                    <ItemContainer key={`pub-${pubId}-${index}`}>
                        <Link to={`/store?pubs=${pubId}`} title={pub?.name}>
                            <StyledLazyImage
                                src={`${pub?.image}?size=small`}
                                alt={`Publisher: ${pub?.name}`}
                                placeholder={<Skeleton width={65} height={65} variant="rectangular" animation={false} />}
                            />
                        </Link>
                    </ItemContainer>
                )
            })
            : null
    }

    return (
        <PubContainer>
            <Wrapper draggable={true} ref={slideRef}>
                {pubsContent}
            </Wrapper>
            <ButtonContainer className="button-container">
                <div>
                    <IconButton aria-label="Scroll publishers to left" onClick={() => scrollSlide(-500)}>
                        <KeyboardArrowLeft fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Scroll publishers to right" onClick={() => scrollSlide(500)}>
                        <KeyboardArrowRight fontSize="small" />
                    </IconButton>
                </div>
            </ButtonContainer>
        </PubContainer>
    )
}

export default Publishers