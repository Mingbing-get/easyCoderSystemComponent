export default async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.setAttribute('style', 'position: absolution; opacity: 0; left: -999999999px; right: -99999999px')
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    if (!document.execCommand('copy')) {
      textArea.remove()
      throw new Error('赋值失败')
    }
    textArea.remove()
  }
}
