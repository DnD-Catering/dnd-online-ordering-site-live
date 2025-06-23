
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { CartItem } from "@/pages/Index";

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<CartItem>) => void;
  subtotal: number;
  total: number;
  onCheckout: () => void;
}

export const Cart = ({
  items,
  onClose,
  onRemoveItem,
  onUpdateItem,
  subtotal,
  total,
  onCheckout
}: CartProps) => {
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateItem(id, { quantity: newQuantity });
    }
  };

  const formatCustomizations = (customizations?: CartItem['customizations']) => {
    if (!customizations) return null;
    
    const details = [];
    if (customizations.pizzaType) {
      details.push(`Pizza: ${customizations.pizzaType}`);
    }
    if (customizations.sodaChoice) {
      details.push(`Soda: ${customizations.sodaChoice}`);
    }
    if (customizations.sodaChoices) {
      details.push(`Sodas: ${customizations.sodaChoices.join(', ')}`);
    }
    
    return details.length > 0 ? details.join(' • ') : null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Customizations */}
                      {formatCustomizations(item.customizations) && (
                        <p className="text-sm text-gray-600 mb-2">
                          {formatCustomizations(item.customizations)}
                        </p>
                      )}

                      {/* Special Instructions */}
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Special Instructions:</span> {item.specialInstructions}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full mt-6 bg-red-600 hover:bg-red-700"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
