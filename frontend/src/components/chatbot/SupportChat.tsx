import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

// Định nghĩa kiểu Product từ API
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  href: string;
}

// Định nghĩa kiểu cho ChatMessage
interface ChatMessage {
  role: string;
  content: string;
  products?: Product[];
}

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Xin chào! 🐾 Rất vui được gặp bạn! Bạn đang tìm gì cho thú cưng của mình hôm nay?",
    },
  ]);

  const suggestions = [
    "Tìm phụ kiện cho mèo 🐱",
    "Tôi cần tư vấn sản phẩm 🎁",
    "Chỉ xem qua thôi 👀",
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null); // Tham chiếu tới cuối danh sách tin nhắn

  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Cuộn xuống sau khi chatHistory thay đổi
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: message };
    setChatHistory([...chatHistory, userMessage]);
    setIsLoading(true);

    const userId = "user456"; // Nên lấy từ hệ thống xác thực (auth context, token, etc.)

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        messages: [message],
        sessionId: sessionId || undefined,
        userId: userId || undefined,
      });

      if (response.data.sessionId) {
        setSessionId(response.data.sessionId);
        localStorage.setItem("chatSessionId", response.data.sessionId);
      }

      const botReply: ChatMessage = {
        role: "bot",
        content: response.data.message || "Mình chưa hiểu rõ, bạn có thể nói thêm không?",
        products: response.data.products || [],
      };

      setChatHistory([...chatHistory, userMessage, botReply]);
      setMessage("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi gọi API chatbot:", error);
        const errorReply: ChatMessage = {
          role: "bot",
          content: `Có lỗi xảy ra: ${error.response?.data?.error || error.message}. Vui lòng thử lại sau.`,
        };
        setChatHistory([...chatHistory, userMessage, errorReply]);
      } else {
        console.error("Lỗi không xác định:", error);
        const errorReply: ChatMessage = {
          role: "bot",
          content: "Có lỗi không xác định xảy ra. Vui lòng thử lại sau.",
        };
        setChatHistory([...chatHistory, userMessage, errorReply]);
      }
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-2xl">💬</span> Hỗ trợ
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[28rem] bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-5 border-b border-blue-200 pb-3">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-blue-600">🐾</span> PetShop ChatBot
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xl"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="h-80 overflow-y-auto bg-white p-4 rounded-lg shadow-inner mb-5 space-y-3">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  chat.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-xl whitespace-pre-wrap ${
                    chat.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  } max-w-[80%] shadow-md`}
                >
                  <span>{chat.content}</span>
                  {chat.products && chat.products.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {chat.products.slice(0, 3).map((product: Product, idx: number) => {
                        const safeHref = product.href || `/products/${product.id}`;
                        const safeImage = product.image || "/images/default-product.png";

                        return (
                          <Link
                            key={idx}
                            href={safeHref}
                            passHref
                            legacyBehavior
                          >
                            <a className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                              <Image
                                src={safeImage}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-md"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/default-product.png";
                                }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Thương hiệu: {product.brand}
                                </p>
                                <p className="text-sm font-semibold text-blue-600">
                                  {product.price.toLocaleString()} VND
                                </p>
                              </div>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Thêm tham chiếu để cuộn tới đây */}
            {chatHistory.length === 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all duration-200 text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="text-center text-gray-500 animate-pulse">Đang xử lý...</div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400 text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Viết tin nhắn..."
            />
            <button
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              ➤
            </button>
          </div>

          <div className="text-center text-gray-500 text-xs mt-3">
            Được hỗ trợ bởi <span className="text-blue-600 font-medium">PetShop ChatBot</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChat;