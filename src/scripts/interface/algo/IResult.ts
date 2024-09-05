export interface IResult {
  method: string
  body: Array<
    Array<{
      txID: string
      signingfrom?: string
      signature: string
    } | null>
  >
}
