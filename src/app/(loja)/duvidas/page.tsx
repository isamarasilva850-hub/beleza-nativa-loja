"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Qual o pedido mínimo?",
    answer: "O pedido mínimo para atacado é de R$ 600,00. Você pode misturar modelos, cores e tamanhos como preferir.",
  },
  {
    question: "Preciso ter CNPJ para comprar no atacado?",
    answer: "Não é obrigatório ter CNPJ. Aceitamos tanto pessoa física quanto jurídica para revenda.",
  },
  {
    question: "Posso comprar para uso próprio?",
    answer: "Sim! Você pode comprar peças avulsas pelo preço de varejo, sem necessidade de cadastro ou pedido mínimo.",
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Aceitamos PIX, cartão de crédito (até 6x), boleto e transferência bancária. As condições são combinadas pelo WhatsApp no momento do pedido.",
  },
  {
    question: "Quanto tempo demora para entregar?",
    answer: "O prazo varia por região: Sudeste 3-7 dias úteis, Sul e Centro-Oeste 5-10 dias, Nordeste e Norte 7-15 dias. Contados após confirmação do pagamento.",
  },
  {
    question: "Vocês têm frete grátis?",
    answer: "Sim, consulte as condições de frete grátis para sua região pelo WhatsApp (35) 99210-0072.",
  },
  {
    question: "Posso trocar um produto?",
    answer: "Sim, aceitamos trocas em até 7 dias após o recebimento para produtos com defeito ou enviados incorretamente. Entre em contato pelo WhatsApp.",
  },
  {
    question: "Vocês enviam para todo o Brasil?",
    answer: "Sim! Enviamos para todos os estados pelos Correios ou transportadora.",
  },
  {
    question: "Como recebo as artes para divulgação?",
    answer: "Após a compra, enviamos artes prontas das peças adquiridas para você divulgar nas redes sociais e WhatsApp.",
  },
  {
    question: "Como faço para me cadastrar como revendedora?",
    answer: "Acesse a página de cadastro, preencha seus dados e nossa equipe entrará em contato para liberar seu acesso aos preços de atacado.",
  },
];

export default function Duvidas() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dúvidas Frequentes</h1>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-3">Não encontrou sua dúvida?</p>
        <p className="text-gray-800 font-semibold">
          Fale conosco pelo WhatsApp: (35) 99210-0072
        </p>
      </div>
    </div>
  );
}
