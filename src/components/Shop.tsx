import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface ShopProps {
  user: User;
  updateUser: (user: User) => void;
  onBack: () => void;
}

const Shop = ({ user, updateUser, onBack }: ShopProps) => {
  const shopItems = [
    { type: 'weapons', name: 'M4A1', price: 2500, icon: 'Sword' },
    { type: 'weapons', name: 'AWP', price: 4750, icon: 'Sword' },
    { type: 'tanks', name: 'T-72', price: 15000, icon: 'Truck' },
    { type: 'tanks', name: 'Абрамс', price: 25000, icon: 'Truck' },
    { type: 'vehicles', name: 'УАЗ', price: 5000, icon: 'Car' },
    { type: 'vehicles', name: 'Хаммер', price: 8500, icon: 'Car' },
  ];

  const handlePurchase = (item: any) => {
    if (user.balance < item.price) {
      alert('Недостаточно средств');
      return;
    }

    const itemArray = user[item.type as keyof User] as string[];
    if (itemArray.includes(item.name)) {
      alert('У вас уже есть этот предмет');
      return;
    }

    const updatedUser = {
      ...user,
      balance: user.balance - item.price,
      [item.type]: [...itemArray, item.name],
    };

    updateUser(updatedUser);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button onClick={onBack} variant="outline" className="border-military-gray/30">
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>
          <div className="text-right">
            <p className="text-sm text-military-gray">Баланс</p>
            <p className="text-xl font-bold text-foreground">{user.balance} ₽</p>
          </div>
        </div>

        <Card className="p-6 bg-card border-military-gray/30">
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Магазин</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shopItems.map((item) => {
              const owned = (user[item.type as keyof User] as string[]).includes(item.name);
              
              return (
                <div 
                  key={item.name} 
                  className="bg-background p-4 rounded-lg border border-military-gray/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Icon name={item.icon as any} size={32} className="text-military-accent" />
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-military-gray">{item.price} ₽</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={owned}
                    className={owned ? 'bg-military-gray/30' : 'bg-military-accent hover:bg-military-accent/90'}
                  >
                    {owned ? 'Куплено' : 'Купить'}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Shop;
