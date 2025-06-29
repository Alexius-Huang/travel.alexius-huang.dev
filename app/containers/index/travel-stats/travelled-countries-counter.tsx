import type { FC, ReactNode } from 'react';

export interface TravelledCountriesCounterProps {
    count: number;
    unitNode: ReactNode;
}

export const TravelledCountriesCounter: FC<TravelledCountriesCounterProps> = ({
    count,
    unitNode,
}) => {
    return (
        <h3 className="font-header text-xl xs:text-2xl sm:text-xl leading-tight">
            <span className="text-6xl xs:text-7xl sm:text-8xl font-bold text-blue-500">
                {count}
            </span>

            <br />
            {unitNode}
        </h3>
    );
};
