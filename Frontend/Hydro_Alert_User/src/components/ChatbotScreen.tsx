import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

type Language = 'en' | 'fil';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotScreenProps {
  language: Language;
}

export default function ChatbotScreen({ language }: ChatbotScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      title: 'AI Assistant',
      subtitle: 'Ask me about flood alerts, safety tips, and emergency protocols',
      placeholder: 'Ask a question...',
      send: 'Send',
      typing: 'AI is typing...',
      quickQuestions: 'Quick Questions',
      suggestions: [
        'What does Orange Rainfall Warning mean?',
        'What should I pack in an emergency kit?',
        'How do I prepare for evacuation?',
        'What are the flood alert levels?'
      ],
      welcome: 'Hello! I\'m here to help translate flood warnings and provide safety guidance. What would you like to know?'
    },
    fil: {
      title: 'AI Assistant',
      subtitle: 'Magtanong tungkol sa flood alerts, safety tips, at emergency protocols',
      placeholder: 'Magtanong...',
      send: 'Ipadala',
      typing: 'Nagsusulat ang AI...',
      quickQuestions: 'Mabilis na Tanong',
      suggestions: [
        'Ano ang ibig sabihin ng Orange Rainfall Warning?',
        'Ano ang dapat ilagay sa emergency kit?',
        'Paano maghanda para sa evacuation?',
        'Ano ang mga antas ng flood alert?'
      ],
      welcome: 'Kumusta! Nandito ako para tulungan kayong maintindihan ang mga flood warnings at magbigay ng safety guidance. Ano ang gusto ninyong malaman?'
    }
  };

  const t = content[language];

  // Simulated AI responses
  const getAIResponse = (question: string): string => {
    const responses = {
      en: {
        orange: 'An Orange Rainfall Warning means heavy rainfall (15-30mm within one hour) is expected. This indicates potential flooding in flood-prone areas. You should: monitor updates closely, prepare your emergency kit, and be ready to evacuate if water levels rise.',
        kit: 'Your emergency kit should include: water (3 liters per person), ready-to-eat food for 3 days, first aid supplies, flashlight with batteries, portable radio, important documents in waterproof bag, cash, medications, hygiene items, and phone charger/power bank.',
        prepare: 'To prepare for evacuation: 1) Pack your emergency kit, 2) Wear appropriate clothing and footwear, 3) Turn off electricity and gas, 4) Secure your home, 5) Bring important documents, 6) Keep your phone charged, 7) Follow the safe route shown in the app, 8) Stay with your family.',
        levels: 'Flood alert levels: GREEN (Safe) - No immediate risk. YELLOW (Monitoring) - Low risk, stay alert. ORANGE (Warning) - Prepare to evacuate, water rising. RED (Danger) - Evacuate immediately, severe flooding.',
        default: 'I can help you understand flood warnings from PAGASA, provide safety tips, and guide you through emergency procedures. Try asking about rainfall warnings, evacuation preparation, or emergency kits.'
      },
      fil: {
        orange: 'Ang Orange Rainfall Warning ay nangangahulugang malakas na ulan (15-30mm sa loob ng isang oras) ang inaasahan. Ito ay nagpapahiwatig ng posibleng pagbaha sa mga lugar na madaling bahain. Dapat kayong: subaybayan ang mga update, ihanda ang emergency kit, at maghanda na lumikas kung tataas ang tubig.',
        kit: 'Ang inyong emergency kit ay dapat maglaman ng: tubig (3 litro bawat tao), pagkain para sa 3 araw, first aid supplies, flashlight na may baterya, portable radio, mahalagang dokumento sa waterproof bag, pera, gamot, hygiene items, at phone charger/power bank.',
        prepare: 'Upang maghanda sa evacuation: 1) Ilagay ang emergency kit, 2) Magsuot ng tamang damit at sapatos, 3) Patayin ang kuryente at gas, 4) Siguruhing nakalock ang bahay, 5) Dalhin ang mahalagang dokumento, 6) Siguruhing charged ang phone, 7) Sundin ang ligtas na ruta sa app, 8) Manatili kasama ng pamilya.',
        levels: 'Mga antas ng flood alert: GREEN (Ligtas) - Walang panganib. YELLOW (Bantayan) - Mababang panganib, manatiling alerto. ORANGE (Babala) - Maghanda sa pag-evacuate, tumataas ang tubig. RED (Panganib) - Lumikas na ngayon, malubhang pagbaha.',
        default: 'Matutulungan ko kayong maintindihan ang mga flood warnings mula sa PAGASA, magbigay ng safety tips, at gabayan kayo sa emergency procedures. Subukang magtanong tungkol sa rainfall warnings, paghahanda sa evacuation, o emergency kits.'
      }
    };

    const lang = language;
    const q = question.toLowerCase();

    if (q.includes('orange') || q.includes('warning') || q.includes('rainfall')) {
      return responses[lang].orange;
    } else if (q.includes('kit') || q.includes('pack')) {
      return responses[lang].kit;
    } else if (q.includes('prepare') || q.includes('evacua')) {
      return responses[lang].prepare;
    } else if (q.includes('level') || q.includes('alert') || q.includes('antas')) {
      return responses[lang].levels;
    } else {
      return responses[lang].default;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message on mount
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: t.welcome,
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(textToSend),
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl">{t.title}</h1>
            <p className="text-xs text-blue-100">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-4 bg-white border-b">
          <p className="text-sm text-gray-600 mb-3">{t.quickQuestions}</p>
          <div className="space-y-2">
            {t.suggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => handleSend(suggestion)}
              >
                <span className="text-sm">{suggestion}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <div
              className={`flex-1 max-w-[80%] ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <Card
                className={`${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white'
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </CardContent>
              </Card>
              <p className="text-xs text-gray-400 mt-1 px-1">
                {message.timestamp.toLocaleTimeString(language === 'fil' ? 'fil-PH' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <Card className="bg-white">
              <CardContent className="p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
