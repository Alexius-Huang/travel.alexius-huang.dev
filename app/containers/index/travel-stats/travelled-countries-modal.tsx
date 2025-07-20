import type { FC } from 'react';
import { Button } from '~/components/button';
import { Modal } from '~/components/modal';
import type { CountryInfo } from '~/data-access/country';
import { CountryFlagChip } from '~/ui/country-flag-chip';
import { trim } from '~/utils/trim';

interface TravelledCountriesModalProps {
    countries: Array<Pick<CountryInfo, 'countryCode' | 'name'>>;
}

export const TravelledCountriesModal: FC<TravelledCountriesModalProps> = ({
    countries,
}) => {
    return (
        <Modal
            trigger={
                countries.length > 5 ? (
                    <Button
                        variant="secondary"
                        size="xs"
                        className="sm:hidden mt-4"
                    >
                        View All
                    </Button>
                ) : countries.length > 3 ? (
                    <Button
                        variant="secondary"
                        size="xs"
                        className="xs:hidden mt-4"
                    >
                        View All
                    </Button>
                ) : (
                    <Button className="hidden" />
                )
            }
        >
            <h3 className="flex flex-col gap-1 text-center h-[200px] justify-center">
                <span className="text-8xl font-bold text-blue-500 dark:text-white">
                    {countries.length}
                </span>
                <span className="uppercase font-semibold">
                    Travelled Countries
                </span>
            </h3>

            <ul
                className={trim`
                    grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-4
                    px-[1.5rem] py-[1rem] max-h-[calc(100vh-200px)] overflow-y-scroll
                `}
            >
                {countries.map(({ countryCode, name }) => (
                    <li
                        key={countryCode}
                        className="text-gray-400 hover:text-gray-900 text-center"
                    >
                        <CountryFlagChip
                            countryCode={countryCode}
                            name={name}
                            size="xl"
                        />
                    </li>
                ))}
            </ul>
        </Modal>
    );
};
