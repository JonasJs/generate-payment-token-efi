# Generador de Token de Pago EFI

*Lee esto en otros idiomas: [Português](README.md) · [English](README.en.md)*

Este proyecto permite la encriptación de datos de tarjetas de crédito directamente en el navegador del cliente para generar el payment_token de Efí. Esta herramienta facilita el proceso de integración y pruebas, permitiendo generar tokens de pago de forma segura e identificar la marca de la tarjeta.

## Sobre el Proyecto

Esta aplicación fue desarrollada para ayudar a los desarrolladores e integradores de Efí a probar la generación de tokens de pago. Utiliza la biblioteca oficial `payment-token-efi` para encriptar los datos de la tarjeta directamente en el navegador, garantizando la seguridad de la información sensible de la tarjeta.

## Características

- 🔐 Generación de tokens de pago para transacciones con tarjeta de crédito
- 🎭 Soporte para entornos Sandbox y Producción
- 🎲 Generador de datos de tarjeta de prueba
- 📋 Funcionalidad de copia fácil al portapapeles
- 💳 Validación de tarjeta de crédito
- 🔄 Retroalimentación en tiempo real
- 🎨 Interfaz moderna y responsiva construida con Tailwind CSS

## Comenzando

### Prerrequisitos

- Node.js 18.0 o superior
- npm, yarn, o pnpm

### Instalación

1. Clona el repositorio:
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