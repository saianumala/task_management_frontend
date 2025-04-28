import { atom } from "recoil";
import { Task } from "../types";

export const taskAtom = atom<Task | null>({
  key: "taskAtom",
  default: null,
});

export const tasksAtom = atom<Task[] | null>({
  key: "tasksAtom",
  default: null,
});
