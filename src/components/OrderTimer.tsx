import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTimerProps {
  startTime: number;
  deadlineTime: string;
  status: OrderStatus;
}

const OrderTimer: React.FC<OrderTimerProps> = ({ startTime, deadlineTime, status }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (status === 'delivered') return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date();
      
      // Parse the deadline time (HH:MM)
      const [hours, minutes] = deadlineTime.split(':').map(Number);
      deadline.setHours(hours, minutes, 0, 0);
      
      // If the deadline is in the past (earlier today), assume it's for tomorrow
      if (deadline < now) {
        deadline.setDate(deadline.getDate() + 1);
      }
      
      const remaining = Math.max(0, deadline.getTime() - now.getTime());
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadlineTime, status]);

  if (status === 'delivered') {
    return null;
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  // Calculate a progress percentage (assuming 2 hours is the max time we'd show)
  const maxTimeMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const progress = Math.min(1, timeLeft / maxTimeMs);

  // Color transitions based on remaining time
  let timerColor = 'text-green-500';
  if (progress <= 0) {
    timerColor = 'text-red-500';
  } else if (progress <= 0.25) {
    timerColor = 'text-red-500';
  } else if (progress <= 0.5) {
    timerColor = 'text-orange-500';
  } else if (progress <= 0.75) {
    timerColor = 'text-yellow-500';
  }

  return (
    <div className={`flex items-center gap-1 mb-2 ${timerColor} transition-colors duration-300`}>
      <Clock className="w-4 h-4" />
      <span>
        {progress <= 0 ? (
          'Atrasado'
        ) : hours > 0 ? (
          `${hours}h ${minutes}m ${seconds}s`
        ) : (
          `${minutes}m ${seconds}s`
        )}
      </span>
    </div>
  );
};

export default OrderTimer;