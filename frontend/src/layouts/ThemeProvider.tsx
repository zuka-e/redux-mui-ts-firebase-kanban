import React, { useState } from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import {
  purple,
  blue,
  pink,
  teal,
  amber,
  cyan,
} from '@material-ui/core/colors';

const defaultTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: blue,
    secondary: pink,
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: cyan,
    secondary: amber,
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal,
    secondary: purple,
    background: {
      paper: "#364F6B",
      default: "#364F6B"
    }
  },
});

export { defaultTheme, lightTheme, darkTheme };

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
      case 'default':
        setTheme(defaultTheme);
        break;
      case 'light':
        setTheme(lightTheme);
        break;
      case 'dark':
        setTheme(darkTheme);
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
