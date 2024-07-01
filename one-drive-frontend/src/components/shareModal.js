import React from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
const ShareModal = ({ open, handleClose, file }) => {

  const dummyUser = {
    name: 'abhijeet',
    email: 'abhijeet@gmail.com'
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="share-modal-title"
      aria-describedby="share-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" id="share-modal-title" gutterBottom>
          Share File: {file.title}
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          People with Access:
        </Typography>
        
        <List sx={{ mb: 2 }}>
          <ListItem>
            <ListItemText primary={dummyUser.name} secondary={dummyUser.email} />
          </ListItem>
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareModal;
