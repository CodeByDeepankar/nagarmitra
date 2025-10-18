import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
	...nextJsConfig,
	{
		ignores: ["app/**/*-new.tsx"],
	},
	{
		rules: {
			"@next/next/no-img-element": "off",
			"react/prop-types": "off",
		},
	},
];
