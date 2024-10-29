export const InternalErrorCode = "InternalError"

export default class InternalError extends Error {
  title: string
  description?: string

  constructor({
    message,
    title,
    description,
  }: {
    message?: string
    title: string
    description?: string
  }) {
    super(InternalErrorCode)

    this.title = title
    this.description = description
    this.cause = InternalErrorCode
  }
}

export function isInternalError(err: unknown): err is InternalError {
  return err instanceof InternalError
}
