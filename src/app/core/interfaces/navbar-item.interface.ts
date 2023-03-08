export interface navBarItem {
  name: string,
  url?: string,
  path: string,
  show: "LOGGED" | "UNLOGGED",
  auth: string[],
  onClick: () => void

}
