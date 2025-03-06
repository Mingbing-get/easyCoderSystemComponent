import { useCallback, useMemo, useState } from 'react'
import { Message, Select } from '@arco-design/web-react'

import { useDataCenter } from '@easy-coder/sdk/data'
import { languages, LanguageCode, useCodeOrder, i18n } from '@easy-coder/sdk/i18n'

import { local } from './local'

interface Props {
  style?: React.CSSProperties
  className?: string
  needPost?: boolean
}

const saveLangStorageKey = 'lang'

function getCurrentLang() {
  const storageLang = localStorage.getItem(saveLangStorageKey)
  if (storageLang && languages[storageLang as LanguageCode]) {
    return storageLang
  }

  const browserLang = navigator.language
  for (const key in languages) {
    if (browserLang.startsWith(key)) return key
  }

  return 'zh'
}

function changeLang(lang: LanguageCode) {
  if (!languages[lang]) {
    throw new Error(`当前不支持语言: ${lang}`)
  }

  localStorage.setItem(saveLangStorageKey, lang)
  location.reload()
}

export default function ToggleLang({ style, className, needPost }: Props) {
  const [loading, setLoading] = useState(false)
  const codeOrder = useCodeOrder()
  const dataCenter = useDataCenter()

  const options = useMemo(() => {
    const options = []

    for (const lang in languages) {
      if (!codeOrder.includes(lang as LanguageCode)) continue

      options.push({
        label: languages[lang as LanguageCode],
        value: lang,
      })
    }

    return options
  }, [codeOrder])

  const handleChangeLang = useCallback(
    async (langCode: LanguageCode) => {
      if (needPost) {
        setLoading(true)
        const res = await dataCenter.put<unknown>('/user/updateLang', { langCode }, { needLogin: true })
        setLoading(false)
        if (res?.code !== 0) {
          Message.error(res?.msg || i18n.translate(local.networkError))
          return
        }
      }

      changeLang(langCode)
    },
    [needPost]
  )

  return (
    <Select
      loading={loading}
      showSearch
      style={{ width: 160, ...style }}
      className={className}
      placeholder={i18n.translate(local.pickLang)}
      value={getCurrentLang()}
      onChange={handleChangeLang}
      options={options}
    />
  )
}
