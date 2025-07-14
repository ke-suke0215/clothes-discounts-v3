import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '~/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'font-inter rounded-lg border border-gray-200 bg-white p-5',
				className,
			)}
			hideNavigation={false}
			classNames={{
				month_caption: 'flex justify-center items-center mb-4 relative',
				caption_label: 'text-base font-medium text-gray-900',
				nav: 'flex justify-between items-center absolute top-0 left-0 right-0 z-10',
				button_previous:
					'w-8 h-8 rounded-md border border-gray-300 bg-white text-black flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed',
				button_next:
					'w-8 h-8 rounded-md border border-gray-300 bg-white text-black flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed',
				chevron:
					'w-4 h-4 !fill-black fill-current !text-black transition-all duration-150 hover:!fill-gray-900',
				month_grid: 'w-full border-separate border-spacing-0.5',
				weekdays: 'mb-2',
				weekday:
					'w-9 h-6 text-xs font-medium text-gray-500 uppercase tracking-wide text-center',
				day: 'w-9 h-9 relative',
				day_button:
					'w-full h-full border-none bg-transparent cursor-pointer rounded text-sm font-normal text-gray-700 flex items-center justify-center transition-all duration-150 hover:bg-gray-100 hover:text-gray-900',
				selected:
					'[&>button]:bg-gray-600 [&>button]:text-white [&>button]:font-medium [&>button:hover]:bg-gray-700',
				today:
					'[&>button]:bg-gray-900 [&>button]:text-white [&>button]:font-medium [&>button:hover]:bg-gray-800',
				outside:
					'[&>button]:text-gray-300 [&>button:hover]:bg-gray-50 [&>button:hover]:text-gray-400',
				...classNames,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = 'Calendar';

export { Calendar };
