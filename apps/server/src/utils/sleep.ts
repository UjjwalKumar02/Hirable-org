export async function sleep(ms: number) {
  console.log(`Sleep for ${ms}`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
