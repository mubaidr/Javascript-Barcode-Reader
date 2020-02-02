/**
 * Returns median number from a number array (modified for only 3 rows)
 * @param {number[]} arr Array of numbers
 * @return {Promise<number></number>} Median of the array
 */
export function median(arr) {
  arr.sort((a, b) => {
    return a - b
  })

  return arr[1]
}
