import * as ort from 'onnxruntime-web'

const SIZE = 640
const MIN_CONFIDENCE = 0.3
const MODEL_URL = '/best.onnx'
const ITEMS = [
  ['battery', 'Take to a battery recycling kiosk at a supermarket or hardware store. Do not bin.', 15],
  ['Keyboard', 'Drop at an e-waste collection bin or a community recycling hub.', 10],
  ['Microwave', 'Hand over to a scrap metal recycler or a specialized appliance recycling facility.', 25],
  ['Mobile', 'Factory reset and drop at a dedicated mobile recycling bin or trade-in kiosk.', 20],
  ['Mouse', 'Deposit in a small e-waste collection bin; ensure batteries are removed first.', 10],
  ['pcb', 'Send to a precious metal recovery specialist to extract gold and copper.', 30],
  ['Player', 'Take to a general electronics recycling point after removing any physical media.', 15],
  ['Printer', 'Remove ink/toner cartridges and take the unit to an office equipment recycling center.', 20],
  ['Television', 'Drop off at a designated e-waste center that handles screen components.', 25],
  ['Washing_Machine', 'Schedule a pickup with a scrap metal merchant or a bulky e-waste recycler.', 40],
]

let sessionPromise

export async function detectOffline(file) {
  const image = await loadImage(file)
  const prepared = prepareImage(image)
  sessionPromise ||= ort.InferenceSession.create(MODEL_URL, { executionProviders: ['wasm'] })
  const session = await sessionPromise
  const outputs = await session.run({ [session.inputNames[0]]: prepared.tensor })
  const box = findBestBox(outputs[session.outputNames[0]], prepared, image)
  if (!box) throw new Error('No detection reached the required 30% confidence. Try a clearer image with one item.')
  const item = ITEMS[box.classId]
  if (!item) throw new Error('The offline model returned an unsupported category.')
  return {
    category: item[0],
    guideline: item[1],
    points: item[2],
    confidence: box.score,
    annotated_image_url: annotate(image, box, item[0]),
    centers_pdf_url: '/centers.pdf',
    feedback_categories: ITEMS.map(([category]) => category),
    offline: true,
  }
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => { URL.revokeObjectURL(url); resolve(image) }
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The selected file is not a valid image.')) }
    image.src = url
  })
}

function prepareImage(image) {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const context = canvas.getContext('2d', { willReadFrequently: true })
  const scale = Math.min(SIZE / image.width, SIZE / image.height)
  const width = Math.round(image.width * scale)
  const height = Math.round(image.height * scale)
  const padX = Math.floor((SIZE - width) / 2)
  const padY = Math.floor((SIZE - height) / 2)
  context.fillStyle = 'rgb(114,114,114)'
  context.fillRect(0, 0, SIZE, SIZE)
  context.drawImage(image, padX, padY, width, height)
  const rgba = context.getImageData(0, 0, SIZE, SIZE).data
  const plane = SIZE * SIZE
  const rgb = new Float32Array(plane * 3)
  for (let index = 0; index < plane; index += 1) {
    rgb[index] = rgba[index * 4] / 255
    rgb[plane + index] = rgba[index * 4 + 1] / 255
    rgb[plane * 2 + index] = rgba[index * 4 + 2] / 255
  }
  return { tensor: new ort.Tensor('float32', rgb, [1, 3, SIZE, SIZE]), scale, padX, padY }
}

function findBestBox(output, prepared, image) {
  if (output.dims.length !== 3) throw new Error(`Unexpected ONNX output: ${output.dims.join(' × ')}`)
  const channelFirst = output.dims[1] < output.dims[2]
  const features = channelFirst ? output.dims[1] : output.dims[2]
  const detections = channelFirst ? output.dims[2] : output.dims[1]
  const classCount = features - 4
  if (classCount !== ITEMS.length) throw new Error(`The ONNX model has ${classCount} classes; the app expects ${ITEMS.length}.`)
  const at = channelFirst
    ? (detection, feature) => output.data[feature * detections + detection]
    : (detection, feature) => output.data[detection * features + feature]
  let best = null
  for (let detection = 0; detection < detections; detection += 1) {
    let classId = 0
    let score = at(detection, 4)
    for (let classIndex = 1; classIndex < classCount; classIndex += 1) {
      const candidate = at(detection, classIndex + 4)
      if (candidate > score) { score = candidate; classId = classIndex }
    }
    if (score < MIN_CONFIDENCE || (best && score <= best.score)) continue
    const centerX = at(detection, 0)
    const centerY = at(detection, 1)
    const width = at(detection, 2)
    const height = at(detection, 3)
    best = {
      classId,
      score,
      x1: clamp((centerX - width / 2 - prepared.padX) / prepared.scale, 0, image.width),
      y1: clamp((centerY - height / 2 - prepared.padY) / prepared.scale, 0, image.height),
      x2: clamp((centerX + width / 2 - prepared.padX) / prepared.scale, 0, image.width),
      y2: clamp((centerY + height / 2 - prepared.padY) / prepared.scale, 0, image.height),
    }
  }
  return best
}

function annotate(image, box, category) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  const line = Math.max(3, Math.round(Math.min(image.width, image.height) / 150))
  const font = Math.max(18, Math.round(Math.min(image.width, image.height) / 24))
  const label = `${category} ${(box.score * 100).toFixed(0)}%`
  context.font = `bold ${font}px sans-serif`
  const labelHeight = font + line * 3
  context.strokeStyle = '#198754'
  context.lineWidth = line
  context.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1)
  context.fillStyle = '#198754'
  context.fillRect(box.x1, Math.max(0, box.y1 - labelHeight), context.measureText(label).width + line * 4, labelHeight)
  context.fillStyle = '#fff'
  context.fillText(label, box.x1 + line * 2, Math.max(font, box.y1 - line * 2))
  return canvas.toDataURL('image/jpeg', 0.9)
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}
