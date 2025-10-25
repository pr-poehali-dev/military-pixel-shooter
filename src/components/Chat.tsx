import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface ChatProps {
  user: User;
  onBack: () => void;
}

const Chat = ({ user, onBack }: ChatProps) => {
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
            <div className="text-center text-military-gray py-12">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет сообщений</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input 
              placeholder="Введите сообщение..."
              className="bg-background border-military-gray/50"
            />
            <Button className="bg-military-accent hover:bg-military-accent/90">
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
