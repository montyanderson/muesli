import { readDatabase } from "./database.ts";

console.log(
	"%c==>%c Reading Granola database",
	"color: blue",
	"color: none",
);

const db = await readDatabase();

try {
	await Deno.mkdir("./summaries", { recursive: true });
} catch (e) {
	if (!(e instanceof Deno.errors.AlreadyExists)) {
		throw e;
	}
}

for await (const summary of db.getSummaries()) {
	const date = new Date(summary.created_at);

	const title = summary.generated_lines[0].text;

	const filename = "./summaries/" + date.toISOString()
		.slice(0, 16)
		.replace("T", "-")
		.replace(":", "-") +
		"-" +
		title.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "") +
		".html";

	console.log(
		"%c==>%c Exporting %c%s%c",
		"color: green",
		"color: none",
		"text-decoration: underline",
		filename,
		"color: none",
	);

	await Deno.writeTextFile(
		filename,
		summary.original_content,
	);
}

console.log(
	"%c==>%c Done",
	"color: blue",
	"color: none",
);
