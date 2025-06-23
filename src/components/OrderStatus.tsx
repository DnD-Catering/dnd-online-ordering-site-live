
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ChefHat, Truck, MapPin } from "lucide-react";
import { Order } from "@/pages/Index";

interface OrderStatusProps {
  order: Order;
  onNewOrder: () => void;
}

export const OrderStatus = ({ order, onNewOrder }: OrderStatusProps) => {
  const [currentStatus, setCurrentStatus] = useState<Order['status']>(order.status);
  const [estimatedTime, setEstimatedTime] = useState(45);

  useEffect(() => {
    // Simulate order status updates
    const statusTimeline = [
      { status: 'confirmed' as const, delay: 2000 },
      { status: 'preparing' as const, delay: 8000 },
      { status: 'ready' as const, delay: 15000 },
      { status: 'delivered' as const, delay: 25000 }
    ];

    statusTimeline.forEach(({ status, delay }) => {
      setTimeout(() => {
        setCurrentStatus(status);
        if (status === 'preparing') setEstimatedTime(30);
        if (status === 'ready') setEstimatedTime(15);
        if (status === 'delivered') setEstimatedTime(0);
      }, delay);
    });
  }, []);

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, text: 'Order Received', color: 'bg-yellow-500' };
      case 'confirmed':
        return { icon: CheckCircle, text: 'Order Confirmed', color: 'bg-blue-500' };
      case 'preparing':
        return { icon: ChefHat, text: 'Preparing Your Order', color: 'bg-orange-500' };
      case 'ready':
        return { icon: Truck, text: 'Out for Delivery', color: 'bg-purple-500' };
      case 'delivered':
        return { icon: CheckCircle, text: 'Delivered', color: 'bg-green-500' };
      default:
        return { icon: Clock, text: 'Processing', color: 'bg-gray-500' };
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Received' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus);
  };

  const currentStatusInfo = getStatusInfo(currentStatus);
  const StatusIcon = currentStatusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 rounded-full ${currentStatusInfo.color} flex items-center justify-center mx-auto mb-4`}>
              <StatusIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {currentStatusInfo.text}
            </Badge>
          </CardHeader>
          <CardContent>
            {/* Status Timeline */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= getCurrentStepIndex();
                  const isCurrent = index === getCurrentStepIndex();
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' : 
                        isCurrent ? currentStatusInfo.color + ' text-white' : 
                        'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`text-xs mt-2 text-center ${
                        isCompleted || isCurrent ? 'text-gray-800 font-medium' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Estimated Time */}
            {estimatedTime > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
                <Clock className="w-5 h-5 inline mr-2 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Estimated delivery: {estimatedTime} minutes
                </span>
              </div>
            )}

            {/* Order Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Delivery Information</h3>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {order.customerInfo.name}</p>
                  <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                  <p><strong>Email:</strong> {order.customerInfo.email}</p>
                  <div className="flex items-start mt-2">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                    <span>{order.customerInfo.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Updates */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-green-900 mb-2">Stay Updated</h4>
              <p className="text-sm text-green-800">
                We'll send you SMS and email updates about your order status. 
                You can also bookmark this page to check your order progress.
              </p>
            </div>

            <Button
              onClick={onNewOrder}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Place Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
