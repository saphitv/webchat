export interface sidebarItem {
  name: string,
  url?: string,
  path: string,
  show: "LOGGED" | "UNLOGGED",
  auth: string[],
  onClick: () => void

}
