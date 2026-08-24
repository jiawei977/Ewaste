const categoryVisuals = {
  battery: { icon: 'bi-battery-charging', color: '#2d6a4f' },
  keyboard: { icon: 'bi-keyboard', color: '#3a86ff' },
  microwave: { icon: 'bi-box', color: '#f77f00' },
  mobile: { icon: 'bi-phone', color: '#7b2cbf' },
  mouse: { icon: 'bi-mouse', color: '#4361ee' },
  pcb: { icon: 'bi-cpu', color: '#00897b' },
  player: { icon: 'bi-play-circle', color: '#e63946' },
  printer: { icon: 'bi-printer', color: '#495057' },
  television: { icon: 'bi-tv', color: '#118ab2' },
  washing_machine: { icon: 'bi-water', color: '#277da1' },
}

export function getCategoryVisual(category = '') {
  return categoryVisuals[category.toLowerCase()] || { icon: 'bi-device-hdd', color: '#40916c' }
}
