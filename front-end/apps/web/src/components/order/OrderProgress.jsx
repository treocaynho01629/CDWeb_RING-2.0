import styled from "@emotion/styled";
import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
} from "@mui/material";
import {
  AssignmentReturnOutlined,
  Close,
  LocalShippingOutlined,
  PaymentsOutlined,
  PublishedWithChanges,
  ReceiptOutlined,
  SaveAltOutlined,
  StarBorder,
} from "@mui/icons-material";
import { dateFormatter, orderTypes, timeFormatter } from "@ring/shared";
import PropTypes from "prop-types";

//#region styled
const ErrorText = styled.span`
  font-size: 18px;
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.error.main};
`;

const DateText = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.secondary};
  margin: ${(props) => props.theme.spacing(0.5)} 0 0;

  ${(props) => props.theme.breakpoints.down("md_lg")} {
    display: none;
  }
`;

const StepperContainer = styled.div`
  margin: ${(props) => props.theme.spacing(2)} 0;
`;

const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 26,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, 
        ${theme.palette.primary.main}, 
        ${theme.palette.success.main} 80%, 
        ${theme.palette.success.main})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, 
        ${theme.palette.primary.main}, 
        ${theme.palette.success.main} 80%, 
        ${theme.palette.success.main})`,
    },
  },
  [`&.refund`]: {
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: `linear-gradient(to right, 
          ${theme.palette.error.main}, 
          ${theme.palette.warning.main} 80%, 
          ${theme.palette.warning.main})`,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: `linear-gradient(to right, 
          ${theme.palette.error.main}, 
          ${theme.palette.warning.main} 80%, 
          ${theme.palette.warning.main})`,
      },
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const StyledStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  zIndex: 1,
  width: 55,
  height: 55,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  border: "3.5px solid",
  borderColor:
    ownerState.active || ownerState.completed
      ? theme.palette.success.main
      : "#ccc",
  color:
    ownerState.active || ownerState.completed
      ? theme.palette.success.main
      : "#fff",
  backgroundColor: theme.palette.background.default,
  alignItems: "center",
  ...theme.applyStyles("dark", {
    borderColor:
      ownerState.active || ownerState.completed
        ? theme.palette.success.main
        : theme.palette.grey[700],
  }),

  [`&.refund`]: {
    borderColor:
      ownerState.active || ownerState.completed
        ? theme.palette.warning.main
        : "#ccc",
    color:
      ownerState.active || ownerState.completed
        ? theme.palette.warning.main
        : "#fff",
  },
}));
//#endregion

function StyledStepIcon(props) {
  const { active, completed, className, stepIcon } = props;

  const icons = {
    1: <ReceiptOutlined />,
    2: <PaymentsOutlined />,
    3: <LocalShippingOutlined />,
    4: <SaveAltOutlined />,
    5: <StarBorder />,
  };

  const refundIcons = {
    1: <ReceiptOutlined />,
    2: <LocalShippingOutlined />,
    3: <PublishedWithChanges />,
    4: <AssignmentReturnOutlined />,
  };

  return (
    <StyledStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {stepIcon
        ? stepIcon
        : className == "refund"
          ? refundIcons[String(props.icon)]
          : icons[String(props.icon)]}
    </StyledStepIconRoot>
  );
}

StyledStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = ["Đặt hàng", "Thanh toán", "Giao hàng", "Nhận hàng", "Hoàn tất"];
const refundSteps = ["Đặt hàng", "Chờ trả hàng", "Kiểm tra hàng", "Hoàn tiền"];

const OrderProgress = ({ order, detailSummary, orderedDate, date }) => {
  return (
    <StepperContainer>
      {order?.status == orderTypes.CANCELED.value ? (
        <Stepper
          alternativeLabel
          connector={<StyledStepConnector />}
          activeStep={detailSummary?.step}
        >
          <Step>
            <StepLabel
              error
              slotProps={{
                stepIcon: {
                  stepIcon: <Close />,
                },
              }}
              slots={{ stepIcon: StyledStepIcon }}
            >
              <ErrorText>Đã huỷ đơn</ErrorText>
            </StepLabel>
          </Step>
        </Stepper>
      ) : order?.status == orderTypes.PENDING_REFUND.value ||
        order?.status === orderTypes.REFUNDED.value ? (
        <Stepper
          alternativeLabel
          connector={<StyledStepConnector className="refund" />}
          activeStep={detailSummary?.step}
        >
          {refundSteps.map((label, index) => (
            <Step key={`refund-${index}`}>
              <StepLabel
                slotProps={{
                  stepIcon: {
                    className: "refund",
                  },
                }}
                slots={{ stepIcon: StyledStepIcon }}
              >
                {label}
                {index == 0 && (
                  <DateText>
                    {timeFormatter(orderedDate)}&nbsp;
                    {dateFormatter(orderedDate)}
                  </DateText>
                )}
                {index == detailSummary?.step && (
                  <DateText>
                    {timeFormatter(date)}&nbsp;{dateFormatter(date)}
                  </DateText>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      ) : (
        <Stepper
          alternativeLabel
          activeStep={detailSummary?.step}
          connector={<StyledStepConnector />}
        >
          {steps.map((label, index) => (
            <Step key={`step-${index}`}>
              <StepLabel slots={{ stepIcon: StyledStepIcon }}>
                {label}
                {index == 0 && (
                  <DateText>
                    {timeFormatter(orderedDate)}&nbsp;
                    {dateFormatter(orderedDate)}
                  </DateText>
                )}
                {index == detailSummary?.step && (
                  <DateText>
                    {timeFormatter(date)}&nbsp;{dateFormatter(date)}
                  </DateText>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </StepperContainer>
  );
};

export default OrderProgress;
