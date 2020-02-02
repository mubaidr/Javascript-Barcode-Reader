export async function combineAllPossible(finalResult, result) {
  let finalResultArr = finalResult.split('')
  let resultArr = result.split('')

  resultArr.forEach((char, index) => {
    if (!finalResultArr[index] || finalResultArr[index] === '?') {
      if (char && char !== '?') {
        finalResultArr[index] = char
      }
    }
  })

  return finalResultArr.join('')
}
