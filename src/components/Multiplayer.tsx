import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface MultiplayerProps {
  user: User;
  onBack: () => void;
}

interface Lobby {
  id: string;
  hostId: string;
  hostName: string;
  players: string[];
  maxPlayers: number;
  status: 'waiting' | 'full' | 'playing';
}

const Multiplayer = ({ user, onBack }: MultiplayerProps) => {
  const [view, setView] = useState<'menu' | 'search' | 'create' | 'invite'>('menu');
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [inviteId, setInviteId] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadLobbies();
  }, [view]);

  const loadLobbies = () => {
    const storedLobbies = JSON.parse(localStorage.getItem('multiplayerLobbies') || '[]');
    setLobbies(storedLobbies);
  };

  const handleSearchGame = () => {
    setSearching(true);
    setView('search');
    
    setTimeout(() => {
      const availableLobby = lobbies.find(l => l.status === 'waiting' && l.players.length < l.maxPlayers);
      
      if (availableLobby) {
        alert(`Игра найдена! Присоединяйтесь к лобби ${availableLobby.hostName}`);
      } else {
        alert('Игроки не найдены. Создайте своё лобби!');
      }
      setSearching(false);
    }, 2000);
  };

  const handleCreateLobby = () => {
    const newLobby: Lobby = {
      id: Date.now().toString(),
      hostId: user.id,
      hostName: user.name,
      players: [user.id],
      maxPlayers: 4,
      status: 'waiting',
    };

    const storedLobbies = JSON.parse(localStorage.getItem('multiplayerLobbies') || '[]');
    storedLobbies.push(newLobby);
    localStorage.setItem('multiplayerLobbies', JSON.stringify(storedLobbies));

    alert('Лобби создано! Ожидайте игроков...');
    setView('create');
    loadLobbies();
  };

  const handleInvitePlayer = () => {
    if (!inviteId) {
      alert('Введите ID или никнейм игрока');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const targetUser = users.find((u: User) => 
      u.id === inviteId || u.name.toLowerCase() === inviteId.toLowerCase()
    );

    if (!targetUser) {
      alert('Игрок не найден');
      return;
    }

    if (!targetUser.isOnline) {
      alert('Игрок не в сети');
      return;
    }

    alert(`Приглашение отправлено игроку ${targetUser.name}`);
    setInviteId('');
  };

  if (view === 'menu') {
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
              <Button 
                onClick={handleSearchGame}
                className="w-full h-16 bg-military-accent hover:bg-military-accent/90 text-lg"
              >
                <Icon name="Search" size={24} className="mr-2" />
                Найти игру 2 на 2
              </Button>

              <Button 
                onClick={handleCreateLobby}
                className="w-full h-16 bg-background hover:bg-military-accent/20 border border-military-gray/30 text-lg" 
                variant="outline"
              >
                <Icon name="Plus" size={24} className="mr-2" />
                Создать лобби
              </Button>

              <Button 
                onClick={() => setView('invite')}
                className="w-full h-16 bg-background hover:bg-military-accent/20 border border-military-gray/30 text-lg" 
                variant="outline"
              >
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
  }

  if (view === 'search') {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setView('menu')} variant="outline" className="border-military-gray/30">
              <Icon name="ArrowLeft" size={20} />
              <span className="ml-2">Назад</span>
            </Button>
          </div>

          <Card className="p-6 bg-card border-military-gray/30">
            <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Поиск игры...</h2>
            
            {searching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-military-accent border-t-transparent mx-auto mb-4"></div>
                <p className="text-military-gray">Поиск соперников...</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Users" size={48} className="mx-auto mb-4 text-military-gray opacity-50" />
                <p className="text-military-gray">Поиск завершён</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    const myLobby = lobbies.find(l => l.hostId === user.id);
    
    return (
      <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setView('menu')} variant="outline" className="border-military-gray/30">
              <Icon name="ArrowLeft" size={20} />
              <span className="ml-2">Закрыть лобби</span>
            </Button>
          </div>

          <Card className="p-6 bg-card border-military-gray/30">
            <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Ваше лобби</h2>
            
            {myLobby && (
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg border border-military-gray/30">
                  <p className="text-sm text-military-gray mb-2">Хост</p>
                  <p className="font-medium text-foreground">{myLobby.hostName}</p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-military-gray/30">
                  <p className="text-sm text-military-gray mb-2">Игроки</p>
                  <p className="font-medium text-foreground">{myLobby.players.length} / {myLobby.maxPlayers}</p>
                </div>

                <Button className="w-full bg-military-accent hover:bg-military-accent/90">
                  Начать игру
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'invite') {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setView('menu')} variant="outline" className="border-military-gray/30">
              <Icon name="ArrowLeft" size={20} />
              <span className="ml-2">Назад</span>
            </Button>
          </div>

          <Card className="p-6 bg-card border-military-gray/30">
            <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Пригласить игрока</h2>
            
            <div className="space-y-4">
              <Input
                value={inviteId}
                onChange={(e) => setInviteId(e.target.value)}
                placeholder="Введите ID или никнейм игрока..."
                className="bg-background border-military-gray/50"
              />

              <Button 
                onClick={handleInvitePlayer}
                className="w-full bg-military-accent hover:bg-military-accent/90"
              >
                Отправить приглашение
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default Multiplayer;