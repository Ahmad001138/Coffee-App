import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from './src/screens/others/GetStartedScreen';
import HomeTabs from './src/navigation/TabNavigator';
import CoffeeDetail from './src/screens/others/CoffeeDetailScreen';
import Order from './src/screens/others/OrderScreen';
import Login from './src/screens/others/LoginScreen';
import Signup from './src/screens/others/SignupScreen';
import { CartProvider } from './src/store/CartContext';
import { FavoritesProvider } from './src/store/FavoritesContext';
import { ReviewProvider } from './src/store/ReviewContext';
import { AuthProvider } from './src/store/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ReviewProvider>
          <CartProvider>
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="GetStarted"
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  presentation: 'card'
                }}
              >
                <Stack.Screen name="GetStarted" component={GetStarted} />
                <Stack.Screen name="Login" component={Login} options={{ animation: 'fade' }} />
                <Stack.Screen name="Signup" component={Signup} options={{ animation: 'fade' }} />
                <Stack.Screen name="Home" component={HomeTabs} options={{ animation: 'fade' }} />
                <Stack.Screen name="CoffeeDetail" component={CoffeeDetail} options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="Order" component={Order} />
              </Stack.Navigator>
            </NavigationContainer>
          </CartProvider>
        </ReviewProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
