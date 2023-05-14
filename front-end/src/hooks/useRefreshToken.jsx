import axios from '../api/axios';
import useAuth from './useAuth';
import { useCookies } from 'react-cookie';
import jwt from 'jwt-decode';

const REFRESH_URL = '/api/v1/auth/refresh-token';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const [ cookies ] = useCookies(['refreshToken'])

    const refresh = async () => {
        const response = await axios.get(REFRESH_URL, {
            headers: { 'Content-Type': 'application/json'
                 ,'Authorization': `Bearer ` + cookies.refreshToken},
            withCredentials: true
        });

        setAuth(prev => {
            const accessToken = response.data.token;
            const roles = response.data.roles;
            const tokenData = jwt(accessToken);
            const userName = tokenData.sub;

            // console.log(accessToken);

            return {
                ...prev,
                userName: userName,
                roles: roles,
                accessToken: accessToken
            }
        });
        
        return response.data.token;
    }
    return refresh;
};

export default useRefreshToken;