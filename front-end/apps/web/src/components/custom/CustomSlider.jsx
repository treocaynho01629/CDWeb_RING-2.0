import Slider from "@mui/material/Slider";
import { styled } from "@mui/material";

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 8,
  marginBottom: theme.spacing(1.5),

  "& .MuiSlider-track": {
    border: "none",
    background: "transparent",
    backgroundImage: `linear-gradient(to right, 
        ${theme.palette.primary.dark}, 
        ${theme.palette.primary.main} 50%, 
        ${theme.palette.primary.light})`,
  },

  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: theme.palette.common.white,
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function CustomSlider(props) {
  return <StyledSlider {...props} />;
}
