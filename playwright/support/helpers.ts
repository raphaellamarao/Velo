export function generateOrderCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return `VLO-${code}`;
}

const order = generateOrderCode();

console.log(order); // Exemplo: VLO-2YE8I1