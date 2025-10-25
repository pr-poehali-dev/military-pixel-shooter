import { useState, useEffect } from 'react';
import Auth from '@/components/Auth';
import MainMenu from '@/components/MainMenu';
import Profile from '@/components/Profile';
import Friends from '@/components/Friends';
import Arsenal from '@/components/Arsenal';
import Shop from '@/components/Shop';
import Multiplayer from '@/components/Multiplayer';
import Chat from '@/components/Chat';
import AdminPanel from '@/components/AdminPanel';
import Game from '@/components/Game';

export interface User {
  email: string;
  name: string;
  password: string;
  id: string;
  balance: number;
  donatBalance: number;
  status: string;
  missionsCompleted: number;
  isAdmin: boolean;
  weapons: string[];
  tanks: string[];
  vehicles: string[];
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('menu');

  useEffect(() => {
    const adminUser = {
      email: 'admin@wz.dev',
      name: 'plutka',
      password: 'user',
      id: 'dev',
      balance: 999999,
      donatBalance: 999,
      status: 'Администратор',
      missionsCompleted: 0,
      isAdmin: true,
      weapons: ['AK-47', 'M4A1', 'AWP'],
      tanks: ['T-72', 'Абрамс'],
      vehicles: ['УАЗ', 'Хаммер'],
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.find((u: User) => u.id === 'dev');
    
    if (!adminExists) {
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('menu');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('menu');
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-military-dark to-military-darker">
      {currentPage === 'menu' && (
        <MainMenu 
          user={currentUser} 
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'profile' && (
        <Profile 
          user={currentUser} 
          onBack={() => setCurrentPage('menu')}
        />
      )}
      {currentPage === 'friends' && (
        <Friends 
          user={currentUser} 
          onBack={() => setCurrentPage('menu')}
        />
      )}
      {currentPage === 'arsenal' && (
        <Arsenal 
          user={currentUser} 
          onBack={() => setCurrentPage('menu')}
        />
      )}
      {currentPage === 'shop' && (
        <Shop 
          user={currentUser} 
          updateUser={updateUser}
          onBack={() => setCurrentPage('menu')}
        />
      )}
      {currentPage === 'multiplayer' && (
        <Multiplayer 
          user={currentUser} 
          onBack={() => setCurrentPage('menu')}
        />
      )}
      {currentPage === 'chat' && (
        <Chat 
          user={currentUser} 
          onBack={() => setCurrentPage('menu')}
        />
      )}
      {currentPage === 'admin' && currentUser.isAdmin && (
        <AdminPanel 
          onBack={() => setCurrentPage('menu')}
        />
      )}
      {currentPage === 'game' && (
        <Game 
          user={currentUser}
          updateUser={updateUser}
          onBack={() => setCurrentPage('menu')}
        />
      )}
    </div>
  );
};

export default Index;