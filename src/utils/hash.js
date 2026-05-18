import CryptoJS from "crypto-js";

export const generateHash = (
  email,
  cardNumber
) => {
  const cleanCard =
    cardNumber.replace(/\s/g, "");

  const first6 =
    cleanCard.substring(0, 6);

  const last4 = cleanCard.slice(-4);

  const combined = first6 + last4;

  const reversedCard = combined
    .split("")
    .reverse()
    .join("");

  const reversedEmail = email
    .trim()
    .split("")
    .reverse()
    .join("");

  const message = (
    reversedEmail +
    "AXIPAYS" +
    reversedCard
  ).toUpperCase();

  console.log(message);

  return CryptoJS.HmacSHA256(
    message,
    "AXI2026"
  )
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();
};