type TProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function EditResumePage({ params }: TProps) {
	const { id } = await params;

	return (
		<div className='container mx-auto py-8'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-bold mb-8'>Edit Resume #{id}</h1>
				<div className='bg-card rounded-lg border p-8 text-center'>
					<h2 className='text-xl font-semibold mb-4'>Resume Editor</h2>
					<p className='text-muted-foreground mb-4'>
						This page will contain the resume editing form and builder interface.
					</p>
					<p className='text-sm text-muted-foreground'>
						Placeholder - to be implemented in future tasks
					</p>
				</div>
			</div>
		</div>
	);
}
