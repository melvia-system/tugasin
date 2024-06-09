import { z } from 'zod'
import { cors } from 'hono/cors'
import { Hono, Context } from 'hono'
import { PrismaClient } from '@prisma/client'
import { zValidator } from '@hono/zod-validator'

// create database connection
const prisma = new PrismaClient()

// create a new Hono instance
const app = new Hono()
app.use('*', cors())

// Schema
const CreateTodoProjectSchema = z.object({
  name: z.string().min(3).max(255)
})
const CreateTodoGroupSchema = z.object({
  name: z.string().min(3).max(255),
})
const CreateTodoItemSchema = z.object({
  name: z.string().min(3).max(255),
  done: z.boolean().default(false)
})
const UpdateTodoItemSchema = CreateTodoItemSchema.partial()
  

// main
function main() {
  app.get('/', (c) => c.json({ success: true, message: 'Hello World' }))
  
  // project
  const projectGroup = new Hono()
  projectGroup.get('/', async (c) => {
    const data = await prisma.todoProject.findMany()
    return c.json({
      success: true,
      message: 'success get all project',
      data
    })
  })
  projectGroup.post('/', zValidator('json', CreateTodoProjectSchema), async (c) => {
    const validated = c.req.valid('json');
    const data = await prisma.todoProject.create({
      data: {
        name: validated.name
      }
    })
    return c.json({
      success: true,
      message: 'success create project',
      data
    })
  })
  // project - group
  const groupGroup = new Hono()
  groupGroup.use(async (c, next) => {
    const projectId = Number(c.req.param('projectId') || -1)
    const project = await prisma.todoProject.findUnique({
      where: {
        id: projectId
      }
    })
    if (!project) {
      return c.json({
        success: false,
        message: `project with id ${projectId} not found`
      })
    }
    return next()
  })
  groupGroup.get('/', async (c) => {
    const data = await prisma
      .todoGroup
      .findMany({
        include: {
          todoItems: {
            select: {
              id: true,
              name: true,
              done: true,
            }
          },
        },
      })
    return c.json({
      success: true,
      message: `success get all group`,
      data
    })
  })
  groupGroup.post('/', zValidator('json', CreateTodoGroupSchema), async (c) => {
    const validated = c.req.valid('json');
    const todoProjectId = Number(c.req.param('projectId') || -1)
    const data = await prisma.todoGroup.create({
      data: {
        name: validated.name,
        todoProjectId,
      }
    })
    return c.json({
      success: true,
      message: `success create group`,
      data
    })
  })
  projectGroup.route('/:projectId/group', groupGroup)
  // project - group - todo
  const todoGroup = new Hono()
  todoGroup.use(async (c, next) => {
    const groupId = Number(c.req.param('groupId') || -1)
    const group = await prisma.todoGroup.findUnique({
      where: {
        id: groupId
      }
    })
    if (!group) {
      return c.json({
        success: false,
        message: `group with id ${groupId} not found`
      })
    }
    return next()
  })
  todoGroup.post('/', zValidator('json', CreateTodoItemSchema), async (c) => {
    const validated = c.req.valid('json');
    const todoGroupId = Number(c.req.param('groupId') || -1)
    const data = await prisma.todoItem.create({
      data: {
        name: validated.name,
        done: validated.done,
        todoGroupId,
      }
    })
    return c.json({
      success: true,
      message: `success create todo`,
      data
    })
  })
  todoGroup.put('/:todoId', zValidator('json', UpdateTodoItemSchema), async (c) => {
    const validated = c.req.valid('json');
    const todoId = Number(c.req.param('todoId') || -1)
    const data = await prisma.todoItem.update({
      where: {
        id: todoId
      },
      data: {
        name: validated.name,
        done: validated.done,
      }
    })
    return c.json({
      success: true,
      message: `success update todo`,
      data
    })
  })
  projectGroup.route('/:projectId/group/:groupId/todo', todoGroup)

  // push
  app.route('/project', projectGroup)
}

// main
try {
  main()
} catch (error) {
  console.error(error)
}
await prisma.$disconnect()

// export default app
export default app
