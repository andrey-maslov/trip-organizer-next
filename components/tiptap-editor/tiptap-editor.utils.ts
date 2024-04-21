import { throttle } from 'lodash'

export const getDocumentStatus = (isSaved: boolean): string => {
  if (!isSaved) {
    return 'Saving...'
  } else if (isSaved) {
    return 'Saved'
  }
  return ''
}

export const throttleOnUpdate = throttle(
  (editor: any, noteId: string, callback: (data: any) => void) => {
    const json = editor.getJSON()
    // send the content to an API
    void callback({ _id: noteId, updatedAt: Date.now(), content: json })
  },
  3000
)
