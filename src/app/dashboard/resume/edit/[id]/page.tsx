import { ResumeEditView } from '@/views/resume-edit-view';

export default function EditResumePage({ params }: any) {
	return <ResumeEditView id={params.id} />;
}
