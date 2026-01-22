import { ResumeView } from "@/components/resume/resume-view";

interface ResumePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export default async function ResumePage({ params }: ResumePageProps) {
	const { userId } = await params;

	return <ResumeView userId={userId} />;
}

export async function generateMetadata({ params }: ResumePageProps) {
	const { userId } = await params;

	return {
		title: `Resume | CLA`,
		description: `View resume for user ${userId}`,
	};
}
