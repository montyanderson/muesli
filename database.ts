type Summary = {
	created_at: string;
	generated_lines: { text: string }[];
	original_content: string;
};

export const readDatabase = async () => {
	const homeDir = Deno.env.get("HOME") ?? (() => {
		throw new Error("HOME environment variable not set");
	})();

	const cacheFile =
		`${homeDir}/Library/Application Support/Granola/cache-v3.json`;

	const { state } = JSON.parse(
		JSON.parse(await Deno.readTextFileSync(cacheFile)).cache,
	) as { state: any };

	return {
		getSummaries: async function* () {
			for (const dp of Object.values(state.documentPanels)) {
				for (const document of Object.values(dp as any)) {
					yield document as Summary;
				}
			}
		},
	};
};
