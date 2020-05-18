import React, { useState } from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import {
  red,
  pink,
  orange,
  deepOrange,
  purple,
  deepPurple,
  indigo,
  cyan,
  blue,
  lightBlue,
  teal,
  green,
  lightGreen,
  lime,
  amber,
  yellow,
  brown,
  grey,
} from '@material-ui/core/colors';

const globalTheme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        padding: '2px 10px 2px 5px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
    },
  },
});

const DEFAULT = 'Default';
const defaultTheme = createMuiTheme({
  ...globalTheme,
  palette: {
    primary: indigo,
    secondary: blue,
  },
});

const LIGHT = 'Light';
const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: amber,
    secondary: yellow,
  },
});

const DARK = 'Dark';
const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: brown,
    secondary: grey,
  },
});

const PURPLE = 'Purple';
const purpleTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepPurple,
    secondary: purple,
  },
});

const RED = 'Red';
const redTheme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: red,
  },
});

const ORANGE = 'Orange';
const orangeTheme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: orange,
  },
});

const BLUE = 'Blue';
const blueTheme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: cyan,
  },
});

const GREEN = 'Green';
const greenTheme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: green,
  },
});

const LIME = 'Lime';
const limeTheme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
  },
});

export const themes = [
  DEFAULT,
  LIGHT,
  DARK,
  PURPLE,
  RED,
  ORANGE,
  BLUE,
  GREEN,
  LIME,
];

export {
  defaultTheme,
  lightTheme,
  darkTheme,
  purpleTheme,
  redTheme,
  orangeTheme,
  blueTheme,
  greenTheme,
  limeTheme,
};

// 'Theme'のタイプ
type Theme = typeof defaultTheme;
// 'createContext'の型を定義
interface ThemeContext {
  theme: Theme;
  toggleTheme: (theme: string) => void;
}

// Context: コンポーネント間の状態共有を可能に。'index.tsx'にて囲い、'App.tsx'にて呼出
export const ThemeContext = React.createContext<ThemeContext>({
  // as: ThemeContext型とみなす (型アサーション)
} as ThemeContext);

const ThemeProvider: React.FC = (props) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // 利用側(イベント)で文字列(theme)渡す
  const toggleTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
    switch (theme) {
      case DEFAULT:
        setTheme(defaultTheme);
        break;
      case LIGHT:
        setTheme(lightTheme);
        break;
      case DARK:
        setTheme(darkTheme);
        break;
      case RED:
        setTheme(redTheme);
        break;
      case ORANGE:
        setTheme(orangeTheme);
        break;
      case PURPLE:
        setTheme(purpleTheme);
        break;
      case BLUE:
        setTheme(blueTheme);
        break;
      case GREEN:
        setTheme(greenTheme);
        break;
      case LIME:
        setTheme(limeTheme);
        break;
      default:
        setTheme(defaultTheme);
        break;
    }
  };
  return (
    // Provider: 配下のコンポーネントで'Context'の共有を可能に
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
