import { styled, tabClasses, tabsClasses } from "@mui/material";
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

  [`&.${tabClasses.root}`]: {
    minHeight: 44,
    height: 44,
  },

  [theme.breakpoints.down("sm")]: {
    [`&.${tabClasses.root}`]: {
      minHeight: 40,
      height: 40,
    },
  },
}));

const StyledTabs = styled((props) => <Tabs {...props} />)(({ theme }) => ({
  [`&.${tabsClasses.root}`]: {
    minHeight: 44,
    height: 44,
  },
  [`.${tabsClasses.indicator}`]: {
    height: "2.5px",

    ...theme.applyStyles("light", {
      backgroundColor: theme.palette.primary.dark,
    }),
  },

  [`.${tabsClasses.scrollButtons}`]: {
    "&.Mui-disabled": {
      width: 0,
    },
  },

  [theme.breakpoints.down("sm")]: {
    [`&.${tabsClasses.root}`]: {
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
