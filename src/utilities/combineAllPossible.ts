export function combineAllPossible(finalResult: string, result: string): string {
  if (finalResult === '' || result === '') {
    return result
  }

  const finalResultArr = finalResult.split('')
  const resultArr = result.split('')

  resultArr.forEach((char, index) => {
    if (!finalResultArr[index] || finalResultArr[index] === '?') {
      if (char && char !== '?') {
        finalResultArr[index] = char
      }
    }
  })

  return finalResultArr.join('')
}
