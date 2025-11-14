import { use, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../../contextAPI/AuthProvider/AuthContext';

export default function Logout() {
    const { logout } = use(AuthContext);
    const navigate = useNavigate();
    //-----------------------------
    useEffect(() => {
        logout();
        navigate('/auth/login');
    }, [logout, navigate]);
    //==========
    return null;
};
