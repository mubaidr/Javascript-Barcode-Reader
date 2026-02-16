export interface BarcodeLocation {
  startX: number
  endX: number
  startY: number
  endY: number
  rotation: number
}

function grayscalePixel(data: Uint8ClampedArray, index: number): number {
  return Math.sqrt((data[index] ** 2 + data[index + 1] ** 2 + data[index + 2] ** 2) / 3)
}

function thresholdPixel(value: number, threshold: number): number {
  return value >= threshold ? 255 : 0
}

function findBarcodeRow(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  channels: number,
  row: number
): { startX: number; endX: number } | null {
  const rowData: number[] = []
  let transitions = 0
  let lastPixel = -1
  let barStart = -1

  for (let col = 0; col < width; col += 1) {
    const index = (row * width + col) * channels
    const pixel = thresholdPixel(grayscalePixel(data, index), 127)
    rowData.push(pixel)

    if (pixel !== lastPixel && lastPixel !== -1) {
      transitions += 1
      if (pixel === 0 && barStart === -1) {
        barStart = col
      }
    }
    lastPixel = pixel
  }

  if (transitions < 10) {
    return null
  }

  let startX = 0
  let endX = width - 1

  for (let col = 0; col < width; col += 1) {
    if (rowData[col] === 0) {
      startX = col
      break
    }
  }

  for (let col = width - 1; col >= 0; col -= 1) {
    if (rowData[col] === 0) {
      endX = col
      break
    }
  }

  return { startX, endX }
}

function analyzeRotation(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  channels: number,
  region: { startX: number; endX: number; startY: number; endY: number }
): number {
  const barcodeWidth = region.endX - region.startX
  const barcodeHeight = region.endY - region.startY

  if (barcodeHeight < barcodeWidth * 0.1) {
    return 0
  }

  const angle = Math.atan2(barcodeHeight, barcodeWidth) * (180 / Math.PI)

  if (angle > 45 && angle < 135) {
    return 90
  }

  if (angle > 135 || angle < -135) {
    return 180
  }

  if (angle < -45 && angle > -135) {
    return 270
  }

  return 0
}

export function detectBarcodeRegion(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  channels: number
): BarcodeLocation | null {
  let barcodeRow: { startX: number; endX: number } | null = null
  let barcodeRowIndex = -1

  for (let row = 0; row < height; row += 2) {
    const result = findBarcodeRow(data, width, height, channels, row)
    if (result) {
      barcodeRow = result
      barcodeRowIndex = row
      break
    }
  }

  if (!barcodeRow) {
    return null
  }

  let startY = barcodeRowIndex
  let endY = barcodeRowIndex

  for (let row = barcodeRowIndex - 1; row >= 0; row -= 1) {
    const result = findBarcodeRow(data, width, height, channels, row)
    if (result && Math.abs(result.startX - barcodeRow.startX) < 20) {
      startY = row
    } else {
      break
    }
  }

  for (let row = barcodeRowIndex + 1; row < height; row += 1) {
    const result = findBarcodeRow(data, width, height, channels, row)
    if (result && Math.abs(result.startX - barcodeRow.startX) < 20) {
      endY = row
    } else {
      break
    }
  }

  const rotation = analyzeRotation(data, width, height, channels, { ...barcodeRow, startY, endY })

  return {
    startX: barcodeRow.startX,
    endX: barcodeRow.endX,
    startY,
    endY,
    rotation,
  }
}

export function rotateImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  angle: number
): { data: Uint8ClampedArray; width: number; height: number } {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null

  if (!canvas) {
    return { data, width, height }
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { data, width, height }
  }

  canvas.width = width
  canvas.height = height

  const tempData = new ImageData(data, width, height)
  ctx.putImageData(tempData, 0, 0)

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) {
    return { data, width, height }
  }
  tempCtx.drawImage(canvas, 0, 0)

  const radians = (angle * Math.PI) / 180
  const sin = Math.abs(Math.sin(radians))
  const cos = Math.abs(Math.cos(radians))

  const newWidth = Math.round(width * cos + height * sin)
  const newHeight = Math.round(width * sin + height * cos)

  canvas.width = newWidth
  canvas.height = newHeight

  ctx.translate(newWidth / 2, newHeight / 2)
  ctx.rotate(radians)
  ctx.drawImage(tempCanvas, -width / 2, -height / 2)

  const rotatedData = ctx.getImageData(0, 0, newWidth, newHeight)

  return {
    data: rotatedData.data,
    width: newWidth,
    height: newHeight,
  }
}

export function cropBarcodeRegion(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  channels: number,
  region: BarcodeLocation
): { data: Uint8ClampedArray; width: number; height: number } {
  const paddedWidth = Math.min(width, region.endX + 5)
  const paddedHeight = Math.min(height, region.endY + 5)
  const paddedStartX = Math.max(0, region.startX - 5)
  const paddedStartY = Math.max(0, region.startY - 5)

  const newWidth = paddedWidth - paddedStartX
  const newHeight = paddedHeight - paddedStartY

  const newData = new Uint8ClampedArray(newWidth * newHeight * channels)

  for (let y = 0; y < newHeight; y += 1) {
    for (let x = 0; x < newWidth; x += 1) {
      const srcIndex = ((paddedStartY + y) * width + (paddedStartX + x)) * channels
      const dstIndex = (y * newWidth + x) * channels

      for (let c = 0; c < channels; c += 1) {
        newData[dstIndex + c] = data[srcIndex + c]
      }
    }
  }

  return { data: newData, width: newWidth, height: newHeight }
}
