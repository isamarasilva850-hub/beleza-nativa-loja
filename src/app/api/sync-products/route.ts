import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: Request) {
  try {
    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      return Response.json(
        { error: "Products must be an array" },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { error: "Supabase credentials not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let synced = 0;

    for (const product of products) {
      try {
        // Check if product with same ref already exists
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("reference", product.ref)
          .single();

        const productData = {
          reference: product.ref,
          name: product.name,
          description: `Cor: ${product.color || "Sem cor"}`,
          price: product.price,
          category: product.category || "Lingerie",
          gender: product.gender || "Feminino",
          created_at: new Date(product.timestamp || Date.now()).toISOString(),
        };

        if (existing?.id) {
          // Update existing
          await supabase
            .from("products")
            .update(productData)
            .eq("id", existing.id);
        } else {
          // Insert new
          await supabase.from("products").insert([productData]);
        }

        // Handle images if provided - MERGE strategy
        if (product.images && product.images.length > 0) {
          const { data: prod } = await supabase
            .from("products")
            .select("id")
            .eq("reference", product.ref)
            .single();

          if (prod?.id) {
            // Get existing images for this product
            const { data: existingImages } = await supabase
              .from("product_images")
              .select("id, image_url, position")
              .eq("product_id", prod.id)
              .order("position", { ascending: true });

            const existingCount = existingImages?.length || 0;

            // Insert only NEW images (those not already in database)
            for (let i = 0; i < product.images.length; i++) {
              const imgBase64 = product.images[i];

              // Check if this image already exists at this position
              if (i < existingCount && existingImages?.[i]?.image_url === imgBase64) {
                // Image already exists, skip
                continue;
              } else if (i < existingCount) {
                // Update existing image at this position
                await supabase
                  .from("product_images")
                  .update({
                    image_url: imgBase64,
                    position: i,
                  })
                  .eq("id", existingImages![i].id);
              } else {
                // Insert new image
                await supabase.from("product_images").insert([
                  {
                    product_id: prod.id,
                    image_url: imgBase64,
                    position: i,
                  },
                ]);
              }
            }

            // If images were removed, delete extras
            if (product.images.length < existingCount) {
              const idsToDelete = existingImages
                ?.slice(product.images.length)
                .map((img) => img.id) || [];

              if (idsToDelete.length > 0) {
                await supabase
                  .from("product_images")
                  .delete()
                  .in("id", idsToDelete);
              }
            }
          }
        }
      } catch (e) {
        console.error("Error syncing product:", e);
      }

      synced++;
    }

    return Response.json({
      success: true,
      synced,
      message: `${synced} product(s) synchronized with Supabase`,
    });
  } catch (error: any) {
    console.error("[Sync Error]", error);
    return Response.json(
      { error: error.message || "Sync failed" },
      { status: 500 }
    );
  }
}
