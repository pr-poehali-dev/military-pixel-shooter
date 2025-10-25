import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User } from '@/pages/Index';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const generateId = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (isLogin) {
      const user = users.find((u: User) => 
        (u.email === email || (email === 'plutka' && u.id === 'dev')) && u.password === password
      );

      if (user) {
        onLogin(user);
      } else {
        alert('Неверный логин или пароль');
      }
    } else {
      const existingUser = users.find((u: User) => u.email === email);
      if (existingUser) {
        alert('Пользователь с таким email уже существует');
        return;
      }

      const newUser: User = {
        email,
        name,
        password,
        id: generateId(),
        balance: 1000,
        donatBalance: 0,
        status: 'Новобранец',
        missionsCompleted: 0,
        isAdmin: false,
        weapons: ['AK-47'],
        tanks: [],
        vehicles: [],
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-military-dark to-military-darker p-4">
      <Card className="w-full max-w-md p-8 bg-card border-military-gray/30">
        <div className="flex items-center justify-center mb-8">
          <div className="text-4xl font-oswald font-bold text-military-accent tracking-wider">
            WZ
          </div>
        </div>
        
        <h2 className="text-2xl font-oswald font-semibold text-center mb-6 text-foreground">
          {isLogin ? 'Вход в игру' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Имя</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background border-military-gray/50"
                placeholder="Введите имя"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-military-gray/50"
              placeholder="Введите email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background border-military-gray/50"
              placeholder="Введите пароль"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-military-accent hover:bg-military-accent/90 text-white font-semibold"
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-military-gray hover:text-foreground transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
