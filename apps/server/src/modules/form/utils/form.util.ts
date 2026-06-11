export const generateSlug = (str: string) => {
  const alphas = "abcdefghij";
  const numbers = "1234567890";
  const generateRandomNumber = () => Math.floor(Math.random() * 10);

  let key = "";
  for (let i = 0; i < 4; i++) {
    key += alphas[generateRandomNumber()];
  }
  for (let i = 0; i < 4; i++) {
    key += numbers[generateRandomNumber()];
  }

  let slug = str.replace(/\s+/g, "");
  slug = `${slug}-${key}`;

  return slug;
};
