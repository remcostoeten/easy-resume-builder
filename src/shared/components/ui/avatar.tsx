import Image from 'next/image';
import { cn } from '@/shared/utilities';

type TProps = {
	src?: string;
	alt?: string;
	fallback?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	className?: string;
	'aria-label'?: string;
};

function Avatar({
	src,
	alt,
	fallback = 'U',
	size = 'md',
	className,
	'aria-label': ariaLabel,
}: TProps) {
	const sizeClasses = {
		xs: 'h-6 w-6 text-xs',
		sm: 'h-8 w-8 text-sm',
		md: 'h-10 w-10 text-base',
		lg: 'h-12 w-12 text-lg',
		xl: 'h-16 w-16 text-xl',
		'2xl': 'h-20 w-20 text-2xl',
	};
	const sizePixels: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number> = {
		xs: 24,
		sm: 32,
		md: 40,
		lg: 48,
		xl: 64,
		'2xl': 80,
	};

	if (src) {
		return (
			<Image
				src={src}
				alt={alt || 'User avatar'}
				width={sizePixels[size]}
				height={sizePixels[size]}
				className={cn(
					'inline-block rounded-full object-cover',
					sizeClasses[size],
					className
				)}
			/>
		);
	}

	return (
		<div
			className={cn(
				'inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
				sizeClasses[size],
				className
			)}
			aria-label={ariaLabel || `User avatar with initials ${fallback}`}
			role='img'
		>
			{fallback}
		</div>
	);
}

export { Avatar };
