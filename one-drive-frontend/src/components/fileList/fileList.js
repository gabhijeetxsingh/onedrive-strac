import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileTile from '../fileTile/fileTile';
import { Box, TextField, Modal, Typography, Button } from '@mui/material';
import './fileList.css';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
      const fetchFiles = async () => {
          const accessToken = localStorage.getItem('access_token');

              try {
                  const response = await axios.get('http://localhost:3001/get/files?access_token='+accessToken);

                  console.log(response.data);
                  setFiles(response.data.value);
              } catch (error) {
                  console.error('Error fetching access token:', error);
              }
          };

      fetchFiles();
  }, []);


  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, files]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDownload = (file) => {
    console.log(`Downloading file: ${file.title}`);
    window.location.href = file['@microsoft.graph.downloadUrl'];
  };

  const handleRename = (file) => {
    setSelectedFile(file);
    setNewFileName(file.title);
    setOpenRenameModal(true);
  };

  const handleCloseRenameModal = () => {
    setOpenRenameModal(false);
    setNewFileName('');
    setSelectedFile(null);
  };

  const handleRenameSubmit = () => {
    console.log(`Renaming file ${selectedFile.title} to ${newFileName}`)

    handleCloseRenameModal();
  };

  return (
    <Box className="file-list-container">
      <TextField
        label="Search by File Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <Box className="file-tile-container">
        {filteredFiles.map((file) => (
          <FileTile
            key={file.id}
            file={file}
            handleDownload={handleDownload}
            handleRename={handleRename}
          />
        ))}
      </Box>

      <Modal
        open={openRenameModal}
        onClose={handleCloseRenameModal}
        aria-labelledby="rename-modal-title"
        aria-describedby="rename-modal-description"
      >
        <Box className="rename-modal">
          <Typography variant="h6" id="rename-modal-title">
            Rename File: {selectedFile && selectedFile.title}
          </Typography>
          <TextField
            label="New File Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <Button onClick={handleRenameSubmit} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FileList;