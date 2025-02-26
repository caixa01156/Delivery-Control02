export type OrderStatus = 'preparing' | 'delivering' | 'delivered';
export type OrderSource = 'ifood' | 'consumer';

export interface Order {
  id: number;
  customerName: string;
  items: string;
  status: OrderStatus;
  deadlineTime: string;
  startTime: number;
  source: OrderSource;
}