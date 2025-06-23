
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { CartItem, Order } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface OrderFormProps {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  onSubmit: (customerInfo: Order['customerInfo']) => void;
  onBack: () => void;
}

export const OrderForm = ({ cartItems, subtotal, total, onSubmit, onBack }: OrderFormProps) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // Houston coordinates for distance calculation
  const RESTAURANT_LAT = 29.6844;
  const RESTAURANT_LNG = -95.3137;
  const MAX_DELIVERY_RADIUS = 12; // miles

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const validateDeliveryAddress = async (address: string) => {
    try {
      // In a real implementation, you would use a geocoding API like Google Maps
      // For now, we'll do a simple Houston area check
      const houstonKeywords = ['houston', 'tx', 'texas', '77'];
      const addressLower = address.toLowerCase();
      const hasHoustonKeyword = houstonKeywords.some(keyword => addressLower.includes(keyword));
      
      if (!hasHoustonKeyword) {
        throw new Error("Address appears to be outside Houston area");
      }
      
      return true;
    } catch (error) {
      throw new Error("Unable to verify delivery address. Please ensure you're within our 12-mile delivery radius from 4515 Dewberry St, Houston, TX 77021");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    try {
      // Validate required fields
      if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate phone format
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = customerInfo.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        throw new Error("Please enter a valid phone number");
      }

      // Validate delivery address
      await validateDeliveryAddress(customerInfo.address);

      // Submit order
      onSubmit(customerInfo);
    } catch (error) {
      toast({
        title: "Order Error",
        description: error instanceof Error ? error.message : "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Order Summary */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4">Your Order</h3>
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">{item.quantity}x {item.name}</span>
                    {item.specialInstructions && (
                      <p className="text-sm text-gray-600">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address, apartment/suite, city, state, zip code"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  We deliver within 12 miles of 4515 Dewberry St, Houston, TX 77021
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Payment Information</h4>
                <p className="text-sm text-blue-800">
                  Payment will be processed securely through Stripe after order confirmation.
                  You'll receive a payment link via email and SMS.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isValidating}
              >
                {isValidating ? "Validating Address..." : "Place Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
