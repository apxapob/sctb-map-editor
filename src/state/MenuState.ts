import { observable } from 'mobx'

export type MenuItem = {
  title: string;
  callback: () => void;
}

export const MenuState: {
  menuX: number,
  menuY: number,
  items: MenuItem[]
} = observable({
  menuX: 0,
  menuY: 0,
  items: []
})
