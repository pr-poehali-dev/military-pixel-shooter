import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface ChatProps {
  user: User;
  onBack: () => void;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

const Chat = ({ user, onBack }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    setMessages(storedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      text: messageText,
      timestamp: Date.now(),
    };

    const storedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const updatedMessages = [...storedMessages, newMessage];
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    setMessages(updatedMessages);
    setMessageText('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="border-military-gray/30">
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>
        </div>

        <Card className="p-6 bg-card border-military-gray/30 h-[600px] flex flex-col">
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Общий чат</h2>
          
          <div className="flex-1 bg-background rounded-lg p-4 mb-4 overflow-y-auto border border-military-gray/30">
            {messages.length === 0 ? (
              <div className="text-center text-military-gray py-12">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет сообщений</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      msg.userId === user.id 
                        ? 'bg-military-accent text-white' 
                        : 'bg-military-gray/20 text-foreground'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">
                          {msg.userName}
                          {msg.userId === 'dev' && ' 🛡️'}
                        </span>
                        <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-sm break-words">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Введите сообщение..."
              className="bg-background border-military-gray/50"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-military-accent hover:bg-military-accent/90"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;