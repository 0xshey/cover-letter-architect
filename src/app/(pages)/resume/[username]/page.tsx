import { ResumeView } from "@/components/resume/resume-view";

interface ResumePageProps {
	params: Promise<{
		username: string;
	}>;
}

export default async function ResumePage({ params }: ResumePageProps) {
	const { username } = await params;

	return <ResumeView username={username} />;
}

export async function generateMetadata({ params }: ResumePageProps) {
	const { username } = await params;

	return {
		title: `Resume | CLA`,
		description: `View resume for ${username}`,
	};
}
