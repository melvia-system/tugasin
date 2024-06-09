<script lang="ts" setup>
import { ref, defineProps, type PropType, watch, onMounted, getCurrentInstance } from 'vue'
import { useStore } from '@nanostores/vue'
import { Api } from '../services/todo'
import { todoStore } from "../stores/todo"
import TaskGroup from './TaskGroup.vue'
import Modal from './Modal.vue'

const $todoStore = useStore(todoStore)
const selectedProject = ref<Api.Schema.Todo.Project | undefined>(undefined)

const fetch = async (projectId: number) => {
    try {
        const data = await Api.Fetch<Api.Schema.Todo.Project[]>(Api.Todo.Project.List())
        const project = data?.data.find((project) => project.id == projectId)
        if (!project) throw new Error('Project not found')

        todoStore.set({ ...todoStore.get(), selectedProject: project })
    } catch (error) {
        console.error(error)
        todoStore.set({ ...todoStore.get(), selectedProject: undefined })
    }
}
watch(() => $todoStore.value, (store) => {
    if (store.selectedProject && store.selectedProject?.id != selectedProject.value?.id) {
        selectedProject.value = store.selectedProject
        fetch(store.selectedProject.id)
    }
    selectedProject.value = store.selectedProject
})

const modalCreateGroupIsOpen = ref(false)
const modalCreateGroupInput = ref({
    name: ''
})
const createGroup = async () => {
    if (!selectedProject.value) return
    const data = await Api.Fetch<Api.Schema.Todo.Group>(Api.Todo.Group.Create(selectedProject.value.id, { name: modalCreateGroupInput.value.name }))
    console.log(data)
    modalCreateGroupIsOpen.value = false
    modalCreateGroupInput.value.name = ''
    fetch(selectedProject.value.id)
    todoStore.set({ ...todoStore.get(), selectedProject: undefined })
    setTimeout(() => todoStore.set({ ...todoStore.get(), selectedProject: selectedProject.value }), 500)
}
</script>

<template>
    <div v-if="$todoStore.selectedProject">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-semibold">{{ $todoStore.selectedProject.name }}</h1>
            <div>
                <button class="text-xs" @click="modalCreateGroupIsOpen = true">➕ New Group</button>
            </div>
        </div>
        <div v-if="selectedProject" class="flex flex-col gap-4">
            <TaskGroup :project="$todoStore.selectedProject"  />
        </div>
        <Modal v-if="modalCreateGroupIsOpen">
            <h2 class="text-xl font-medium">Create Group</h2>
            <div class="mt-4">
                <input v-model="modalCreateGroupInput.name" type="text" class="border border-gray-300 px-2 py-1 text-sm rounded w-full" placeholder="Group name" />
            </div>
            <div class="flex mt-4 gap4 justify-end">
                <button @click="() => modalCreateGroupIsOpen = false" class="text-sm border border-gray-300 px-4 py-2 rounded-lg mr-2">Cancel</button>
                <button @click="createGroup" class="text-sm bg-red-500 text-white px-4 py-2 rounded-lg">Create</button>
            </div>
        </Modal>
    </div>
</template>