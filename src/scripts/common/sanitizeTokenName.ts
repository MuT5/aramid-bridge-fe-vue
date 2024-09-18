export const sanitizeTokenName = (name: string) => {
  return name.replace('Token', '').trim()
}
