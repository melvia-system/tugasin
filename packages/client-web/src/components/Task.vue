<script lang="ts" setup>
import { ref, defineProps, type PropType, watch, onMounted, reactive, getCurrentInstance } from 'vue'
import { useStore } from '@nanostores/vue'
import { Api } from '../services/todo'
import { todoStore } from "../stores/todo"
import Task from './Task.vue'

const props = defineProps({
    project: {
        type: Object as PropType<Api.Schema.Todo.Project>,
        required: true
    },
    group: {
        type: Object as PropType<Api.Schema.Todo.Group>,
        required: true
    }
})

const emit = defineEmits(['fetch'])

const onChange = async (groupId: number, itemId: number, payload: Event) => {
    const target = payload.target as HTMLInputElement
    const data = await Api.Fetch<Api.Schema.Todo.Item>(Api.Todo.Item.Update(props.project.id, groupId, itemId, { done: target.checked }))
    console.log(data)
}

const taskName = ref('');

const addTask = async (groupId: number) => {
    if (!taskName.value) return
    const data = await Api.Fetch<Api.Schema.Todo.Item>(Api.Todo.Item.Create(props.project.id, groupId, { name: taskName.value }))
    console.log(data)
    taskName.value = ''
    emit('fetch')
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-3">
            <div v-for="(item, j) in group.todoItems" :key="j" class="flex">
                <div>
                    <input type="checkbox" class="mr-2" :checked="item.done" @change="((payload: Event) => onChange(group.id, item.id, payload))" />
                </div>
                <div>
                    <div>{{ item.name }}</div>
                    <!-- <div>
                        <span class="text-xs text-gray-500">🕛 {{ item }}</span>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="border rounded p-4 mt-4 flex gap-4">
            <input type="text" v-model="taskName" @keyup.enter="() => addTask(group.id)" class="border border-gray-300 px-2 py-1 text-sm rounded w-full" placeholder="Add a task">
            <button @click="() => addTask(group.id)" class="text-sm bg-red-500 text-white px-4 py-2 rounded-lg">Add</button>
            <!-- <div class="flex justify-end items-center mt-4 gap-2">
                <button @click="addTask" class="text-sm bg-gray-200/60 text-gray-700 px-4 py-2 rounded-lg">Cancel</button>
                <button @click="addTask" class="text-sm bg-red-500 text-white px-4 py-2 rounded-lg">Add</button>
            </div> -->
        </div>
    </div>
</template>