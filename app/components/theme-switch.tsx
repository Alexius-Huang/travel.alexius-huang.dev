import {
    memo,
    useCallback,
    useEffect,
    useState,
    type CSSProperties,
    type FC,
} from 'react';
import { Button, type ButtonProps } from '~/components/button';

export interface ThemeSwitchProps extends ButtonProps {
    className?: string;
    style?: CSSProperties;
}

function getThemeMode() {
    return localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

export const ThemeSwitch: FC<ThemeSwitchProps> = memo((props) => {
    const [isDarkMode, setIsDarkMode] = useState(getThemeMode() === 'dark');

    useEffect(() => {
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        document.documentElement.classList.toggle(
            'dark',
            getThemeMode() === 'dark'
        );
    }, []);

    const handleThemeToggle = useCallback(() => {
        // Toggle the theme and save it to localStorage
        const currentTheme = localStorage.getItem('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        setIsDarkMode(newTheme === 'dark');
    }, []);

    return (
        <Button
            onClick={handleThemeToggle}
            {...props}
            className={`${props.className} gap-2.5 rounded-full`}
        >
            {isDarkMode ? 'Dark' : 'Light'}

            {/* Background Transition */}
            <span
                aria-hidden='true'
                className={`
                    absolute size-6 rounded-full
                    bg-yellow-300 dark:bg-blue-900
                    left-2.5 dark:left-[calc(100%-2.1rem)]
                    z-[-1] top-0 bottom-0 my-auto 
                    transition-all duration-300 ease-in-out
                `}
            />
        </Button>
    );
});

ThemeSwitch.displayName = 'ThemeSwitch';
