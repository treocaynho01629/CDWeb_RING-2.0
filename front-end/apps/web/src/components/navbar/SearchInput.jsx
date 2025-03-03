import styled from "@emotion/styled";
import { Search, Close } from "@mui/icons-material";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";

//#region styled
const StyledSearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: row-reverse;
  }
`;

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  color: "inherit",
  background: theme.palette.background.paper,

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  "& .MuiInputBase-input": {
    background: theme.palette.background.paper,
    transition: theme.transitions.create("width"),
    width: "100%",

    [theme.breakpoints.up("md")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,

  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
  },
}));
//#endregion

const SearchInput = ({
  searchField,
  setSearchField,
  setToggle,
  setFocus,
  isToggleSearch,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleSearch = () => {
    setToggle((prev) => !prev);
  };

  //Confirm search
  const handleNavigateStore = (e, value) => {
    e.preventDefault();
    let { pathname } = location;
    let search;
    if (!pathname.startsWith("/store")) {
      pathname = "/store";
      search = value != "" ? `?q=${value}` : "";
    } else {
      value != "" ? searchParams.set("q", value) : searchParams.delete("q");
      search = searchParams.toString();
    }
    navigate({ pathname, search });
  };

  return (
    <StyledSearchForm onSubmit={(e) => handleNavigateStore(e, searchField)}>
      {isToggleSearch && (
        <Autocomplete
          disablePortal
          freeSolo
          options={["The Godfather", "Pulp Fiction"]}
          renderInput={(params) => (
            <StyledSearchInput
              {...params}
              placeholder="Tìm kiếm... "
              size="small"
            />
          )}
        />
      )}
      <StyledIconButton aria-label="search toggle" onClick={toggleSearch}>
        {isToggleSearch ? (
          <Close sx={{ fontSize: "26px" }} />
        ) : (
          <Search sx={{ fontSize: "26px" }} />
        )}
      </StyledIconButton>
      {/* <StyledSearchInput
              {...params}
              placeholder="Tìm kiếm... "
              autoFocus
              autoComplete="search"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onChange={(e) => setSearchField(e.target.value)}
              value={searchField}
              id="search"
              size="small"
              slotProps={{
                input: {
                  startAdornment: <Search sx={{ marginRight: 1 }} />,
                },
              }}
            /> */}
    </StyledSearchForm>
  );
};

export default SearchInput;
