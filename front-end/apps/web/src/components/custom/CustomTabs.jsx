import { styled } from "@mui/material";
import { Tab, Tabs } from "@mui/material";

const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  fontWeight: 500,
  textTransform: "none",

  "&.Mui-selected": {
    fontWeight: 550,

    ...theme.applyStyles("light", {
      color: theme.palette.primary.dark,
    }),
  },

  "&.MuiTab-root": {
    minHeight: 44,
    height: 44,
  },

  [theme.breakpoints.down("sm")]: {
    "&.MuiTab-root": {
      minHeight: 40,
      height: 40,
    },
  },
}));

const StyledTabs = styled((props) => <Tabs {...props} />)(({ theme }) => ({
  "&.MuiTabs-root": {
    minHeight: 44,
    height: 44,
  },
  "& .MuiTabs-indicator": {
    height: "2.5px",

    ...theme.applyStyles("light", {
      backgroundColor: theme.palette.primary.dark,
    }),
  },

  [theme.breakpoints.down("sm")]: {
    "&.MuiTabs-root": {
      minHeight: 40,
      height: 40,
    },
  },
}));

export const CustomTab = (props) => {
  return <StyledTab {...props} />;
};

export const CustomTabs = (props) => {
  return <StyledTabs {...props} />;
};
