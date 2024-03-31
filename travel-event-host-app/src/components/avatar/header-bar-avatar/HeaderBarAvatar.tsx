import theme from '@/app/theme';
import { Avatar, Box, ButtonBase, Menu, MenuItem, Typography, styled } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import styles from './style.module.css';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

/**
 * This header bar has the user's avatar and name, plus a dropdown menu with options like logout.
 */
interface HeaderBarAvatarProps {
  userName: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

export default function HeaderBarAvatar({ userName, imageUrl, children }: HeaderBarAvatarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isErrorImage, setIsErrorImage] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else setAnchorEl(event.currentTarget);
  };
  const logout = () => {
    signOut();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
      onClick={handleClick}
    >
      {children}
      <svg
        className={`${styles.arrow} ${open ? 'rotate-180' : ''}`}
        width='14'
        height='8'
        viewBox='0 0 18 10'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M0.479187 0.00915527L9.22919 9.36283L17.9792 0.00915527H0.479187Z'
          fill='#FAFAFF'
          stroke='#FAFAFF'
          strokeWidth='0.008'
        />
      </svg>
      <Menu
        anchorEl={anchorEl}
        open={open}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          '& .MuiMenu-list': {
            background: theme.palette.primary.thirdColorlightBlack,
            padding: 0,
          },
          '& .MuiPaper-root': {
            marginTop: '10px',
          },
        }}
      >
        {/* Add more menu options here as needed */}
        <MenuItem
          sx={{
            '&.MuiList-root': {
              background: theme.palette.primary.thirdColorlightBlack,
            },
            '&.MuiButtonBase-root': {
              fontSize: '1.25rem',
              background: theme.palette.primary.thirdColorlightBlack,
              color: theme.palette.primary.thirdColorIceLight,
            },
            '&.MuiButtonBase-root:hover': {
              background: theme.palette.primary.secondaryColorDarkBlack,
            },
            [theme.breakpoints.down(700)]: {
              '&.MuiButtonBase-root': {
                fontSize: '1rem',
              },
            },
            [theme.breakpoints.down(610)]: {
              '&.MuiButtonBase-root': {
                fontSize: '11px',
              },
            },
          }}
        >
          <Link href='/dashboard'>Dashboard</Link>
        </MenuItem>
        <MenuItem
          onClick={logout}
          sx={{
            '&.MuiList-root': {
              background: theme.palette.primary.thirdColorlightBlack,
            },
            '&.MuiButtonBase-root': {
              fontSize: '1.25rem',
              background: theme.palette.primary.thirdColorlightBlack,
              color: '#FF9999',
            },
            '&.MuiButtonBase-root:hover': {
              background: theme.palette.primary.secondaryColorDarkBlack,
            },
            [theme.breakpoints.down(700)]: {
              '&.MuiButtonBase-root': {
                fontSize: '1rem',
              },
            },
            [theme.breakpoints.down(610)]: {
              '&.MuiButtonBase-root': {
                fontSize: '11px',
              },
            },
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

function loadAvatarImage(
  isErrorImage: boolean,
  userName: string,
  setIsErrorImage: (value: boolean) => void,
  imageUrl?: string,
) {
  // If there is no image url, return the MUI avatar icon
  if (imageUrl === undefined || imageUrl === null || imageUrl === '') {
    return <StyledAvatar />;
  }

  // If there is an error loading, return the MUI  avatar icon
  if (isErrorImage) {
    return <StyledAvatar />;
  }

  return (
    <Image
      src={imageUrl}
      alt={userName}
      fill
      objectFit='cover'
      className={styles.headerBarAvatar}
      onError={() => setIsErrorImage(true)} // If there is an error loading the image return the MUI avatar icon
    />
  );
}

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '47px',
  height: '47px',
  [theme.breakpoints.down(700)]: {
    '&.MuiAvatar-root': {
      width: '32px',
      height: '32px',
    },
  },
}));
