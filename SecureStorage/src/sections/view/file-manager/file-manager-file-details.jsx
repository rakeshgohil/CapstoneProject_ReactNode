// // import { useState, useCallback } from 'react';

// // import Box from '@mui/material/Box';
// // import Chip from '@mui/material/Chip';
// // import Stack from '@mui/material/Stack';
// // import Button from '@mui/material/Button';
// // import Drawer from '@mui/material/Drawer';
// // import Divider from '@mui/material/Divider';
// // import Checkbox from '@mui/material/Checkbox';
// // import TextField from '@mui/material/TextField';
// // import IconButton from '@mui/material/IconButton';
// // import Typography from '@mui/material/Typography';
// // import Autocomplete from '@mui/material/Autocomplete';

// // import { useBoolean } from 'src/hooks/use-boolean';

// // // import { fData } from 'src/utils/format-number';
// // // import { fDateTime } from 'src/utils/format-time';

// // import { Iconify } from 'src/components/iconify';
// // import { Scrollbar } from 'src/components/scrollbar';
// // import { fileFormat, FileThumbnail } from 'src/components/file-thumbnail';

// // import { FileManagerShareDialog } from './file-manager-share-dialog';
// // import { FileManagerInvitedItem } from './file-manager-invited-item';

// // // ----------------------------------------------------------------------

// // export function FileManagerFileDetails({
// //   item,
// //   open,
// //   onClose,
// //   onDelete,
// //   onDownload,
// //   favorited,
// //   onFavorite,
// //   onCopyLink,
// //   ...other
// // }) {
// //   const { name, size, url, type, shared, modifiedAt } = item;

// //   const hasShared = shared && !!shared.length;

// //   const toggleTags = useBoolean(true);

// //   const share = useBoolean();

// //   const properties = useBoolean(true);

// //   const [inviteEmail, setInviteEmail] = useState('');

// //   const [tags, setTags] = useState(item.tags.slice(0, 3));

// //   const handleChangeInvite = useCallback((event) => {
// //     setInviteEmail(event.target.value);
// //   }, []);

// //   const handleChangeTags = useCallback((newValue) => {
// //     setTags(newValue);
// //   }, []);

// //   const renderTags = (
// //     <Stack spacing={1.5}>
// //       <Stack
// //         direction="row"
// //         alignItems="center"
// //         justifyContent="space-between"
// //         sx={{ typography: 'subtitle2' }}
// //       >
// //         Tags
// //         <IconButton size="small" onClick={toggleTags.onToggle}>
// //           <Iconify
// //             icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
// //           />
// //         </IconButton>
// //       </Stack>

// //       {toggleTags.value && (
// //         <Autocomplete
// //           multiple
// //           freeSolo
// //           options={item.tags.map((option) => option)}
// //           getOptionLabel={(option) => option}
// //           defaultValue={item.tags.slice(0, 3)}
// //           value={tags}
// //           onChange={(event, newValue) => {
// //             handleChangeTags(newValue);
// //           }}
// //           renderOption={(props, option) => (
// //             <li {...props} key={option}>
// //               {option}
// //             </li>
// //           )}
// //           renderTags={(selected, getTagProps) =>
// //             selected.map((option, index) => (
// //               <Chip
// //                 {...getTagProps({ index })}
// //                 size="small"
// //                 variant="soft"
// //                 label={option}
// //                 key={option}
// //               />
// //             ))
// //           }
// //           renderInput={(params) => <TextField {...params} placeholder="#Add a tags" />}
// //         />
// //       )}
// //     </Stack>
// //   );

// //   const renderProperties = (
// //     <Stack spacing={1.5}>
// //       <Stack
// //         direction="row"
// //         alignItems="center"
// //         justifyContent="space-between"
// //         sx={{ typography: 'subtitle2' }}
// //       >
// //         Properties
// //         <IconButton size="small" onClick={properties.onToggle}>
// //           <Iconify
// //             icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
// //           />
// //         </IconButton>
// //       </Stack>

// //       {properties.value && (
// //         <>
// //           <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
// //             <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
// //               Size
// //             </Box>
// //             {/* {fData(size)} */}
// //           </Stack>

// //           <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
// //             <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
// //               Modified
// //             </Box>
// //             {/* {fDateTime(modifiedAt)} */}
// //           </Stack>

// //           <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
// //             <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
// //               Type
// //             </Box>
// //             {fileFormat(type)}
// //           </Stack>
// //         </>
// //       )}
// //     </Stack>
// //   );

// //   const renderShared = (
// //     <>
// //       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
// //         <Typography variant="subtitle2"> Share with </Typography>

// //         <IconButton
// //           size="small"
// //           color="primary"
// //           onClick={share.onTrue}
// //           sx={{
// //             width: 24,
// //             height: 24,
// //             bgcolor: 'primary.main',
// //             color: 'primary.contrastText',
// //             '&:hover': { bgcolor: 'primary.dark' },
// //           }}
// //         >
// //           <Iconify icon="mingcute:add-line" />
// //         </IconButton>
// //       </Stack>

// //       {hasShared && (
// //         <Box component="ul" sx={{ pl: 2, pr: 1 }}>
// //           {shared.map((person) => (
// //             <FileManagerInvitedItem key={person.id} person={person} />
// //           ))}
// //         </Box>
// //       )}
// //     </>
// //   );

// //   return (
// //     <>
// //       <Drawer
// //         open={open}
// //         onClose={onClose}
// //         anchor="right"
// //         slotProps={{ backdrop: { invisible: true } }}
// //         PaperProps={{ sx: { width: 320 } }}
// //         {...other}
// //       >
// //         <Scrollbar>
// //           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
// //             <Typography variant="h6"> Info </Typography>

// //             <Checkbox
// //               color="warning"
// //               icon={<Iconify icon="eva:star-outline" />}
// //               checkedIcon={<Iconify icon="eva:star-fill" />}
// //               checked={favorited}
// //               onChange={onFavorite}
// //             />
// //           </Stack>

// //           <Stack
// //             spacing={2.5}
// //             justifyContent="center"
// //             sx={{ p: 2.5, bgcolor: 'background.neutral' }}
// //           >
// //             <FileThumbnail
// //               imageView
// //               file={type === 'folder' ? type : url}
// //               sx={{ width: 'auto', height: 'auto', alignSelf: 'flex-start' }}
// //               slotProps={{
// //                 img: {
// //                   width: 320,
// //                   height: 'auto',
// //                   aspectRatio: '4/3',
// //                   objectFit: 'cover',
// //                 },
// //                 icon: { width: 64, height: 64 },
// //               }}
// //             />

// //             <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
// //               {name}
// //             </Typography>

// //             <Divider sx={{ borderStyle: 'dashed' }} />

// //             {renderTags}

// //             {renderProperties}
// //           </Stack>

// //           {renderShared}
// //         </Scrollbar>

// //         <Box sx={{ p: 2.5 }}>
// //           <Button
// //             fullWidth
// //             variant="soft"
// //             color="error"
// //             size="large"
// //             startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
// //             onClick={onDelete}
// //           >
// //             Delete
// //           </Button>
// //         </Box>
// //         <Box sx={{ p: 2.5 }}>
// //           <Button
// //             fullWidth
// //             variant="soft"
// //             color="success"
// //             size="large"
// //             startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
// //             onClick={onDownload}
// //           >
// //             Download
// //           </Button>
// //         </Box>
// //         <Box sx={{ p: 2.5 }}>
// //           <Button
// //             fullWidth
// //             variant="soft"
// //             color="success"
// //             size="large"
// //             startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
// //             onClick={onDownload}
// //           >
// //             Download
// //           </Button>
// //         </Box>
// //       </Drawer>

// //       <FileManagerShareDialog
// //         open={share.value}
// //         shared={shared}
// //         inviteEmail={inviteEmail}
// //         onChangeInvite={handleChangeInvite}
// //         onCopyLink={onCopyLink}
// //         onClose={() => {
// //           share.onFalse();
// //           setInviteEmail('');
// //         }}
// //       />
// //     </>
// //   );
// // }

// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
// import MenuList from '@mui/material/MenuList';
// import MenuItem from '@mui/material/MenuItem';
// import Checkbox from '@mui/material/Checkbox';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

// import { useBoolean } from 'src/hooks/use-boolean';
// import { fData } from 'src/utils/format-number';
// import { fDateTime } from 'src/utils/format-time';

// import { maxLine } from 'src/theme/styles';
// import { Iconify } from 'src/components/iconify';
// import { ConfirmDialog } from 'src/components/custom-dialog';
// import { FileThumbnail } from 'src/components/file-thumbnail';
// import { usePopover, CustomPopover } from 'src/components/custom-popover';

// import { FileManagerDownloadDialog } from './file-manager-download-dialog'; // New download dialog component
// import { FileManagerShareDialog } from './file-manager-share-dialog';
// import { FileManagerFileDetails } from './file-manager-file-details';

// // ----------------------------------------------------------------------

// export function FileManagerFileItem({ file, selected, onSelect, onDelete, sx, ...other }) {
//   const share = useBoolean();
//   const confirm = useBoolean();
//   const details = useBoolean();
//   const popover = usePopover();
//   const checkbox = useBoolean();
//   const favorite = useBoolean(file.isFavorited);

//   const [inviteEmail, setInviteEmail] = useState('');
//   const [isDownloadDialogOpen, setDownloadDialogOpen] = useState(false); // State for download dialog
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleChangeInvite = useCallback((event) => {
//     setInviteEmail(event.target.value);
//   }, []);

//   const handleOpenDownloadDialog = (file) => {
//     setSelectedFile(file); // Set selected file for download
//     setDownloadDialogOpen(true); // Open download dialog
//   };

//   const handleCloseDownloadDialog = () => {
//     setDownloadDialogOpen(false); // Close download dialog
//     setSelectedFile(null); // Clear selected file
//   };

//   const renderIcon = (
//     <Box
//       onMouseEnter={checkbox.onTrue}
//       onMouseLeave={checkbox.onFalse}
//       sx={{ display: 'inline-flex', width: 36, height: 36 }}
//     >
//       {(checkbox.value || selected) && onSelect ? (
//         <Checkbox
//           checked={selected}
//           onClick={onSelect}
//           icon={<Iconify icon="eva:radio-button-off-fill" />}
//           checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
//           inputProps={{
//             id: `item-checkbox-${file.id}`,
//             'aria-label': `Item checkbox`,
//           }}
//           sx={{ width: 1, height: 1 }}
//         />
//       ) : (
//         <FileThumbnail file={file.type} sx={{ width: 1, height: 1 }} />
//       )}
//     </Box>
//   );

//   const renderAction = (
//     <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
//       <Checkbox
//         color="warning"
//         icon={<Iconify icon="eva:star-outline" />}
//         checkedIcon={<Iconify icon="eva:star-fill" />}
//         checked={favorite.value}
//         onChange={favorite.onToggle}
//         inputProps={{
//           id: `favorite-checkbox-${file.id}`,
//           'aria-label': `Favorite checkbox`,
//         }}
//       />

//       <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
//         <Iconify icon="eva:more-vertical-fill" />
//       </IconButton>
//     </Stack>
//   );

//   const renderText = (
//     <>
//       <Typography
//         variant="subtitle2"
//         onClick={details.onTrue}
//         sx={(theme) => ({
//           ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
//           mt: 2,
//           mb: 0.5,
//           width: 1,
//         })}
//       >
//         {file.name}
//       </Typography>

//       <Stack
//         direction="row"
//         alignItems="center"
//         sx={{
//           maxWidth: 0.99,
//           whiteSpace: 'nowrap',
//           typography: 'caption',
//           color: 'text.disabled',
//         }}
//       >
//         {fData(file.size)}

//         <Box
//           component="span"
//           sx={{
//             mx: 0.75,
//             width: 2,
//             height: 2,
//             flexShrink: 0,
//             borderRadius: '50%',
//             bgcolor: 'currentColor',
//           }}
//         />
//         <Typography noWrap component="span" variant="caption">
//           {fDateTime(file.modifiedAt)}
//         </Typography>
//       </Stack>
//     </>
//   );

//   const renderAvatar = (
//     <AvatarGroup
//       max={3}
//       sx={{
//         mt: 1,
//         [`& .${avatarGroupClasses.avatar}`]: {
//           width: 24,
//           height: 24,
//           '&:first-of-type': { fontSize: 12 },
//         },
//       }}
//     >
//       {file.shared?.map((person) => (
//         <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
//       ))}
//     </AvatarGroup>
//   );

//   return (
//     <>
//       <Paper
//         variant="outlined"
//         sx={{
//           p: 2.5,
//           display: 'flex',
//           borderRadius: 2,
//           cursor: 'pointer',
//           position: 'relative',
//           bgcolor: 'transparent',
//           flexDirection: 'column',
//           alignItems: 'flex-start',
//           ...((checkbox.value || selected) && {
//             bgcolor: 'background.paper',
//             boxShadow: (theme) => theme.customShadows.z20,
//           }),
//           ...sx,
//         }}
//         {...other}
//       >
//         {renderIcon}
//         {renderText}
//         {renderAvatar}
//         {renderAction}
//       </Paper>

//       <CustomPopover
//         open={popover.open}
//         anchorEl={popover.anchorEl}
//         onClose={popover.onClose}
//         slotProps={{ arrow: { placement: 'right-top' } }}
//       >
//         <MenuList>
//           <MenuItem
//             onClick={() => {
//               popover.onClose();
//               share.onTrue();
//             }}
//           >
//             <Iconify icon="solar:share-bold" />
//             Share
//           </MenuItem>

//           {/* Download button */}
//           <MenuItem
//             onClick={() => {
//               popover.onClose();
//               handleOpenDownloadDialog(file); // Open download dialog with the selected file
//             }}
//           >
//             <Iconify icon="solar:download-bold" />
//             Download
//           </MenuItem>

//           <Divider sx={{ borderStyle: 'dashed' }} />

//           <MenuItem
//             onClick={() => {
//               confirm.onTrue();
//               popover.onClose();
//             }}
//             sx={{ color: 'error.main' }}
//           >
//             <Iconify icon="solar:trash-bin-trash-bold" />
//             Delete
//           </MenuItem>
//         </MenuList>
//       </CustomPopover>

//       <FileManagerFileDetails
//         item={file}
//         favorited={favorite.value}
//         onFavorite={favorite.onToggle}
//         open={details.value}
//         onClose={details.onFalse}
//         onDelete={onDelete}
//       />

//       <FileManagerShareDialog
//         open={share.value}
//         shared={file.shared}
//         inviteEmail={inviteEmail}
//         onChangeInvite={handleChangeInvite}
//         onClose={() => {
//           share.onFalse();
//           setInviteEmail('');
//         }}
//       />

//       {/* Download Dialog */}
//       <FileManagerDownloadDialog
//         open={isDownloadDialogOpen}
//         selectedFile={selectedFile}
//         onClose={handleCloseDownloadDialog}
//       />

//       <ConfirmDialog
//         open={confirm.value}
//         onClose={confirm.onFalse}
//         title="Delete"
//         content="Are you sure you want to delete?"
//         action={
//           <Button variant="contained" color="error" onClick={onDelete}>
//             Delete
//           </Button>
//         }
//       />
//     </>
//   );
// }


// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Drawer from '@mui/material/Drawer';
// import Divider from '@mui/material/Divider';
// import Checkbox from '@mui/material/Checkbox';
// import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Autocomplete from '@mui/material/Autocomplete';

// import { useBoolean } from 'src/hooks/use-boolean';

// // import { fData } from 'src/utils/format-number';
// // import { fDateTime } from 'src/utils/format-time';

// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';
// import { fileFormat, FileThumbnail } from 'src/components/file-thumbnail';

// import { FileManagerShareDialog } from './file-manager-share-dialog';
// import { FileManagerInvitedItem } from './file-manager-invited-item';

// // ----------------------------------------------------------------------

// export function FileManagerFileDetails({
//   item,
//   open,
//   onClose,
//   onDelete,
//   onDownload,
//   favorited,
//   onFavorite,
//   onCopyLink,
//   ...other
// }) {
//   const { name, size, url, type, shared, modifiedAt } = item;

//   const hasShared = shared && !!shared.length;

//   const toggleTags = useBoolean(true);

//   const share = useBoolean();

//   const properties = useBoolean(true);

//   const [inviteEmail, setInviteEmail] = useState('');

//   const [tags, setTags] = useState(item.tags.slice(0, 3));

//   const handleChangeInvite = useCallback((event) => {
//     setInviteEmail(event.target.value);
//   }, []);

//   const handleChangeTags = useCallback((newValue) => {
//     setTags(newValue);
//   }, []);

//   const renderTags = (
//     <Stack spacing={1.5}>
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         sx={{ typography: 'subtitle2' }}
//       >
//         Tags
//         <IconButton size="small" onClick={toggleTags.onToggle}>
//           <Iconify
//             icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
//           />
//         </IconButton>
//       </Stack>

//       {toggleTags.value && (
//         <Autocomplete
//           multiple
//           freeSolo
//           options={item.tags.map((option) => option)}
//           getOptionLabel={(option) => option}
//           defaultValue={item.tags.slice(0, 3)}
//           value={tags}
//           onChange={(event, newValue) => {
//             handleChangeTags(newValue);
//           }}
//           renderOption={(props, option) => (
//             <li {...props} key={option}>
//               {option}
//             </li>
//           )}
//           renderTags={(selected, getTagProps) =>
//             selected.map((option, index) => (
//               <Chip
//                 {...getTagProps({ index })}
//                 size="small"
//                 variant="soft"
//                 label={option}
//                 key={option}
//               />
//             ))
//           }
//           renderInput={(params) => <TextField {...params} placeholder="#Add a tags" />}
//         />
//       )}
//     </Stack>
//   );

//   const renderProperties = (
//     <Stack spacing={1.5}>
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         sx={{ typography: 'subtitle2' }}
//       >
//         Properties
//         <IconButton size="small" onClick={properties.onToggle}>
//           <Iconify
//             icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
//           />
//         </IconButton>
//       </Stack>

//       {properties.value && (
//         <>
//           <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
//             <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
//               Size
//             </Box>
//             {/* {fData(size)} */}
//           </Stack>

//           <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
//             <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
//               Modified
//             </Box>
//             {/* {fDateTime(modifiedAt)} */}
//           </Stack>

//           <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
//             <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
//               Type
//             </Box>
//             {fileFormat(type)}
//           </Stack>
//         </>
//       )}
//     </Stack>
//   );

//   const renderShared = (
//     <>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
//         <Typography variant="subtitle2"> Share with </Typography>

//         <IconButton
//           size="small"
//           color="primary"
//           onClick={share.onTrue}
//           sx={{
//             width: 24,
//             height: 24,
//             bgcolor: 'primary.main',
//             color: 'primary.contrastText',
//             '&:hover': { bgcolor: 'primary.dark' },
//           }}
//         >
//           <Iconify icon="mingcute:add-line" />
//         </IconButton>
//       </Stack>

//       {hasShared && (
//         <Box component="ul" sx={{ pl: 2, pr: 1 }}>
//           {shared.map((person) => (
//             <FileManagerInvitedItem key={person.id} person={person} />
//           ))}
//         </Box>
//       )}
//     </>
//   );

//   return (
//     <>
//       <Drawer
//         open={open}
//         onClose={onClose}
//         anchor="right"
//         slotProps={{ backdrop: { invisible: true } }}
//         PaperProps={{ sx: { width: 320 } }}
//         {...other}
//       >
//         <Scrollbar>
//           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
//             <Typography variant="h6"> Info </Typography>

//             <Checkbox
//               color="warning"
//               icon={<Iconify icon="eva:star-outline" />}
//               checkedIcon={<Iconify icon="eva:star-fill" />}
//               checked={favorited}
//               onChange={onFavorite}
//             />
//           </Stack>

//           <Stack
//             spacing={2.5}
//             justifyContent="center"
//             sx={{ p: 2.5, bgcolor: 'background.neutral' }}
//           >
//             <FileThumbnail
//               imageView
//               file={type === 'folder' ? type : url}
//               sx={{ width: 'auto', height: 'auto', alignSelf: 'flex-start' }}
//               slotProps={{
//                 img: {
//                   width: 320,
//                   height: 'auto',
//                   aspectRatio: '4/3',
//                   objectFit: 'cover',
//                 },
//                 icon: { width: 64, height: 64 },
//               }}
//             />

//             <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
//               {name}
//             </Typography>

//             <Divider sx={{ borderStyle: 'dashed' }} />

//             {renderTags}

//             {renderProperties}
//           </Stack>

//           {renderShared}
//         </Scrollbar>

//         <Box sx={{ p: 2.5 }}>
//           <Button
//             fullWidth
//             variant="soft"
//             color="error"
//             size="large"
//             startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
//             onClick={onDelete}
//           >
//             Delete
//           </Button>
//         </Box>
//         <Box sx={{ p: 2.5 }}>
//           <Button
//             fullWidth
//             variant="soft"
//             color="success"
//             size="large"
//             startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
//             onClick={onDownload}
//           >
//             Download
//           </Button>
//         </Box>
//         <Box sx={{ p: 2.5 }}>
//           <Button
//             fullWidth
//             variant="soft"
//             color="success"
//             size="large"
//             startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
//             onClick={onDownload}
//           >
//             Download
//           </Button>
//         </Box>
//       </Drawer>

//       <FileManagerShareDialog
//         open={share.value}
//         shared={shared}
//         inviteEmail={inviteEmail}
//         onChangeInvite={handleChangeInvite}
//         onCopyLink={onCopyLink}
//         onClose={() => {
//           share.onFalse();
//           setInviteEmail('');
//         }}
//       />
//     </>
//   );
// }

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { FileManagerDownloadDialog } from './file-manager-download-dialog'; // New download dialog component
import { FileManagerShareDialog } from './file-manager-share-dialog';
import { FileManagerFileDetails } from './file-manager-file-details';

// ----------------------------------------------------------------------

export function FileManagerFileItem({ file, selected, onSelect, onDelete, sx, ...other }) {
  const share = useBoolean();
  const confirm = useBoolean();
  const details = useBoolean();
  const popover = usePopover();
  const checkbox = useBoolean();
  const favorite = useBoolean(file.isFavorited);

  const [inviteEmail, setInviteEmail] = useState('');
  const [isDownloadDialogOpen, setDownloadDialogOpen] = useState(false); // State for download dialog
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleOpenDownloadDialog = (file) => {
    setSelectedFile(file); // Set selected file for download
    setDownloadDialogOpen(true); // Open download dialog
  };

  const handleCloseDownloadDialog = () => {
    setDownloadDialogOpen(false); // Close download dialog
    setSelectedFile(null); // Clear selected file
  };

  const renderIcon = (
    <Box
      onMouseEnter={checkbox.onTrue}
      onMouseLeave={checkbox.onFalse}
      sx={{ display: 'inline-flex', width: 36, height: 36 }}
    >
      {(checkbox.value || selected) && onSelect ? (
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<Iconify icon="eva:radio-button-off-fill" />}
          checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          inputProps={{
            id: `item-checkbox-${file.id}`,
            'aria-label': `Item checkbox`,
          }}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <FileThumbnail file={file.type} sx={{ width: 1, height: 1 }} />
      )}
    </Box>
  );

  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      <Checkbox
        color="warning"
        icon={<Iconify icon="eva:star-outline" />}
        checkedIcon={<Iconify icon="eva:star-fill" />}
        checked={favorite.value}
        onChange={favorite.onToggle}
        inputProps={{
          id: `favorite-checkbox-${file.id}`,
          'aria-label': `Favorite checkbox`,
        }}
      />

      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );

  const renderText = (
    <>
      <Typography
        variant="subtitle2"
        onClick={details.onTrue}
        sx={(theme) => ({
          ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
          mt: 2,
          mb: 0.5,
          width: 1,
        })}
      >
        {file.name}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          maxWidth: 0.99,
          whiteSpace: 'nowrap',
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        {fData(file.size)}

        <Box
          component="span"
          sx={{
            mx: 0.75,
            width: 2,
            height: 2,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: 'currentColor',
          }}
        />
        <Typography noWrap component="span" variant="caption">
          {fDateTime(file.modifiedAt)}
        </Typography>
      </Stack>
    </>
  );

  const renderAvatar = (
    <AvatarGroup
      max={3}
      sx={{
        mt: 1,
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 24,
          height: 24,
          '&:first-of-type': { fontSize: 12 },
        },
      }}
    >
      {file.shared?.map((person) => (
        <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          display: 'flex',
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          bgcolor: 'transparent',
          flexDirection: 'column',
          alignItems: 'flex-start',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        {renderIcon}
        {renderText}
        {renderAvatar}
        {renderAction}
      </Paper>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              share.onTrue();
            }}
          >
            <Iconify icon="solar:share-bold" />
            Share
          </MenuItem>

          {/* Download button */}
          <MenuItem
            onClick={() => {
              popover.onClose();
              handleOpenDownloadDialog(file); // Open download dialog with the selected file
            }}
          >
            <Iconify icon="solar:download-bold" />
            Download
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <FileManagerFileDetails
        item={file}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDelete}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={file.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      {/* Download Dialog */}
      <FileManagerDownloadDialog
        open={isDownloadDialogOpen}
        selectedFile={selectedFile}
        onClose={handleCloseDownloadDialog}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
