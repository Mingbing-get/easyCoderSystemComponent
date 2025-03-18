import { useCallback, useRef, useState } from 'react'
import { Icon, Modal, Input, Message } from '@arco-design/web-react'
import { PluginProps } from 'react-markdown-editor-lite'
import { i18n } from '@easy-coder/sdk/i18n'
import { useDataCenter } from '@easy-coder/sdk/data'

const AiPlugin = (props: PluginProps) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const promptRef = useRef<string>()
  const datacenter = useDataCenter()

  const handleConfirm = useCallback(async () => {
    if (!promptRef.current) {
      Message.warning(i18n.translate({ zh: '请输入提示内容', en: 'Please enter prompt content' }))
      return
    }

    if (!props.editor) return
    let oldValue = props.editor.getMdValue() || ''

    setLoading(true)
    const { onChunk, onError, result } = datacenter.ai.completionStream(promptRef.current)
    onChunk((chunk) => {
      if (!props.editor) return

      oldValue += chunk
      props.editor.setText(oldValue)
    })
    onError((msg) => {
      Message.error(msg)
      setLoading(false)
    })
    await result
    setLoading(false)
  }, [])

  return (
    <>
      <span
        onClick={() => setVisible(true)}
        className="button"
        style={{ fontSize: 16, display: 'inline-flex', alignItems: 'center' }}>
        <Icon viewBox="0 0 1024 1024">
          <path d="M672.256 128c12.416 0 23.936 6.784 30.08 17.728l191.232 336.96a35.968 35.968 0 0 1 0 35.456l-3.904 6.848a214.912 214.912 0 0 0-67.52-26.56L652.16 198.912H310.08L139.008 500.416 310.08 801.984h271.872c12.736 27.136 30.976 51.2 53.312 70.848H289.92a34.688 34.688 0 0 1-30.144-17.728L68.672 518.144a35.968 35.968 0 0 1 0-35.456l191.168-336.96A34.688 34.688 0 0 1 289.92 128h382.336zM936.192 812.032a21.12 21.12 0 0 1-21.248 20.992H772.608a21.12 21.12 0 0 1-21.12-20.992 21.12 21.12 0 0 1 21.12-20.992h142.336a21.12 21.12 0 0 1 21.248 20.992z m0-59.392a21.12 21.12 0 0 1-21.248 20.992h-80.768a21.12 21.12 0 0 1-21.184-20.992 21.12 21.12 0 0 1 21.184-20.992h80.768a21.12 21.12 0 0 1 21.248 20.992z m-84.736-105.472L712.96 801.28l-58.56 11.968a4.352 4.352 0 0 1-5.312-5.056l8.576-58.368 137.088-152.512c3.2-3.456 8.32-4.096 11.52-1.28l45.184 39.808c3.2 2.752 3.2 7.872 0 11.328z m39.936-44.352l-21.184 23.552a4.672 4.672 0 0 1-6.592 0.384l-49.792-43.776a4.608 4.608 0 0 1-0.384-6.528l21.248-23.68a21.12 21.12 0 0 1 29.632-1.664l25.472 22.4c8.576 7.68 9.344 20.736 1.6 29.312z m-422.272-2.432l-3.648-13.696h-87.04l-3.84 13.888a48.128 48.128 0 0 1-46.336 34.944 25.92 25.92 0 0 1-24.512-34.368l82.304-238.272a37.632 37.632 0 0 1 71.104 0l82.368 238.272a25.92 25.92 0 0 1-24.512 34.368 47.36 47.36 0 0 1-45.76-35.136z m-71.104-80.896h49.28l-23.872-87.424-25.408 87.424z m181.952 81.28v-229.44a34.752 34.752 0 1 1 69.504 0v229.44a34.752 34.752 0 0 1-69.504 0z m0 0v-229.44a34.752 34.752 0 1 1 69.504 0v229.44a34.752 34.752 0 0 1-69.504 0z"></path>
        </Icon>
      </span>
      <Modal
        title={i18n.translate({ zh: 'AI 帮写', en: 'AI Write' })}
        visible={!loading && visible}
        getPopupContainer={() => document.body}
        onCancel={() => setVisible(false)}
        footer={(cancelButton, confirmButton) => confirmButton}
        okButtonProps={{
          size: 'small',
          children: i18n.translate({ zh: '提交', en: 'Submit' }),
        }}
        onConfirm={handleConfirm}>
        <Input.TextArea
          placeholder={i18n.translate({ zh: '请输入提示内容', en: 'Please enter prompt content' })}
          rows={6}
          defaultValue={promptRef.current}
          onChange={(v) => (promptRef.current = v)}
        />
      </Modal>
    </>
  )
}

AiPlugin.align = 'left'
AiPlugin.pluginName = 'ai-plugin'

export default AiPlugin
