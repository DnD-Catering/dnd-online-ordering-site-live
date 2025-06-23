
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { CartItem } from "@/pages/Index";

interface MenuItemsProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

export const MenuItems = ({ onAddToCart }: MenuItemsProps) => {
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});
  const [customizations, setCustomizations] = useState<Record<string, any>>({});

  const menuItems = [
    {
      id: "grand-opening-special",
      name: "Grand Opening Special - 2 for $25",
      description: "Baked Fettuccine Alfredo + 12\" Pizza (Cheese or Pepperoni) + (2) 12oz Sodas",
      price: 25,
      isSpecial: true,
      customizable: true,
      customizationOptions: {
        pizzaType: ["Cheese", "Pepperoni"],
        sodaChoices: ["Coke", "Sprite", "Dr. Pepper", "Orange Soda"]
      }
    },
    {
      id: "cheese-pizza",
      name: "12\" Cheese Pizza",
      description: "Classic cheese pizza with our signature sauce and fresh mozzarella",
      price: 15,
      isSpecial: false
    },
    {
      id: "pepperoni-pizza",
      name: "12\" Pepperoni Pizza",
      description: "Classic pepperoni pizza with our signature sauce and fresh mozzarella",
      price: 15,
      isSpecial: false
    },
    {
      id: "fettuccine-alfredo",
      name: "Baked Fettuccine Alfredo",
      description: "Creamy fettuccine pasta baked to perfection with our rich alfredo sauce",
      price: 12,
      isSpecial: false
    },
    {
      id: "soda",
      name: "12oz Soda",
      description: "Choice of Coke, Sprite, Dr. Pepper, or Orange Soda",
      price: 3,
      isSpecial: false,
      customizable: true,
      customizationOptions: {
        sodaChoice: ["Coke", "Sprite", "Dr. Pepper", "Orange Soda"]
      }
    }
  ];

  const handleAddToCart = (item: typeof menuItems[0]) => {
    const itemCustomizations = customizations[item.id] || {};
    const instructions = specialInstructions[item.id] || "";

    onAddToCart({
      name: item.name,
      price: item.price,
      quantity: 1,
      specialInstructions: instructions,
      customizations: itemCustomizations
    });

    // Reset form for this item
    setSpecialInstructions(prev => ({ ...prev, [item.id]: "" }));
    setCustomizations(prev => ({ ...prev, [item.id]: {} }));
  };

  const updateCustomization = (itemId: string, field: string, value: string | string[]) => {
    setCustomizations(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <Card key={item.id} className={`hover:shadow-lg transition-shadow ${item.isSpecial ? 'ring-2 ring-orange-400' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-gray-800">{item.name}</CardTitle>
              {item.isSpecial && (
                <Badge className="bg-orange-500 hover:bg-orange-600">
                  Special!
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{item.description}</p>
            <div className="text-2xl font-bold text-red-600">${item.price}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customization Options */}
            {item.customizable && item.customizationOptions && (
              <div className="space-y-3">
                {item.customizationOptions.pizzaType && (
                  <div>
                    <Label htmlFor={`pizza-${item.id}`}>Pizza Type</Label>
                    <Select onValueChange={(value) => updateCustomization(item.id, 'pizzaType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose pizza type" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.customizationOptions.pizzaType.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {item.customizationOptions.sodaChoice && (
                  <div>
                    <Label htmlFor={`soda-${item.id}`}>Soda Choice</Label>
                    <Select onValueChange={(value) => updateCustomization(item.id, 'sodaChoice', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose soda" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.customizationOptions.sodaChoice.map((soda) => (
                          <SelectItem key={soda} value={soda.toLowerCase()}>{soda}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {item.customizationOptions.sodaChoices && (
                  <div>
                    <Label htmlFor={`sodas-${item.id}`}>Choose 2 Sodas</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((sodaNum) => (
                        <Select key={sodaNum} onValueChange={(value) => {
                          const currentChoices = customizations[item.id]?.sodaChoices || [];
                          const newChoices = [...currentChoices];
                          newChoices[sodaNum - 1] = value;
                          updateCustomization(item.id, 'sodaChoices', newChoices);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Soda ${sodaNum}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {item.customizationOptions.sodaChoices.map((soda) => (
                              <SelectItem key={soda} value={soda.toLowerCase()}>{soda}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <Label htmlFor={`instructions-${item.id}`}>Special Instructions</Label>
              <Textarea
                id={`instructions-${item.id}`}
                placeholder="Any special requests or modifications..."
                value={specialInstructions[item.id] || ""}
                onChange={(e) => setSpecialInstructions(prev => ({
                  ...prev,
                  [item.id]: e.target.value
                }))}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={() => handleAddToCart(item)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
