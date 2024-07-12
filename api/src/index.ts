import { Hono } from 'hono'
import { chat } from './routes/chat'


const app = new Hono()


app.route('/chat', chat)


app.get('/', (c) => {
  return c.text('Hello Hono!')
})


export default app
