import React, { useState } from "react";
import { View, Text, Button, Alert, FlatList, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import for navigation

// Assume this is the order structure
interface Order {
  id: number;
  customerName: string;
  vegetable: string;
  quantity: number;
  status: string; // Can be 'pending', 'accepted', or 'rejected'
}

const VendorApp: React.FC = () => {
  const navigation = useNavigation(); // Access navigation

  // Initial list of orders
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customerName: "Vivek Kushwaha", vegetable: "Tomato", quantity: 5, status: "pending" },
    { id: 2, customerName: "Anant Bahore", vegetable: "Potato", quantity: 3, status: "pending" },
    { id: 3, customerName: "Vinayak Badole", vegetable: "Carrot", quantity: 8, status: "pending" },
    { id: 4, customerName: "Vedansh Shrivastava", vegetable: "Potato", quantity: 3, status: "pending" },
    { id: 5, customerName: "Yugal Sangavi", vegetable: "Potato", quantity: 3, status: "pending" },
  ]);

  // State to store accepted orders
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [isOrderHistoryVisible, setIsOrderHistoryVisible] = useState(false); // Modal visibility state

  // Function to accept an order
  const acceptOrder = (id: number) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "accepted" } : order
    ));

    const acceptedOrder = orders.find(order => order.id === id);
    if (acceptedOrder) {
      setAcceptedOrders([...acceptedOrders, { ...acceptedOrder, status: "accepted" }]);
    }
    Alert.alert("Order Status", "Order has been accepted!");
  };

  // Function to reject an order
  const rejectOrder = (id: number) => {
    setOrders(orders.filter(order => order.id !== id));
    Alert.alert("Order Status", "Order has been rejected and removed!");
  };

  const trackOrder = (id: number) => {
    Alert.alert("Track Order", `You are tracking order #${id}`);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.text}><Text style={styles.boldText}>Customer:</Text> {item.customerName}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Vegetable:</Text> {item.vegetable}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Quantity:</Text> {item.quantity}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Status:</Text> {item.status}</Text>

      {item.status === "pending" && (
        <View style={styles.buttonContainer}>
          <Button title="Accept" onPress={() => acceptOrder(item.id)} color="green" />
          <View style={styles.spacing} />
          <Button title="Reject" onPress={() => rejectOrder(item.id)} color="red" />
        </View>
      )}

      {item.status === "accepted" && (
        <View>
          <Text style={styles.acceptedText}>Order has been accepted.</Text>
          {/* Track Order button */}
          <Button title="Track Order" onPress={() => trackOrder(item.id)} color="blue" />
        </View>
      )}
    </View>
  );

  // Render accepted orders in the order history modal
  const renderAcceptedOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.text}><Text style={styles.boldText}>Customer:</Text> {item.customerName}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Vegetable:</Text> {item.vegetable}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Quantity:</Text> {item.quantity} kg</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Orders</Text>
      
      {/* Button to show order history */}
      <Button
        title="Order History"
        onPress={() => setIsOrderHistoryVisible(true)} // Show modal with accepted orders
      />

      {/* Add a gap between buttons */}
      <View style={styles.buttonGap} />

      {/* Button to navigate to the inventory page */}
      <Button
        title="Go to Inventory"
        onPress={() => navigation.navigate('InventoryScreen')} // Navigate to inventory page
      />

      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No pending orders.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
        />
      )}

      {/* Order History Modal */}
      <Modal
        visible={isOrderHistoryVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOrderHistoryVisible(false)} // Allows closing the modal
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Order History</Text>
            
            {acceptedOrders.length === 0 ? (
              <Text style={styles.noOrdersText}>No accepted orders yet.</Text>
            ) : (
              <FlatList
                data={acceptedOrders}
                renderItem={renderAcceptedOrder}
                keyExtractor={item => item.id.toString()}
              />
            )}
            
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsOrderHistoryVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  orderContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
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
    marginTop: 10,
  },
  buttonGap: {
    height: 20, // Creates a gap between buttons
  },
  spacing: {
    width: 10,
  },
  acceptedText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: 'green',
  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
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
    width: '85%',
    height: '60%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default VendorApp;
