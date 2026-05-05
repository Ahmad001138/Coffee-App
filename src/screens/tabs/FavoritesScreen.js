import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
  ToastAndroid,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../../store/FavoritesContext';

const FavouriteCard = ({ item, onRemove, navigation }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleRemove = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onRemove(item.id));
  };

  return (
    <Animated.View style={{ flex: 0.5, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate('CoffeeDetail', { coffee: item })}
        style={styles.cardItem}
      >
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.coffeeImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity
            style={styles.favoriteBadge}
            onPress={handleRemove}
          >
            <MaterialIcons name="favorite" size={20} color="#ED5151" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.subTextCard}>with {item.type === 'espresso' ? 'Milk' : 'Chocolate'}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{item.price}</Text>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={14} color="#FBBE21" />
              <Text style={styles.ratingTextCard}>{item.rating || '4.8'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Favourite = () => {
  const navigation = useNavigation();
  const { favorites, removeFavorite } = useFavorites();

  const handleRemoveFavourite = (id) => {
    removeFavorite(id);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Removed from Favorites', ToastAndroid.SHORT);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialIcons name="favorite-border" size={60} color="#C67C4E" />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any coffee to save it here for later.
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explore Coffees</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#131313', '#313131']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>Your personal sanctuary of coffee</Text>
      </LinearGradient>

      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <FavouriteCard
            item={item}
            navigation={navigation}
            onRemove={handleRemoveFavourite}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  coffeeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 6,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F2D2C',
    marginBottom: 2,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  subTextCard: {
    fontSize: 12,
    color: '#9B9B9B',
    marginBottom: 8,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F2D2C',
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingTextCard: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F2D2C',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F2D2C',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9B9B9B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Favourite;
