import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getAccessToken = async (code) => {
 
            try {
                const response = await axios.get('http://localhost:3001/callback?code=' + code);
                localStorage.setItem('access_token', response.data.accessToken);
                navigate('/files');
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
            localStorage.removeItem('have');
        };

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log(code , !localStorage.getItem('have'), code && !localStorage.getItem('have'))
        if (code && !localStorage.getItem('have')) {
            localStorage.setItem('have', 'true');
            console.log(code)
            getAccessToken(code);
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default Callback;