export const getDocumentStatus = (isSaved: boolean): string => {
  if (!isSaved) {
    return 'Saving...'
  } else if (isSaved) {
    return 'Saved'
  }

  return ''
}
