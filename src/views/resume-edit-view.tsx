type TProps = {
	id: string;
};

export function ResumeEditView({ id }: TProps) {
	return (
		<div className='p-6'>
			<h1 className='text-xl font-semibold'>Edit Resume</h1>
			<p className='text-sm text-muted-foreground'>Editing ID: {id}</p>
		</div>
	);
}
