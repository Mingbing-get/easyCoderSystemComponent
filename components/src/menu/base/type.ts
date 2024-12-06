export interface MenuData {
  id: string
  label: React.ReactNode
  subMenus?: MenuData[]
}
