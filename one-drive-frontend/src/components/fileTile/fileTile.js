import React, { useState } from 'react';
import { Card, CardContent, CardMedia, IconButton, Menu, MenuItem, Typography, Box, Avatar, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageIcon from '@mui/icons-material/Image';
import FolderIcon from '@mui/icons-material/Folder';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ShareModal from '../shareModal';
import genericPlaceholder from '../../assets/pdf.png'; 
import pdfPlaceholder from '../../assets/pdf.png';
import './fileTile.css';

const formatLastModified = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString();
};

const FileTile = ({ file, handleDownload, handleRename }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openShareModal, setOpenShareModal] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDoubleClick = () => {
    if (file.thumbnailUrl) {
      window.open(file.thumbnailUrl, '_blank');
    }
  };

  const displayTitle = file.name.length > 15 ? `${file.name.slice(0, 15)}...` : file.name;

  const openShareModalHandler = () => {
    setOpenShareModal(true);
    handleClose();
  };

  const isFolder = file.folder && file.folder.type === 'folder';
  const isPdf = file.name.endsWith('.pdf');
  //const isImage = file.mimeType && file.mimeType.startsWith('image/');

  const fileIcon = isFolder ? (
    <FolderIcon className="file-icon" />
  ) : isPdf ? (
    <PictureAsPdfIcon className="file-icon" />
  ) : (
    <ImageIcon className="file-icon" />
  );

  const imageUrl = isFolder
    ? genericPlaceholder
    : isPdf
    ? pdfPlaceholder
    : file['@microsoft.graph.downloadUrl'] || genericPlaceholder;

  return (
    <Card className="file-tile">
      <Box className="file-tile-header" onClick={handleClick}>
        <Box className="file-actions">
          {fileIcon}
          <Tooltip title={file.name} placement="top">
            <Typography className="file-title">{displayTitle}</Typography>
          </Tooltip>
        </Box>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
      <CardMedia
        component="img"
        className="file-thumbnail"
        image={imageUrl}
        alt={file.name}
        onDoubleClick={handleDoubleClick}
      />
      <CardContent className="file-details">
        <Box className="file-details-content">
          <Avatar className="file-avatar" src={file.avatarUrl} />
          <Box className="file-metadata">
            <Typography variant="caption" color="textSecondary">
              Last modified: {formatLastModified(file.lastModifiedDateTime)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        {!isFolder && (
          <MenuItem onClick={() => handleDownload(file)}>Download</MenuItem>
        )}
        <MenuItem onClick={openShareModalHandler}>Share</MenuItem>
        <MenuItem onClick={() => handleRename(file)}>Rename</MenuItem>
      </Menu>

      <ShareModal
        open={openShareModal}
        handleClose={() => setOpenShareModal(false)}
        file={file}
      />
    </Card>
  );
};

export default FileTile;
