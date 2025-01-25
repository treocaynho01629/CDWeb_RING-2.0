import { SnackbarProvider as NotistackProvider } from 'notistack';
import Snackbar from '../components/Snackbar';

const SnackbarProvider = ({ children }) => {
    return (
        <NotistackProvider
            maxSnack={3}
            autoHideDuration={1500}
            dense
            Components={{
                default: Snackbar,
                success: Snackbar,
                error: Snackbar,
                warning: Snackbar,
                info: Snackbar,
            }}
        >
            {children}
        </NotistackProvider>
    );
};

export default SnackbarProvider;