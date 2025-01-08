import { useCallback, useMemo } from 'react'
import { Upload, UploadProps } from '@arco-design/web-react'
import { useHold } from '@easy-coder/sdk/helper'

import toBase64 from './toBase64'

import './index.scss'

type ArrayOf<T extends any[]> = T extends Array<infer R> ? R : T
type UploadOptions = Parameters<Required<UploadProps>['customRequest']>[0]
export type UploadItem = ArrayOf<Required<UploadProps>['fileList']>

interface Props {
  limit?: number
  disabled?: boolean
  value?: string[]
  onChange?: (value?: string[]) => void
}

export default function UploadImg({ limit, disabled, value, onChange }: Props) {
  const [_value, setValue] = useHold(value, onChange)

  const fileList: UploadItem[] = useMemo(() => {
    return (
      _value?.map((item, index) => ({
        uid: `${index}`,
        url: item,
      })) || []
    )
  }, [_value])

  const handleUpload = useCallback(async (options: UploadOptions) => {
    const res = await toBase64(options.file)
    if (!res) return

    setValue((old) => {
      if (!old) return [res]

      return [...old, res]
    })
  }, [])

  const handleRemove = useCallback((item: UploadItem) => {
    setValue((old) => {
      return old?.filter((oldItem) => oldItem !== item.url)
    })
  }, [])

  return (
    <Upload
      className="upload-img"
      drag
      multiple
      listType="picture-card"
      limit={limit}
      disabled={disabled}
      accept="image/*"
      fileList={fileList}
      customRequest={handleUpload}
      onRemove={handleRemove}
      imagePreview
      showUploadList={{
        imageRender: (file) => <img src={file.url} />,
      }}
    />
  )
}
