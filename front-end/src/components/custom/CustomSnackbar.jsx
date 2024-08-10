import { Alert } from '@mui/material';
import { SnackbarContent, useSnackbar } from 'notistack';
import { forwardRef, useCallback } from 'react';

const CustomSnackbar = forwardRef(
    ({ id, ...props }, ref) => {
        const { closeSnackbar } = useSnackbar();

        const handleCloseSnackbar = useCallback(() => {
            closeSnackbar(id);
        }, [id, closeSnackbar]);

        return (
            <SnackbarContent ref={ref}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={props.variant ?? 'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {props.message}
                </Alert>
            </SnackbarContent>
        )
    }
)

export default CustomSnackbar;