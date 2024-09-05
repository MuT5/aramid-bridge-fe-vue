import { type Payload } from '../Payload'

export type SignedPayload = {
  command: string
  payload: Payload
}
