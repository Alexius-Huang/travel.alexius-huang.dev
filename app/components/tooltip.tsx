import type { FC, ReactNode } from 'react';
import {OverlayArrow, TooltipTrigger, Tooltip as RATooltip, type TooltipProps as RATooltipProps} from 'react-aria-components';
import './tooltip.css';
import { type ButtonProps, Button } from './button';

interface TooltipProps extends Omit<RATooltipProps, 'children'> {
  children: ReactNode;
  tooltip: ReactNode;
  triggerButtonProps?: ButtonProps;
}

export const Tooltip: FC<TooltipProps> = ({
    children,
    triggerButtonProps,
    tooltip,
    ...props
}: TooltipProps) => {
  return (
    <TooltipTrigger delay={0} closeDelay={250}>
        <Button {...triggerButtonProps}>
            {children}
        </Button>

        <RATooltip {...props}>
            <OverlayArrow>
                <svg
                    width={8}
                    height={8}
                    viewBox="0 0 8 8"
                    className='block fill-yellow-500'
                >
                    <path d="M0 0 L4 4 L8 0" />
                </svg>
            </OverlayArrow>
            {tooltip}
        </RATooltip>
    </TooltipTrigger>
  );
}

