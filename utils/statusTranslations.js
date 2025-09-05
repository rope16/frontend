export const statusTranslations = {
  NotStarted: 'Nije započeto',
  InProgress: 'U toku',
  Completed: 'Završeno',
  Cancelled: 'Otkazano',
}

export function translateStatus(status) {
  return statusTranslations[status] || status
}