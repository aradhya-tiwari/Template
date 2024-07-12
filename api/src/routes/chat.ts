import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
    return c.text('This is Chat Url')
})

export { app as chat }