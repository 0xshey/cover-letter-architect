export interface CoverLetter {
	id: string;
	title: string;
	updated_at: string;
	target_info: any;
	blocks: any;
	markdown?: string;
}

export interface LetterItemProps {
	letter: CoverLetter;
	onOpen: (letter: CoverLetter) => void;
	onDelete: (id: string) => void;
}
