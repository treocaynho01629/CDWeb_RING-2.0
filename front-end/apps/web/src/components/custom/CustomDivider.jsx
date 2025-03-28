import { styled, Divider } from "@mui/material";

const StyledDivider = styled(Divider)(({ theme }) => ({
  fontSize: 18,
  fontWeight: "bold",
  textTransform: "uppercase",
  color: theme.palette.primary.dark,
  textAlign: "center",
  justifyContent: "center",
  margin: "15px 0",

  [theme.breakpoints.down("sm")]: {
    fontSize: 16,
    fontWeight: 500,
    padding: "0 10px",
    margin: "5px 0",
    textTransform: "none",
  },
}));

export default function CustomDivider(props) {
  return <StyledDivider {...props} />;
}
