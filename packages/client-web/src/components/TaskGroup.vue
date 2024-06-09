<script lang="ts" setup>
import { ref, defineProps, type PropType, watch, onMounted, reactive } from 'vue'
import { useStore } from '@nanostores/vue'
import { Api } from '../services/todo'
import { todoStore } from "../stores/todo"
import Task from './Task.vue'

const props = defineProps({
    project: {
        type: Object as PropType<Api.Schema.Todo.Project>,
        required: true
    }
})

const groups = ref<Api.Schema.Todo.Group[]>([])

const fetch = async () => {
    const data = await Api.Fetch<Api.Schema.Todo.Group[]>(Api.Todo.Group.List(props.project.id))
    console.log(data)
    groups.value = data?.data
}
onMounted(() => {
    fetch()
})
</script>

<template>
    <div v-for="(group, i) in groups" :key="i">
        <div class="mb-2 font-medium">{{ group.name }}</div>
        <Task :project="project" :group="group" @fetch="() => fetch()" />
    </div>
</template>