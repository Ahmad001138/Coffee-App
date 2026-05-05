import React, { useRef, useState } from 'react';
import { useCart } from '../../store/CartContext';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedButton from '../../components/AnimatedButton';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = -80;

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  const swimAnim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isSwiping, setIsSwiping] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          swimAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          Animated.timing(swimAnim, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onRemove(item.id, item.selectedSize));
        } else {
          Animated.spring(swimAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.deleteBackground}>
        <Icon name="trash-can-outline" size={28} color="#FFF" />
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.productCard,
          { transform: [{ translateX: swimAnim }], opacity }
        ]}
      >
        <Image source={item.image} style={styles.productImage} />
        <View style={{ flex: 1, paddingLeft: 4 }}>
          <Text style={styles.boldText}>{item.name}</Text>
          <Text style={styles.subText}>Size: {item.selectedSize || 'M'}</Text>
          <Text style={styles.priceText}>${Number(item.price).toFixed(2)}</Text>
        </View>

        <View style={styles.qtyContainer}>
          <TouchableOpacity
            onPress={() => onDecrement(item.id, item.selectedSize)}
            style={styles.qtyBtn}
          >
            <Icon name="minus" size={18} color="#2F2D2C" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onIncrement(item.id, item.selectedSize)}
            style={[styles.qtyBtn, styles.qtyBtnPlus]}
          >
            <Icon name="plus" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const CartTab = () => {
  const navigation = useNavigation();
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, cartTotal } = useCart();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialIcons name="shopping-bag" size={60} color="#C67C4E" />
      </View>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added any coffee yet. Time to change that!
      </Text>
      <AnimatedButton
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explore Menu</Text>
      </AnimatedButton>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedButton
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#2F2D2C" />
        </AnimatedButton>
        <Text style={styles.headerTitle} numberOfLines={1}>
          My Cart
        </Text>
        <View style={styles.headerSideSpacer} />
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {cartItems.map((item) => (
              <CartItem
                key={`${item.id}-${item.selectedSize}`}
                item={item}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onRemove={removeFromCart}
              />
            ))}

            <AnimatedButton
              style={styles.addMoreBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Icon name="plus-circle-outline" size={20} color="#C67C4E" />
              <Text style={styles.addMoreText}>Add more items</Text>
            </AnimatedButton>
          </ScrollView>

          <View style={styles.footer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', '#FFFFFF']}
              style={styles.footerGradient}
            >
              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Total Price</Text>
                  <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
                </View>
                <AnimatedButton
                  style={styles.checkoutBtn}
                  onPress={() => navigation.navigate('Order')}
                >
                  <Text style={styles.checkoutText}>Checkout</Text>
                </AnimatedButton>
              </View>
            </LinearGradient>
          </View>
        </>
      ) : renderEmptyState()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingHorizontal: 24,
    backgroundColor: '#FAFAFA',
    paddingBottom: 20,
  },
  iconButton: {
    backgroundColor: '#FFF',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerSideSpacer: {
    width: 44,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#2D2621',
    textAlign: 'center',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 160,
  },
  itemContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FF6B6B', // Softer red delete background
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 24,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  productImage: {
    width: 76,
    height: 76,
    borderRadius: 16,
    marginRight: 16,
  },
  boldText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2F2D2C',
    marginBottom: 4,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  subText: {
    fontSize: 13,
    color: '#9B9B9B',
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2F2D2C',
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  qtyBtnPlus: {
    backgroundColor: '#C67C4E',
    borderColor: '#C67C4E',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2F2D2C',
    minWidth: 16,
    textAlign: 'center',
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    backgroundColor: '#FFF0E6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBE8D8',
    marginTop: 8,
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C67C4E',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerGradient: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#9B9B9B',
    marginBottom: 4,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#C67C4E',
  },
  checkoutBtn: {
    backgroundColor: '#C67C4E',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 18,
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -80,
  },
  emptyIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F2D2C',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#9B9B9B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  exploreButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default CartTab;
