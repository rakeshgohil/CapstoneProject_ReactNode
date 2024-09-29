import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------


// pages/auth/forgot-password.js

import { ForgetPasswordView } from 'src/auth/view/jwt'; // Update this path as per your file structure

export const metadata = { title: `Forgot password | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <ForgetPasswordView />;
}
