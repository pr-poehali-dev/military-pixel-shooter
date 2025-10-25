import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';
import { Badge } from '@/components/ui/badge';

interface FriendsProps {
  user: User;
  onBack: () => void;
}

const Friends = ({ user, onBack }: FriendsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    loadFriendsData();
  }, [user]);

  const loadFriendsData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const friendsList = users.filter((u: User) => 
      user.friends?.includes(u.id)
    );
    setFriends(friendsList);

    const requestsList = users.filter((u: User) => 
      user.friendRequests?.includes(u.id)
    );
    setRequests(requestsList);
    setNotifications(requestsList.length);
  };

  const handleSendRequest = () => {
    if (!searchQuery) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const targetUser = users.find((u: User) => 
      u.id === searchQuery || u.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (!targetUser) {
      alert('Игрок не найден');
      return;
    }

    if (targetUser.id === user.id) {
      alert('Нельзя добавить самого себя');
      return;
    }

    if (user.friends?.includes(targetUser.id)) {
      alert('Уже в друзьях');
      return;
    }

    if (!targetUser.friendRequests) {
      targetUser.friendRequests = [];
    }

    if (targetUser.friendRequests.includes(user.id)) {
      alert('Заявка уже отправлена');
      return;
    }

    targetUser.friendRequests.push(user.id);
    
    const userIndex = users.findIndex((u: User) => u.id === targetUser.id);
    users[userIndex] = targetUser;
    localStorage.setItem('users', JSON.stringify(users));

    alert(`Заявка отправлена игроку ${targetUser.name}`);
    setSearchQuery('');
  };

  const handleAcceptRequest = (requesterId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const currentUserIndex = users.findIndex((u: User) => u.id === user.id);
    const requesterIndex = users.findIndex((u: User) => u.id === requesterId);

    if (currentUserIndex === -1 || requesterIndex === -1) return;

    if (!users[currentUserIndex].friends) users[currentUserIndex].friends = [];
    if (!users[requesterIndex].friends) users[requesterIndex].friends = [];

    users[currentUserIndex].friends.push(requesterId);
    users[requesterIndex].friends.push(user.id);

    users[currentUserIndex].friendRequests = users[currentUserIndex].friendRequests?.filter(
      (id: string) => id !== requesterId
    ) || [];

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[currentUserIndex]));

    loadFriendsData();
    alert('Заявка принята!');
  };

  const handleDeclineRequest = (requesterId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUserIndex = users.findIndex((u: User) => u.id === user.id);

    if (currentUserIndex === -1) return;

    users[currentUserIndex].friendRequests = users[currentUserIndex].friendRequests?.filter(
      (id: string) => id !== requesterId
    ) || [];

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users[currentUserIndex]));

    loadFriendsData();
  };

  const inviteToBattle = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend?.isOnline) {
      alert(`Приглашение отправлено игроку ${friend.name}`);
    } else {
      alert('Игрок не в сети');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button onClick={onBack} variant="outline" className="border-military-gray/30">
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>
          {notifications > 0 && (
            <Badge className="bg-military-accent text-white">
              {notifications} новых заявок
            </Badge>
          )}
        </div>

        <Card className="p-6 bg-card border-military-gray/30 mb-4">
          <h2 className="text-2xl font-oswald font-bold mb-4 text-foreground">Найти друга</h2>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите ID или имя игрока..."
              className="bg-background border-military-gray/50"
            />
            <Button 
              onClick={handleSendRequest}
              className="bg-military-accent hover:bg-military-accent/90"
            >
              <Icon name="UserPlus" size={20} />
            </Button>
          </div>
        </Card>

        {requests.length > 0 && (
          <Card className="p-6 bg-card border-military-accent/50 mb-4">
            <h2 className="text-xl font-oswald font-bold mb-4 text-foreground">
              Заявки в друзья ({requests.length})
            </h2>
            <div className="space-y-3">
              {requests.map((request) => (
                <div 
                  key={request.id}
                  className="bg-background p-4 rounded-lg border border-military-gray/30 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{request.name}</p>
                    <p className="text-sm text-military-gray">ID: {request.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAcceptRequest(request.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Принять
                    </Button>
                    <Button 
                      onClick={() => handleDeclineRequest(request.id)}
                      size="sm"
                      variant="outline"
                      className="border-military-gray/30"
                    >
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 bg-card border-military-gray/30">
          <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">
            Друзья ({friends.length})
          </h2>
          
          {friends.length === 0 ? (
            <div className="text-center py-12 text-military-gray">
              <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Пока что нет друзей</p>
              <p className="text-sm mt-2">Найди друга по ID или имени</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div 
                  key={friend.id}
                  className="bg-background p-4 rounded-lg border border-military-gray/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Icon name="User" size={32} className="text-military-accent" />
                      {friend.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{friend.name}</p>
                      <p className="text-sm text-military-gray">ID: {friend.id}</p>
                      <p className="text-xs text-military-gray">
                        {friend.isOnline ? 'В сети' : 'Не в сети'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => inviteToBattle(friend.id)}
                    size="sm"
                    className="bg-military-accent hover:bg-military-accent/90"
                    disabled={!friend.isOnline}
                  >
                    <Icon name="Swords" size={16} className="mr-1" />
                    Позвать в бой
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Friends;