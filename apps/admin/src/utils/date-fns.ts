export function getAge(dateOfBirth: Date): number {
  const ms = Date.now() - dateOfBirth.getTime();
  const newAgeMs = new Date(ms);

  return Math.abs(newAgeMs.getUTCFullYear() - 1970);
}
