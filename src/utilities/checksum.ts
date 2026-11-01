function gs1Mod10(digits: string): boolean {
  let sum = 0
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const weight = (digits.length - 1 - i) % 2 === 0 ? 1 : 3
    sum += (digits.charCodeAt(i) - 48) * weight
  }
  return sum % 10 === 0
}

// Expand a raw 8-digit UPC-E (NS + six payload digits + check digit) into its
// equivalent 12-digit UPC-A, following the ZXing UPC-E expansion rules.
function expandUPCE(upce: string): string {
  const ns = upce.charAt(0)
  const d1 = upce.charAt(1)
  const d2 = upce.charAt(2)
  const d3 = upce.charAt(3)
  const d4 = upce.charAt(4)
  const d5 = upce.charAt(5)
  const d6 = upce.charAt(6)
  const check = upce.charAt(7)

  switch (d6) {
    case '0':
    case '1':
    case '2':
      return ns + d1 + d2 + d6 + '0000' + d3 + d4 + d5 + check
    case '3':
      return ns + d1 + d2 + d3 + '00000' + d4 + d5 + check
    case '4':
      return ns + d1 + d2 + d3 + d4 + '00000' + d5 + check
    default:
      return ns + d1 + d2 + d3 + d4 + d5 + '0000' + d6 + check
  }
}

// EAN/UPC family only. value is the raw decoded string; barcodeType is one of
// ean-13, ean-8, upc-a, upc-e.
export function isValidChecksum(value: string, barcodeType: string): boolean {
  if (!/^\d+$/.test(value)) {
    return false
  }

  let upca: string
  if (barcodeType === 'upc-e') {
    if (value.length !== 8) {
      return false
    }
    upca = expandUPCE(value)
  } else {
    upca = value
  }

  return gs1Mod10(upca)
}
