import mitt from 'mitt'

type Events = {
  highlight_card: { index: number }
  open_layer: { type: 'career' | 'projects' }
  show_project: { id: string }
}

export const portfolioEventBus = mitt<Events>()
