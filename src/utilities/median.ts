export function median(arr: number[]): number {
  arr.sort((a, b) => {
    return a - b
  })

  return arr[1]
}
