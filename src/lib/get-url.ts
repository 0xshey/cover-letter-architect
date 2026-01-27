export const getURL = () => {
	let url =
		process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
		process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
		"http://localhost:3000/";

	// If running on the client, use the current window's origin
	if (typeof window !== "undefined") {
		return window.location.origin.endsWith("/")
			? window.location.origin
			: `${window.location.origin}/`;
	}

	// Make sure to include `https://` when not localhost.
	url = url.includes("http") ? url : `https://${url}`;

	// Make sure to include a trailing `/`.
	url = url.endsWith("/") ? url : `${url}/`;
	return url;
};
