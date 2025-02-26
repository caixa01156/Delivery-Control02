import React, { useState, KeyboardEvent } from 'react';
import { Clock, Utensils, Truck, CheckCircle, Trash2, Store, Smartphone, PlusCircle, List } from 'lucide-react';
import OrderTimer from './components/OrderTimer';
import { Order, OrderStatus, OrderSource } from './types';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [orderSource, setOrderSource] = useState<OrderSource>('consumer');
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');

  // Set default deadline time to current time + 30 minutes
  const getCurrentTimePlus30 = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toTimeString().substring(0, 5); // Format as HH:MM
  };

  // Initialize deadline time when component mounts
  React.useEffect(() => {
    setDeadlineTime(getCurrentTimePlus30());
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, nextField: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextElement = document.querySelector(`[data-next="${nextField}"]`) as HTMLElement;
      nextElement?.focus();
    }
  };

  const addOrder = () => {
    if (!customerName.trim() || !address.trim() || !deadlineTime) return;

    const newOrder: Order = {
      id: Date.now(),
      customerName,
      items: address,
      status: 'preparing',
      deadlineTime,
      startTime: Date.now(),
      source: orderSource,
    };

    setOrders([...orders, newOrder]);
    setCustomerName('');
    setAddress('');
    setDeadlineTime(getCurrentTimePlus30());
    setOrderSource('consumer');

    const firstField = document.querySelector('[data-next="address"]') as HTMLElement;
    firstField?.focus();
  };

  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const deleteOrder = (orderId: number) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const orderSummary = {
    preparing: orders.filter(order => order.status === 'preparing').length,
    delivering: orders.filter(order => order.status === 'delivering').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-2">
          <Utensils className="w-8 h-8" />
          Delivery Yosugiru
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-yellow-400 text-2xl font-bold">{orderSummary.preparing}</p>
            <p className="text-gray-400">Em Preparo</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-blue-400 text-2xl font-bold">{orderSummary.delivering}</p>
            <p className="text-gray-400">Em Entrega</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-green-400 text-2xl font-bold">{orderSummary.delivered}</p>
            <p className="text-gray-400">Entregues</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'new'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            Novo Pedido
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'list'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
            Lista de Pedidos
          </button>
        </div>

        {activeTab === 'new' ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Novo Pedido</h2>
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setOrderSource('consumer')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    orderSource === 'consumer'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  Consumer
                </button>
                <button
                  onClick={() => setOrderSource('ifood')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    orderSource === 'ifood'
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  Ifood
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'address')}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Digite o nome do cliente"
                  data-next="address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Endereço de Entrega
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'deadlineTime')}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Digite o endereço completo para entrega"
                  rows={3}
                  data-next="deadlineTime"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Horário Limite de Entrega
                </label>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOrder();
                    }
                  }}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                  data-next="submit"
                />
              </div>
              <button
                onClick={addOrder}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full"
              >
                Adicionar Pedido
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-gray-800 rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{order.customerName}</h3>
                      <span className={`px-2 py-0.5 rounded text-sm ${
                        order.source === 'ifood' 
                          ? 'bg-red-900/50 text-red-200' 
                          : 'bg-orange-900/50 text-orange-200'
                      }`}>
                        {order.source === 'ifood' ? (
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            Ifood
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3" />
                            Consumer
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-line">
                      <strong className="text-orange-400">Endereço:</strong> {order.items}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Horário limite: {order.deadlineTime}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                    title="Apagar pedido"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <OrderTimer
                    startTime={order.startTime}
                    deadlineTime={order.deadlineTime}
                    status={order.status}
                  />
                  <div className="flex items-center justify-between">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${order.status === 'preparing' ? 'bg-yellow-900 text-yellow-200' : ''}
                      ${order.status === 'delivering' ? 'bg-blue-900 text-blue-200' : ''}
                      ${order.status === 'delivered' ? 'bg-green-900 text-green-200' : ''}
                    `}>
                      {order.status === 'preparing' && 'Em Preparo'}
                      {order.status === 'delivering' && 'Em Entrega'}
                      {order.status === 'delivered' && 'Entregue'}
                    </span>
                    
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivering')}
                        className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Truck className="w-3 h-3" />
                        Entregar
                      </button>
                    )}
                    {order.status === 'delivering' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Confirmar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;