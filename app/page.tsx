"use client";

import dynamic from "next/dynamic";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useState } from "react";
import ChatBubble from "./components/ChatBubble"
import { useRef, useEffect } from "react";

 
export default function Home() {

    const ExcalidrawComponent = dynamic(
    () => import("@excalidraw/excalidraw").then(mod => mod.Excalidraw),
    { ssr: false }
  );

  const chatEndRef = useRef(null);

  

  const [messages, setMessages] = useState([]);

  async function sendMessage(text) {
    const newMsg = {
      id: crypto.randomUUID(),
      msg: text,
      sender: "user",
    }; //New Message

    setMessages(prev => [...prev, newMsg]);

    const newAiMsg = {
      id: crypto.randomUUID(),
      msg: await callAI(text),
      sender: "ai",
    }; // New Ai Message

    setMessages(prev => [...prev, newAiMsg]); //Add new user message
  };

  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); //Don't refresh
    if (!input.trim()) return; //Remove spaces

    sendMessage(input);
    setInput("");
  };

  async function callAI(inputText) {
    
    const newAiMsg = [
          ...messages.map(m => (
            {
            role: m.sender === "ai" ? "assistant" : "user",
            content: m.msg
          }
        )),
          {role: "user", content: inputText},
        ]

    const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dolphin3.0-llama3.1-8b",
        messages: newAiMsg,
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };

  useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <header className="fixed top-2 left-2 w-[48.7%] bg-white/10 text-black backdrop-blur-sm border border-black/10 rounded-xl shadow-lg p-4 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold">Co-Foundr</h1>
        <nav className="space-x-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Settings</a>
        </nav>
      </header>

      <main className="flex h-screen overflow-y-auto hide-scrollbar">
        
          <div className="w-1/2 h-screen overflow-y-auto hide-scrollbar pb-12" >
            
            <div className="pt-21 p-6">
              <div className="flex-1 flex flex-col gap-8"> 
                {messages.map(msg => (
                  <ChatBubble key={msg.id} text={msg.msg} sender={msg.sender} />
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          
          <form onSubmit={handleSubmit} className="flex-1 justify-center absolute bottom-3 left-0 w-1/2 px-10">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Say anything..." className="w-full px-5 py-3 rounded-xl bg-white border border-black/10"/>
          </form>
        
        </div>
        <div className="w-1/2 border border-black/10">
          
          <div style={{ height: "100vh", width: "100%" }}>
            <Excalidraw />
          </div>
        
        </div>
      </main>
    </>
  );
}
