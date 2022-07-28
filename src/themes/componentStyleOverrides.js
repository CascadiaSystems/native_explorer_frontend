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
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.colors?.grey.light}`
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
          '&:last-child': {
            padding: 0
          }
        }
      }
    },
    // MuiTable
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          borderBottom: `1px solid ${theme.colors?.grey.light}`
        }
      }
    }

  }
};

export default componentStyleOverrides;