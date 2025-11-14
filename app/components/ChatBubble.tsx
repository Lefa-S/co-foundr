"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

export default function ChatBubble({ text, sender }) {
  return (
    <div 
        className={`
        ${sender === "user" ? "bg-gray-200 text-black self-end ml-auto p-2 flex p-3 mb-2 rounded-xl max-w-[60%] w-auto break-words whitespace-normal" : "text-black mx-auto max-w-[85%] break-words whitespace-pre-wrap"}`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}