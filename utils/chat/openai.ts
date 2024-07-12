import OpenAI from 'openai'
import type { ChatCompletionTool, ChatCompletionMessageParam, } from 'openai/resources/index.mjs';
import * as dotenv from 'dotenv'

dotenv.config()


async function chat(messages: ChatCompletionMessageParam[], currentMessage: ChatCompletionMessageParam, config: any) {
    const openai = new OpenAI({ apiKey: config.key || process.env.OPENAI_API_KEY })
    const tools = [
        {
            type: "function",
            function: {
                name: "get_user_device_problem",
                description: "Get the problem with user's device",
                parameters: {
                    type: "object",
                    properties: {
                        location: {
                            type: "string",
                            description: "The city and state, e.g. San Francisco, CA",
                        },
                        problem: {
                            type: "string",
                            description: "The problem user is facing with their device",
                        },
                        unit: { type: "string", enum: ["celsius", "fahrenheit"] },
                    },
                    required: ["location", "problem"],
                },
            },
        },
    ];
    // Pushing Current User Message
    messages.push(currentMessage)
    const completion = await openai.chat.completions.create({
        messages: messages,
        stream: true,
        model: 'gpt-3.5-turbo',
        tools: tools as ChatCompletionTool[],
        tool_choice: 'auto'
    })

    for await (let chunk of completion) {
        let msg = chunk.choices[0]?.delta || ""
        if (msg.tool_calls) console.log(msg.tool_calls)
        else {
            console.log(chunk.choices[0]?.delta?.content || "");
            console.log("Logging -------")
        }

        return chunk.choices[0]?.delta?.content || ""
    }
}
console.log(
    chat([{ role: "system", content: "You are a helpful AI agent" },

    { role: "user", content: "What is wrong with my phone in indore, it is hanging a lot" }
        , { role: "assistant", content: "Its not good " }
    ],
        { role: "user", content: "Its because of bloatware" }
    ))

