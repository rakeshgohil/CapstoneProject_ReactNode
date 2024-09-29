import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { Typography } from '@mui/material';
export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = 'Upload files',
  ...other
}) {
  const [files, setFiles] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // To store all users fetched from the API
  const [users, setUsers] = useState([]); // To store all users fetched from the API
  const [selectedUserIds, setSelectedUserIds] = useState([]); // To store selected users for permission
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    if (open) {
      setFiles([]);
      fetchUsers(); // Fetch users when dialog is opened
    }
  }, [open]);
  const router = useRouter();


  // Fetch users from the /allusers API
  const fetchUsers = async () => {
    try {
      const loggedInUserId = localStorage.getItem('userid')
      const response = await axios.get('http://localhost:5000/users');
      console.log(response.data,"before");
      
      setUsers(response.data); // Assuming API returns users as an array
      const filteredUsers = users.filter(user => user.id !== loggedInUserId);
      setAllUsers(filteredUsers); // Update the state with filtered users
      console.log(allUsers,"after");

    
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      console.log('Accepted files:', acceptedFiles);
    },
    []
  );

  // Handle user selection for permission
  const handleUserSelection = (userId, event) => {
    if (event.target.checked) {
      setSelectedUserIds([...selectedUserIds, userId]); // Add user ID if checked
      console.log(selectedUserIds, "selected if")
    } else {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId)); // Remove user ID if unchecked
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadMessage('Please select at least one file to upload.');
      return;
    }

    if (selectedUserIds.length === 0) {
      setUploadMessage('Please select at least one user to share with.');
      return;
    }

    // Combine the logged-in user's ID with the selected user IDs
    // const combinedUserIds = [localStorage.getItem('userid'), ...selectedUserIds];
    const combinedUserIds = [parseInt(localStorage.getItem('userid')) || 0, ...selectedUserIds];


    const formData = new FormData();

    // Append each file to FormData
    files.forEach((file) => {
      formData.append('file', file); // Assuming the backend expects 'file' as the key
    });

    // Append combined user IDs as a JSON array
    formData.append('userids', JSON.stringify(combinedUserIds));

    // Optionally, append the logged-in user's ID separately
    // formData.append('userid', localStorage.getItem('userid') ?? '0');
    formData.append('userid', parseInt(localStorage.getItem('userid')) || 0);

    console.log('FormData before sending:', formData);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadMessage('File uploaded and shared successfully!');
      console.log('Response:', response.data);
      if (response.status === 200) {
        router.push('/dashboard/');
        // await checkUserSession?.();
        router.refresh();
      }
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setUploadMessage('Error uploading file. Please try again.');
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        {/* File Upload Component */}
        <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />

        {/* User Selection Section */}
        <div>
          <h4>Choose 4 users to share the uploaded file(s) with.</h4>
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div key={user.id} style={{ display: 'flex' }}>
                <input
                  type="checkbox"
                  id={`user_${user.id}`}
                  onChange={(e) => handleUserSelection(user.id, e)}
                />
                {/* <label htmlFor={`user_${user.id}`}>{user.name}</label> */}
<<<<<<< Updated upstream
                <Typography variant="subtitle2" htmlFor={`user_${user.id}`}>{user.firstname} {user.lastname}</Typography>
=======
                <Typography variant="subtitle2" htmlFor={`user_${user.id}`}>{user.firstname}-{user.lastname}</Typography>
>>>>>>> Stashed changes

              </div>
            ))
          ) : (
            <p>Loading users...</p>
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          Upload
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>

      {uploadMessage && (
        <div className="alert alert-info mt-3">{uploadMessage}</div>
      )}
    </Dialog>
  );
}
