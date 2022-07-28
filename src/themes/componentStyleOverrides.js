const componentStyleOverrides = (theme) => {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.colors?.grey.light}`,
          borderRadius: '0px',
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'capitalize'
        },
        text: {
          padding: 0,
          '&.font-bold': {
            fontWeight: 700
          },
          '&:hover': {
            backgroundColor: 'transparent',
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    }
  }
};

export default componentStyleOverrides;