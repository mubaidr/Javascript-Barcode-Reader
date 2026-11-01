export function isUrl(s: string): boolean {
  if (s.startsWith('#')) return false

  // data: and protocol-relative // URLs are valid loadable sources.
  if (s.startsWith('data:')) return true
  if (s.startsWith('//')) return true

  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

  return regexp.test(s)
}
