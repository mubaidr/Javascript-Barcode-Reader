export function isUrl(s: string): boolean {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

  if (s.startsWith('#')) return false

  return regexp.test(s)
}
