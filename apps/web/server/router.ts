import "server-only"

import { os } from "./orpc"
import { healthRouter } from "./routers/health"
import { settingsRouter } from "./routers/settings"
import { setupRouter } from "./routers/setup"
import { authMethodsRouter, ssoRouter } from "./routers/sso"
import { taskRouter } from "./routers/task"
import { userRouter } from "./routers/user"

export const router = os.router({
  auth: authMethodsRouter,
  health: healthRouter,
  settings: settingsRouter,
  setup: setupRouter,
  sso: ssoRouter,
  task: taskRouter,
  user: userRouter,
})

export type Router = typeof router
