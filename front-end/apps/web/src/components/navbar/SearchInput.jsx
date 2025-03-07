import styled from "@emotion/styled";
import { Search, Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  inputBaseClasses,
  Paper,
  TextField,
  useAutocomplete,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";

//#region styled
const StyledSearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: row-reverse;
    justify-content: space-between;
  }
`;

const AutocompleteContainer = styled.div`
  width: 100%;
  position: relative;
`;

const StyledSearchInput = styled(TextField)`
  display: flex;
  color: inherit;
  background: ${({ theme }) => theme.palette.background.paper};

  ${({ theme }) => theme.breakpoints.down("md")} {
    width: 100%;
  }

  .${inputBaseClasses.input} {
    width: 100%;
    background: ${({ theme }) => theme.palette.background.paper};
  }

  .${inputBaseClasses.adornedEnd} {
    padding-right: 6px;
  }
`;

const ListBoxContainer = styled(Paper)`
  width: 100%;
  z-index: 1;
  position: absolute;
  margin-top: ${({ theme }) => theme.spacing(1.5)};
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.32));

  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: fixed;
    top: ${({ theme }) => theme.mixins.toolbar.minHeight + 16}px;
    left: 0;
    max-height: auto;
    height: 100vh;
    margin-top: 0;
  }
`;

const Listbox = styled.ul`
  max-height: 250px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: transparent;
  overflow: auto;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    max-height: auto;
    height: 100vh;
  }
`;

const ListItem = styled.li`
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(1)}`};

  &.Mui-focused {
    background-color: ${({ theme }) => theme.palette.action.hover};
    cursor: pointer;
  }

  &:active {
    background-color: ${({ theme }) => theme.palette.action.selected};
  }
`;

const StyledIconButton = styled(IconButton)`
  border-radius: 0;

  &:hover {
    background-color: transparent;
    color: ${({ theme, hoverColor }) =>
      theme.palette[hoverColor]?.main ?? theme.palette.primary.main};
  }
`;

const AdornmentContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchButton = styled(Button)`
  height: 28px;
  width: 48px;
  min-width: auto;
  padding: ${({ theme }) => theme.spacing(0.5)};

  svg {
    font-size: 22px;
  }
`;
//#endregion

const SearchInput = ({ searchField, setSearchField }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue,
    getClearProps,
  } = useAutocomplete({
    id: "autocomplete-input",
    options: [
      "The Godfather",
      "Pulp Fiction",
      "aaaa",
      "bbbbbb",
      "ccccc",
      "dddddd",
      "eeeeee",
      "fffffff",
      "ggggggg",
      "iiiiiii",
      "jjjjjj",
    ],
    freeSolo: true,
    openOnFocus: true,
  });

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

  let endAdornment = (
    <AdornmentContainer>
      {inputValue && (
        <StyledIconButton
          {...getClearProps()}
          aria-label="clear search value"
          hoverColor="error"
        >
          <Close fontSize="small" />
        </StyledIconButton>
      )}
      <SearchButton variant="contained" size="small" aria-label="submit search">
        <Search />
      </SearchButton>
    </AdornmentContainer>
  );

  return (
    <StyledSearchForm onSubmit={(e) => handleNavigateStore(e, searchField)}>
      <AutocompleteContainer {...getRootProps()}>
        <StyledSearchInput
          autoFocus
          placeholder="Tìm kiếm..."
          size="small"
          slotProps={{
            input: {
              endAdornment: endAdornment,
            },
            htmlInput: {
              ...getInputProps(),
            },
          }}
        />
        {groupedOptions.length > 0 ? (
          <ListBoxContainer elevation={7}>
            <Listbox {...getListboxProps()}>
              {groupedOptions.map((option, index) => {
                const { key, ...optionProps } = getOptionProps({
                  option,
                  index,
                });
                return (
                  <ListItem key={key} {...optionProps}>
                    {option}
                  </ListItem>
                );
              })}
            </Listbox>
          </ListBoxContainer>
        ) : null}
      </AutocompleteContainer>
    </StyledSearchForm>
  );
};

export default SearchInput;
