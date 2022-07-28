import { createTheme } from '@mui/material/styles';

import componentStyleOverrides from './componentStyleOverrides';
import themePalette from './palette';
import themeTypography from './typography';

const colors = {
  text: {
    primary: '#E4E6EB',
    secondary: '#B0B3B8'
  },
  grey: {
    dark: '#18191A',
    main: '#242526',
    light: '#3A3B3C'
  },
  blue: {
    main: '#1778F2'
  }
};

export const theme = (options) => {
  const themeOption = {
    colors
  };

  const themeOptions = {
    palette: themePalette(themeOption),
    typography: themeTypography(themeOption),
    components: componentStyleOverrides(themeOption)
  }

  const themes = createTheme(themeOptions);

  return themes;
}

export default theme;