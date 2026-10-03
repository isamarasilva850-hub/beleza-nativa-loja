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
      className="group block bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
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
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <p className="text-xs font-bold text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </p>

        {/* Description */}
        <p className="text-[10px] text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        {/* Prices */}
        <div className="mb-2">
          <p className="text-primary-dark font-bold text-lg">
            R$ {retailPrice.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-[10px] text-gray-400 -mt-0.5">para uso próprio</p>

          {isLoggedIn ? (
            <p className="text-sm font-bold text-primary mt-1">
              R$ {product.price.toFixed(2).replace(".", ",")} <span className="text-[10px] font-normal">revenda</span>
            </p>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "/minha-conta";
              }}
              className="text-[10px] text-primary hover:underline mt-1 block bg-none border-none p-0 cursor-pointer"
            >
              Logue-se para preço de revenda
            </button>
          )}
        </div>

        {/* Sizes */}
        <div className="mb-2">
          <p className="text-[10px] font-semibold text-gray-600 mb-1">Tamanhos:</p>
          <div className="flex gap-1 flex-wrap">
            {Array.from(new Set(product.variants.flatMap(v => v.sizes))).map((size) => (
              <span key={size} className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-semibold">
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-2">
          <p className="text-[10px] font-semibold text-gray-600 mb-1">Cores:</p>
          <div className="flex gap-1">
            {product.variants.map((v, i) => (
              <span
                key={`${v.color}-${i}`}
                className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-primary transition-colors cursor-help"
                style={{ backgroundColor: v.colorHex }}
                title={`${getColorName(v.color)}`}
              />
            ))}
          </div>
        </div>

        {/* Composition Hint */}
        <p className="text-[9px] text-gray-500 italic">
          {product.composition.split(",")[0]}
        </p>

        {/* REF */}
        <p className="text-[10px] text-gray-400 mt-1 font-mono">
          REF {product.ref}
        </p>
      </div>
    </Link>
  );
}
