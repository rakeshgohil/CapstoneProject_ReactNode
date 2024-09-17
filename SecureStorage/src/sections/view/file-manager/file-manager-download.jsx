import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios'; // For making API calls
import { toast } from 'src/components/snackbar'; // Using toast for messages

export function FileManagerDownload({
  open,
  selectedFile, // File selected for download
  onClose,
  isDialogopen,
  onDownload,
  ...other
}) {
  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [token3, setToken3] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handler for submitting the tokens
  const handleSubmitTokens = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file first.');
      return;
    }

    if (!token1 || !token2 || !token3) {
      setErrorMessage('Please enter all three tokens.');
      return;
    }

    const payload = {
      fileId: selectedFile.id, // Assuming selectedFile contains the file ID
      shares: [token1, token2, token3]
    };

    try {
      const response = await axios.post('http://localhost:5000/validate-shares', payload);
      if (response.data.valid) {
        toast.success('Tokens are valid! Downloading file...');
        onDownload(selectedFile); // Call the onDownload function if tokens are valid
      } else {
        setErrorMessage('Invalid tokens. Unable to reconstruct the file secret.');
      }
    } catch (error) {
      console.error('Error validating tokens:', error);
      setErrorMessage('Error validating tokens. Please try again.');
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle>Download</DialogTitle>
      <DialogTitle>Please enter three tokens</DialogTitle>

      {/* Token Input Fields */}
      <Box sx={{ px: 3 }}>
        <TextField
          fullWidth
          placeholder="Token 1"
          value={token1}
          onChange={(e) => setToken1(e.target.value)} // Track token 1 input
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          placeholder="Token 2"
          value={token2}
          onChange={(e) => setToken2(e.target.value)} // Track token 2 input
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          placeholder="Token 3"
          value={token3}
          onChange={(e) => setToken3(e.target.value)} // Track token 3 input
          sx={{ mb: 2 }}
        />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Show error message */}
      </Box>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" color="inherit" onClick={handleSubmitTokens}>
          Download
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
