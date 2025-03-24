import { visit } from 'unist-util-visit'
import { Node } from 'unist'

interface CodeNode extends Node {
  value?: string
}

export function remarkCodeWrap(originText?: string) {
  return () => {
    return (tree: Node) => {
      if (!originText) return

      visit(tree, 'code', (node: CodeNode) => {
        node.value = originText.substring(node.position.start.offset, node.position.end.offset).match(/```(?:\w+)?\s*([\s\S]*?)```/)?.[1] || ''
      })
    }
  }
}
