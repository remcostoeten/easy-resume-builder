import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utilities';

const spinnerVariants = cva('relative inline-block', {
	variants: {
		size: {
			sm: 'w-3 h-3',
			md: 'w-4 h-4',
			lg: 'w-5 h-5',
			xl: 'w-6 h-6',
		},
		color: {
			white: '[--spinner-color:255,255,255]',
			black: '[--spinner-color:0,0,0]',
			primary: '[--spinner-color:var(--primary)]',
			secondary: '[--spinner-color:var(--secondary)]',
		},
	},
	defaultVariants: {
		size: 'md',
		color: 'white',
	},
});

export type TProps = VariantProps<typeof spinnerVariants> & {
	className?: string;
};

export function Spinner({ size, color, className }: TProps) {
	return (
		<div className={cn(spinnerVariants({ size, color }), className)}>
			{Array.from({ length: 12 }).map((_, i) => (
				<div
					key={i}
					className='absolute top-[37%] left-[44%] w-0.5 h-1.5 bg-[rgb(var(--spinner-color))] rounded-sm will-change-opacity'
					style={{
						transform: `rotate(${i * 30}deg) translateY(-130%)`,
						animation: `spinner-blade 1s linear infinite`,
						animationDelay: `${-1.667 + i * 0.083}s`,
					}}
				/>
			))}
		</div>
	);
}
