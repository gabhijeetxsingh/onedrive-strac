import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            const accessToken = localStorage.getItem('access_token');
            const client = axios.create({
                baseURL: 'https://graph.microsoft.com/v1.0',
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await client.put(`/me/drive/root/children/${file.name}/content`, formData);
                console.log('File uploaded:', response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div>
            <h1>Upload File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
