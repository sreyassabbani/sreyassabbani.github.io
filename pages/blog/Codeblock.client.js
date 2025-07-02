"use client";
import { Highlight } from "prism-react-renderer";
import { gruvboxDark, gruvboxLight } from "../../themes/gruvbox";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({
	className = "",
	children,
	showLineNumbers = true,
	showCopyButton = true,
	title,
}) {
	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [codeTheme, setCodeTheme] = useState("gruvboxLight");

	// Handle hydration mismatch and get code theme from localStorage
	useEffect(() => {
		setMounted(true);

		// Get code theme from localStorage
		try {
			const savedCodeTheme = localStorage.getItem("codeTheme");
			if (savedCodeTheme) {
				setCodeTheme(savedCodeTheme);
			} else {
				// Default based on system theme
				const mediaQuery = window.matchMedia(
					"(prefers-color-scheme: dark)"
				);
				setCodeTheme(
					mediaQuery.matches ? "gruvboxDark" : "gruvboxLight"
				);
			}
		} catch (e) {
			// Fallback if localStorage is not available
			setCodeTheme("gruvboxLight");
		}

		// Listen for storage changes (theme updates from footer)
		const handleStorageChange = (e) => {
			if (e.key === "codeTheme" && e.newValue) {
				setCodeTheme(e.newValue);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const languageRaw = className.replace(/language-/, "") ?? "";
	const language = languageRaw === "" ? "plain" : languageRaw;
	const code = typeof children === "string" ? children.trim() : "";
	const selectedTheme =
		codeTheme === "gruvboxDark" ? gruvboxDark : gruvboxLight;

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	if (!mounted) {
		// Return a basic pre element during SSR to prevent hydration mismatch
		return (
			<pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
				<code>{code}</code>
			</pre>
		);
	}

	return (
		<div className="relative group my-6">
			{/* Header with title and controls */}
			{(title || showCopyButton) && (
				<div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-800 text-gray-200 text-sm rounded-t-lg border-b border-gray-600">
					<div className="flex items-center gap-2">
						{title && <span className="font-medium">{title}</span>}
						{language && language !== "plain" && (
							<span className="px-2 py-1 bg-gray-700 rounded text-xs uppercase font-mono">
								{language}
							</span>
						)}
					</div>
					<div className="flex items-center gap-2">
						{showCopyButton && (
							<button
								onClick={copyToClipboard}
								className="p-1 hover:bg-gray-700 rounded transition-colors"
								title="Copy code"
							>
								{copied ? (
									<Check
										size={14}
										className="text-green-400"
									/>
								) : (
									<Copy size={14} />
								)}
							</button>
						)}
					</div>
				</div>
			)}

			{/* Code block */}
			<Highlight
				theme={selectedTheme}
				code={code}
				language={language}
				key={codeTheme}
			>
				{({
					className: hlClassName,
					style,
					tokens,
					getLineProps,
					getTokenProps,
				}) => (
					<pre
						className={`${hlClassName} overflow-x-auto ${
							title || showCopyButton
								? "rounded-t-none"
								: "rounded-lg"
						}`}
						style={{
							...style,
							margin: 0,
							padding: "1rem",
						}}
					>
						{tokens.map((line, i) => {
							const lineProps = getLineProps({ line });
							const lineNumber = i + 1;

							return (
								<div
									key={i}
									{...lineProps}
									className={`${lineProps.className} ${
										showLineNumbers ? "flex" : ""
									}`}
									style={{
										...lineProps.style,
										...(showLineNumbers && {
											paddingLeft: 0,
										}),
									}}
								>
									{showLineNumbers && (
										<span
											className="select-none text-right pr-4 opacity-50 min-w-[3rem] flex-shrink-0"
											style={{
												color: selectedTheme.plain
													.color,
												fontFamily:
													selectedTheme.plain
														.fontFamily,
											}}
										>
											{lineNumber}
										</span>
									)}
									<span className="flex-1">
										{line.map((token, key) => {
											const tokenProps = getTokenProps({
												token,
												key,
											});
											const {
												key: _key,
												...restTokenProps
											} = tokenProps;
											return (
												<span
													key={key}
													{...restTokenProps}
												/>
											);
										})}
									</span>
								</div>
							);
						})}
					</pre>
				)}
			</Highlight>
		</div>
	);
}
