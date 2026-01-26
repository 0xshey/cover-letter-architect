import { Instrument_Serif, Outfit } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-serif",
});

export const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-geometric",
});
