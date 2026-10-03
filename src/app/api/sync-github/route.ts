import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_OWNER = "isamarasilva850-hub";
const REPO_NAME = "beleza-nativa-loja";
const FILE_PATH = "src/data/products.ts";

interface ProductForGithub {
  id: string;
  ref: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  description?: string;
  variants?: Array<{ color: string; colorHex: string }>;
  images?: string[];
}

export async function POST(req: Request) {
  try {
    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      return Response.json(
        { error: "Products must be an array" },
        { status: 400 }
      );
    }

    if (!process.env.GITHUB_TOKEN) {
      return Response.json(
        { error: "GitHub token not configured" },
        { status: 500 }
      );
    }

    // Get current file from GitHub
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    if (!("content" in fileData)) {
      throw new Error("Failed to read file from GitHub");
    }

    // Decode content
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");

    // Parse existing products
    const exportMatch = content.match(/export const products: Product\[\] = \[([\s\S]*)\];/);
    if (!exportMatch) {
      throw new Error("Could not parse products from GitHub file");
    }

    // Convert incoming products to GitHub format
    const productsForGithub = products.map((p: any) => {
      const variants = p.colorHex
        ? [{ color: p.color, colorHex: p.colorHex }]
        : [];

      return {
        id: p.ref,
        ref: p.ref,
        name: p.name,
        category: p.category || "Lingerie",
        gender: p.gender || "Feminino",
        price: p.price,
        description: p.description || "",
        variants,
        images: p.images || [],
      };
    });

    // Generate new products array content
    const productsContent = productsForGithub
      .map(
        (p: ProductForGithub) => `  {
    id: "${p.id}",
    ref: "${p.ref}",
    name: "${p.name.replace(/"/g, '\\"')}",
    category: "${p.category}",
    gender: "${p.gender}",
    price: ${p.price},
    description: "${(p.description || "").replace(/"/g, '\\"')}",
    variants: [${(p.variants || [])
      .map((v) => `{ color: "${v.color}", colorHex: "${v.colorHex}" }`)
      .join(", ")}],
    images: ${JSON.stringify(p.images || [])},
  }`
      )
      .join(",\n");

    const newContent = `export const products: Product[] = [
${productsContent}
];`;

    // Update file on GitHub
    const updateResponse = await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
      message: `🔄 Atualizar produtos via Palmira (${products.length} produtos) [Bot]`,
      content: Buffer.from(newContent).toString("base64"),
      sha: fileData.sha,
      committer: {
        name: "Palmira Bot",
        email: "noreply@belezanativa.com",
      },
    });

    return Response.json({
      success: true,
      synced: products.length,
      message: `${products.length} products synced to GitHub`,
      commit: updateResponse.data.commit.sha,
    });
  } catch (error: any) {
    console.error("[GitHub Sync Error]", error);
    return Response.json(
      { error: error.message || "GitHub sync failed" },
      { status: 500 }
    );
  }
}
