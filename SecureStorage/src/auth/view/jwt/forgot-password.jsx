'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { resetPassword } from '../../context/jwt'; // Assuming you have a password reset API
import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';
import axios from 'axios';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  //   email: zod
  //     .string()
  //     .min(1, { message: 'Email is required!' })
  //     .email({ message: 'Email must be a valid email address!' }),
  //   password: zod
  //     .string()
  //     .min(6, { message: 'Password must be at least 6 characters!' }),
  //   confirmPassword: zod
  //     .string()
  //     .min(6, { message: 'Confirm password must be at least 6 characters!' })
  //     .refine((val, ctx) => val === ctx.parent.password, {
  //       message: 'Passwords must match!',
  //     }),
});

// ----------------------------------------------------------------------

export function ForgetPasswordView() {
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    email: 'rakesh115@gmail.com',
    password: 'Vekariya43@',
    confirmPassword: 'Vekariya43@',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,

  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log("handle in");
    try {
      // API calling for reset password
      const response = await axios.post('http://localhost:5000/updatepassword', {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      console.log('response: qq', response);


      // const res = await resetPassword({
      //   email: data.email,
      //   password: data.password,
      // });
      // if (res?.error) {
      //   setErrorMsg(res?.error);
      // } else {
      //   router.push(paths.auth.jwt.signIn); // Redirect to sign-in after password reset
      //   await checkUserSession?.();
      //   router.refresh();
      // }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });


  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Field.Text
        name="password"
        label="Password"
        placeholder="8+ characters"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm Password"
        placeholder="8+ characters"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Resetting password..."
      >
        Reset Password
      </LoadingButton>
      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        variant="body2"
        color="inherit"
        sx={{ alignSelf: 'flex-end' }}
      >
        Back to Sign in?
      </Link>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Reset Your Password"
        description={null}
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <SignUpTerms />
    </>
  );
}
