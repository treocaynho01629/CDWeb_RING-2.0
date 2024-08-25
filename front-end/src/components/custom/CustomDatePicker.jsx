import { FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { viVN } from '@mui/x-date-pickers/locales';
import localeVi from "dayjs/locale/vi";

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: 0,
    },
    '& label.Mui-focused': {
        color: theme.palette.action.focus
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.action.focus,
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 0,
        '& fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.action.focus,
        },
        '&:hover fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.action.hover,
        },
        '&.Mui-focused fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.action.focus,
        },
    },
    '& input:valid + fieldset': {
        borderColor: theme.palette.action.focus,
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:invalid + fieldset': {
        borderColor: theme.palette.error.main,
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
        borderColor: theme.palette.primary.main,
        borderLeftWidth: 4,
        borderRadius: 0,
        padding: '4px !important',
    },
}));

const CustomDatePicker = (props) => {
    return (
        <LocalizationProvider
            localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
            dateAdapter={AdapterDayjs}
            adapterLocale="vi"
        >
            <FormControl margin="dense" fullWidth>
                <StyledDatePicker {...props} />
            </FormControl>
        </LocalizationProvider>
    )
}

export default CustomDatePicker