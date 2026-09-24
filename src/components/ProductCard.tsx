"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasImage = product.images.length > 0 && !product.images[0].includes("basica-1");
  const retailPrice = product.price * 2;
  const { isLoggedIn } = useAuth();
  const [colorOverrides, setColorOverrides] = useState<any[]>([]);

  useEffect(() => {
    try {
      const overrides = JSON.parse(localStorage.getItem("belezanativa_color_overrides") || "[]");
      setColorOverrides(overrides);
    } catch {}
  }, []);

  const getColorName = (originalColor: string) => {
    const override = colorOverrides.find(
      (o: any) => o.productRef === product.ref && o.originalColor === originalColor
    );
    return override ? override.newColor : originalColor;
  };

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={`${product.ref} - ${product.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      <div className="p-3">
        <p className="text-primary-dark font-bold text-lg">
          R$ {retailPrice.toFixed(2).replace(".", ",")}
        </p>
        <p className="text-[10px] text-gray-400 -mt-0.5 mb-1">para uso próprio</p>

        {isLoggedIn ? (
          <p className="text-sm font-bold text-primary -mt-0.5 mb-2">
            R$ {product.price.toFixed(2).replace(".", ",")} <span className="text-[10px] font-normal">para revenda</span>
          </p>
        ) : (
          <Link
            href="/minha-conta"
            className="text-[10px] text-primary hover:underline -mt-0.5 mb-2 block"
            onClick={(e) => e.stopPropagation()}
          >
            Logue-se para ver o preço de revenda
          </Link>
        )}

        <div className="flex gap-1 mb-2">
          {product.variants.map((v, i) => (
            <span
              key={`${v.color}-${i}`}
              className="w-5 h-5 rounded-full border border-gray-300"
              style={{ backgroundColor: v.colorHex }}
              title={getColorName(v.color)}
            />
          ))}
        </div>

        <p className="text-xs text-gray-600 leading-tight">
          {product.ref} - {product.name}
        </p>
      </div>
    </Link>
  );
}
