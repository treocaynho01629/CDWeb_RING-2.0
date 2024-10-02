import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, LinearProgress, Rating } from '@mui/material';
import { EditOutlined, Star, StarBorder } from '@mui/icons-material';
import { numFormatter } from '../../ultils/covert';

//#region styled
const ReviewsInfoContainer = styled.div`
    display: flex;
    margin-top: 15px;
    text-transform: none;
    
    ${props => props.theme.breakpoints.down("md")} {
        padding-bottom: 10px;
        justify-content: center;
        border-bottom: .5px solid ${props => props.theme.palette.divider};
    }
`

const ScoreContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 20px;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0;
    }
`

const ProgressContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
    flex-grow: 3;
    padding-left: 20px;
    margin-left: 10px;
    max-width: 600px;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 0;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`

const Score = styled.h1`
    margin: 0;
    b { font-size: 30px;}

    ${props => props.theme.breakpoints.down("md")} {
        font-size: 40px;
        b {display: none;}
    }
`

const TotalLabel = styled.span`
    margin: 5px 0;
    font-size: 14px;
    color: ${props => props.theme.palette.text.secondary};
`

const ProgressLabel = styled.span`
    font-size: 14px;
`

const Progress = styled.div`
    display: flex;
    align-items: center;
`

const ProgressLabelContainer = styled.div`
    min-width: 45px;
    &.percent { min-width: 35px};
`

const ProgressBarContainer = styled.div`
    width: 100%;
    margin-right: 6px;
    color: ${props => props.theme.palette.warning.light};
`
//#endregion

function LinearProgressWithLabel(props) {
    const { label, value, ...otherProps } = props;

    return (
        <Progress>
            <ProgressLabelContainer>
                <ProgressLabel>{label}</ProgressLabel>
            </ProgressLabelContainer>
            <ProgressBarContainer>
                <LinearProgress sx={{ height: 5 }} color="inherit" variant="determinate" value={Math.round(value)} {...otherProps} />
            </ProgressBarContainer>
            <ProgressLabelContainer className="percent">
                <ProgressLabel>{`${Math.round(value)}%`}</ProgressLabel>
            </ProgressLabelContainer>
        </Progress>
    );
}

LinearProgressWithLabel.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

const ReviewInfo = ({ handleClick, rating, count = [] }) => {
    const reviewPercent = (value) => {
        const total = count[0] ?? 0;
        const result = (value == 0 || total == 0) ? 0 : (value / total) * 100;
        return result;
    }

    return (
        <ReviewsInfoContainer>
            <ScoreContainer>
                <Score>{(rating ?? 0).toFixed(1)}<b>/5</b></Score>
                <Rating
                    name="product-rating"
                    value={rating ?? 0}
                    readOnly
                    sx={{ fontSize: { xs: 18, sm: 24 } }}
                    icon={<Star fontSize="inherit" />}
                    emptyIcon={<StarBorder fontSize="inherit" />}
                />
                <TotalLabel>({numFormatter(count[0])} đánh giá)</TotalLabel>
            </ScoreContainer>
            <ProgressContainer>
                {[...Array(5)].map((item, index) =>
                    <LinearProgressWithLabel
                        key={`progress-${index + 1}`}
                        label={`${index + 1} sao`}
                        value={reviewPercent(count[index + 1] ?? 0)} />
                )}
            </ProgressContainer>
            <ButtonContainer>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={handleClick}
                    startIcon={<EditOutlined />}
                >
                    Viết đánh giá
                </Button>
            </ButtonContainer>
        </ReviewsInfoContainer>
    )
}

export default ReviewInfo