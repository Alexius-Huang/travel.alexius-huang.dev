import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Button } from '../app/components/button';
import { SunOutlineIcon } from '~/icons/outline/sun';
import { MoonOutlineIcon } from '~/icons/outline/moon';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Component/Button',
    component: (props) => (
        <Button {...props}>{props.children ?? 'Example Button'}</Button>
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary'],
        },
        size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
        children: { control: 'text', description: 'Button Content' },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
    },
};

export const Tertiary: Story = {
    args: {
        variant: 'tertiary',
    },
};

export const WithStartIcon: Story = {
    args: {
        variant: 'primary',
        startIcon: SunOutlineIcon,
    },
};
export const WithEndIcon: Story = {
    args: {
        variant: 'primary',
        endIcon: MoonOutlineIcon,
    },
};
