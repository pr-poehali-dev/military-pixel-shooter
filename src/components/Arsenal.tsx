import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface ArsenalProps {
  user: User;
  onBack: () => void;
}

const Arsenal = ({ user, onBack }: ArsenalProps) => {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="border-military-gray/30">
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>
        </div>

        <Card className="p-6 bg-card border-military-gray/30 mb-4">
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Оружие</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {user.weapons.map((weapon) => (
              <div key={weapon} className="bg-background p-4 rounded-lg border border-military-gray/30">
                <Icon name="Sword" size={32} className="mb-2 text-military-accent" />
                <p className="font-medium text-foreground">{weapon}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-military-gray/30 mb-4">
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Танки</h2>
          {user.tanks.length === 0 ? (
            <p className="text-military-gray text-center py-8">Нет танков</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.tanks.map((tank) => (
                <div key={tank} className="bg-background p-4 rounded-lg border border-military-gray/30">
                  <p className="font-medium text-foreground">{tank}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-card border-military-gray/30">
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Машины</h2>
          {user.vehicles.length === 0 ? (
            <p className="text-military-gray text-center py-8">Нет машин</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.vehicles.map((vehicle) => (
                <div key={vehicle} className="bg-background p-4 rounded-lg border border-military-gray/30">
                  <p className="font-medium text-foreground">{vehicle}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Arsenal;
