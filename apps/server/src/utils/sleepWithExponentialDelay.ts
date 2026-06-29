let delay = 1000;

export async function sleepWithBackoff() {
  console.log(`Sleep (exp) for ${delay}`);
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (delay === 90000) {
    delay = 1000;
  }

  delay = Math.min(delay * 4, 90000);
}

export function resetSleepDelay() {
  delay = 1000;
}
