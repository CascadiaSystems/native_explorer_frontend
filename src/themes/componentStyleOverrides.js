const componentStyleOverrides = (theme) => {
  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.font-mono': {
            fontFamily: 'monospace'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.colors?.grey.light}`,
          borderRadius: '0px',
          backgroundImage: 'none'
        }
      }
    },
    // MuiButton
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
        contained: {
          '&.Mui-disabled': {
            backgroundColor: theme.colors?.grey.light,
            color: theme.colors?.text.secondary
          }
        },
        outlined: {
          borderColor: theme.colors?.grey.light,
          '&.MuiLoadingButton-loading.Mui-disabled': {
            color: theme.colors?.text.secondary
          },
          '&.active': {
            borderColor: theme.colors?.text.primary,
            backgroundColor: theme.colors?.grey.dark,
          },
          '&.align-left': {
            justifyContent: 'start'
          }
        },
        startIcon: {
          '& svg': {
            fontSize: '0.875rem !important'
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
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            borderColor: theme.colors?.grey.light,
            // color: theme.colors?.text.secondary
          }
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        circle: {
          stroke: theme.colors?.text.secondary
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontSize: '1rem',
          fontWeight: 'normal'
        }
      }
    },
    // MuiCard
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
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderTop: `1px solid ${theme.colors?.grey.light}`
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
          border: 0,
          whiteSpace: 'nowrap'
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
    // MuiChip
    MuiChip: {
      styleOverrides: {
        filled: {
          backgroundColor: `${theme.colors?.grey.dark} !important`,
          borderRadius: 0,
          padding: '3px 0'
        },
        labelMedium: {
          fontSize: '1rem'
        },
        labelSmall: {
          fontSize: '0.875rem'
        },
      }
    },
    // MuiTooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.colors?.grey.light,
          borderRadius: 0,
          padding: '16px',
          maxWidth: '250px'
        },
        arrow: {
          color: theme.colors?.grey.light,
        }
      }
    }
  }
};

export default componentStyleOverrides;