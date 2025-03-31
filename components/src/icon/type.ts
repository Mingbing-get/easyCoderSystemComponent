import { Multilingual } from '@easy-coder/sdk/i18n'

export interface IconGroup {
  label: Multilingual
  name: string
  applicationName: string
}

export interface SVGTag {
  tag: string
  attrs: Record<string, string | boolean>
  children?: SVGTag[]
}

export interface SVGIcon {
  label: Multilingual
  viewBox?: string
  fill?: string
  stroke?: string
  strokeWidth?: string
  tags: SVGTag[]
}

export interface WithGroupInfoSVGIcon extends SVGIcon {
  groupName: string
  id: string
}
