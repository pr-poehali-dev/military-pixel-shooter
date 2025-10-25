import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');

  const handleGiveMoney = () => {
    if (!targetId || !amount) {
      alert('Заполните все поля');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === targetId || u.name === targetId);

    if (userIndex === -1) {
      alert('Пользователь не найден');
      return;
    }

    users[userIndex].balance += parseInt(amount);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert(`Выдано ${amount} ₽ пользователю ${users[userIndex].name}`);
    setTargetId('');
    setAmount('');
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

        <Card className="p-6 bg-card border-military-accent/50">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Shield" size={32} className="text-military-accent" />
            <h2 className="text-2xl font-oswald font-bold text-foreground">Админ панель</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                ID или имя игрока
              </label>
              <Input
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Введите ID или никнейм"
                className="bg-background border-military-gray/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Сумма
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                className="bg-background border-military-gray/50"
              />
            </div>

            <Button 
              onClick={handleGiveMoney}
              className="w-full bg-military-accent hover:bg-military-accent/90"
            >
              Выдать баланс
            </Button>
          </div>

          <div className="mt-6 p-4 bg-military-accent/10 border border-military-accent/30 rounded-lg">
            <p className="text-sm text-military-gray">
              💡 Админ-панель доступна только пользователям с ID: dev
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
