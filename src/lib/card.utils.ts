// Gera um número aleatório entre min e max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Gera um CPF válido
export const generateValidCPF = (): string => {
  const numbers: number[] = [];
  
  // Gera os 9 primeiros dígitos
  for (let i = 0; i < 9; i++) {
    numbers.push(randomInt(0, 9));
  }

  // Calcula o primeiro dígito verificador
  let sum = numbers.reduce((acc, cur, idx) => acc + cur * (10 - idx), 0);
  const dv1 = 11 - (sum % 11);
  numbers.push(dv1 >= 10 ? 0 : dv1);

  // Calcula o segundo dígito verificador
  sum = numbers.reduce((acc, cur, idx) => acc + cur * (11 - idx), 0);
  const dv2 = 11 - (sum % 11);
  numbers.push(dv2 >= 10 ? 0 : dv2);

  return numbers.join('');
};

// Implementa o algoritmo de Luhn para validação de cartão
const luhnCheck = (num: string): boolean => {
  let sum = 0;
  let isEven = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Gera um número de cartão válido
export const generateValidCardNumber = (): string => {
  // Prefixo Visa: 4
  let cardNumber = '4';

  // Gera 14 dígitos aleatórios
  for (let i = 0; i < 14; i++) {
    cardNumber += randomInt(0, 9).toString();
  }

  // Calcula o dígito verificador usando Luhn
  let checkDigit = 0;
  while (!luhnCheck(cardNumber + checkDigit)) {
    checkDigit = (checkDigit + 1) % 10;
  }

  return cardNumber + checkDigit;
};

// Lista de nomes comuns brasileiros
const firstNames = [
  'Maria', 'José', 'Ana', 'João', 'Pedro', 'Paulo', 'Carlos', 'Lucas',
  'Marcos', 'Luis', 'Gabriel', 'Rafael', 'Felipe', 'Bruno', 'Rodrigo',
  'Mariana', 'Juliana', 'Fernanda', 'Patricia', 'Camila', "Jonas", "Fernando", "Marlon", "Paul"
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira',
  'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins',
  'Carvalho', 'Almeida'
];

// Gera um nome completo aleatório
export const generateHolderName = (): string => {
  const firstName = firstNames[randomInt(0, firstNames.length - 1)];
  const lastName = lastNames[randomInt(0, lastNames.length - 1)];
  return `${firstName} ${lastName}`;
};

// Gera um CVV válido (3 dígitos)
export const generateCVV = (): string => {
  return String(randomInt(100, 999));
};

// Gera uma data de expiração válida (após 2025)
export const generateExpirationDate = (): { month: string; year: string } => {
  const currentYear = new Date().getFullYear();
  const year = String(randomInt(2025, currentYear + 10));
  const month = String(randomInt(1, 12)).padStart(2, '0');
  
  return { month, year };
};