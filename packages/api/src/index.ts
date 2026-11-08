import type {
  ContractRouterClient,
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from "@orpc/contract"

import { healthContract } from "./contracts/health"
import { settingsContract } from "./contracts/settings"
import { setupContract } from "./contracts/setup"
import { taskContract } from "./contracts/task"

/**
 * The API contract shared by the server (implementation) and client (typed calls).
 */
export const contract = {
  health: healthContract,
  settings: settingsContract,
  setup: setupContract,
  task: taskContract,
}

export type Contract = typeof contract
export type ApiClient = ContractRouterClient<Contract>
export type ApiInputs = InferContractRouterInputs<Contract>
export type ApiOutputs = InferContractRouterOutputs<Contract>

export * from "./schemas/settings"
export * from "./schemas/setup"
export * from "./schemas/task"
