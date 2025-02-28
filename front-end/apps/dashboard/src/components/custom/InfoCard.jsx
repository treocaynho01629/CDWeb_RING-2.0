import styled from "@emotion/styled";
import { TrendingDown, TrendingFlat, TrendingUp } from "@mui/icons-material";
import { alpha, Paper, Skeleton } from "@mui/material";

//#region preStyled
const InfoWrapper = styled(Paper)`
  display: flex;
  position: relative;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(2.5)};
  overflow: hidden;
  height: 100%;
  z-index: 1;

  &:before {
    content: "";
    position: absolute;
    top: -35%;
    left: -50px;
    height: 110%;
    aspect-ratio: 1/1;
    background-color: ${({ theme, color }) =>
      theme.palette[color]?.light || theme.palette.primary.light};
    opacity: 0.3;
    transform: rotate(45deg);
    z-index: -1;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  white-space: nowrap;

  span {
    font-weight: 450;
  }

  h2 {
    font-weight: 600;
    margin: 4px 0;
  }

  svg {
    font-size: 2.75em;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
`;

const Diff = styled.span`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  width: 0;
  overflow: visible;

  span {
    white-space: nowrap;
  }

  svg {
    font-size: 24px;
    border-radius: 50%;
    padding: 4px;
    background-color: color-mix(in srgb, currentColor 20%, transparent);
  }
`;
//#endregion

const InfoCard = ({ info, icon, color }) => {
  const diff = info?.diff;

  return (
    <InfoWrapper elevation={3} color={color}>
      <InfoContainer>
        {icon}
        <div>
          <span>
            {info != null ? (
              info?.label
            ) : (
              <Skeleton variant="text" width="120px" />
            )}
          </span>
          <h2>
            {info != null ? (
              info?.value
            ) : (
              <Skeleton variant="text" width="80px" />
            )}
          </h2>
        </div>
      </InfoContainer>
      {diff != null && (
        <Diff>
          {diff > 0 ? (
            <TrendingUp color="success" />
          ) : diff < 0 ? (
            <TrendingDown color="error" />
          ) : (
            <TrendingFlat />
          )}
          &nbsp;{diff * 100}%&nbsp;<span>tháng trước</span>
        </Diff>
      )}
    </InfoWrapper>
  );
};

export default InfoCard;
