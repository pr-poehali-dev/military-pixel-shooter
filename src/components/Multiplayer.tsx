import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface MultiplayerProps {
  user: User;
  onBack: () => void;
}

const Multiplayer = ({ user, onBack }: MultiplayerProps) => {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="border-military-gray/30">
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>
        </div>

        <Card className="p-6 bg-card border-military-gray/30">
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Мультиплеер</h2>
          
          <div className="space-y-4">
            <Button className="w-full h-16 bg-military-accent hover:bg-military-accent/90 text-lg">
              <Icon name="Search" size={24} className="mr-2" />
              Найти игру 2 на 2
            </Button>

            <Button className="w-full h-16 bg-background hover:bg-military-accent/20 border border-military-gray/30 text-lg" variant="outline">
              <Icon name="Plus" size={24} className="mr-2" />
              Создать лобби
            </Button>

            <Button className="w-full h-16 bg-background hover:bg-military-accent/20 border border-military-gray/30 text-lg" variant="outline">
              <Icon name="UserPlus" size={24} className="mr-2" />
              Пригласить по ID/нику
            </Button>
          </div>

          <div className="mt-8 text-center text-military-gray">
            <Icon name="Wifi" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm">Режим 2 на 2</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Multiplayer;
