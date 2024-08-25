import { Alert } from '@mui/material';
import { SnackbarContent, SnackbarProvider, useSnackbar } from 'notistack';
import { forwardRef, useCallback } from 'react';

const CustomSnackbar = forwardRef(
    ({ id, ...props }, ref) => {
        const { closeSnackbar } = useSnackbar();

        const handleCloseSnackbar = useCallback(() => {
            closeSnackbar(id);
        }, [id, closeSnackbar]);

        return (
            <SnackbarContent ref={ref} style={{ width: '100%', backgroundColor: 'red' }}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={props.variant ?? 'success'}
                    variant="filled"
                    sx={{ width: '100%', color: 'white' }}
                >
                    {props.message}
                </Alert>
            </SnackbarContent>
        )
    }
)

const CustomSnackbarProvider = ({ children }) => {
    return (
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={1500}
            dense
            Components={{
                default: CustomSnackbar,
                success: CustomSnackbar,
                error: CustomSnackbar,
                warning: CustomSnackbar,
                info: CustomSnackbar,
            }}
        >
            {children}
        </SnackbarProvider>
    );
};

export default CustomSnackbarProvider;