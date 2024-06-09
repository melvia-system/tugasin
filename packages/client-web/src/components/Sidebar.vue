<script lang="ts" setup>
import { ref, defineProps, type PropType, watch } from 'vue'
import { useStore } from '@nanostores/vue'
import { Api } from '../services/todo'
import { todoStore } from "../stores/todo"

defineProps({
    projects: {
        type: Array as PropType<Api.Schema.Todo.Project[]>,
        required: true
    }
})

const $todoStore = useStore(todoStore)
const selectProject = (project: Api.Schema.Todo.Project) => {
    todoStore.set({
        ...todoStore.get(),
        selectedProject: project,
    })
}
</script>

<template>
    <div class="w-[260px] bg-[#F7F7F7] border-r-2 border-[#EFEFEF] flex">
        <div class="relative flex-1">
            <div class="flex justify-between items-center mx-4 py-2">
                <div class="flex gap-1.5 w-full">
                    <div class="w-[13px] h-[13px] bg-red-500 rounded-full" />
                    <div class="w-[13px] h-[13px] bg-yellow-500 rounded-full" />
                    <div class="w-[13px] h-[13px] bg-green-500 rounded-full" />
                </div>
                <div>
                    <button class="border px-1 py-[1px] rounded bg-gray-200/50">🔅</button>
                </div>
            </div>
            <div class="mx-4 py-2 mt-2">
                <div class="flex gap-3 items-center">
                    <div class="w-8 h-8 rounded-sm bg-green-500/40 flex items-center justify-center">
                        <span class="text-green-600 text-xs">AD</span>
                    </div>
                    <div class="font-medium text-sm">Alfian Dwi Nugraha</div>
                </div>
            </div>
            <div class="mx-4 py-4 flex flex-col gap-5">
                <!-- <div class="flex flex-col gap-2">
                    <div class="text-sm text-gray-600">Favorites</div>
                    <div class="flex flex-col gap-1.5">
                        <div class="flex items-center gap-3 rounded px-2 py-1 bg-gray-200/60">
                            <div class="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">🏠</div>
                            <div class="text-sm">Home</div>
                        </div>
                    </div>
                </div> -->
                <div class="flex flex-col gap-2">
                    <div class="text-sm text-gray-600">Personal Workspace</div>
                    <div class="flex flex-col gap-1.5">
                        <button
                            v-for="project in projects"
                            class="flex items-center gap-3 rounded px-2 py-1 hover:bg-gray-200/60"
                            v-on:click="() => selectProject(project)"
                            :class="{
                                'bg-gray-200/60': project.id === $todoStore.selectedProject?.id
                            }"
                        >
                            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div class="text-sm">{{ project.name }}</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>