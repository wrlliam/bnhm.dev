import { create } from "zustand";

export type LoaderStore = {
  state: boolean;
  comingInternal: boolean;
  setState: (v: boolean) => void;
  setComingInternal: (v: boolean) => void;
};

export const loaderStore = create<LoaderStore>()((set) => ({
  state: true,
  comingInternal: false,
  setState: (v: boolean) => set(() => ({ state: v })),
  setComingInternal: (v: boolean) => set(() => ({ comingInternal: v })),
}));

export type MousePos = {
  posX: number;
  posY: number;
  setPosX: (v: number) => void;
  setPosY: (v: number) => void;
};

export const mousePos = create<MousePos>()((set) => ({
  posX: 0,
  posY: 0,
  setPosX: (v: number) => set(() => ({ posX: v })),
  setPosY: (v: number) => set(() => ({ posY: v })),
}));
