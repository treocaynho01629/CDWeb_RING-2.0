import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    const createNoti = async () => {
        const { enqueueSnackbar } = await import('notistack');
        enqueueSnackbar('Server có thể mất một lúc để khởi động!', { variant: 'warning', autoHideDuration: 30000 });
    }

    useEffect(() => {
        createNoti();
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;