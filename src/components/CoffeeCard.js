import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, ToastAndroid, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../store/AuthContext';
import { useFavorites } from '../store/FavoritesContext';
import AnimatedButton from './AnimatedButton';

const CoffeeCard = ({ item, navigation, addToCart }) => {
  const { isLoggedIn } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const liked = isFavorite(item.id);

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    if (liked) {
      removeFavorite(item.id);
      if (Platform.OS === 'android') ToastAndroid.show('Removed from Favorites', ToastAndroid.SHORT);
    } else {
      addFavorite(item);
      if (Platform.OS === 'android') ToastAndroid.show('Added to Favorites', ToastAndroid.SHORT);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    const priceNumber = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
    addToCart({ ...item, price: priceNumber, quantity: 1 });
    if (Platform.OS === 'android') {
      ToastAndroid.show('Added to cart', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Added to cart');
    }
  };

  const handleCardPress = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('CoffeeDetail', { coffee: item });
  };

  return (
    <AnimatedButton
      onPress={handleCardPress}
      style={styles.cardGridItemWrapper}
      scaleTo={0.96}
    >
      <View style={styles.cardGridItem}>
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.coffeeImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.imageOverlay}
          />
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={14} color="#FBBE21" />
            <Text style={styles.ratingTextCard}>{item.rating || '4.8'}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteBadge}
            onPress={handleToggleFavorite}
          >
            <MaterialIcons
              name={liked ? 'favorite' : 'favorite-border'}
              size={20}
              color={liked ? '#ED5151' : '#FFF'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.subTextCard}>with {item.type === 'espresso' ? 'Milk' : 'Chocolate'}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{item.price}</Text>
            <AnimatedButton onPress={handleAddToCart}>
              <View style={styles.addButton}>
                <MaterialIcons name="add" size={20} color="#FFF" />
              </View>
            </AnimatedButton>
          </View>
        </View>
      </View>
    </AnimatedButton>
  );
};

const styles = StyleSheet.create({
  cardGridItemWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  cardGridItem: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    height: 140,
    marginBottom: 12,
  },
  coffeeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingTextCard: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  infoContainer: {
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F2D2C',
    marginBottom: 4,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  subTextCard: {
    fontSize: 12,
    color: '#9B9B9B',
    marginBottom: 16,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F2D2C',
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  addButton: {
    backgroundColor: '#C67C4E',
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(CoffeeCard);
