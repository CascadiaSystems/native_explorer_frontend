import { borderRadius } from "@mui/system";

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
          textTransform: 'capitalize',
          fontSize: '1rem',
          fontWeight: 400
        },
        text: {
          padding: 0,
          '&:hover': {
            backgroundColor: 'transparent',
          }
        },
        outlined: {
          borderColor: theme.colors?.grey.light
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
        },
        action: {
          margin: 0
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
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:last-child': {
            border: 0
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.colors?.grey.light}`,
        },
        head: {
          borderBottom: `1px solid ${theme.colors?.grey.light}`,
          backgroundColor: '#2F3031',
          '& .MuiTableCell-root': {
            fontSize: '0.875rem',
            color: theme.colors?.text.secondary,
            fontWeight: 'normal'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          border: 0
        }
      }
    },
    // MuiSelect
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingRight: '24px !important'
        },
        outlined: {
          borderRadius: 0,
          // '&:hover': {
          //   backgroundColor: theme.colors?.grey.dark
          // }
        },
        icon: {
          right: 0,
          fill: theme.colors?.text.primary
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        inputSizeSmall: {
          padding: '2px 10px !important'
        },
        root: {
          transition: 'all 0.3s',
          '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.colors?.text.secondary,            
          },
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.colors?.text.secondary,
            borderWidth: 1     
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        notchedOutline: {
          transition: 'all 0.3s',
          borderColor: theme.colors?.grey.light
        }
      }
    },
  }
};

export default componentStyleOverrides;