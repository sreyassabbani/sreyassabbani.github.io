/**
 * Gruvbox themes for prism-react-renderer
 * Integrated with Tailwind CSS for consistent theming
 */

export const gruvboxDark = {
	plain: {
		color: "#ebdbb2", // gruvbox fg1
		backgroundColor: "#1d2021", // gruvbox bg0_h
		fontFamily:
			'"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
		fontSize: "0.875rem", // text-sm
		lineHeight: "1.5",
	},
	styles: [
		{
			types: ["comment", "prolog", "cdata"],
			style: {
				color: "#a89984", // gruvbox fg4
				fontStyle: "italic",
			},
		},
		{
			types: [
				"delimiter",
				"boolean",
				"keyword",
				"selector",
				"important",
				"atrule",
			],
			style: {
				color: "#fb4934", // gruvbox red
				fontWeight: "600",
			},
		},
		{
			types: ["operator", "punctuation", "attr-name"],
			style: {
				color: "#a89984", // gruvbox fg4
			},
		},
		{
			types: ["tag", "doctype", "builtin"],
			style: {
				color: "#fabd2f", // gruvbox yellow
			},
		},
		{
			types: ["entity", "number", "symbol"],
			style: {
				color: "#d3869b", // gruvbox purple
			},
		},
		{
			types: ["property", "constant", "variable"],
			style: {
				color: "#fb4934", // gruvbox red
			},
		},
		{
			types: ["string", "char"],
			style: {
				color: "#b8bb26", // gruvbox green
			},
		},
		{
			types: ["attr-value"],
			style: {
				color: "#a89984", // gruvbox fg4
			},
		},
		{
			types: ["url"],
			style: {
				color: "#b8bb26", // gruvbox green
				textDecoration: "underline",
			},
		},
		{
			types: ["function"],
			style: {
				color: "#fabd2f", // gruvbox yellow
			},
		},
		{
			types: ["class-name"],
			style: {
				color: "#8ec07c", // gruvbox aqua
			},
		},
		{
			types: ["method", "function-definition"],
			style: {
				color: "#fabd2f", // gruvbox yellow
			},
		},
		{
			types: ["namespace"],
			style: {
				color: "#fe8019", // gruvbox orange
			},
		},
	],
};

export const gruvboxLight = {
	plain: {
		color: "#3c3836", // gruvbox fg1 (light)
		backgroundColor: "#f9f5d7", // gruvbox bg0_h (light)
		fontFamily:
			'"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
		fontSize: "0.875rem", // text-sm
		lineHeight: "1.5",
	},
	styles: [
		{
			types: ["comment", "prolog", "cdata"],
			style: {
				color: "#7c6f64", // gruvbox fg4 (light)
				fontStyle: "italic",
			},
		},
		{
			types: [
				"delimiter",
				"boolean",
				"keyword",
				"selector",
				"important",
				"atrule",
			],
			style: {
				color: "#9d0006", // gruvbox red (light)
				fontWeight: "600",
			},
		},
		{
			types: ["operator", "punctuation", "attr-name"],
			style: {
				color: "#7c6f64", // gruvbox fg4 (light)
			},
		},
		{
			types: ["tag", "doctype", "builtin"],
			style: {
				color: "#b57614", // gruvbox yellow (light)
			},
		},
		{
			types: ["entity", "number", "symbol"],
			style: {
				color: "#8f3f71", // gruvbox purple (light)
			},
		},
		{
			types: ["property", "constant", "variable"],
			style: {
				color: "#9d0006", // gruvbox red (light)
			},
		},
		{
			types: ["string", "char"],
			style: {
				color: "#797403", // gruvbox green (light)
			},
		},
		{
			types: ["attr-value"],
			style: {
				color: "#7c6f64", // gruvbox fg4 (light)
			},
		},
		{
			types: ["url"],
			style: {
				color: "#797403", // gruvbox green (light)
				textDecoration: "underline",
			},
		},
		{
			types: ["function"],
			style: {
				color: "#b57614", // gruvbox yellow (light)
			},
		},
		{
			types: ["class-name"],
			style: {
				color: "#427b58", // gruvbox aqua (light)
			},
		},
		{
			types: ["method", "function-definition"],
			style: {
				color: "#b57614", // gruvbox yellow (light)
			},
		},
		{
			types: ["namespace"],
			style: {
				color: "#af3a03", // gruvbox orange (light)
			},
		},
	],
};
