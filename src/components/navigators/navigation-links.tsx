import { Folder, Form, LayoutPanelTop, User } from "lucide-react";

export const NAVIGATION_ITEMS = [
	{
		icon: Folder,
		label: "Home",
		path: "/letters",
		match: (pathname: string) => pathname === "/letters",
	},

	{
		icon: Form,
		label: "Resume",
		path: "/resume",
		match: (pathname: string) => pathname.startsWith("/resume"),
	},
	{
		icon: User,
		label: "Profile",
		path: "/user",
		match: (pathname: string) => pathname === "/user",
	},
];
