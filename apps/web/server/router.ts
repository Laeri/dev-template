import "server-only"

import { os } from "./orpc"
import { healthRouter } from "./routers/health"
import { settingsRouter } from "./routers/settings"
import { setupRouter } from "./routers/setup"
import { taskRouter } from "./routers/task"
import { userRouter } from "./routers/user"

export const router = os.router({
  health: healthRouter,
  settings: settingsRouter,
  setup: setupRouter,
  task: taskRouter,
  user: userRouter,
})

export type Router = typeof router
