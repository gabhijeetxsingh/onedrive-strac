import React from 'react';
import axios from 'axios';
import './login.css';
import drive from '../../assets/drive.png'; 

const Login = () => {

    const handleLoginButtonClick = async () => {
        const response = await axios.get('http://localhost:3001/login');
        if (response) {
            window.location.href = response.data;
        }
    };

    return (
        <div className="login-container">
            <img src={drive} alt="Drive" className="drive-image" /> {/* Add the image */}
            <button className="login-button" onClick={handleLoginButtonClick}>
                <i className="fab fa-microsoft"></i> Login with Microsoft
            </button>
            <div className="upload-message">
                <i className="fas fa-upload upload-icon"></i>
            </div>
        </div>
    );
};

export default Login;