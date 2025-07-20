"use client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXClient } from "next-mdx-remote-client/csr";
import CodeBlock from "./Codeblock.client";
import Link from "next/link";

// Enhanced MDX components with theme integration
export default function BlogPost({ mdxSource, post }) {
	const components = {
		// Typography components
		p: (props) => (
			<p
				className="text-base leading-relaxed mb-4 text-gray-800 dark:text-gray-200"
				{...props}
			/>
		),
		h1: (props) => (
			<h1
				className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100"
				{...props}
			/>
		),
		h2: (props) => (
			<h2
				className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100"
				{...props}
			/>
		),
		h3: (props) => (
			<h3
				className="text-xl font-medium mt-5 mb-2 text-gray-900 dark:text-gray-100"
				{...props}
			/>
		),
		blockquote: (props) => (
			<blockquote
				className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-700 dark:text-gray-300"
				{...props}
			/>
		),
		ul: (props) => (
			<ul
				className="list-disc list-inside mb-4 space-y-1 text-gray-800 dark:text-gray-200"
				{...props}
			/>
		),
		ol: (props) => (
			<ol
				className="list-decimal list-inside mb-4 space-y-1 text-gray-800 dark:text-gray-200"
				{...props}
			/>
		),
		li: (props) => <li className="mb-1" {...props} />,
		a: ({ href, children, ...rest }) => {
			if (!href) return <a {...rest}>{children}</a>;

			const isExternal = /^https?:\/\//.test(href);

			return isExternal ? (
				<a
					href={href}
					{...rest}
					target="_blank"
					rel="noopener noreferrer"
				>
					{children}
				</a>
			) : (
				<Link href={href} {...rest}>
					{children}
				</Link>
			);
		},
		table: (props) => (
			<div className="overflow-x-auto my-4">
				<table
					className="min-w-full border border-gray-300 dark:border-gray-600"
					{...props}
				/>
			</div>
		),
		th: (props) => (
			<th
				className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold"
				{...props}
			/>
		),
		td: (props) => (
			<td
				className="border border-gray-300 dark:border-gray-600 px-4 py-2"
				{...props}
			/>
		),
		hr: (props) => (
			<hr
				className="my-8 border-gray-300 dark:border-gray-600"
				{...props}
			/>
		),

		// Enhanced code components with theme integration
		pre: ({ children, ...props }) => {
			// Extract code block props if available
			const codeElement = children?.props;
			console.log("pre");
			if (codeElement && typeof codeElement.children === "string") {
				return (
					<CodeBlock
						className={codeElement.className || ""}
						showLineNumbers={true}
						showCopyButton={true}
						{...props}
					>
						{codeElement.children}
					</CodeBlock>
				);
			}
			// Fallback for regular pre elements
			return (
				<pre
					className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto my-4 text-sm"
					{...props}
				/>
			);
		},

		// Inline code styling
		code: ({ children, className, ...props }) => {
			// Check if this is inline code (not in a pre block)
			if (!className) {
				return (
					<code
						className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm"
						{...props}
					>
						{children}
					</code>
				);
			}
			// For code blocks, this will be handled by the pre component
			return (
				<code className={className} {...props}>
					{children}
				</code>
			);
		},

		// Custom components for enhanced functionality
		CodeBlock: (props) => <CodeBlock {...props} />,
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<article>
				<header className="mb-8">
					<div className="flex justify-between items-start mb-6">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
							{post.frontmatter.title}
						</h1>
					</div>

					<div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-6">
						<span>By Sreyas Sabbani</span>
						<span>•</span>
						<span>{post.frontmatter.date}</span>
						{post.frontmatter.readTime && (
							<>
								<span>•</span>
								<span>
									{post.frontmatter.readTime} min read
								</span>
							</>
						)}
					</div>

					{post.frontmatter.tags &&
						post.frontmatter.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-6">
								{post.frontmatter.tags.map((tag) => (
									<span
										key={tag}
										className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm"
									>
										{tag}
									</span>
								))}
							</div>
						)}

					{post.frontmatter.excerpt && (
						<p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
							{post.frontmatter.excerpt}
						</p>
					)}
				</header>

				<div className="prose prose-lg max-w-none dark:prose-invert">
					<MDXClient {...mdxSource} components={components} />
				</div>
			</article>
		</div>
	);
}

export async function getStaticPaths() {
	const blogsDirectory = path.join(process.cwd(), "blog");
	let paths = [];

	if (fs.existsSync(blogsDirectory)) {
		const filenames = fs.readdirSync(blogsDirectory);
		paths = filenames
			.filter((name) => name.endsWith(".mdx"))
			.map((name) => ({
				params: {
					slug: name.replace(/\.mdx$/, ""),
				},
			}));
	}

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const { slug } = params;
	const blogsDirectory = path.join(process.cwd(), "blog");
	const filePath = path.join(blogsDirectory, `${slug}.mdx`);

	if (!fs.existsSync(filePath)) {
		return {
			notFound: true,
		};
	}

	const fileContent = fs.readFileSync(filePath, "utf8");
	const { data, content } = matter(fileContent);

	const mdxSource = await serialize(content, {
		mdxOptions: {
			remarkPlugins: [],
			rehypePlugins: [],
		},
	});

	return {
		props: {
			post: {
				slug,
				frontmatter: data,
				content,
			},
			mdxSource,
		},
	};
}
