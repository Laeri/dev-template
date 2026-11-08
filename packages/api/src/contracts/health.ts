import { oc } from "@orpc/contract"
import { z } from "zod"

export const healthContract = {
  check: oc.output(z.object({ status: z.literal("ok"), time: z.date() })),
}
