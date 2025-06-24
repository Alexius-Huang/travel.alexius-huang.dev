import {
    memo,
    useCallback,
    useEffect,
    type CSSProperties,
    type FC,
} from 'react';
import { Button, type ButtonProps } from '~/components/button';

export interface ThemeSwitchProps extends ButtonProps {
    className?: string;
    style?: CSSProperties;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = memo((props) => {
    useEffect(() => {
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' ||
                (!('theme' in localStorage) &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches),
        );
    }, []);

    const handleThemeToggle = useCallback(() => {
        // Toggle the theme and save it to localStorage
        const currentTheme = localStorage.getItem('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, []);

    return (
        <Button
            onClick={handleThemeToggle}
            {...props}
            className={`theme-switch__btn ${props.className}`}
        >
            Toggle Theme
        </Button>
    );
});

ThemeSwitch.displayName = 'ThemeSwitch';
