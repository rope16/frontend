export const statusTranslations = {
  NotStarted: 'Nije započeto',
  InProgress: 'U toku',
  Completed: 'Završeno',
  Cancelled: 'Otkaženo',

  // Dodaj i druge statuse ovde ako imaš
}

export function translateStatus(status) {
  return statusTranslations[status] || status
}