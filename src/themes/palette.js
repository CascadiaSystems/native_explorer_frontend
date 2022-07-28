const themePalette = (theme) => {
  return {
    text: {
      primary: theme.colors?.text.primary,
      secondary: theme.colors?.text.secondary,
    },
    primary: {
      main: theme.colors?.text.primary,
      contrastText: theme.colors?.grey.dark
    },
    secondary: {
      main: theme.colors?.text.secondary,
      contrastText: theme.colors?.grey.dark
    },
    background: {
      default: theme.colors?.grey.dark,
      paper: theme.colors?.grey.main
    }
  }
};

export default themePalette;