import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      {/* Newsletter */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <div>
              <p className="text-lg font-bold text-gray-800 uppercase">Newsletter</p>
              <p className="text-xs text-gray-500">Seja a primeira a saber de nossas novidades e promoções!</p>
            </div>
          </div>
          <div className="flex flex-1 gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Seu nome"
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
            />
            <button className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2 rounded text-sm transition-colors whitespace-nowrap">
              EU QUERO
            </button>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PAGAMENTO + SITE SEGURO */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-primary uppercase">Pagamento</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {["VISA", "MASTER", "AMEX", "BOLETO", "PIX"].map((method) => (
                <span
                  key={method}
                  className="bg-white text-gray-700 text-[10px] font-bold px-2.5 py-1.5 rounded"
                >
                  {method}
                </span>
              ))}
            </div>

            <h3 className="font-bold text-sm mb-3 text-primary uppercase">Site 100% Seguro</h3>
            <div className="flex items-center gap-2 text-green-400 mb-6">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <span className="text-xs text-gray-300">Certificado SSL</span>
            </div>
          </div>

          {/* SUPORTE */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-primary uppercase">Suporte</h3>
            <div className="text-sm text-gray-300 leading-7">
              <p className="font-semibold text-white">BELEZA NATIVA</p>
              <p>CNPJ 45.790.118/0001-07</p>
              <p>RUA APARECIDA, 111</p>
              <p>CENTRO, MUZAMBINHO/MG</p>
              <p>CEP 37890-000</p>
              <p>TELEFONE +55 (35) 99210-0072</p>
              <p>WHATSAPP +55 (35) 99210-0072</p>
              <p>belezanativajuruaia@gmail.com</p>
            </div>
          </div>

          {/* COMPRAS */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-primary uppercase">Compras</h3>
            <ul className="space-y-2">
              {[
                { label: "Seja uma Revendedora", href: "/cadastro" },
                { label: "Quem Somos", href: "/quem-somos" },
                { label: "Como Comprar", href: "/como-comprar" },
                { label: "Condições de Frete", href: "/frete" },
                { label: "Trocas e Devoluções", href: "/trocas" },
                { label: "Dúvidas Frequentes", href: "/duvidas" },
                { label: "Condições de Parcelamento", href: "/parcelamento" },
                { label: "Política de Privacidade de Dados", href: "/privacidade" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SIGA-NOS */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Siga-nos</p>
            <a
              href="https://www.instagram.com/belezanativaoficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-3">
            <Image
              src="/logo-bn.png"
              alt="Beleza Nativa"
              width={120}
              height={50}
              className="opacity-70"
            />
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
