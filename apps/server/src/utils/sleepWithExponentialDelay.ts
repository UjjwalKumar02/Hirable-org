let delay = 1000 + Math.random() * 1000;

export async function sleepWithBackoff() {
  const jitter = Math.random() * 500;

  console.log(`Sleep for ${delay + jitter}`);
  await new Promise((resolve) => setTimeout(resolve, delay + jitter));
  
  delay = Math.min(delay * 4, 90000);
}

export function resetSleepDelay() {
  delay = 1000;
}
