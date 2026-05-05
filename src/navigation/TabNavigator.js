import React from 'react';
import { View, Animated, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavTab from '../screens/tabs/FavoritesScreen';
import Home from '../screens/tabs/HomeScreen';
import CartTab from '../screens/tabs/CartScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../store/CartContext';
import { useFavorites } from '../store/FavoritesContext';
import { useAuth } from '../store/AuthContext';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { isLoggedIn } = useAuth();
  const { cartItems } = useCart();
  const { favorites } = useFavorites();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopRightRadius: 28,
          borderTopLeftRadius: 28,
          height: Platform.OS === 'ios' ? 88 : 70,
          position: 'absolute', // Floating effect
          bottom: 0,
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Fav') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'CartTab') {   // ✅ fix name
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
              <Icon name={iconName} size={28} color={color} />
              {focused && (
                <Animated.View
                  style={{
                    height: 5,
                    width: 24,
                    backgroundColor: '#C67C4E',
                    borderRadius: 3,
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 5 : -14,
                  }}
                />
              )}
            </View>
          );
        },
        tabBarActiveTintColor: '#C67C4E',
        tabBarInactiveTintColor: '#A9A9A9',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Fav"
        component={FavTab}
        options={{
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#C67C4E',
            color: '#FFF',
            fontSize: 10,
            lineHeight: 14,
            fontWeight: 'bold',
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
      <Tab.Screen
        name="CartTab"
        component={CartTab}
        options={{
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ED5151',
            color: '#FFF',
            fontSize: 10,
            lineHeight: 14,
            fontWeight: 'bold',
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
