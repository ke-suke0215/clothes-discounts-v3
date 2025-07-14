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
	// Calendar layout styles
	const calendarStyles = {
		container: 'font-inter rounded-lg border border-gray-200 bg-white p-5',
		monthCaption: 'flex justify-center items-center mb-4 relative',
		captionLabel: 'text-base font-medium text-gray-900',
		nav: 'flex justify-between items-center absolute top-0 left-0 right-0 z-10',
		monthGrid: 'w-full border-separate border-spacing-0.5',
		weekdays: 'mb-2',
		weekday:
			'w-9 h-6 text-xs font-medium text-gray-500 uppercase tracking-wide text-center',
		day: 'w-9 h-9 relative',
	};

	// Button styles
	const buttonStyles = {
		navigationButton: [
			'w-8 h-8 rounded-md border border-gray-300 bg-white text-black',
			'flex items-center justify-center cursor-pointer transition-all duration-150',
			'hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400',
			'disabled:opacity-40 disabled:cursor-not-allowed',
			'[&>svg]:fill-black [&>svg]:text-black [&>svg]:stroke-black',
			'[&>svg]:!fill-black [&>svg]:!text-black [&>svg]:!stroke-black',
		].join(' '),

		dayButton: [
			'w-full h-full border-none bg-transparent cursor-pointer rounded',
			'text-sm font-normal text-gray-700 flex items-center justify-center',
			'transition-all duration-150 hover:bg-gray-100 hover:text-gray-900',
		].join(' '),
	};

	// Day state styles (using CSS selector targeting)
	const dayStateStyles = {
		selected:
			'[&>button]:bg-gray-600 [&>button]:text-white [&>button]:font-medium [&>button:hover]:bg-gray-700',
		today:
			'[&>button]:bg-gray-900 [&>button]:text-white [&>button]:font-medium [&>button:hover]:bg-gray-800',
		outside:
			'[&>button]:text-gray-300 [&>button:hover]:bg-gray-50 [&>button:hover]:text-gray-400',
	};

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(calendarStyles.container, className)}
			hideNavigation={false}
			classNames={{
				month_caption: calendarStyles.monthCaption,
				caption_label: calendarStyles.captionLabel,
				nav: calendarStyles.nav,
				button_previous: buttonStyles.navigationButton,
				button_next: buttonStyles.navigationButton,
				month_grid: calendarStyles.monthGrid,
				weekdays: calendarStyles.weekdays,
				weekday: calendarStyles.weekday,
				day: calendarStyles.day,
				day_button: buttonStyles.dayButton,
				selected: dayStateStyles.selected,
				today: dayStateStyles.today,
				outside: dayStateStyles.outside,
				...classNames,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = 'Calendar';

export { Calendar };
