import { memo, useEffect, useState, type CSSProperties, type FC } from 'react';
import { Theme, useTheme } from 'remix-themes';
import { Button, type ButtonProps } from '~/components/button';
import './button.css';

export interface ThemeSwitchProps extends ButtonProps {
    className?: string;
    style?: CSSProperties;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = memo((props) => {
    const [theme, setTheme] = useTheme();
    const isDarkMode = theme === Theme.DARK;

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (!disabled) return;

        setTimeout(() => {
            setDisabled(false);
        }, 1000);
    }, [disabled]);

    return (
        <Button
            onClick={() => {
                setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
                setDisabled(true);
            }}
            {...props}
            isDisabled={disabled}
            className={`${props.className} gap-2.5 rounded-full`}
        >
            {isDarkMode ? 'Dark' : 'Light'}

            {/* Background Transition */}
            <span
                aria-hidden="true"
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
