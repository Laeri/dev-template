import "server-only"

import { os } from "../orpc"

export const healthRouter = {
  check: os.health.check.handler(() => ({ status: "ok", time: new Date() })),
}
