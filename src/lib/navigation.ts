import { Home, PlusSquare, FileText } from "lucide-react";

export const NAVIGATION_ITEMS = [
	{
		icon: Home,
		label: "Home",
		path: "/dashboard",
		match: (pathname: string) => pathname === "/dashboard",
	},
	{
		icon: PlusSquare,
		label: "Create",
		path: "/editor",
		match: (pathname: string) => pathname === "/editor",
	},
];
