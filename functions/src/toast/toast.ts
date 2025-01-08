export type ToastType = 'info' | 'success' | 'error' | 'warn'

export interface ToastOption {
  canClose?: boolean
  duration?: number
}

export default class Toast {
  static TOAST_BOX_ID = 'toast_box'

  private toastBox: HTMLDivElement
  private content: string
  private type: ToastType = 'info'
  private option: ToastOption

  private toastWrapper: HTMLDivElement | undefined
  private autoDestroyTimer: number | NodeJS.Timeout | undefined

  constructor(content: string, type?: ToastType, option?: ToastOption) {
    const toastBox = document.getElementById(Toast.TOAST_BOX_ID)
    if (toastBox) {
      this.toastBox = toastBox as HTMLDivElement
    } else {
      this.toastBox = this.createToastBox()
    }

    this.content = content
    if (['info', 'success', 'error', 'warn'].includes(type || '')) {
      this.type = type || 'info'
    }
    this.option = {
      canClose: option?.canClose === true,
      duration: Math.abs(option?.duration || 5000),
    }
  }

  private createToastBox() {
    const toastBox = document.createElement('div')

    toastBox.setAttribute('id', Toast.TOAST_BOX_ID)
    toastBox.setAttribute(
      'style',
      `position: fixed;z-index: 1000000000000;top: 0;left: 50%;transform: translateX(-50%);display: flex;flex-direction: column;gap: 1rem;align-items: center;padding-top:1.5rem;`
    )

    document.body.appendChild(toastBox)

    return toastBox
  }

  private getIconByType(type: ToastType | 'close') {
    if (type === 'info') {
      return `<svg
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          viewBox="0 0 48 48"
          class="arco-icon arco-icon-info-circle-fill">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            stroke="none"
            d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm2-30a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2Zm0 17h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1v-8a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11Z"
            clip-rule="evenodd"></path>
        </svg>`
    }

    if (type === 'success') {
      return `<svg
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          viewBox="0 0 48 48"
          class="arco-icon arco-icon-check-circle-fill">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            stroke="none"
            d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm10.207-24.379a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0L22 26.172l-4.878-4.88a1 1 0 0 0-1.415 0l-1.414 1.415a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414 0l11.5-11.5Z"
            clip-rule="evenodd"></path>
        </svg>`
    }

    if (type === 'error') {
      return `<svg
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          viewBox="0 0 48 48"
          class="arco-icon arco-icon-close-circle-fill">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            stroke="none"
            d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm4.955-27.771-4.95 4.95-4.95-4.95a1 1 0 0 0-1.414 0l-1.414 1.414a1 1 0 0 0 0 1.414l4.95 4.95-4.95 4.95a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-4.95-4.95 4.95-4.95a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0Z"
            clip-rule="evenodd"></path>
        </svg>`
    }

    if (type === 'warn') {
      return `<svg
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          viewBox="0 0 48 48"
          class="arco-icon arco-icon-exclamation-circle-fill">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            stroke="none"
            d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-2-11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2Zm4-18a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V15Z"
            clip-rule="evenodd"></path>
        </svg>`
    }

    if (type === 'close') {
      return `<svg
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          viewBox="0 0 48 48"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          class="arco-icon arco-icon-close">
          <path d="M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142"></path>
        </svg>`
    }
  }

  private getColorByType(type: ToastType) {
    return {
      info: '#165dff',
      success: '#00b42a',
      error: '#f53f3f',
      warn: '#ff7d00',
    }[type]
  }

  show() {
    if (this.toastWrapper) return

    this.toastWrapper = document.createElement('div')
    this.toastWrapper.setAttribute(
      'style',
      'padding: 10px 16px; opacity: 0; transform: translate(-20px, -20px); border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,.1);border: 1px solid rgb(229,230,235); display: flex; align-items: center; gap: 0.6rem; transition: opacity 0.2s linear,transform 0.2s linear;'
    )
    this.toastWrapper.innerHTML = `
    <span style="color: ${this.getColorByType(
      this.type
    )}; font-size: 1rem; display:inline-flex; align-items: center; justify-content: center; width: 1.2rem; height: 1.2rem; border-radius: 50%;">${this.getIconByType(
      this.type
    )}</span>
    <span>${this.content}</span>
    `
    this.toastWrapper.addEventListener('mouseenter', () => {
      if (!this.autoDestroyTimer) return

      clearTimeout(this.autoDestroyTimer)
    })
    this.toastWrapper.addEventListener('mouseleave', () => {
      this.autoDestroyTimer = setTimeout(() => {
        this.destroy()
        this.autoDestroyTimer = undefined
      }, this.option.duration)
    })

    if (this.option.canClose) {
      const closeSpan = document.createElement('span')
      closeSpan.setAttribute('style', 'cursor: pointer;')
      closeSpan.addEventListener('click', () => {
        this.destroy()
      })
      closeSpan.innerHTML = this.getIconByType('close') || ''

      this.toastWrapper.appendChild(closeSpan)
    }

    this.toastBox.appendChild(this.toastWrapper)
    requestAnimationFrame(() => {
      if (!this.toastWrapper) return

      this.toastWrapper.style.opacity = '1'
      this.toastWrapper.style.transform = 'translate(0, 0)'
    })

    this.autoDestroyTimer = setTimeout(() => {
      this.destroy()
      this.autoDestroyTimer = undefined
    }, this.option.duration)
  }

  destroy() {
    if (!this.toastWrapper) return

    this.toastWrapper.style.opacity = '0'
    this.toastWrapper.style.transform = 'translate(20px, -20px)'

    setTimeout(() => {
      if (!this.toastWrapper) return

      this.toastBox.removeChild(this.toastWrapper)
      this.toastWrapper = undefined
    }, 200)
  }
}
