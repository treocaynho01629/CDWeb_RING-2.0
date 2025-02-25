import styled from "@emotion/styled";
import {
  alpha,
  Box,
  Collapse,
  Paper,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  stepLabelClasses,
  Stepper,
} from "@mui/material";
import {
  AssignmentReturnOutlined,
  Check,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardReturn,
  LocalShippingOutlined,
  PaymentsOutlined,
  PublishedWithChanges,
  ReceiptOutlined,
  SaveAltOutlined,
  StarBorder,
} from "@mui/icons-material";
import { dateFormatter, orderTypes, timeFormatter } from "@ring/shared";
import { useState } from "react";
import { ToggleArrow } from "../custom/OrderComponents";
import PropTypes from "prop-types";

//#region styled
const DateText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: ${({ theme }) => theme.spacing(0.5)} 0 0;

  p {
    margin: 0;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: flex;
  }
`;

const StepperContainer = styled.div`
  background-color: ${({ theme, color }) =>
    alpha(theme.palette[color]?.light ?? theme.palette.primary.light, 0.3)};
  border: 0.5px solid
    ${({ theme, color }) =>
      theme.palette[color]?.light ?? theme.palette.primary.light};
  padding: ${({ theme }) => theme.spacing(2)} 0;
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  ${({ theme }) => theme.breakpoints.down("md")} {
    background-color: transparent;
    border-top: none;
    border-color: ${({ theme }) => theme.palette.divider};
    padding: ${({ theme }) => `${theme.spacing(1.5)} ${theme.spacing(2.5)}`};
    margin: 0;
  }
`;

const StyledStepConnector = styled(StepConnector)(({ theme, color }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 26,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, 
        hsl(from ${theme.palette[color]?.main ?? theme.palette.primary.main} calc(h - 30) s l),
        ${theme.palette[color]?.main ?? theme.palette.primary.main} 80%, 
        ${theme.palette[color]?.main ?? theme.palette.primary.main})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, 
          hsl(from ${theme.palette[color]?.main ?? theme.palette.primary.main} calc(h - 30) s l),
        ${theme.palette[color]?.main ?? theme.palette.primary.main} 80%, 
        ${theme.palette[color]?.main ?? theme.palette.primary.main})`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[700],
    }),
  },

  [theme.breakpoints.down("md")]: {
    [`& .${stepConnectorClasses.line}`]: {
      width: 3,
      transform: "scaleY(3)",
    },
    [`&.${stepConnectorClasses.vertical}`]: {
      height: 5,
      marginLeft: 18,
    },
  },
}));

const StyledStepIconRoot = styled("div")(({ theme, color, ownerState }) => ({
  zIndex: 1,
  width: 54,
  height: 54,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  border: "3.5px solid",
  borderColor:
    ownerState.active || ownerState.completed
      ? (theme.palette[color]?.main ?? theme.palette.primary.main)
      : theme.palette.grey[300],
  color:
    ownerState.active || ownerState.completed
      ? (theme.palette[color]?.main ?? theme.palette.primary.main)
      : theme.palette.text.disabled,
  backgroundColor: theme.palette.background.default,
  alignItems: "center",
  ...theme.applyStyles("dark", {
    borderColor:
      ownerState.active || ownerState.completed
        ? (theme.palette[color]?.main ?? theme.palette.primary.main)
        : theme.palette.grey[700],
  }),

  [theme.breakpoints.down("md")]: {
    width: 38,
    height: 38,
    marginRight: theme.spacing(1.5),
  },
}));

const StatusTag = styled.div`
  background-color: ${({ theme, color }) =>
    alpha(theme.palette[color]?.light ?? theme.palette.primary.light, 0.3)};
  color: ${({ theme, color }) =>
    theme.palette[color]?.main ?? theme.palette.primary.main};
  border: 0.5px solid;
  border-color: currentColor;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  font-weight: 500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  p {
    text-transform: none;
    font-size: 14px;
    margin: ${({ theme }) => theme.spacing(1)} 0 0;
    filter: brightness(0.9);
  }
`;

const StyledStepLabel = styled(StepLabel)`
  ${({ theme }) => theme.breakpoints.down("md")} {
    .${stepLabelClasses.label} {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

const LabelCheck = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme, color }) =>
    alpha(theme.palette[color]?.light ?? theme.palette.primary.light, 0.3)};
  color: ${({ theme, color }) =>
    theme.palette[color]?.main ?? theme.palette.primary.main};

  svg {
    font-size: 16px;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: none;
  }
`;

const SummaryIcon = styled.span`
  svg {
    font-size: 35px;
  }
`;
//#endregion

function StyledStepIcon(props) {
  const { active, completed, className, color, icon } = props;

  return (
    <StyledStepIconRoot
      ownerState={{ completed, active }}
      className={className}
      color={color}
    >
      {icon}
    </StyledStepIconRoot>
  );
}

StyledStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = [
  { label: "Đặt hàng", icon: <ReceiptOutlined /> },
  { label: "Thanh toán", icon: <PaymentsOutlined /> },
  { label: "Giao hàng", icon: <LocalShippingOutlined /> },
  { label: "Nhận hàng", icon: <SaveAltOutlined /> },
  { label: "Hoàn tất", icon: <StarBorder /> },
];
const refundSteps = [
  { label: "Đặt hàng", icon: <ReceiptOutlined /> },
  { label: "Hoàn tất", icon: <Check /> },
  { label: "Chờ trả hàng", icon: <LocalShippingOutlined /> },
  { label: "Kiểm tra hàng", icon: <PublishedWithChanges /> },
  { label: "Hoàn tiền", icon: <AssignmentReturnOutlined /> },
];
const cancelSteps = [
  { label: "Đặt hàng", icon: <ReceiptOutlined /> },
  { label: "Đã huỷ đơn", icon: <Close /> },
];

const OrderProgress = ({
  order,
  detailSummary,
  detailStatus,
  orderedDate,
  date,
  tabletMode,
}) => {
  const [open, setOpen] = useState(false);

  const toggleStepper = () => {
    setOpen((prev) => !prev);
  };

  let stepper = (
    <StepperContainer color={detailStatus?.color}>
      <Stepper
        alternativeLabel={!tabletMode}
        connector={<StyledStepConnector color={detailStatus?.color} />}
        activeStep={detailSummary?.step}
        orientation={tabletMode ? "vertical" : "horizontal"}
      >
        {(order?.status == orderTypes.CANCELED.value
          ? cancelSteps
          : order?.status == orderTypes.PENDING_REFUND.value ||
              order?.status === orderTypes.REFUNDED.value
            ? refundSteps
            : steps
        ).map((step, index) => (
          <Step key={index}>
            <StyledStepLabel
              slotProps={{
                stepIcon: {
                  color: detailStatus?.color,
                  icon: step.icon,
                },
              }}
              slots={{ stepIcon: StyledStepIcon }}
            >
              <div>
                {step.label}
                {index == 0 && (
                  <DateText>
                    <span>{timeFormatter(orderedDate)}&nbsp;</span>
                    <p>{dateFormatter(orderedDate)}</p>
                  </DateText>
                )}
                {index == detailSummary?.step && (
                  <DateText>
                    <span>{timeFormatter(date)}&nbsp;</span>
                    <p>{dateFormatter(date)}</p>
                  </DateText>
                )}
              </div>
              {detailSummary?.step >= index && (
                <LabelCheck color={detailStatus?.color}>
                  {order?.status == orderTypes.CANCELED.value ? (
                    <Close />
                  ) : order?.status == orderTypes.PENDING_REFUND.value ||
                    order?.status === orderTypes.REFUNDED.value ? (
                    <KeyboardReturn />
                  ) : (
                    <Check />
                  )}
                </LabelCheck>
              )}
            </StyledStepLabel>
          </Step>
        ))}
      </Stepper>
    </StepperContainer>
  );

  return (
    <>
      {tabletMode ? (
        <Paper elevation={3} sx={{ width: "90%", mx: "auto", my: 1 }}>
          <StatusTag color={detailStatus?.color} onClick={toggleStepper}>
            <div>
              <Box display="flex" alignItems="center">
                {detailStatus?.label}
                <ToggleArrow>
                  {open ? (
                    <KeyboardArrowUp fontSize="small" />
                  ) : (
                    <KeyboardArrowDown fontSize="small" />
                  )}
                </ToggleArrow>
              </Box>
              <p>{detailSummary?.summary}</p>
            </div>
            <SummaryIcon>
              {order?.status == orderTypes.CANCELED.value
                ? cancelSteps[detailSummary?.step]?.icon
                : order?.status == orderTypes.REFUNDED.value
                  ? refundSteps[detailSummary?.step]?.icon
                  : steps[detailSummary?.step]?.icon}
            </SummaryIcon>
          </StatusTag>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {stepper}
          </Collapse>
        </Paper>
      ) : (
        <>{stepper}</>
      )}
    </>
  );
};

export default OrderProgress;
