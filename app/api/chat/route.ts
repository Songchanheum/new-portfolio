export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { Type } from '@google/genai'

import { geminiClient, GEMINI_MODEL, EMBEDDING_MODEL } from '@/lib/gemini'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HIGHLIGHT_CARD_TOOL = {
  name: 'highlight_card',
  description: '관련 포트폴리오 카드를 강조 표시합니다. 질문이 특정 카드 주제와 관련될 때 호출하세요.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      index: {
        type: Type.NUMBER,
        description: '하이라이트할 카드 인덱스 (0~4). 카드 순서: 0=AI탐구자(소개), 1=기술설계(개발자), 2=경력(커리어타임라인), 3=프로젝트(사이드프로젝트), 4=AI협업자(철학)',
      },
    },
    required: ['index'],
  },
}

const OPEN_LAYER_TOOL = {
  name: 'open_layer',
  description: '경력 타임라인 또는 프로젝트 그리드 레이어를 열어줍니다. "경력 보여줘", "프로젝트 알려줘" 등 레이어 진입 요청 시 호출하세요.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: '"career" = 경력 타임라인 레이어, "projects" = 프로젝트 그리드 레이어',
      },
    },
    required: ['type'],
  },
}

const SHOW_PROJECT_TOOL = {
  name: 'show_project',
  description: '특정 프로젝트를 그리드에서 강조 표시합니다. 방문자가 특정 프로젝트에 대해 물어볼 때 호출하세요. 프로젝트 그리드가 열리며 해당 프로젝트가 강조됩니다.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: '강조할 프로젝트 ID. 알 수 없으면 빈 문자열("")을 전달하세요.',
      },
    },
    required: ['id'],
  },
}

async function retrieveContext(query: string): Promise<string> {
  try {
    const embeddingResponse = await geminiClient.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: [{ parts: [{ text: query }] }],
      config: { outputDimensionality: 768 },
    })
    const vector = embeddingResponse.embeddings?.[0]?.values

    if (!vector) return ''

    const { data } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: vector,
      match_threshold: 0.5,
      match_count: 3,
    })

    return data?.map((d: { content: string }) => d.content).join('\n\n') ?? ''
  } catch (err) {
    console.error('[chat/route] 컨텍스트 검색 실패:', (err as Error).message)
    return ''
  }
}

function buildPrompt(context: string, question: string): string {
  if (!context) {
    return '질문에 대한 관련 정보를 찾을 수 없습니다. "해당 정보를 찾을 수 없습니다. 포트폴리오에 관한 다른 질문을 해주세요."라고 답변하세요.'
  }
  return `당신은 포트폴리오 오너(송찬흠)의 AI 어시스턴트입니다.
아래 컨텍스트를 기반으로 방문자의 질문에 친절하고 정확하게 한국어로 답변하세요.
컨텍스트에 없는 정보는 추측하지 마세요.
답변은 간결하게 2-3문장으로 작성하세요.

질문 주제에 따라 적절한 도구를 호출하세요:
- highlight_card: 카드 강조 (0=AI탐구자, 1=기술설계, 2=경력, 3=프로젝트, 4=AI협업자)
- open_layer: "경력 보여줘" → type="career", "프로젝트 보여줘" → type="projects"
- show_project: 특정 프로젝트 문의 시 → id=프로젝트ID (모르면 "")

## 컨텍스트
${context}

## 질문
${question}`
}

type ToolCall = { name: string; args: Record<string, unknown> }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body?.message
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : null

    if (typeof message !== 'string' || message.trim().length === 0) {
      return Response.json({ error: '메시지가 비어있습니다' }, { status: 400 })
    }

    if (message.length > 500) {
      return Response.json({ error: '메시지가 너무 깁니다 (최대 500자)' }, { status: 400 })
    }

    const context = await retrieveContext(message.trim())
    const prompt = buildPrompt(context, message.trim())

    // Phase 1: stream with function calling enabled
    const stream1 = await geminiClient.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ functionDeclarations: [HIGHLIGHT_CARD_TOOL, OPEN_LAYER_TOOL, SHOW_PROJECT_TOOL] }],
      },
    })

    const userMessage = message.trim()

    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder()
        let fullAssistantText = ''
        try {
          // Collect all parts from phase 1
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const modelParts: any[] = []
          const toolCalls: ToolCall[] = []
          let hasText = false

          for await (const chunk of stream1) {
            const parts = chunk.candidates?.[0]?.content?.parts ?? []
            for (const part of parts) {
              modelParts.push(part)
              if (part.text) {
                controller.enqueue(enc.encode(part.text))
                fullAssistantText += part.text
                hasText = true
              }
              if (part.functionCall) {
                console.log('[chat/route] functionCall detected:', JSON.stringify(part.functionCall))
                toolCalls.push({
                  name: part.functionCall.name ?? '',
                  args: part.functionCall.args as Record<string, unknown>,
                })
              }
            }
          }

          console.log('[chat/route] toolCalls:', toolCalls.length, 'hasText:', hasText)

          // If function calls found and no text was streamed yet, do phase 2
          if (toolCalls.length > 0 && !hasText) {
            // Send tool calls prefix
            controller.enqueue(enc.encode(`__TOOLS__:${JSON.stringify(toolCalls)}\n`))

            // Phase 2: send function results and get text response
            const stream2 = await geminiClient.models.generateContentStream({
              model: GEMINI_MODEL,
              contents: [
                { role: 'user', parts: [{ text: prompt }] },
                { role: 'model', parts: modelParts },
                {
                  role: 'user',
                  parts: toolCalls.map((tc) => ({
                    functionResponse: {
                      name: tc.name,
                      response: { executed: true },
                    },
                  })),
                },
              ],
            })

            for await (const chunk of stream2) {
              const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
              if (text) {
                controller.enqueue(enc.encode(text))
                fullAssistantText += text
              }
            }
          } else if (toolCalls.length > 0 && hasText) {
            // Text came first, then tool call — append tool prefix at end for client
            controller.enqueue(enc.encode(`\n__TOOLS__:${JSON.stringify(toolCalls)}\n`))
          }

          // 대화 기록 저장 (fire and forget)
          if (fullAssistantText && sessionId) {
            supabaseAdmin.from('chat_logs').insert({
              session_id: sessionId,
              user_message: userMessage,
              assistant_message: fullAssistantText,
            }).then(({ error }) => {
              if (error) console.error('[chat/route] 대화 저장 실패:', error.message)
            })
          }
        } catch (err) {
          console.error('[chat/route] 스트리밍 에러:', (err as Error).message)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    console.error('[chat/route] API 에러:', (err as Error).message)
    return Response.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
