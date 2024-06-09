import { atom } from "nanostores"
import { Api } from "../services/todo"

export const todoStore = atom({
    selectedProject: undefined as Api.Schema.Todo.Project | undefined,
})