import { cn } from '@/utils/cn';

type TProps = {
	title: string;
	value: React.ReactNode;
	icon?: React.ReactNode;
	description?: string;
	className?: string;
};

export function StatCard({ title, value, icon, description, className }: TProps) {
	return (
		<div
			className={cn(
				'p-4 bg-card rounded-lg border hover:bg-muted/50 transition-colors',
				className
			)}
		>
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
				{icon}
			</div>
			<p className='text-2xl font-bold mt-2'>{value}</p>
			{description && <p className='text-xs text-muted-foreground mt-1'>{description}</p>}
		</div>
	);
}
