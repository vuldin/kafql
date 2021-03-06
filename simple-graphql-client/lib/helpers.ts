import { Client, SubscribePayload } from 'graphql-ws'

export function getExecuteFunction(client: Client) {
  // https://github.com/enisdenjo/graphql-ws#async-iterator
  return function execute<T>(payload: SubscribePayload): AsyncGenerator<T> {
    let deferred: {
      resolve: (done: boolean) => void
      reject: (err: unknown) => void
    } | null = null
    const pending: T[] = []
    let throwMe: unknown = null,
      done = false
    const dispose = client.subscribe<T>(payload, {
      next: (data: any) => {
        pending.push(data)
        deferred?.resolve(false)
      },
      error: (err) => {
        throwMe = err
        deferred?.reject(throwMe)
      },
      complete: () => {
        done = true
        deferred?.resolve(true)
      },
    })
    return {
      [Symbol.asyncIterator]() {
        return this
      },
      async next() {
        if (done) return { done: true, value: undefined }
        if (throwMe) throw throwMe
        if (pending.length) return { value: pending.shift()! }
        return (await new Promise<boolean>((resolve, reject) => (deferred = { resolve, reject })))
          ? { done: true, value: undefined }
          : { value: pending.shift()! }
      },
      async throw(err) {
        throw err
      },
      async return() {
        dispose()
        return { done: true, value: undefined }
      },
    }
  }
}

const vals = ['|', '/', '-', '\\']
let num = 0
export function printReconnecting(url: string) {
  process.stdout.write(`connecting to ${url}... ${vals[num % vals.length]}\r`)
  num += 1
}
