import { Folder, Form, LayoutPanelTop } from "lucide-react";

export const NAVIGATION_ITEMS = [
	{
		icon: Folder,
		label: "Home",
		path: "/letters",
		match: (pathname: string) => pathname === "/letters",
	},
	{
		icon: LayoutPanelTop,
		label: "Create",
		path: "/editor",
		match: (pathname: string) => pathname === "/editor",
	},
	{
		icon: Form,
		label: "Resume",
		path: "/resume",
		match: (pathname: string) => pathname.startsWith("/resume"),
	},
];
