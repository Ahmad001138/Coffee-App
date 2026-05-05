import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import { allCoffees, categories } from '../../data/coffeeData';

import CoffeeCard from '../../components/CoffeeCard';
import PromoCard from '../../components/PromoCard';
import AnimatedButton from '../../components/AnimatedButton';

const Home = () => {
  const navigation = useNavigation();
  const { isLoggedIn, logout } = useAuth();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredData = useMemo(() => {
    let base = allCoffees;
    if (selectedCategory !== 'all') {
      base = allCoffees.filter(item => item.type === selectedCategory);
    }
    if (!searchQuery.trim()) return base;
    return base.filter(item =>
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );
  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {/* Header Section */}
      <LinearGradient
        colors={['rgba(20, 20, 20, 1)', 'rgba(40, 40, 40, 1)']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.locationHeader}>
          <View>
            <Text style={styles.welcome}>Location</Text>
            <View style={styles.locationRow}>
              <Text style={styles.location}>Pakistan, Lahore</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AnimatedButton
              style={styles.profileButton}
              onPress={() => {
                if (isLoggedIn) {
                  Alert.alert('Logout', 'Are you sure you want to logout?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: () => logout() }
                  ]);
                } else {
                  navigation.navigate('Login');
                }
              }}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }}
                style={styles.profileImage}
              />
            </AnimatedButton>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#B7B7B7" style={styles.searchIcon} />
          <TextInput
            placeholder="Search coffee..."
            placeholderTextColor="#B7B7B7"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <MaterialIcons name="close" size={22} color="#B7B7B7" />
            </TouchableOpacity>
          )}
          <AnimatedButton style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color="#FFF" />
          </AnimatedButton>
        </View>
      </LinearGradient>

      {/* Fixed Categories Bar */}
      <View style={styles.categoryContainerFixed}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map(cat => {
            const focused = selectedCategory === cat.key;
            return (
              <AnimatedButton
                key={cat.key}
                scaleTo={0.9}
                style={[
                  styles.categoryChip,
                  focused ? styles.categoryChipActive : styles.categoryChipInactive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    focused ? styles.categoryTextActive : styles.categoryTextInactive,
                  ]}
                >
                  {cat.label}
                </Text>
              </AnimatedButton>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListHeaderComponent={
          <>
            <PromoCard />
            {searchQuery.length > 0 && (
              <Text style={styles.resultsText}>
                Found {filteredData.length} results
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color="#EAEAEA" />
            <Text style={styles.emptyText}>No coffees found matching your search</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CoffeeCard
            item={item}
            navigation={navigation}
            addToCart={addToCart}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#1E1E1E',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  welcome: {
    color: '#B7B7B7',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 0.5,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  location: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    height: '100%',
    textAlign: 'left',
    ...Platform.select({
      android: {
        paddingVertical: 0,
        textAlignVertical: 'center',
      },
    }),
  },
  filterButton: {
    backgroundColor: '#C67C4E',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  categoryContainerFixed: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 12,
  },
  categoryRow: {
    paddingLeft: 24,
    paddingRight: 16,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#C67C4E',
    elevation: 4,
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  categoryChipInactive: {
    backgroundColor: '#F3F3F3',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  categoryTextInactive: {
    color: '#2F2D2C',
  },
  resultsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2F2D2C',
    marginBottom: 16,
    marginTop: -8,
  },
  grid: {
    paddingHorizontal: 24,
    paddingBottom: 160,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#9B9B9B',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
});

export default Home;
