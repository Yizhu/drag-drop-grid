export interface ChatMessage {
  id: string,
  role: string,
  text: string,
  widgets?: ChatWidget[]
}

export interface ChatWidget {
  title: string,
  chartType: string,
}

export interface AiChat {
  sessionId: string,
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string,
  role: string,
  text: string,
  widgets?: ChatWidget[]
}

export interface WidgetListData {
  id: string,
  title: string,
  chartType: string,
  sessionId: string,
}