
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin, Clock, Phone } from "lucide-react";
import { MenuItems } from "@/components/MenuItems";
import { Cart } from "@/components/Cart";
import { OrderForm } from "@/components/OrderForm";
import { OrderStatus } from "@/components/OrderStatus";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  customizations?: {
    pizzaType?: string;
    sodaChoice?: string;
    sodaChoices?: string[];
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  orderTime: Date;
  estimatedDelivery: Date;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { toast } = useToast();

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setCartItems(prev => [...prev, newItem]);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const deliveryFee = subtotal > 0 ? 10 : 0;
    return subtotal + deliveryFee;
  };

  const handleOrderSubmit = (customerInfo: Order['customerInfo']) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      items: cartItems,
      customerInfo,
      total: getTotal(),
      status: 'pending',
      orderTime: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    };
    
    setCurrentOrder(newOrder);
    setCartItems([]);
    setShowOrderForm(false);
    setShowCart(false);
    
    toast({
      title: "Order placed successfully!",
      description: "You will receive updates about your order status.",
    });
  };

  if (currentOrder) {
    return <OrderStatus order={currentOrder} onNewOrder={() => setCurrentOrder(null)} />;
  }

  if (showOrderForm) {
    return (
      <OrderForm
        cartItems={cartItems}
        subtotal={getSubtotal()}
        total={getTotal()}
        onSubmit={handleOrderSubmit}
        onBack={() => setShowOrderForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-red-600">DnD Catering</h1>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Grand Opening Special!
              </Badge>
            </div>
            <Button
              onClick={() => setShowCart(true)}
              className="relative bg-red-600 hover:bg-red-700"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({getTotalItems()})
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Authentic Italian Cuisine</h2>
          <p className="text-xl mb-8">Fresh pizzas and pasta delivered to your door</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>4515 Dewberry St, Houston, TX 77021</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>12-mile delivery radius • $10 delivery fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Menu</h2>
          <MenuItems onAddToCart={addToCart} />
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeFromCart}
          onUpdateItem={updateCartItem}
          subtotal={getSubtotal()}
          total={getTotal()}
          onCheckout={() => {
            setShowCart(false);
            setShowOrderForm(true);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">DnD Catering</h3>
          <p className="mb-4">Serving Houston with authentic Italian flavors</p>
          <div className="flex justify-center items-center">
            <Phone className="w-5 h-5 mr-2" />
            <span>Contact us for custom catering orders</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
