"use client";

export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface UploadedProduct {
  ref: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  image: string;
  variant: { color: string; colorHex: string; sizes: string[] };
  quantity: number;
  timestamp: string;
}

const banners = [
  { src: "/banners/banner-desktop-1.jpg", mobileSrc: "/banners/banner-principal-1.jpg", alt: "Sua beleza começa por dentro" },
  { src: "/banners/banner-desktop-2.jpg", mobileSrc: "/banners/banner-principal-2.jpg", alt: "Conforto, renda e confiança em cada detalhe" },
  { src: "/banners/banner-desktop-3.jpg", mobileSrc: "/banners/banner-principal-3.jpg", alt: "Peças que valorizam o seu corpo" },
];

export default function Home() {
  const searchParams = useSearchParams();
  const [currentBanner, setCurrentBanner] = useState(0);
  const hoveringRef = useRef(false);
  const [filters, setFilters] = useState({
    collection: null as string | null,
    gender: null as string | null,
    category: null as string | null,
    size: null as string | null,
    priceRange: null as [number, number] | null,
    sortBy: null as string | null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [uploadedProducts, setUploadedProducts] = useState<UploadedProduct[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadProductsFromERP = async () => {
      try {
        const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
        setUploadedProducts(uploads);
      } catch (err) {
        console.log("Erro ao carregar produtos do localStorage");
      }
    };

    loadProductsFromERP();
  }, []);

  const nextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, []);

  const prevBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    const genero = searchParams.get("genero");
    const categoria = searchParams.get("categoria");
    setFilters((prev) => ({
      ...prev,
      gender: genero || null,
      category: categoria || null,
    }));
  }, [searchParams]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    const tick = () => {
      nextBanner();
      const speed = hoveringRef.current ? 1500 : 5000;
      timerId = setTimeout(tick, speed);
    };
    timerId = setTimeout(tick, 5000);
    return () => clearTimeout(timerId);
  }, [nextBanner]);

  const filteredProducts = products.filter((p) => {
    if (filters.collection && p.collection !== filters.collection) return false;
    if (filters.gender && p.gender !== filters.gender) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.size) {
      const hasSize = p.variants.some((v) => v.sizes.includes(filters.size!));
      if (!hasSize) return false;
    }
    return true;
  });

  return (
    <div>
      {/* 1. Banner Carousel - full width */}
      <section
        className="relative overflow-hidden bg-[#e8f0e4]"
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
      >
        <div className="hidden md:block relative w-full" style={{ aspectRatio: "19/7" }}>
          {banners.map((banner, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: currentBanner === i ? 1 : 0 }}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        <div className="md:hidden relative w-full" style={{ paddingBottom: "100%" }}>
          {banners.map((banner, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: currentBanner === i ? 1 : 0 }}
            >
              <Image
                src={banner.mobileSrc}
                alt={banner.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
                unoptimized
              />
            </div>
          ))}
        </div>

        <button
          onClick={prevBanner}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/60 rounded-full flex items-center justify-center transition-colors"
          aria-label="Banner anterior"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/60 rounded-full flex items-center justify-center transition-colors"
          aria-label="Próximo banner"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentBanner === i ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Benefits Bar */}
      <section className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 justify-center">
              <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm font-bold tracking-wide uppercase">Cadastre-se</p>
                <p className="text-[10px] md:text-[11px] opacity-80 uppercase">Seja uma revendedora</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <svg className="w-7 h-7 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm font-bold tracking-wide uppercase">Pra você</p>
                <p className="text-[10px] md:text-[11px] opacity-80 uppercase">Peças que são tendências!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm font-bold tracking-wide uppercase">Pronta-entrega</p>
                <p className="text-[10px] md:text-[11px] opacity-80 uppercase">Da fábrica para sua loja</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <div>
                <p className="text-xs md:text-sm font-bold tracking-wide uppercase">Frete grátis</p>
                <p className="text-[10px] md:text-[11px] opacity-80 uppercase">Consulte as nossas condições</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Secondary Banners */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/cadastro" className="block">
            <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "460/242" }}>
              <Image
                src="/banners/banner-secundario-1.jpg"
                alt="Cadastre-se e aproveite!"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Link>
          <Link href="/" className="block">
            <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "460/242" }}>
              <Image
                src="/banners/banner-secundario-2.jpg"
                alt="Atacado para todo Brasil"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Seja Revendedora */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#d4e8d0] via-[#e8f0e4] to-[#d4e8d0]">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="hidden md:block w-1/4 relative h-[350px] overflow-hidden">
            <Image
              src="/banners/banner-principal-1.jpg"
              alt=""
              fill
              className="object-cover object-top"
              sizes="25vw"
            />
          </div>
          <div className="text-center py-12 md:py-8 md:w-2/4 px-8">
            <p className="text-3xl md:text-5xl text-gray-600 font-light leading-tight">
              Seja
            </p>
            <p className="text-4xl md:text-6xl font-bold text-gray-700 leading-tight mb-6">
              revendedora
            </p>
            <Image
              src="/logo-bn.png"
              alt="Beleza Nativa"
              width={220}
              height={100}
              className="mx-auto mb-6"
            />
            <Link
              href="/cadastro"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full text-sm tracking-wider transition-colors"
            >
              CADASTRE-SE AGORA
            </Link>
          </div>
          <div className="hidden md:block w-1/4 relative h-[350px] overflow-hidden">
            <Image
              src="/banners/banner-principal-2.jpg"
              alt=""
              fill
              className="object-cover object-top"
              sizes="25vw"
            />
          </div>
        </div>
      </section>

      {/* 5. Products */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-12">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full mb-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? "OCULTAR FILTROS" : "FILTRAR PRODUTOS"}
        </button>

        <div className="flex gap-8">
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0`}>
            <Sidebar onFilterChange={(f) => setFilters(f)} />
          </div>
          <div className="flex-1">
            {uploadedProducts.length > 0 && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-700">
                  ✨ {uploadedProducts.length} produto(s) novo(s) adicionado(s) por Palmira!
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {uploadedProducts.map((upload, idx) => (
                <div key={`upload-${idx}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <img src={upload.image} alt={upload.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      NOVO
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 font-mono mb-1">REF {upload.ref}</p>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{upload.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{upload.gender}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200" style={{ backgroundColor: upload.variant.colorHex }} title={upload.variant.color} />
                      <span className="text-xs text-gray-500">{upload.variant.sizes.join(", ")}</span>
                    </div>
                    <p className="text-lg font-bold text-primary">R$ {upload.price.toFixed(2).replace(".", ",")}</p>
                    <p className="text-xs text-gray-500 mt-1">Est: {upload.quantity} un.</p>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && uploadedProducts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">Nenhum produto encontrado</p>
                <p className="text-sm mt-1">Tente alterar os filtros</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
