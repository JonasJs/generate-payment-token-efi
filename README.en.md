# Gerador de Token de Pagamento EFI

*Leia em outros idiomas: [English](README.en.md) · [Español](README.es.md)*

Este projeto permite a criptografia dos dados do cartão de crédito diretamente no navegador do cliente para gerar o payment_token da Efí. Esta ferramenta facilita o processo de integração e testes, permitindo gerar tokens de pagamento de forma segura e identificar a bandeira do cartão.

## Sobre o Projeto

Esta aplicação foi desenvolvida para auxiliar desenvolvedores e integradores da Efí a testar a geração de tokens de pagamento. Ela utiliza a biblioteca oficial `payment-token-efi` para criptografar os dados do cartão diretamente no navegador, garantindo a segurança das informações sensíveis do cartão.

## Funcionalidades

- 🔐 Geração de tokens de pagamento para transações com cartão de crédito
- 🎭 Suporte para ambientes Sandbox e Produção
- 🎲 Gerador de dados de cartão de teste
- 📋 Funcionalidade de cópia fácil para a área de transferência
- 💳 Validação de cartão de crédito
- 🔄 Feedback em tempo real
- 🎨 Interface moderna e responsiva construída com Tailwind CSS

## Como Começar

### Pré-requisitos

- Node.js 18.0 ou superior
- npm, yarn ou pnpm

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/yourusername/generate-payment-token-efi.git
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.