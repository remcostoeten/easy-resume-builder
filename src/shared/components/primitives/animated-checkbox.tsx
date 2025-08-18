import type React from 'react';
import { type InputHTMLAttributes, useState } from 'react';

type TProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	label?: React.ReactNode;
};

export function AnimatedCheckbox({
	label,
	className = '',
	checked: controlledChecked,
	defaultChecked,
	onChange,
	...props
}: TProps) {
	const [internalChecked, setInternalChecked] = useState(defaultChecked || false);

	const isControlled = controlledChecked !== undefined;
	const isChecked = isControlled ? controlledChecked : internalChecked;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!isControlled) {
			setInternalChecked(e.target.checked);
		}
		onChange?.(e);
	}

	const neonCheckboxStyles = {
		'--primary': 'hsl(var(--primary))',
		'--primary-dark': 'hsl(var(--primary) / 0.8)',
		'--primary-light': 'hsl(var(--primary) / 0.3)',
		'--size': '18px',
	} as React.CSSProperties;

	return (
		<label
			className={`relative inline-flex items-center cursor-pointer ${className}`}
			style={neonCheckboxStyles}
		>
			<input
				type='checkbox'
				className='hidden'
				checked={isChecked}
				onChange={handleChange}
				{...props}
			/>

			<div
				className='relative flex-shrink-0'
				style={{ width: 'var(--size)', height: 'var(--size)' }}
			>
				<div
					className={`absolute inset-0 bg-background border-2 rounded transition-all duration-300 ${
						isChecked ? 'border-primary' : 'border-border hover:border-primary/80'
					}`}
					style={isChecked ? { backgroundColor: 'var(--primary-light)' } : {}}
				>
					<div className='absolute inset-[1px] flex items-center justify-center'>
						<svg
							viewBox='0 0 24 24'
							className={`w-3/4 h-3/4 fill-none stroke-2 stroke-linecap-round stroke-linejoin-round transition-all duration-300 ${
								isChecked ? 'stroke-primary' : 'stroke-primary'
							}`}
							style={{
								strokeDasharray: '20',
								strokeDashoffset: isChecked ? '0' : '20',
							}}
						>
							<path d='M3,12.5l7,7L21,5'></path>
						</svg>
					</div>

					<div
						className={`absolute -inset-0.5 rounded blur-sm transition-opacity duration-300 ${
							isChecked ? 'opacity-10' : 'opacity-0'
						}`}
						style={{ backgroundColor: 'var(--primary)' }}
					/>
				</div>
			</div>

			{label && (
				<span className='ml-2 text-sm text-muted-foreground select-none'>{label}</span>
			)}
		</label>
	);
}
