import { oc } from "@orpc/contract"
import { z } from "zod"

import {
  createTaskInputSchema,
  taskSchema,
  updateTaskInputSchema,
} from "../schemas/task"

const base = oc.errors({
  UNAUTHORIZED: { message: "You must be signed in" },
  NOT_FOUND: { message: "Task not found" },
})

export const taskContract = {
  list: base.output(z.array(taskSchema)),
  create: base.input(createTaskInputSchema).output(taskSchema),
  update: base.input(updateTaskInputSchema).output(taskSchema),
  delete: base.input(z.object({ id: z.string() })).output(z.void()),
}
