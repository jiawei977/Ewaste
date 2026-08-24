export async function apiRequest(path, options = {}) {
  const hasJsonBody = options.body && !(options.body instanceof FormData)
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}
