import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VendorApp from './VendorApp';  // Your existing vendor dashboard
import InventoryScreen from './InventoryScreen';  // The new inventory page
// import OrderHistoryScreen from './OrderHistoryScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="VendorApp">
        <Stack.Screen name="VendorApp" component={VendorApp} options={{ title: 'Vendor Dashboard' }} />
        <Stack.Screen name="InventoryScreen" component={InventoryScreen} options={{ title: 'Today Inventory' }} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
