'use client';

import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';
import Image from 'next/image';

// ----------------------------------------------------------------------

export const Logo = forwardRef(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const gradientId = useId();

    const TEXT_PRIMARY = theme.vars.palette.text.primary;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    /*
  * OR using local (public folder)
  *
  const singleLogo = (
    <Box
      alt="Single logo"
      component="img"
      src={`${CONFIG.assetsDir}/logo/logo-single.svg`}
      width="100%"
      height="100%"
    />
  );

  const fullLogo = (
    <Box
      alt="Full logo"
      component="img"
      src={`${CONFIG.assetsDir}/logo/logo-full.svg`}
      width="100%"
      height="100%"
    />
  );
  *
  */
    // ${CONFIG.assetsDir}/assets/core/cyan-blur.png
    // const singleLogo = <Image
    //   src="/singlelogo.png" // Path to your image
    //   alt="Description of the image"
    //   width={100} // Specify the width
    //   height={50} // Specify the height
    //   style={{objectFit:'contain'}}
    // />
    const singleLogo = <img
      src="/singlelogo.png" // Path to your image
      alt="Description of the image"
      // width={100} // Specify the width
      // height={50} // Specify the height
      style={{ height: '60px', width: '60px' }}
    />

    const fullLogo = null

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
