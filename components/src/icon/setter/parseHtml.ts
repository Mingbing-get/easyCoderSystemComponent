import { SVGTag } from '../type'

export function SVGTagListToHtml(tags: SVGTag[]) {
  return tags.map(SVGTagToHtml).join('\n')
}

function SVGTagToHtml(tag: SVGTag): string {
  const attrs: string[] = []

  for (const key in tag.attrs) {
    attrs.push(`${key}="${tag.attrs[key]}"`)
  }

  if (tag.children?.length) {
    return `<${tag.tag} ${attrs.join(' ')}>\n${SVGTagListToHtml(tag.children)}\n</${tag.tag}>`
  }

  return `<${tag.tag} ${attrs.join(' ')} />`
}
