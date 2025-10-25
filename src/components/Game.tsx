import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface GameProps {
  user: User;
  updateUser: (user: User) => void;
  onBack: () => void;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
}

interface Bomb {
  x: number;
  y: number;
  radius: number;
}

interface Vehicle {
  type: string;
  x: number;
  y: number;
}

const Game = ({ user, updateUser, onBack }: GameProps) => {
  const [selectedMission, setSelectedMission] = useState<number | null>(null);
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 300 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [canBomb, setCanBomb] = useState(true);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastClickTime = useRef(0);

  const missions = [
    { id: 1, name: 'Миссия 1: Оборона позиций', desc: 'Защити окопы от наступления' },
    { id: 2, name: 'Миссия 2: Городской бой', desc: 'Прорвись через город' },
    { id: 3, name: 'Миссия 3: Танковый прорыв', desc: 'Уничтожь вражескую технику' },
    { id: 4, name: 'Миссия 4: Штурм базы', desc: 'Захвати вражескую базу' },
    { id: 5, name: 'Миссия 5: Снайперская охота', desc: 'Ликвидируй офицеров' },
    { id: 6, name: 'Миссия 6: Последний рубеж', desc: 'Финальная битва' },
  ];

  useEffect(() => {
    if (selectedMission !== null) {
      const initialEnemies = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 600 + Math.random() * 200,
        y: 50 + i * 80,
        health: 100,
      }));
      setEnemies(initialEnemies);
    }
  }, [selectedMission]);

  useEffect(() => {
    if (!canvasRef.current || selectedMission === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedMission === 1) {
      ctx.fillStyle = '#3d4a3a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#4a5568';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(30, 50 + i * 80, 180, 50);
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(40, 55 + i * 80, 160, 15);
        ctx.fillStyle = '#4a5568';
      }
      
      ctx.fillStyle = '#8b7355';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
      }
    } else if (selectedMission === 2) {
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#5a5a5a';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(100 + i * 150, 50, 100, 150);
        ctx.fillStyle = '#3a3a3a';
        for (let j = 0; j < 3; j++) {
          ctx.fillRect(110 + i * 150, 60 + j * 40, 30, 30);
        }
        ctx.fillStyle = '#5a5a5a';
      }
      
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * 200, 20 + Math.random() * 30, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#4a5568';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(50, 50 + i * 100, 150, 60);
      }
    }

    ctx.fillStyle = '#ea384c';
    ctx.fillRect(playerPos.x, playerPos.y, 20, 20);

    enemies.forEach(enemy => {
      ctx.fillStyle = '#8E9196';
      ctx.fillRect(enemy.x, enemy.y, 20, 20);
      
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(enemy.x, enemy.y - 10, 20 * (enemy.health / 100), 3);
    });

    vehicles.forEach(vehicle => {
      ctx.fillStyle = '#f97316';
      ctx.fillRect(vehicle.x, vehicle.y, 40, 30);
    });

    bombs.forEach(bomb => {
      ctx.fillStyle = 'rgba(234, 56, 76, 0.3)';
      ctx.beginPath();
      ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    const animationId = requestAnimationFrame(() => {
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        x: enemy.x - 0.5,
      })));
    });

    return () => cancelAnimationFrame(animationId);
  }, [playerPos, enemies, bombs, vehicles, selectedMission]);

  const handleMove = (direction: string) => {
    setPlayerPos(prev => {
      const speed = 20;
      switch (direction) {
        case 'up': return { ...prev, y: Math.max(0, prev.y - speed) };
        case 'down': return { ...prev, y: Math.min(380, prev.y + speed) };
        case 'left': return { ...prev, x: Math.max(0, prev.x - speed) };
        case 'right': return { ...prev, x: Math.min(380, prev.x + speed) };
        default: return prev;
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const now = Date.now();
    const isDoubleClick = now - lastClickTime.current < 300;
    lastClickTime.current = now;

    if (isDoubleClick && canBomb) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setBombs(prev => [...prev, { x, y, radius: 60 }]);
      setCanBomb(false);
      
      setTimeout(() => {
        setBombs(prev => prev.filter(b => !(b.x === x && b.y === y)));
      }, 500);
      
      setTimeout(() => setCanBomb(true), 5000);

      setEnemies(prev => prev.map(enemy => {
        const dist = Math.sqrt((enemy.x - x) ** 2 + (enemy.y - y) ** 2);
        if (dist < 60) {
          return { ...enemy, health: Math.max(0, enemy.health - 50) };
        }
        return enemy;
      }).filter(e => e.health > 0));

      setScore(prev => prev + 50);
    } else {
      setScore(prev => prev + 10);
    }
  };

  const handleSpawnVehicle = (type: string) => {
    setVehicles(prev => [...prev, { type, x: playerPos.x, y: playerPos.y }]);
  };

  const handleMissionComplete = () => {
    if (selectedMission === 6 && user.missionsCompleted < 6) {
      updateUser({ ...user, missionsCompleted: 6, status: 'Ветеран войны 🎖️' });
    } else if (selectedMission && user.missionsCompleted < selectedMission) {
      updateUser({ ...user, missionsCompleted: selectedMission });
    }
    setSelectedMission(null);
  };

  if (selectedMission === null) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button onClick={onBack} variant="outline" className="border-military-gray/30">
              <Icon name="ArrowLeft" size={20} />
              <span className="ml-2">Назад</span>
            </Button>
          </div>

          <Card className="p-6 bg-card border-military-gray/30">
            <h2 className="text-2xl font-oswald font-bold mb-6 text-foreground">Выбор миссии</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missions.map(mission => (
                <Button
                  key={mission.id}
                  onClick={() => setSelectedMission(mission.id)}
                  className="h-auto p-6 bg-background hover:bg-military-accent/20 border border-military-gray/30 flex flex-col items-start text-left"
                  variant="outline"
                  disabled={mission.id > user.missionsCompleted + 1}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Target" size={24} className="text-military-accent" />
                    <span className="font-oswald font-bold text-foreground">{mission.name}</span>
                  </div>
                  <p className="text-sm text-military-gray">{mission.desc}</p>
                  {mission.id <= user.missionsCompleted && (
                    <p className="text-xs text-green-500 mt-2">✓ Пройдено</p>
                  )}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-military-dark to-military-darker">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Button onClick={() => setSelectedMission(null)} variant="outline" className="border-military-gray/30">
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Выход</span>
          </Button>
          <div className="flex gap-4">
            <p className="text-foreground">Очки: {score}</p>
            <p className="text-foreground">Враги: {enemies.length}</p>
          </div>
        </div>

        <Card className="p-4 bg-card border-military-gray/30 mb-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onClick={handleCanvasClick}
            className="w-full border-2 border-military-gray/30 rounded cursor-crosshair"
          />
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-card border-military-gray/30">
            <p className="text-sm font-medium mb-3 text-foreground">Управление</p>
            <div className="grid grid-cols-3 gap-2">
              <div />
              <Button onClick={() => handleMove('up')} className="bg-military-accent/80 hover:bg-military-accent">
                <Icon name="ArrowUp" size={20} />
              </Button>
              <div />
              <Button onClick={() => handleMove('left')} className="bg-military-accent/80 hover:bg-military-accent">
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div />
              <Button onClick={() => handleMove('right')} className="bg-military-accent/80 hover:bg-military-accent">
                <Icon name="ArrowRight" size={20} />
              </Button>
              <div />
              <Button onClick={() => handleMove('down')} className="bg-military-accent/80 hover:bg-military-accent">
                <Icon name="ArrowDown" size={20} />
              </Button>
              <div />
            </div>
            <div className="mt-3 text-xs text-military-gray space-y-1">
              <p>1 клик - Выстрел</p>
              <p>2 клика - Авиабомба (КД 5сек)</p>
            </div>
          </Card>

          <Card className="p-4 bg-card border-military-gray/30">
            <p className="text-sm font-medium mb-3 text-foreground">Спавн техники</p>
            <div className="space-y-2">
              <Button 
                onClick={() => handleSpawnVehicle('tank')}
                className="w-full bg-background hover:bg-military-accent/20 border border-military-gray/30"
                variant="outline"
              >
                <Icon name="Truck" size={16} className="mr-2" />
                Танк
              </Button>
              <Button 
                onClick={() => handleSpawnVehicle('vehicle')}
                className="w-full bg-background hover:bg-military-accent/20 border border-military-gray/30"
                variant="outline"
              >
                <Icon name="Car" size={16} className="mr-2" />
                Машина
              </Button>
            </div>
          </Card>
        </div>

        {enemies.length === 0 && (
          <Card className="p-6 bg-military-accent/20 border-military-accent mt-4 text-center">
            <h3 className="text-xl font-oswald font-bold text-foreground mb-2">Миссия выполнена!</h3>
            <Button onClick={handleMissionComplete} className="bg-military-accent hover:bg-military-accent/90">
              Продолжить
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Game;