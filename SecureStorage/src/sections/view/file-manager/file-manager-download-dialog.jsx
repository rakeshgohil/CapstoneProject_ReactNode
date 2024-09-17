// import { useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import TextField from '@mui/material/TextField';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogActions from '@mui/material/DialogActions';
// import axios from 'axios';

// export function FileManagerDownloadDialog({ open, selectedFile, onClose }) {
//   const [tokens, setTokens] = useState(['', '', '', '']);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleTokenChange = (index, event) => {
//     const newTokens = [...tokens];
//     newTokens[index] = event.target.value;
//     setTokens(newTokens);
//   };

//   const handleSubmit = async () => {
//     if (tokens.some(token => token.trim() === '')) {
//       setErrorMessage('Please enter all four tokens.');
//       return;
//     }

//     const payload = {
//       fileId: selectedFile.id,
//       shares: tokens,
//     };

//     try {
//       const response = await axios.post('http://localhost:5000/validate-shares', payload);

//       if (response.data.valid) {
//         const downloadUrl = `http://localhost:5000/download/${selectedFile.id}`;
//         window.location.href = downloadUrl;
        
//       } else {
//         setErrorMessage('Invalid tokens. Unable to reconstruct the file secret.');
//       }
//     } catch (error) {
//       console.error('Error validating tokens:', error);
//       setErrorMessage('Error validating tokens. Please try again.');
//     }
//   };

//   return (
//     <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
//       <DialogTitle>Enter Tokens for Download</DialogTitle>

//       <Box sx={{ px: 3, py: 2 }} style={{overflow:'hidden'}}>
//         {tokens.map((token, index) => (
//           <TextField
//             key={index}
//             fullWidth
//             value={token}
//             placeholder={`Token ${index + 1}`}
//             onChange={(event) => handleTokenChange(index, event)}
//             sx={{ mb: 2 }}
//           />
//         ))}

//         {errorMessage && (
//           <Box sx={{ color: 'error.main', mb: 2 }}>
//             {errorMessage}
//           </Box>
//         )}
//       </Box>

//       <DialogActions>
//         <Button variant="outlined" color="inherit" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button variant="contained" onClick={handleSubmit}>
//           Validate and Download
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }


import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import axios from 'axios';

export function FileManagerDownloadDialog({ open, selectedFile, onClose }) {
  // State for tokens (3 tokens required)
  const [tokens, setTokens] = useState(['', '', '']);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle token input changes
  const handleTokenChange = (index, event) => {
    const newTokens = [...tokens];
    newTokens[index] = event.target.value;
    setTokens(newTokens);

    // Clear the error message when the user starts typing again
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Validate and submit the tokens
  const handleSubmit = async () => {
    // Ensure all tokens are filled
    if (tokens.some(token => token.trim() === '')) {
      setErrorMessage('Please enter all three tokens.');
      return;
    }

    const payload = {
      fileId: selectedFile.id,
      shares: tokens,
    };

    try {
      const response = await axios.post('http://localhost:5000/validate-shares', payload);

      if (response.data.valid) {
        const downloadUrl = `http://localhost:5000/download/${selectedFile.id}`;
        window.location.href = downloadUrl;  // Trigger download
      } else {
        setErrorMessage('Invalid tokens. Unable to reconstruct the file secret.');
      }
    } catch (error) {
      console.error('Error validating tokens:', error);
      setErrorMessage('Error validating tokens. Please try again.');
    }
  };

  // Reset tokens and error message on dialog close
  const handleClose = () => {
    setTokens(['', '', '']);  // Reset tokens
    setErrorMessage('');      // Reset error message
    onClose();                // Trigger the onClose callback
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} PaperProps={{
      style: { borderRadius: 15, padding: '16px' },
    }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pb: 2 }}>Enter 3 Tokens for Download</DialogTitle>

      <Box sx={{ px: 3, py: 2 }}>
        {/* Render 3 token input fields */}
        {tokens.map((token, index) => (
          <TextField
            key={index}
            fullWidth
            value={token}
            placeholder={`Token ${index + 1}`}
            onChange={(event) => handleTokenChange(index, event)}
            sx={{ mb: 2 }}
            error={!!errorMessage}  
            variant="outlined"
            InputProps={{
              style: { borderRadius: 8 },
            }}
          />
        ))}

        {/* Display error message */}
        {errorMessage && (
          <Typography sx={{ color: 'error.main', mb: 2, textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        )}
      </Box>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose} sx={{ borderRadius: 8 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 8 }}>
          Validate and Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}
