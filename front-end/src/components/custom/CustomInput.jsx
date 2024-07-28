import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

const StyledInput = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: theme.palette.primary.main
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 0,
        '& fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.primary.main,
        },
        '&:hover fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.primary.light,
        },
        '&.Mui-focused fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.primary.dark,
        },
    },
    '& input:valid + fieldset': {
        borderColor: 'lightgray',
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:invalid + fieldset': {
        borderColor: theme.palette.error.main,
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
        borderColor: theme.palette.secondary.main,
        borderLeftWidth: 4,
        borderRadius: 0,
        padding: '4px !important',
    },
    '& .MuiFormHelperText-root': {
        width: 250,
    },
}));

export default function CustomInput(props) {
    const { typeToggle } = props;
    const [showPassword, setShowPassword] = useState(false);

    //Toggle type
    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const handleMouseDownPassword = (e) => { e.preventDefault() };

    if (typeToggle) {
        const endAdornment =
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
            </InputAdornment>

        return (
            <StyledInput
                {...props}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: endAdornment
                }}
            />
        )
    } else {
        return <StyledInput {...props} />;
    }
}