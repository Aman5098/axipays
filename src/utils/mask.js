export const maskCard = (card = "") => {
  if (!card) return "";

  const clean = String(card).replace(
    /\s/g,
    ""
  );

  return (
    clean.slice(0, 4) +
    " **** **** " +
    clean.slice(-4)
  );
};