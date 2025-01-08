export default async function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
      resolve(this.result as string)
    }
    reader.onerror = function () {
      reject(this.error?.message)
    }
    reader.readAsDataURL(file)
  })
}
