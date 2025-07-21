"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { make as SEO } from "src/components/SEO.res.mjs";
import { getAllBlogPosts, getAllBlogSlugs } from "src/blog/BlogUtils.res.mjs";

export default function BlogIndex({ posts }) {
	const [search, setSearch] = useState("");

	const filteredPosts = posts.filter((post) => {
		const title = post.frontmatter.title?.toLowerCase() || "";
		const subtitle = post.frontmatter.subtitle?.toLowerCase() || "";
		const tags = (post.frontmatter.tags || []).join(" ").toLowerCase();
		const query = search.toLowerCase();
		return (
			title.includes(query) ||
			subtitle.includes(query) ||
			tags.includes(query)
		);
	});
	// console.log(filteredPosts);
	// return "";

	return (
		<>
			<SEO title="Blog" />
			<div className="py-10 flex flex-row gap-30 relative">
				<div className="mb-12 w-1/4">
					<h1 className="text-4xl font-bold mb-4">Blog</h1>
					<p className="text-xl mb-4">
						Thoughts, tutorials, and insights. Anything I wish to
						share.
					</p>
					<div className="relative">
						<input
							placeholder="Search..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="appearance-none outline-none border-2 border-secondary ring-primary rounded py-2 px-3 text-sm bg-secondary/20 text-secondary-foreground focus:ring-2 focus:ring-primary transition pl-10"
						/>
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground w-5 h-5 pointer-events-none" />
					</div>
				</div>

				<main className="space-y-8 grow">
					{filteredPosts.map((post) => {
						const postDate = new Date(post.frontmatter.date);
						const now = new Date();
						const diffMs = now - postDate;
						const diffDays = Math.floor(
							diffMs / (1000 * 60 * 60 * 24)
						);
						const diffYears = Math.floor(diffDays / 365);

						let timeAgo = "";
						if (diffYears > 0) {
							timeAgo = `${diffYears} year${
								diffYears > 1 ? "s" : ""
							} ago`;
						} else if (diffDays > 0) {
							timeAgo = `${diffDays} day${
								diffDays > 1 ? "s" : ""
							} ago`;
						} else {
							timeAgo = "Today";
						}

						return (
							<div
								key={post.slug}
								className="relative pb-8 flex flex-row group"
							>
								<div className="pointer-events-none absolute inset-0 bg-secondary/20 -mx-4 -mt-8 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10" />
								<div className="grow">
									<h2 className="text-2xl font-bold">
										<Link
											href={`/blog/${post.slug}`}
											className="transition-colors"
										>
											<span className="absolute inset-0"></span>
											{post.frontmatter.title}
										</Link>
									</h2>
									<p className="mb-2">
										{post.frontmatter.subtitle}
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										{post.frontmatter.tags.map((tag) => (
											<span
												key={tag}
												className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm"
											>
												{tag}
											</span>
										))}
									</div>

									<p className="text-primary font-semibold">
										Read more →
									</p>
								</div>
								<div className="text-muted-foreground mb-4 flex flex-col items-end">
									<span>{post.frontmatter.date}</span>
									<span className="text-xs text-muted-foreground/80">
										{timeAgo}
									</span>
								</div>
							</div>
						);
					})}
				</main>

				{filteredPosts.length === 0 && (
					<div className="text-center py-12">
						<p className="text-lg">
							No blog posts found. Check back soon!
						</p>
					</div>
				)}
			</div>
		</>
	);
}

export async function getStaticProps() {

	const posts = getAllBlogPosts();

  const paths = getAllBlogSlugs();

	return {
		props: {
			posts,
		},
	};
}
