import { redirect } from 'next/navigation';

type TProps = {
	params: Promise<{ id: string }>;
};

export default function EditResumePage({ params }: TProps) {
	redirect('/');
}
