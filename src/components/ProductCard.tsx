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
  const hasImage = product.images && product.images.length > 0 && !product.images[0].includes("basica-1");
  const retailPrice = product.price * 2;
  const { user } = useAuth();
  const isReseller = user?.type === 'revendedor';
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
      className="group block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-primary"
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
      </div>

      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <p className="text-base font-black text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2 font-semibold">
          {product.description}
        </p>

        {/* Prices */}
        <div className="mb-3 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-200">
          <p className="text-gray-700 font-bold text-sm mb-1.5">Preço ao consumidor</p>
          <p className="text-gray-800 font-black text-lg line-through">
            R$ {retailPrice.toFixed(2).replace(".", ",")}
          </p>

          {isReseller ? (
            <div className="mt-3 pt-3 border-t-2 border-[#2d8a7d]/30">
              <div className="inline-block bg-gradient-to-r from-[#1b7a6f] to-[#2d8a7d] text-white px-2.5 py-1 rounded-full text-xs font-black mb-2">
                💰 PREÇO REVENDA
              </div>
              <p className="text-[#1b7a6f] font-black text-2xl">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-[#2d8a7d] font-semibold">
                ✓ Você economiza R$ {(retailPrice - product.price).toFixed(2).replace(".", ",")}
              </p>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "/quero-comecar";
              }}
              className="text-xs text-primary font-semibold hover:text-primary-dark mt-2 block bg-none border-none p-0 cursor-pointer underline"
            >
              → Comece como revendedora para preço especial
            </button>
          )}
        </div>

        {/* Sizes */}
        <div className="mb-3">
          <p className="text-xs font-bold text-gray-800 mb-2">Tamanhos:</p>
          <div className="flex gap-2 flex-wrap">
            {product.variants && Array.from(new Set(product.variants.flatMap(v => v.sizes))).map((size) => (
              <span key={size} className="text-xs px-2.5 py-1 bg-gray-200 text-gray-800 rounded font-semibold">
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-3">
          <p className="text-xs font-bold text-gray-800 mb-2">Cores:</p>
          <div className="flex gap-2">
            {product.variants?.map((v, i) => (
              <span
                key={`${v.color}-${i}`}
                className="w-6 h-6 rounded-full border-2 border-gray-400 hover:border-primary transition-colors cursor-help"
                style={{ backgroundColor: v.colorHex }}
                title={`${getColorName(v.color)}`}
              />
            ))}
          </div>
        </div>

        {/* Composition Hint */}
        {product.composition && (
          <p className="text-xs text-gray-600 italic mb-1">
            {product.composition.split(",")[0]}
          </p>
        )}

        {/* REF */}
        <p className="text-xs text-gray-600 mt-1 font-mono font-bold">
          REF {product.ref}
        </p>
      </div>
    </Link>
  );
}
