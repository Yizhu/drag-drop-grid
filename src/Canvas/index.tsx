import React, { useState } from "react";

import { Spin, Button } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";

// import SendMessageOutlined from './assets/SendMessageOutlined.svg'
import { ChatMessage, AiChat, WidgetListData } from "./utils/type";
// import { useNavigate }                                 from 'react-router-dom'

import Canvas from "./Canvas";
import { DraggableChart } from "./components/WidgetChart";
import * as UI from "./styledComponents";

export default function AICanvas() {
  // const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [chats, setChats] = useState([] as ChatMessage[]);
  const [widgets, setWidgets] = useState([] as WidgetListData[]);

  const [searchText, setSearchText] = useState("");
  // const linkToDashboard = useTenantLink('/dashboard')
  const placeholder = `Looking for answers or need help? Type your message—I’m ready when you are.`;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };
  const handleSearch = async (suggestion?: string) => {
    if (!suggestion && searchText.length <= 1) return;
    const question = suggestion || searchText;
    const newMessage = {
      id: uuidv4(),
      role: "USER",
      text: question,
    };
    setChats([...chats, newMessage]);
    setLoading(true);
    setSearchText("");
    // const response = await chatAi({
    //   payload: {
    //     question,
    //     ...(sessionId && { sessionId })
    //   }
    // }).unwrap()
    const response: AiChat = {
      sessionId: "001",
      messages: [
        {
          id: "1",
          role: "USER",
          text: "Generate a Pie Chart",
        },
        {
          id: "a1",
          role: "AI",
          text: `A pie chart has been generated. 
          You can drag and drop it onto the canvas on the right.`,
          widgets: [
            {
              title: "",
              chartType: "pie",
            },
          ],
        },
      ],
    };
    if (response.sessionId && !sessionId) {
      setSessionId(response.sessionId);
    }
    setTimeout(() => {
      setLoading(false);
      setChats(response.messages);
      const latest = response.messages[response.messages.length - 1];
      if (latest.widgets) {
        setWidgets([
          ...widgets,
          {
            ...latest.widgets[0],
            sessionId: response.sessionId,
            id: latest.id,
          },
        ]);
      }
    }, 1000);
  };

  // const onClose = () => {
  // navigate(linkToDashboard)
  // }

  const Message = (props: { chat: ChatMessage }) => {
    const { chat } = props;
    return (
      <div className="message">
        <div
          className={`chat-container ${chat.role === "USER" ? "right" : ""}`}
        >
          <div className="chat-bubble">{chat.text}</div>
        </div>
        {chat.role === "AI" && chat.widgets?.length && (
          <DraggableChart
            data={{
              ...chat.widgets[0],
              sessionId,
              id: chat.id,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <UI.Wrapper>
        <div className="chat">
          <div className="content">
            <div className="chatroom">
              <div className="placeholder">
                <div
                  onClick={() => {
                    handleSearch("Generate a Pie Chart");
                  }}
                >
                  Generate a Pie Chart
                </div>
              </div>
              <div className="messages-wrapper">
                {chats?.map((i) => (
                  <Message key={i.id} chat={i} />
                ))}
                {loading && (
                  <div className="loading">
                    <Spin />
                  </div>
                )}
              </div>
              <div className="input">
                <UI.Input
                  autoFocus
                  value={searchText}
                  //@ts-ignore
                  onChange={({ target: { value } }) => setSearchText(value)}
                  onKeyDown={onKeyDown}
                  data-testid="search-input"
                  rows={10}
                  placeholder={placeholder}
                />
                <Button
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Canvas />
      </UI.Wrapper>
    </DndProvider>
  );
}
