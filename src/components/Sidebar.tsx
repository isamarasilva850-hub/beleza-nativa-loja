"use client";

import { useState } from "react";
import { collections, genders, categories, sizes } from "@/data/products";

interface SidebarProps {
  onFilterChange?: (filters: {
    collection: string | null;
    gender: string | null;
    category: string | null;
    size: string | null;
    priceRange: [number, number] | null;
    sortBy: string | null;
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [openSections, setOpenSections] = useState({
    collections: true,
    genders: true,
    categories: true,
    sizes: true,
    colors: true,
    prices: true,
    sort: true,
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
    <aside className="w-full">
      {/* Collections */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("collections")}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-bold text-gray-700 tracking-wide">COLEÇÕES</span>
          <span className="text-gray-400 text-sm">{openSections.collections ? "−" : "+"}</span>
        </button>
        {openSections.collections && (
          <ul className="mt-2 space-y-1">
            {collections.map((c) => (
              <li key={c}>
                <button
                  onClick={() => handleFilter("collection", c)}
                  className={`text-xs hover:text-primary transition-colors ${
                    selectedCollection === c ? "text-primary font-semibold" : "text-gray-600"
                  }`}
                >
                  {c.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Genders */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("genders")}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-bold text-gray-700 tracking-wide">GÊNEROS</span>
          <span className="text-gray-400 text-sm">{openSections.genders ? "−" : "+"}</span>
        </button>
        {openSections.genders && (
          <ul className="mt-2 space-y-1">
            {genders.map((g) => (
              <li key={g}>
                <button
                  onClick={() => handleFilter("gender", g)}
                  className={`text-xs hover:text-primary transition-colors ${
                    selectedGender === g ? "text-primary font-semibold" : "text-gray-600"
                  }`}
                >
                  {g.toUpperCase()}
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
          <span className="text-xs font-bold text-gray-700 tracking-wide">CATEGORIAS</span>
          <span className="text-gray-400 text-sm">{openSections.categories ? "−" : "+"}</span>
        </button>
        {openSections.categories && (
          <ul className="mt-2 space-y-1">
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => handleFilter("category", c)}
                  className={`text-xs hover:text-primary transition-colors ${
                    selectedCategory === c ? "text-primary font-semibold" : "text-gray-600"
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
          <span className="text-xs font-bold text-gray-700 tracking-wide">TAMANHOS</span>
          <span className="text-gray-400 text-sm">{openSections.sizes ? "−" : "+"}</span>
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
                    : "border-gray-300 text-gray-600 hover:border-primary"
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
          <span className="text-xs font-bold text-gray-700 tracking-wide">PREÇOS</span>
          <span className="text-gray-400 text-sm">{openSections.prices ? "−" : "+"}</span>
        </button>
        {openSections.prices && (
          <ul className="mt-2 space-y-1">
            {priceRanges.map((r) => (
              <li key={r}>
                <button className="text-xs text-gray-600 hover:text-primary transition-colors">
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
                <button className="text-xs text-gray-600 hover:text-primary transition-colors">
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
