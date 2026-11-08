import "server-only"

import { os } from "./orpc"
import { healthRouter } from "./routers/health"
import { settingsRouter } from "./routers/settings"
import { setupRouter } from "./routers/setup"
import { taskRouter } from "./routers/task"

export const router = os.router({
  health: healthRouter,
  settings: settingsRouter,
  setup: setupRouter,
  task: taskRouter,
})

export type Router = typeof router
