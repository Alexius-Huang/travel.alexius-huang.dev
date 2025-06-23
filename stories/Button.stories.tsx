import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../app/components/button';
import '../app/components/button.css';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary'],
        },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
    },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: { children: 'Primary', variant: 'primary', size: 'md' },
};

export const Secondary: Story = {
    args: { children: 'Secondary', variant: 'secondary', size: 'md' },
};

export const Tertiary: Story = {
    args: { children: 'Tertiary', variant: 'tertiary', size: 'md' },
};
