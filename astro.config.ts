import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import starlightDocSearch from "@astrojs/starlight-docsearch";
import starlightImageZoom from "starlight-image-zoom";
import liveCode from "astro-live-code";
import starlightLinksValidator from "starlight-links-validator";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import rehypeTitleFigure from "rehype-title-figure";
import rehypeMermaid from "./src/plugins/rehype/mermaid.ts";
import rehypeAutolinkHeadings from "./src/plugins/rehype/autolink-headings.ts";
import rehypeExternalLinks from "./src/plugins/rehype/external-links.ts";
import rehypeHeadingSlugs from "./src/plugins/rehype/heading-slugs.ts";

import { sidebar } from "./src/util/sidebar.ts";

const runLinkCheck = process.env.RUN_LINK_CHECK || false;

// https://astro.build/config
export default defineConfig({
	site: "https://developers.cloudflare.com",
	markdown: {
		smartypants: false,
		rehypePlugins: [
			rehypeMermaid,
			rehypeExternalLinks,
			rehypeHeadingSlugs,
			rehypeAutolinkHeadings,
			// @ts-expect-error plugins types are outdated but functional
			rehypeTitleFigure,
		],
	},
	experimental: {
		contentIntellisense: true,
		contentLayer: true,
		directRenderScript: true,
	},
	server: {
		port: 1111,
	},
	integrations: [
		starlight({
			title: "Cloudflare Docs",
			logo: {
				src: "./src/assets/logo.svg",
			},
			favicon: "/favicon.png",
			head: ["image", "og:image", "twitter:image"].map((name) => {
				return {
					tag: "meta",
					attrs: {
						name,
						content: "https://developers.cloudflare.com/cf-twitter-card.png",
					},
				};
			}),
			social: {
				github: "https://github.com/cloudflare/cloudflare-docs",
				"x.com": "https://x.com/cloudflare",
				youtube: "https://www.youtube.com/cloudflare",
			},
			editLink: {
				baseUrl:
					"https://github.com/cloudflare/cloudflare-docs/edit/production/",
			},
			components: {
				Footer: "./src/components/overrides/Footer.astro",
				Head: "./src/components/overrides/Head.astro",
				Hero: "./src/components/overrides/Hero.astro",
				LastUpdated: "./src/components/overrides/LastUpdated.astro",
				MarkdownContent: "./src/components/overrides/MarkdownContent.astro",
				Sidebar: "./src/components/overrides/Sidebar.astro",
				PageSidebar: "./src/components/overrides/PageSidebar.astro",
				PageTitle: "./src/components/overrides/PageTitle.astro",
				SocialIcons: "./src/components/overrides/SocialIcons.astro",
				SkipLink: "./src/components/overrides/SkipLink.astro",
				TableOfContents: "./src/components/overrides/TableOfContents.astro",
			},
			sidebar,
			customCss: [
				"./src/asides.css",
				"./src/code.css",
				"./src/footnotes.css",
				"./src/headings.css",
				"./src/input.css",
				"./src/mermaid.css",
				"./src/table.css",
				"./src/tailwind.css",
				"./src/title.css",
			],
			pagination: false,
			plugins: [
				...(runLinkCheck
					? [
							starlightLinksValidator({
								errorOnInvalidHashes: false,
								errorOnLocalLinks: false,
								exclude: [
									"/api/",
									"/api/**",
									"/changelog/",
									"/http/resources/**",
									"{props.*}",
									"/",
									"**/glossary/?term=**",
									"/products/?product-group=*",
									"/products/",
									"/rules/snippets/examples/?operation=*",
									"/rules/transform/examples/?operation=*",
									"/ruleset-engine/rules-language/fields/reference/**",
									"/workers/examples/?languages=*",
									"/workers/examples/?tags=*",
									"/workers-ai/models/**",
								],
							}),
						]
					: []),
				starlightDocSearch({
					appId: "D32WIYFTUF",
					apiKey: "5cec275adc19dd3bc17617f7d9cf312a",
					indexName: "prod_devdocs",
					insights: true,
				}),
				starlightImageZoom(),
			],
			lastUpdated: true,
		}),
		tailwind({
			applyBaseStyles: false,
		}),
		liveCode({
			layout: "~/components/live-code/Layout.astro",
		}),
		icon(),
		sitemap({
			serialize(item) {
				item.lastmod = new Date().toISOString();
				return item;
			},
		}),
		react(),
	],
});
