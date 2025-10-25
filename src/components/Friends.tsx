import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface FriendsProps {
  user: User;
  onBack: () => void;
}

const Friends = ({ user, onBack }: FriendsProps) => {
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
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Друзья</h2>
          
          <div className="text-center py-12 text-military-gray">
            <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Пока что нет друзей</p>
            <p className="text-sm mt-2">Найди друга по ID или имени</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Friends;
