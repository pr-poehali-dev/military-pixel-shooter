import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

const Profile = ({ user, onBack }: ProfileProps) => {
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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-military-accent/20 flex items-center justify-center border-2 border-military-accent">
              <Icon name="User" size={40} className="text-military-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-oswald font-bold text-foreground">{user.name}</h2>
              <p className="text-military-gray">ID: {user.id}</p>
              <p className="text-sm text-foreground mt-1">{user.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg border border-military-gray/30">
              <p className="text-sm text-military-gray mb-1">Баланс</p>
              <p className="text-2xl font-bold text-foreground">{user.balance} ₽</p>
            </div>

            <div className="bg-background p-4 rounded-lg border border-military-gray/30">
              <p className="text-sm text-military-gray mb-1">Донат баланс</p>
              <p className="text-2xl font-bold text-military-accent">{user.donatBalance} 💎</p>
            </div>
          </div>

          <div className="bg-background p-4 rounded-lg border border-military-gray/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-military-gray">Миссии пройдены</p>
              <p className="text-lg font-bold text-foreground">{user.missionsCompleted} / 6</p>
            </div>
            <div className="w-full bg-military-dark rounded-full h-2">
              <div 
                className="bg-military-accent h-2 rounded-full transition-all"
                style={{ width: `${(user.missionsCompleted / 6) * 100}%` }}
              />
            </div>
          </div>

          {user.missionsCompleted === 6 && (
            <div className="mt-4 p-4 bg-military-accent/10 border border-military-accent rounded-lg text-center">
              <p className="text-lg font-oswald font-semibold text-military-accent">
                Ветеран войны 🎖️
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
