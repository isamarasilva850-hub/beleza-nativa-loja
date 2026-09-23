const fs = require("fs");
const path = require("path");

const csvPath = path.join(__dirname, "..", "..", "..", "Downloads", "440_excel1787857429432.csv");
const csvContent = fs.readFileSync(csvPath, "utf-8");

const lines = csvContent.split("\n").filter((l) => l.trim());

const hunterStock = {};

for (const line of lines) {
  const cols = line.split(";");
  if (cols.length < 9) continue;

  const productName = (cols[1] || "").trim();
  const size = (cols[2] || "").trim();
  const subGroup = (cols[3] || "").trim();
  const qtyRaw = (cols[7] || "0").replace(",", ".");
  const qty = Math.floor(parseFloat(qtyRaw) || 0);

  if (
    subGroup === "MATERIA PRIMA" ||
    subGroup === "EMBALAGENS" ||
    subGroup === "PRODUTO" ||
    !productName ||
    !size ||
    qty <= 0
  )
    continue;

  if (["UNICO", "P/M", "G/GG"].includes(size)) continue;

  const refMatch = productName.match(/^(\d{2,3})\s*[-\s]/);
  if (!refMatch) continue;

  let ref = refMatch[1];
  if (ref.length === 2) ref = "0" + ref;

  if (!hunterStock[ref]) hunterStock[ref] = {};
  hunterStock[ref][size] = (hunterStock[ref][size] || 0) + qty;
}

console.log("=== Estoque do Hunter (refs com quantidade > 0) ===\n");
for (const [ref, sizes] of Object.entries(hunterStock).sort((a, b) => a[0].localeCompare(b[0]))) {
  const sizeList = Object.entries(sizes)
    .map(([s, q]) => `${s}=${q}`)
    .join(", ");
  console.log(`REF ${ref}: ${sizeList}`);
}

const productsPath = path.join(__dirname, "..", "src", "data", "products.ts");
const productsContent = fs.readFileSync(productsPath, "utf-8");

const productBlocks = productsContent.split(/\n\s*\{[\s\n]+id:/g).slice(1);

const products = [];
for (const block of productBlocks) {
  const refMatch = block.match(/ref:\s*"([^"]+)"/);
  const variantsMatch = block.match(/variants:\s*\[([\s\S]*?)\],\s*\n\s*images/);
  if (!refMatch || !variantsMatch) continue;

  const ref = refMatch[1];
  const variantsStr = variantsMatch[1];

  const variants = [];
  const variantParts = variantsStr.split(/\{\s*color:/g).slice(1);
  for (const vp of variantParts) {
    const colorMatch = vp.match(/^\s*"([^"]+)"/);
    const sizesMatch = vp.match(/sizes:\s*\[([^\]]+)\]/);
    if (colorMatch && sizesMatch) {
      const color = colorMatch[1];
      const sizes = sizesMatch[1].match(/"([^"]+)"/g).map((s) => s.replace(/"/g, ""));
      variants.push({ color, sizes });
    }
  }

  products.push({ ref, variants });
}

const stockEntries = [];
let matched = 0;
let unmatched = [];

for (const [hunterRef, sizeQtys] of Object.entries(hunterStock)) {
  const product = products.find((p) => p.ref === hunterRef);
  if (!product) {
    unmatched.push(hunterRef);
    continue;
  }

  matched++;
  const numColors = product.variants.length;

  for (const [size, totalQty] of Object.entries(sizeQtys)) {
    const perColor = Math.floor(totalQty / numColors);
    const remainder = totalQty % numColors;

    product.variants.forEach((variant, i) => {
      if (!variant.sizes.includes(size)) return;
      const qty = perColor + (i === 0 ? remainder : 0);
      if (qty > 0) {
        stockEntries.push({
          ref: product.ref,
          color: variant.color,
          size,
          quantity: qty,
        });
      }
    });
  }
}

console.log(`\n=== Resultado ===`);
console.log(`Refs do Hunter com estoque: ${Object.keys(hunterStock).length}`);
console.log(`Refs encontradas no site: ${matched}`);
console.log(`Refs NÃO encontradas no site: ${unmatched.length}`);
if (unmatched.length > 0) {
  console.log(`  (${unmatched.join(", ")})`);
}
console.log(`Total de entradas de estoque geradas: ${stockEntries.length}`);
console.log(
  `Total de peças: ${stockEntries.reduce((s, e) => s + e.quantity, 0)}`
);

const outputPath = path.join(__dirname, "hunter-stock-import.json");
fs.writeFileSync(outputPath, JSON.stringify(stockEntries, null, 2));
console.log(`\nArquivo salvo em: ${outputPath}`);
