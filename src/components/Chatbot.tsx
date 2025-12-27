"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { MessageCircle, X, Send, Mail } from "lucide-react";
import { chatbotOpenAtom, chatbotMessageAtom } from "../atoms/chatbotAtom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  isFullScreen?: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isFullScreen = false }) => {
  const [isOpen, setIsOpen] = useAtom(chatbotOpenAtom);
  const [triggerMessage, setTriggerMessage] = useAtom(chatbotMessageAtom);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true);
  const [showContactTooltip, setShowContactTooltip] = useState(false);
  const [isCollectingEmail, setIsCollectingEmail] = useState(false);
  const [isCollectingExplanation, setIsCollectingExplanation] = useState(false);
  const [collectedEmail, setCollectedEmail] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseEnter = () => {
    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      // FIXED: Added random string to prevent duplicate ID crashes
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    if (isOpen && triggerMessage) {
      addMessage(triggerMessage, "bot");
      setTriggerMessage(null);
    }
  }, [isOpen, triggerMessage, setTriggerMessage]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = "Hey, welcome to my website!\n\nI'm Tushar, a software engineer.\n\nAsk about me or contact me!";
      addMessage(welcomeMessage, "bot");
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const connectSection = document.getElementById('connect');
      if (connectSection) {
        const rect = connectSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && !isOpen) {
          setShowContactTooltip(true);
        } else {
          setShowContactTooltip(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleContactTooltipClick = () => {
    setIsOpen(true);
    setShowContactTooltip(false);
    setIsCollectingEmail(true);
    const emailMessage = "Email is tushar.singh.ggsipu@gmail.com, but you can just mention your email here and I will attend to you ASAP.";
    setTriggerMessage(emailMessage);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    addMessage(userMessage, "user");

    if (isCollectingExplanation) {
      setIsTyping(true);
      setTimeout(() => {
        handleExplanationSubmit(userMessage);
        setIsTyping(false);
      }, 500);
      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMessage.toLowerCase());
      addMessage(response, "bot");
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateResponse = (message: string): string => {
    const msg = message.toLowerCase();

    if (msg.includes("contact") || msg.includes("email") || msg.includes("reach") || msg.includes("connect") ||
        msg.includes("get in touch") || msg.includes("message") || msg.includes("talk to")) {
      setIsCollectingEmail(true);
      return "I'd be happy to help you connect with Tushar! Could you please share your email address so he can reach out to you?";
    }
    if ((msg.includes("how") && msg.includes("tushar")) || msg.includes("how is tushar") || msg.includes("how's tushar")) {
      const responses = [
        "Tushar is doing great! He's passionate about building software that solves real problems and is always excited to work on new challenges.",
        "Tushar is fantastic! He's currently focused on creating innovative web applications and loves exploring new technologies like RAG and Web3.",
        "Tushar is doing well and staying productive. He's always learning new things and working on projects that matter to him."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (msg.includes("what does tushar do") || (msg.includes("what") && msg.includes("do") && msg.includes("tushar"))) {
      const responses = [
        "Tushar is a software engineer who specializes in building full-stack web applications. He creates everything from AI-powered documentation tools to astronomical dashboards, with a focus on clean code and great user experiences.",
        "Tushar develops web applications and tools that solve real-world problems. From AI implementations to productivity tools, he enjoys crafting software that makes a difference.",
        "As a software engineer, Tushar builds modern web applications using cutting-edge technologies. He's passionate about creating solutions that are both technically sound and user-friendly."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (msg.includes("experience") || msg.includes("background") || msg.includes("work history")) {
      return "Tushar has solid experience in software development, having built multiple production-ready applications. He's currently open to work and would love to book an interview to discuss opportunities! He's particularly experienced in React, Next.js, Node.js, and Python.";
    }

    if (msg.includes("open to work") || msg.includes("looking for job") || msg.includes("hiring") || msg.includes("available")) {
      return "Yes! Tushar is currently open to work and actively looking for exciting opportunities. He would love to book an interview to discuss how he can contribute to your team. Would you like me to help you get in touch with him?";
    }

    if (msg.includes("interview") || msg.includes("schedule") || msg.includes("meet")) {
      return "Absolutely! Tushar would be thrilled to schedule an interview. He has experience in full-stack development and is eager to discuss opportunities. Would you like to share your contact information so he can reach out to arrange a time?";
    }

    if ((msg.includes("who") && msg.includes("tushar")) || msg.includes("tell me about tushar") || msg.includes("about tushar")) {
      const responses = [
        "Tushar is a passionate software engineer who focuses on building projects that actually matter. He's skilled in full-stack development with expertise in React, Next.js, Node.js, and Python. He's currently working on innovative AI projects and enjoys solving complex problems.",
        "Meet Tushar - a dedicated software engineer who believes in creating software that makes a real impact. With strong skills in modern web technologies and a passion for clean, efficient code, he's always excited to take on new challenges.",
        "Tushar is a software engineer who loves building things that matter. He specializes in creating full-stack web applications and has experience with everything from RAG systems to astronomical data visualization."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (msg.includes("skills") || msg.includes("technologies") || msg.includes("tech stack") || msg.includes("expertise")) {
      const responses = [
        "Tushar specializes in: Frontend (React, Next.js, TypeScript, Tailwind CSS), Backend (Node.js, Python/FastAPI, Express.js), Databases (PostgreSQL, MongoDB, IndexedDB), and Tools (Git, Docker, Neovim).",
        "Tushar's tech stack includes modern web technologies: React/Next.js for frontend, Node.js/FastAPI for backend, and languages including TypeScript, Python, and C++. He's also proficient with state management libraries like Jotai.",
        "Tushar is proficient in: React, Next.js 15, TypeScript, Python (FastAPI), Node.js, Tailwind CSS, Framer Motion, and various other modern web technologies. He also has experience with RAG implementations."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (msg.includes("frontend") || msg.includes("ui") || msg.includes("interface")) {
      return "Tushar excels at frontend development! He builds beautiful, responsive user interfaces using React, Next.js, TypeScript, and Tailwind CSS. He also loves creating smooth animations with Framer Motion and has an eye for themes like his 'Titanium' interface design.";
    }

    if (msg.includes("backend") || msg.includes("server") || msg.includes("api")) {
      return "On the backend, Tushar works with Node.js, Express.js, and Python (FastAPI) to build robust APIs. He has experience with scraping, streaming data, and databases including PostgreSQL and MongoDB.";
    }

    if (msg.includes("full stack") || msg.includes("fullstack")) {
      return "Yes, Tushar is a full-stack developer! He can handle everything from beautiful user interfaces to robust backend systems. He loves the challenge of building complete applications end-to-end.";
    }

    if ((msg.includes("what") && msg.includes("projects")) || msg.includes("his projects") || msg.includes("portfolio")) {
      return "Tushar has worked on some exciting projects! Here are the highlights:\n\n1) **Docent AI** - Live Documentation Assistant using RAG\n2) **Caelivisio** - Astronomical dashboard monitoring Near-Earth Objects\n\nWould you like me to elaborate on any of these projects?";
    }

    if (msg.includes("how good") || msg.includes("quality") || msg.includes("level") || msg.includes("skill level")) {
      return "Tushar is a highly skilled developer who consistently delivers high-quality work. His projects demonstrate strong technical expertise, clean code practices, and attention to user experience. He's received positive feedback and builds applications that handle complex real-world use cases.";
    }

    if (msg.includes("best project") || msg.includes("favorite project")) {
      return "That's tough to pick just one! Tushar is particularly proud of Docent AI for its technical complexity in solving 'knowledge cutoffs' and Caelivisio for its data visualization. Which one would you like to hear more about?";
    }

    // Docent AI specific responses
    if (msg.includes("docent") && !msg.includes("elaborate")) {
      return "Docent AI is a RAG-based documentation assistant built with Next.js 15 and Python (FastAPI). It eliminates 'knowledge cutoffs' by fetching live documentation URLs in real-time. It features a responsive 'Titanium' themed interface, local chat persistence, and uses Jotai for state management. Would you like me to elaborate on the technical implementation?";
    }

    // Caelivisio specific responses
    if (msg.includes("caelivisio") && !msg.includes("elaborate")) {
      return "Caelivisio is an astronomical dashboard that monitors Near-Earth Objects (NEOs) using NASA's API. It visualizes asteroid data, flags potentially hazardous objects, and provides accessible celestial information. Built with Next.js and efficient API routes. Would you like me to elaborate on the data visualization or NASA API integration?";
    }

    if (msg.includes("elaborate") || msg.includes("more about") || msg.includes("tell me more") || msg.includes("explain")) {
      if (msg.includes("docent") || msg.includes("ai")) {
        return "Docent AI is a technical powerhouse! It uses a RAG (Retrieval Augmented Generation) architecture to scrape and parse documentation on-demand, streaming up-to-date syntax context to the LLM. The frontend utilizes a 'Titanium' themed design with Framer Motion for a 'thinking' state visualization. It prioritizes privacy and performance by using IndexedDB for local chat persistence and Jotai for atomic global state management.";
      }
      if (msg.includes("caelivisio")) {
        return "Caelivisio integrates with NASA's NeoWs API to fetch real-time asteroid data. It processes velocity, diameter, and miss distance information to classify potentially hazardous objects using NASA's collision probability algorithms. The visualization uses D3.js-inspired charts with a space-themed dark mode interface. It includes features like date range filtering, search functionality, and detailed object information displays.";
      }
    }

    if (msg.includes("github") || msg.includes("linkedin") || msg.includes("leetcode") || msg.includes("social") || msg.includes("profiles")) {
      return "You can find Tushar on: GitHub (tushar-404), LinkedIn (Tushar Kumar Singh), LeetCode (QuantumFlash - 150+ problems solved), and Codeforces (flash_vortex_12 - Rating 848).";
    }

    if (msg.includes("coding") || msg.includes("competitive") || msg.includes("contest")) {
      return "Tushar is quite active in competitive programming! He is an active participant on Codeforces (Handle: flash_vortex_12, Max Rating: 893) and has solved over 150 problems on LeetCode (Handle: QuantumFlash). He enjoys algorithmic challenges and regularly participates in coding contests to keep his problem-solving skills sharp.";
    }

    if (msg.includes("how are you") || msg.includes("how are u") || (msg.includes("how") && msg.includes("are"))) {
      return "Thanks for asking, I'm fine. You need help with something?";
    }

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("greetings")) {
      const greetings = [
        "Hello! I'm flash Assistant. I can tell you about Tushar's background, skills, projects, or help you get in touch with him. What would you like to know?",
        "Hi there! Welcome to Tushar's portfolio. I'm here to help you learn about his work and connect with him. What interests you most?",
        "Hey! Great to see you're checking out Tushar's portfolio. I can share details about his projects, skills, experience, or help you reach out. What's on your mind?",
        "Greetings! I'm Tushar's AI assistant. Whether you want to know about his projects, skills, or get in touch, I'm here to help. What would you like to explore?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (msg.includes("haha") || msg.includes("hahaha") || msg.includes("hehe") || msg.includes("hehehe")) {
      const hahaResponses = [
        "What else would you like to know about Tushar?",
        "Ask me anything about Tushar's work or projects.",
        "Want to know more about his skills or projects?",
        "What's next on your mind?"
      ];
      return hahaResponses[Math.floor(Math.random() * hahaResponses.length)];
    }

    if (msg.includes("lol") || msg.includes("lmao") || msg.includes("rofl")) {
      const lolResponses = [
        "Anything else you'd like to ask?",
        "Want to know more about Tushar's projects?",
        "What else can I tell you about?",
        "Have any questions about Tushar's work or experience?"
      ];
      return lolResponses[Math.floor(Math.random() * lolResponses.length)];
    }

    if (msg.includes("dude") || msg.includes("bro") || msg.includes("man")) {
      const dudeResponses = [
        "What would you like to know about Tushar?",
        "Ask me anything about Tushar's projects or skills.",
        "What interests you most?",
        "What do you want to know?"
      ];
      return dudeResponses[Math.floor(Math.random() * dudeResponses.length)];
    }

    if (msg.includes("cool") || msg.includes("nice") || msg.includes("awesome") || msg.includes("sick")) {
      const coolResponses = [
        "Want to know more about Tushar's projects or skills?",
        "I can tell you about Tushar's work. What interests you?",
        "Ask me anything about Tushar's portfolio or experience.",
        "What would you like to explore about his work?"
      ];
      return coolResponses[Math.floor(Math.random() * coolResponses.length)];
    }

    if (msg.includes("thank") || msg.includes("thanks") || msg.includes("appreciate")) {
      const thanks = [
        "You're welcome! Feel free to ask me anything else about Tushar or his work.",
        "Happy to help! Don't hesitate to ask if you have more questions about Tushar's portfolio.",
        "My pleasure! Tushar would love to hear from you if you're interested in his work.",
        "Glad I could help! Feel free to explore more or ask about anything else."
      ];
      return thanks[Math.floor(Math.random() * thanks.length)];
    }

    if (msg.includes("what can you") || msg.includes("help me") || msg.includes("what do you")) {
      return "I can tell you all about Tushar! Ask me about his background, skills, experience, projects, or how to get in touch with him. I know details about his projects like Docent AI and Caelivisio. What would you like to know?";
    }

    if (msg.includes("where") && (msg.includes("tushar") || msg.includes("live") || msg.includes("located"))) {
      return "Tushar is based in India and works remotely. He's available for remote work opportunities and international collaborations. He's currently open to work and excited about new opportunities!";
    }

    if (msg.includes("remote") || msg.includes("location") || msg.includes("timezone")) {
      return "Tushar works remotely and is comfortable with different time zones. He's based in India (IST timezone) but has experience collaborating with international teams across various time zones.";
    }

    if (msg.includes("learn") || msg.includes("learning") || msg.includes("improve") || msg.includes("grow")) {
      return "Tushar is passionate about continuous learning! He's always exploring new technologies and frameworks. Currently, he's deepening his knowledge in AI/ML integration (like RAG), Web3 technologies, and advanced frontend patterns. He's also an avid competitive programmer.";
    }

    if (msg.includes("work style") || msg.includes("how does he work") || msg.includes("collaboration")) {
      return "Tushar thrives in collaborative environments and enjoys working with cross-functional teams. He values clear communication, clean code practices, and iterative development. He's adaptable and enjoys both independent work and team collaboration.";
    }

    if (msg.includes("interest") || msg.includes("hobby") || msg.includes("outside work")) {
      return "Outside of coding, Tushar enjoys reading about technology and exploring new programming paradigms. He also enjoys problem-solving challenges and occasionally contributes to open-source projects.";
    }

    return "Sorry, I can't help with that. Do you have anything else in mind?";
  };

  const handleEmailSubmit = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      addMessage(`At the moment, your contact info seems to not work. Please check your email format and try again.`, "bot");
      return;
    }

    setCollectedEmail(email);
    setIsCollectingEmail(false);
    setIsCollectingExplanation(true);
    addMessage(`Great! I've noted your email: ${email}. Can you please explain the motive behind meeting? A little bit of explanation would be nice too!`, "bot");
  };

  const handleExplanationSubmit = async (explanation: string) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: collectedEmail,
          message: explanation || 'User wants to connect from portfolio chatbot',
          explanation: explanation
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType);
        const text = await response.text();
        console.error('Response text:', text);
        addMessage(`Something went wrong.`, "bot");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setIsCollectingExplanation(false);
        setCollectedEmail("");
        addMessage(`Email sent, Tushar will contact you soon.`, "bot");
      } else {
        addMessage(`Something went wrong.`, "bot");
      }
    } catch (error) {
      console.error('Error submitting explanation:', error);
      addMessage(`Something went wrong.`, "bot");
    }
  };

  if (isFullScreen) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpen && (showContactTooltip ? (
          <motion.div
            key="contact-tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 z-50 bg-[#4D2D9A] text-white px-4 py-3 rounded-lg shadow-lg max-w-xs cursor-pointer hover:bg-[#3D1F8A] transition-colors"
            onClick={handleContactTooltipClick}
          >
            <div className="text-sm font-medium">Looking for email? Click here</div>
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-[#4D2D9A]"></div>
          </motion.div>
        ) : showWelcomeTooltip && (
          <motion.div
            key="welcome-tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 z-50 bg-[#4D2D9A] text-white px-4 py-3 rounded-lg shadow-lg max-w-xs"
          >
            <div className="text-sm font-medium mb-1">Hey, welcome to my website!</div>
            <div className="text-xs opacity-90">I'm Tushar, a software engineer.</div>
            <div className="text-xs opacity-90 mt-1">Ask about me or contact me! ↓</div>
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-[#4D2D9A]"></div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-2 right-2 z-50 bg-[#4D2D9A] hover:bg-[#3D1F8A] text-white p-4 rounded-full shadow-lg transition-colors"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#4D2D9A] text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle size={20} />
                <span className="font-medium">flash Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div 
              ref={messagesContainerRef}
              onMouseEnter={handleMouseEnter}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Hi! I'm here to help you learn about Tushar and his work.</p>
                  <p className="text-xs mt-2">Ask me anything about his skills, projects, or how to get in touch!</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.sender === "user"
                        ? "bg-[#4D2D9A] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {isCollectingEmail && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4D2D9A]"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleEmailSubmit((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                      if (emailInput?.value) {
                        handleEmailSubmit(emailInput.value);
                      }
                    }}
                    className="bg-[#4D2D9A] text-white p-2 rounded-md hover:bg-[#3D1F8A] transition-colors"
                  >
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            )}

            {isCollectingExplanation && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Tell us why you'd like to connect..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4D2D9A]"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleExplanationSubmit(inputValue);
                        setInputValue("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (inputValue.trim()) {
                        handleExplanationSubmit(inputValue);
                        setInputValue("");
                      }
                    }}
                    className="bg-[#4D2D9A] text-white p-2 rounded-md hover:bg-[#3D1F8A] transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {!isCollectingEmail && !isCollectingExplanation && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about Tushar's work..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4D2D9A]"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-[#4D2D9A] text-white p-2 rounded-md hover:bg-[#3D1F8A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};