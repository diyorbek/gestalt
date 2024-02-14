// @flow strict
import {
  type Context,
  createContext,
  type Element,
  type Node as ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import classnames from 'classnames';
import darkColorDesignTokens from 'gestalt-design-tokens/dist/json/variables-dark.json';
import lightColorDesignTokens from 'gestalt-design-tokens/dist/json/variables-light.json';
import layoutStyles from '../Layout.css';

export type ColorScheme = 'light' | 'dark' | 'userPreference';

export type Theme = {
  name: 'lightMode' | 'darkMode',
  colorRed100Hovered: string,
  colorGray0: string,
  colorGray50: string,
  colorGray100: string,
  colorGray100Active: string,
  colorGray200: string,
  colorGray300: string,
  colorGray400: string,
  colorTransparentGray60: string,
  colorTransparentGray100: string,
  [tokenName: string]: string,
};

const lightModeTheme = {
  name: 'lightMode',
  colorRed100Hovered: '#ad081b',
  colorGray0: '#fff',
  colorGray50: '#fff',
  colorGray100: '#efefef',
  colorGray100Active: '#dadada',
  colorGray200: '#767676',
  colorGray300: '#111',
  colorGray400: '#000',
  colorTransparentGray60: 'rgb(0 0 0 / 0.06)',
  colorTransparentGray100: 'rgb(0 0 0 / 0.1)',
};

const darkModeTheme = {
  name: 'darkMode',
  colorRed100Hovered: '#cf001f',
  colorGray0: '#030303',
  colorGray50: '#212121',
  colorGray100: '#404040',
  colorGray100Active: '#666',
  colorGray200: '#ababab',
  colorGray300: '#efefef',
  colorGray400: '#fff',
  colorTransparentGray60: 'rgb(250 250 250 / 0.5)',
  colorTransparentGray100: 'rgb(250 250 250 / 0.6)',
};

const ThemeContext: Context<Theme> = createContext<Theme>(lightModeTheme);

/**
 * Appends tokens as injected CSS tokens
 */
const themeToStyles = (theme: {
  colorGray0: string,
  colorGray100: string,
  colorGray100Active: string,
  colorGray200: string,
  colorGray300: string,
  colorGray400: string,
  colorGray50: string,
  colorRed100Hovered: string,
  colorTransparentGray100: string,
  colorTransparentGray60: string,
  name: string,
}) => {
  let styles = '';
  Object.keys(theme).forEach((key) => {
    if (key.startsWith('color')) {
      styles += `  --g-${key}: ${theme[key]};\n`;
    }
  });
  if (theme.name === 'darkMode') {
    Object.keys(darkColorDesignTokens).forEach((key) => {
      styles += `  --${key}: ${darkColorDesignTokens[key]};\n`;
    });
  }
  if (theme.name === 'lightMode') {
    Object.keys(lightColorDesignTokens).forEach((key) => {
      styles += `  --${key}: ${lightColorDesignTokens[key]};\n`;
    });
  }

  return styles;
};

const getTheme = (colorScheme: ?ColorScheme) =>
  colorScheme === 'dark' ||
  (colorScheme === 'userPreference' &&
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? darkModeTheme
    : lightModeTheme;

type Props = {
  /**
   * Context lets a parent component provide data to the entire tree below it. Only components within the ColorSchemeProvider tree will be able to subscribe to it.
   */
  children: ReactNode,
  /**
   * The color scheme for components inside the ColorSchemeProvider. Use 'userPreference' to allow the end user to specify the color scheme via their browser settings, using the 'prefers-color-scheme' media query. See [color scheme](https://gestalt.pinterest.systems/web/utilities/colorschemeprovider#Color-scheme) variant for examples.
   */
  colorScheme?: ColorScheme,
  /**
   * Sets the dimensions of the outputted `<div>` to 100% width and height.
   */
  fullDimensions?: boolean,
  /**
   * Use with caution! Set an id in your provider to limit the scope of the provider to just the children. This should only be used for cases where you want to enable dark mode in delimited sections to examplify dark mode itself.
   * If not passed in, settings will be applied as globally as possible (ex. setting color scheme variables at :root). A global implementation is critical for displaying dark mode correctly: when dark mode is not set globally, [React Portal](https://react.dev/reference/react-dom/createPortal)-based components, mostly Popovers and Tooltips, will not render in dark mode. The main ColorSchemeProvider in your app should NOT have an id set.
   */
  id?: ?string,
};

/**
 * [ColorSchemeProvider](https://gestalt.pinterest.systems/web/utilities/colorschemeprovider) is an optional [React context provider](https://reactjs.org/docs/context.html#contextprovider) to enable dark mode.
 */
export default function ColorSchemeProvider({
  children,
  colorScheme = 'light',
  fullDimensions = false,
  id,
}: Props): Element<typeof ThemeContext.Provider> {
  const [theme, setTheme] = useState(getTheme(colorScheme));
  const className = id ? `__gestaltTheme${id}` : undefined;
  const selector = className ? `.${className}` : ':root';

  const handlePrefChange = (event: MediaQueryList) => {
    setTheme(getTheme(event.matches ? 'dark' : 'light'));
  };

  useEffect(() => {
    setTheme(getTheme(colorScheme));
    if (colorScheme === 'userPreference' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addListener(handlePrefChange);
      return () =>
        window.matchMedia('(prefers-color-scheme: dark)').removeListener(handlePrefChange);
    }
    return undefined; // Flow doesn't like that only userPreference returns a clean up func
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={theme}>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html:
            colorScheme === 'userPreference'
              ? `@media(prefers-color-scheme: dark) {
  ${selector} {
${themeToStyles(darkModeTheme)} }
}`
              : `${selector} {
${themeToStyles(theme)} }`,
        }}
      />
      <div
        className={classnames(className, {
          [layoutStyles.fullHeight]: fullDimensions,
          [layoutStyles.fullWidth]: fullDimensions,
        })}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useColorScheme(): Theme {
  const theme = useContext(ThemeContext);
  return theme || lightModeTheme;
}
