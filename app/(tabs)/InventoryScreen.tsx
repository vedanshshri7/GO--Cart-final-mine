import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';

interface InventoryItem {
  id: number;
  vegetable: string;
  quantity: number; // In kg
}

const availableVegetables = [
  { id: 4, vegetable: "Cauliflower", quantity: 10 },
  { id: 5, vegetable: "Ladyfinger", quantity: 12 },
  { id: 6, vegetable: "Spinach", quantity: 8 },
  { id: 7, vegetable: "Carrot", quantity: 15 },
  { id: 8, vegetable: "Brinjal", quantity: 9 },
  { id: 9, vegetable: "Tomato", quantity: 13 },
  { id: 10, vegetable: "Cucumber", quantity: 11 },
  { id: 11, vegetable: "Beetroot", quantity: 7 },
  { id: 12, vegetable: "Capsicum", quantity: 6 },
  { id: 13, vegetable: "Peas", quantity: 10 },
];

const InventoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, vegetable: "Cabbage", quantity: 5 },
    { id: 2, vegetable: "Potato", quantity: 10 },
    { id: 3, vegetable: "Onion", quantity: 14 },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1); // To handle quantity for selected vegetable

  // Modify quantity in existing inventory
  const modifyQuantity = (id: number, delta: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  // Remove vegetable from inventory
  const removeVegetable = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // Add vegetable to inventory or update its quantity if it already exists
  const addVegetableToInventory = () => {
    if (selectedVegetable) {
      const existingItem = inventory.find(item => item.id === selectedVegetable.id);
      if (existingItem) {
        // If vegetable already exists in inventory, increase its quantity
        setInventory(inventory.map(item => 
          item.id === selectedVegetable.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        // Otherwise, add the vegetable as a new entry
        const vegetableToAdd = { ...selectedVegetable, quantity };
        setInventory([...inventory, vegetableToAdd]);
      }
      setIsModalVisible(false); // Close the modal after adding
      setQuantity(1); // Reset quantity
    }
  };

  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.inventoryItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.text}><Text style={styles.boldText}>Vegetable:</Text> {item.vegetable}</Text>
        <View style={styles.quantityControls}>
          <Button title="-" onPress={() => modifyQuantity(item.id, -1)} />
          <Text style={styles.quantityText}>{item.quantity} Rs/kg</Text>
          <Button title="+" onPress={() => modifyQuantity(item.id, 1)} />
        </View>
      </View>
      <View style={styles.removeButtonContainer}>
        <Button title="Remove" onPress={() => removeVegetable(item.id)} color="red" />
      </View>
    </View>
  );

  const renderVegetableOption = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity onPress={() => setSelectedVegetable(item)}>
      <View style={styles.vegetableOption}>
        <Text style={styles.text}>{item.vegetable}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Inventory</Text>

      <View style={styles.buttonContainer}>
        <Button title="Back to Dashboard" onPress={() => navigation.goBack()} />
        <View style={styles.spacing} />
        <Button title="Add Vegetable" onPress={() => setIsModalVisible(true)} />
      </View>

      <FlatList
        data={inventory}
        renderItem={renderInventoryItem}
        keyExtractor={item => item.id.toString()}
      />

      {/* Modal for Selecting Vegetables and Setting Quantity */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
          setQuantity(1); // Reset quantity when modal closes
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select a Vegetable and Quantity</Text>

            {/* Render vegetable options if none is selected */}
            {!selectedVegetable && (
              <FlatList
                data={availableVegetables}
                renderItem={renderVegetableOption}
                keyExtractor={item => item.id.toString()}
              />
            )}

            {/* If a vegetable is selected, show quantity controls */}
            {selectedVegetable && (
              <View>
                <Text style={styles.selectedVegetableText}>Selected: {selectedVegetable.vegetable}</Text>

                <View style={styles.quantityContainer}>
                  <Button title="-" onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                  <Text style={styles.quantityText}>{quantity} Rs/kg</Text>
                  <Button title="+" onPress={() => setQuantity(quantity + 1)} />
                </View>

                {/* Align buttons in vertical list */}
                <View style={styles.modalButtonList}>
                  <TouchableOpacity style={styles.buttonWrapper}>
                    <Button title="Add to Inventory" onPress={addVegetableToInventory} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonWrapper}>
                    <Button title="Go Back" onPress={() => setSelectedVegetable(null)} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonWrapper}>
                    <Button title="Cancel" onPress={() => {
                      setIsModalVisible(false);
                      setSelectedVegetable(null);
                      setQuantity(1); // Reset quantity when modal closes
                    }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inventoryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  removeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  spacing: {
    width: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%', // Increased the width of the modal
    height: '75%', // Increased the height of the modal
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  vegetableOption: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedVegetableText: {
    fontSize: 18,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalButtonList: {
    flexDirection: 'column', // List the buttons vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    marginVertical: 10, // Add spacing between buttons
    width: '100%', // Ensure the button takes full width
  },
});

export default InventoryScreen;
