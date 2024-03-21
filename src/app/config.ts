
import { from } from 'env-var'

export default function getEnv (env: NodeJS.ProcessEnv) {
  const { get } = from(env)

  return {
    WEBHOOK_SECRET: get('WEBHOOK_SECRET').required().asString()
  }
}
