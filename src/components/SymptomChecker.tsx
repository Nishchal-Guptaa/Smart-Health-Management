"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ChatMessage {
  id: number;
  type: "user" | "bot";
  message: string;
  timestamp: string;
}

const SymptomChecker = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 1,
    type: "bot",
    message:
      "Hello! I'm your AI health assistant. I can help you understand your symptoms and provide preliminary guidance. Please describe what you're experiencing.",
    timestamp: "Just now",
  }]);

  const [inputMessage, setInputMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const urgencyLevels = [
    {
      level: "Emergency",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      icon: AlertTriangle,
      description: "Seek immediate medical attention",
    },
    {
      level: "Urgent",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      icon: Clock,
      description: "Schedule appointment within 24 hours",
    },
    {
      level: "Routine",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      icon: CheckCircle,
      description: "Schedule routine check-up",
    },
  ];

  const recommendedTests = [
    { name: "Complete Blood Count (CBC)", price: "$45" },
    { name: "Basic Metabolic Panel", price: "$35" },
    { name: "Lipid Panel", price: "$55" },
    { name: "Chest X-Ray", price: "$120" },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: ChatMessage = {
      id: messages.length + 1,
      type: "user",
      message: inputMessage,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: inputMessage }),
      });

      const data = await response.json();

      const botResponse: ChatMessage = {
        id: messages.length + 2,
        type: "bot",
        message:
          data.response ||
          data.message ||
          "I'm having trouble responding right now.",
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, botResponse]);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error talking to backend:", error);
      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        type: "bot",
        message:
          "There was a problem reaching the assistant. Please try again later.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Symptom Checker</h1>
            <p className="text-gray-600 mt-2">
              Get preliminary diagnosis and health guidance from our AI assistant
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex items-center space-x-2"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Health Assistant Chat</span>
                </CardTitle>
                <CardDescription>
                  Describe your symptoms and I’ll help assess your condition.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <div
                    className="h-[450px] overflow-y-auto pr-2 space-y-4"
                    ref={scrollContainerRef}
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p>{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.type === "user"
                                ? "text-blue-200"
                                : "text-gray-500"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 items-end mt-2">
                  <textarea
                    placeholder="Describe your symptoms..."
                    value={inputMessage}
                    rows={2}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="medical-gradient text-white h-10"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep > 2 ? (
                  <div className="space-y-3">
                    {urgencyLevels.map((level, index) => (
                      <div
                        key={level.level}
                        className={`p-3 rounded-lg ${level.bgColor} ${
                          index === 2 ? "ring-2 ring-green-300" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <level.icon className={`w-4 h-4 ${level.textColor}`} />
                          <span className={`font-medium ${level.textColor}`}>
                            {level.level}
                          </span>
                          {index === 2 && (
                            <Badge className="bg-green-600 text-white">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {level.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Continue chatting to receive your assessment</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {currentStep > 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Tests</CardTitle>
                  <CardDescription>
                    Based on your symptoms, these tests might be helpful
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendedTests.map((test, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{test.name}</h4>
                          <Badge variant="outline">{test.price}</Badge>
                        </div>
                        <Button size="sm" className="w-full" variant="outline">
                          Book Test
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  🎉 Emergency Services
                </Button>
                <Button className="w-full" variant="outline">
                  🗓 Book Appointment
                </Button>
                <Button className="w-full" variant="outline">
                  🏥 Find Nearby Hospitals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
