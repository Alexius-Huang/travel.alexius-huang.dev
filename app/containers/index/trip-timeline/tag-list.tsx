import type { FC } from "react";
import { trim } from "~/utils/trim";

export interface TagListProps {
    tags: Array<string>;
    className?: string;
}

export const TagList: FC<TagListProps> = ({ tags, className }) => {
    return (
        <>
            <h4 className='sr-only'>Tags About This Trip</h4>
            <ul className={`flex flex-row gap-x-2.5 gap-y-2 flex-wrap ${className}`}>
                {tags.map(tag => (
                    <li
                        key={tag}
                        className={trim`
                            text-sm font-normal
                            text-blue-500 dark:text-yellow-300
                            hover:bg-blue-100/50 dark:hover:bg-yellow-100/20
                            transition-colors duration-200 ease-in-out
                            rounded
                            px-1.5 py-0.5
                            cursor-pointer
                            direction-ltr
                        `}
                        /**
                         *  TODO: In the future, we might want to change tag to
                         *        act as clickable button for linking to search
                         *        result on all trip/attractions ... etc under
                         *        the same tag
                         */
                        // role='button'
                    >
                        <span aria-hidden='true' className='font-bold text-blue-300 dark:text-yellow-200'>
                            #
                        </span>{' '}
                        {tag}
                    </li>
                ))}
            </ul>
        </>
    );
}