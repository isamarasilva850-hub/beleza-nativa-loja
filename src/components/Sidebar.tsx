"use client";

import { useState } from "react";
import { collections, genders, categories, sizes, products as allProducts } from "@/data/products";
import ColorFilter from "@/components/ColorFilter";

interface SidebarProps {
  onFilterChange?: (filters: {
    collection: string | null;
    gender: string | null;
    category: string | null;
    size: string | null;
    priceRange: [number, number] | null;
    sortBy?: string | null;
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [openSections, setOpenSections] = useState({
    collections: false,
    genders: true,
    categories: false,
    sizes: false,
    colors: false,
    prices: false,
    sort: false,
  });

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const toggle = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilter = (
    type: "collection" | "gender" | "category" | "size",
    value: string
  ) => {
    const setters = {
      collection: setSelectedCollection,
      gender: setSelectedGender,
      category: setSelectedCategory,
      size: setSelectedSize,
    };
    const current = {
      collection: selectedCollection,
      gender: selectedGender,
      category: selectedCategory,
      size: selectedSize,
    };

    const newValue = current[type] === value ? null : value;
    setters[type](newValue);

    onFilterChange?.({
      collection: type === "collection" ? newValue : selectedCollection,
      gender: type === "gender" ? newValue : selectedGender,
      category: type === "category" ? newValue : selectedCategory,
      size: type === "size" ? newValue : selectedSize,
      priceRange: null,
      sortBy: null,
    });
  };

  const priceRanges = [
    "DE R$ 0,00 A R$ 25,00",
    "DE R$ 25,00 A R$ 50,00",
    "DE R$ 50,00 A R$ 75,00",
    "DE R$ 75,00 A R$ 100,00",
  ];

  const sortOptions = ["MAIS VENDIDOS", "OFERTAS", "MENOR PREÇO", "MAIOR PREÇO"];

  return (
    <aside className="w-full bg-white rounded-lg p-4 border-2 border-gray-300 shadow-md">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrar
        </h2>
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <ColorFilter
          products={allProducts}
          onColorSelect={() => {}}
        />
      </div>

      {/* Collections */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggle("collections")}
          className="flex items-center justify-between w-full text-left hover:text-primary transition-colors group"
        >
          <span className="text-sm font-bold text-gray-900 tracking-wide flex items-center gap-2">
            <span className="text-lg">◆</span> COLEÇÕES
          </span>
          <span className={`text-gray-400 text-lg transition-transform ${openSections.collections ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        {openSections.collections && (
          <ul className="mt-3 space-y-2 pl-6">
            {collections.map((c) => (
              <li key={c}>
                <button
                  onClick={() => handleFilter("collection", c)}
                  className={`text-sm transition-all ${
                    selectedCollection === c
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  ✓ {c}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Genders */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggle("genders")}
          className="flex items-center justify-between w-full text-left hover:text-primary transition-colors"
        >
          <span className="text-sm font-bold text-gray-900 tracking-wide flex items-center gap-2">
            <span className="text-lg">👥</span> GÊNEROS
          </span>
          <span className={`text-gray-400 text-lg transition-transform ${openSections.genders ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        {openSections.genders && (
          <ul className="mt-3 space-y-2 pl-6">
            {genders.map((g) => (
              <li key={g}>
                <button
                  onClick={() => handleFilter("gender", g)}
                  className={`text-sm transition-all ${
                    selectedGender === g
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  ✓ {g}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("categories")}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-bold text-gray-900 tracking-wide">CATEGORIAS</span>
          <span className="text-gray-600 text-sm">{openSections.categories ? "−" : "+"}</span>
        </button>
        {openSections.categories && (
          <ul className="mt-2 space-y-1">
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => handleFilter("category", c)}
                  className={`text-xs hover:text-primary transition-colors ${
                    selectedCategory === c ? "text-primary font-semibold" : "text-gray-800"
                  }`}
                >
                  {c.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sizes */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("sizes")}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-bold text-gray-900 tracking-wide">TAMANHOS</span>
          <span className="text-gray-600 text-sm">{openSections.sizes ? "−" : "+"}</span>
        </button>
        {openSections.sizes && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => handleFilter("size", s)}
                className={`px-2 py-1 text-[10px] border rounded transition-colors ${
                  selectedSize === s
                    ? "border-primary bg-primary text-white"
                    : "border-gray-400 text-gray-900 hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prices */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("prices")}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-bold text-gray-900 tracking-wide">PREÇOS</span>
          <span className="text-gray-600 text-sm">{openSections.prices ? "−" : "+"}</span>
        </button>
        {openSections.prices && (
          <ul className="mt-2 space-y-1">
            {priceRanges.map((r) => (
              <li key={r}>
                <button className="text-xs text-gray-800 hover:text-primary transition-colors">
                  {r}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sort */}
      <div className="pb-3">
        <button
          onClick={() => toggle("sort")}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-bold text-gray-700 tracking-wide">ORDENAR</span>
          <span className="text-gray-400 text-sm">{openSections.sort ? "−" : "+"}</span>
        </button>
        {openSections.sort && (
          <ul className="mt-2 space-y-1">
            {sortOptions.map((o) => (
              <li key={o}>
                <button className="text-xs text-gray-800 hover:text-primary transition-colors">
                  {o}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
