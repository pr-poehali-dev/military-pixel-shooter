import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface MainMenuProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const MainMenu = ({ user, onNavigate }: MainMenuProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    const playAudio = () => {
      audioRef.current?.play().catch(() => {});
    };

    playAudio();
    document.addEventListener('click', playAudio, { once: true });

    return () => {
      audioRef.current?.pause();
    };
  }, []);
  const menuItems = [
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'friends', label: 'Друзья', icon: 'Users' },
    { id: 'arsenal', label: 'Оружие', icon: 'Sword' },
    { id: 'multiplayer', label: 'Мультиплеер', icon: 'Wifi' },
    { id: 'shop', label: 'Магазин', icon: 'ShoppingCart' },
    { id: 'game', label: 'Играть', icon: 'Gamepad2' },
    { id: 'chat', label: 'Чат', icon: 'MessageSquare' },
  ];

  if (user.isAdmin) {
    menuItems.push({ id: 'admin', label: 'Админ меню', icon: 'Shield' });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-military-dark to-military-darker">
      <div className="absolute top-4 left-4">
        <div className="text-3xl font-oswald font-bold text-military-accent tracking-wider">
          WZ
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-military-gray">ID: {user.id}</p>
        </div>
      </div>

      <Card className="w-full max-w-2xl p-8 bg-card/80 backdrop-blur border-military-gray/30">
        <h1 className="text-4xl font-oswald font-bold text-center mb-8 text-military-accent">
          WARZONE
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="h-24 flex flex-col items-center justify-center gap-2 bg-background hover:bg-military-accent/20 border border-military-gray/30 text-foreground hover:text-military-accent transition-all"
              variant="outline"
            >
              <Icon name={item.icon as any} size={28} />
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-military-gray">
          <p>🎮 2D Пиксельный военный шутер</p>
        </div>
      </Card>
    </div>
  );
};

export default MainMenu;