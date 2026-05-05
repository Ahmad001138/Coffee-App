import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Animated,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../store/CartContext';
import AnimatedButton from '../../components/AnimatedButton';

const SuccessModal = ({ visible, orderId, onClose }) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    } else {
      scale.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.successModalContent}>
          <Animated.View style={[styles.successIconCircle, { transform: [{ scale }] }]}>
            <Icon name="check-circle" size={90} color="#C67C4E" />
          </Animated.View>
          <Text style={styles.successTitle}>Order Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your order #{orderId} has been placed. We're preparing your coffee with love.
          </Text>
          <AnimatedButton style={styles.trackButton} onPress={onClose}>
            <Text style={styles.trackButtonText}>Track My Order</Text>
          </AnimatedButton>
        </View>
      </View>
    </Modal>
  );
};

const Order = () => {
  const navigation = useNavigation();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('Garden Town, Phase 2, Gujranwala');
  const [tempAddress, setTempAddress] = useState(address);
  const [note, setNote] = useState('');
  const [tempNote, setTempNote] = useState('');
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const deliveryFee = 1.0;
  const discount = 1.0;
  const finalTotal = cartTotal + deliveryFee - discount;

  const handleOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      const id = Math.random().toString(36).slice(2, 8).toUpperCase();
      setOrderId(id);
      setIsOrdering(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleFinish = () => {
    clearCart();
    setShowSuccess(false);
    navigation.navigate('Home', { screen: 'Home' });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AnimatedButton
            style={styles.iconButton}
            onPress={() => navigation.navigate('Home')}
          >
            <MaterialIcons name="arrow-back-ios-new" size={20} color="#2F2D2C" />
          </AnimatedButton>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Order Summary
          </Text>
          <View style={styles.headerSideSpacer} />
        </View>

        <View style={[styles.section, { marginTop: 16 }]}>
          <Text style={styles.title}>Delivery Address</Text>
          <Text style={styles.subText}>{address}</Text>

          <View style={styles.rowGap}>
            <AnimatedButton
              style={styles.addressBtn}
              onPress={() => {
                setTempAddress(address);
                setModalVisible(true);
              }}
            >
              <Icon name="pencil" size={18} color="#2F2D2C" />
              <Text style={styles.btnText}>Edit Address</Text>
            </AnimatedButton>

            <AnimatedButton
              style={styles.addressBtn}
              onPress={() => {
                setTempNote(note);
                setNoteModalVisible(true);
              }}
            >
              <Icon name="note-text" size={18} color="#2F2D2C" />
              <Text style={styles.btnText}>Add Note</Text>
            </AnimatedButton>
          </View>
        </View>

        {note ? (
          <View style={styles.noteDisplay}>
            <Icon name="note-text-outline" size={20} color="#C67C4E" />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          {cartItems.map((item, idx) => (
            <View style={styles.productCard} key={`${item.id}-${idx}`}>
              <Image source={item.image} style={styles.productImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.boldText}>{item.name}</Text>
                <Text style={styles.subTextProduct}>Size: {item.selectedSize || 'M'}</Text>
              </View>
              <View style={styles.qtyPriceColumn}>
                <Text style={styles.qtyText}>x{item.quantity || 1}</Text>
                <Text style={styles.priceProduct}>${Number(item.price).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        <AnimatedButton style={styles.discountRow}>
          <Icon name="ticket-percent-outline" size={24} color="#C67C4E" />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.discountTitle}>1% Discount is Applied</Text>
            <Text style={styles.discountSubtitle}>Promo code: COFFEEBREW</Text>
          </View>
          <MaterialIcons name="chevron-right" size={28} color="#2F2D2C" />
        </AnimatedButton>

        <View style={styles.section}>
          <Text style={styles.title}>Payment Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>$1.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#ED5151' }]}>-$1.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { fontWeight: '800', fontSize: 17, color: '#2F2D2C' }]}>Total</Text>
              <Text style={styles.finalTotalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <AnimatedButton style={styles.walletRow}>
          <View style={styles.walletIconWrapper}>
            <Icon name="wallet-outline" size={24} color="#C67C4E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.boldTextWallet}>Cash/Wallet</Text>
            <Text style={styles.walletBalance}>Safe balance: $125.50</Text>
          </View>
          <Icon name="chevron-down" size={28} color="#2F2D2C" />
        </AnimatedButton>
      </ScrollView>

      <View style={styles.bottomBar}>
        <AnimatedButton
          style={[styles.orderBtn, (cartItems.length === 0 || isOrdering) && styles.orderBtnDisabled]}
          disabled={cartItems.length === 0 || isOrdering}
          onPress={handleOrder}
        >
          <Text style={styles.orderBtnText}>
            {isOrdering ? 'Processing...' : 'Place Order'}
          </Text>
        </AnimatedButton>
      </View>

      <SuccessModal
        visible={showSuccess}
        orderId={orderId}
        onClose={handleFinish}
      />

      {/* Logic Preserved Modals */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            <TextInput
              style={styles.input}
              value={tempAddress}
              onChangeText={setTempAddress}
              placeholder="Street No , City"
              multiline
            />
            <View style={styles.modalActions}>
              <AnimatedButton style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#555', fontWeight: '600' }}>Cancel</Text>
              </AnimatedButton>
              <AnimatedButton style={styles.modalSaveBtn} onPress={() => { setAddress(tempAddress); setModalVisible(false); }}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Save</Text>
              </AnimatedButton>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={noteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Delivery Note</Text>
            <TextInput
              style={styles.input}
              value={tempNote}
              onChangeText={setTempNote}
              placeholder="Enter instructions..."
              multiline
            />
            <View style={styles.modalActions}>
              <AnimatedButton style={styles.modalCancelBtn} onPress={() => setNoteModalVisible(false)}>
                <Text style={{ color: '#555', fontWeight: '600' }}>Cancel</Text>
              </AnimatedButton>
              <AnimatedButton style={styles.modalSaveBtn} onPress={() => { setNote(tempNote); setNoteModalVisible(false); }}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Save Note</Text>
              </AnimatedButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 160,
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
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2F2D2C',
    marginBottom: 16,
  },
  subText: {
    fontSize: 15,
    color: '#2F2D2C',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  rowGap: {
    flexDirection: 'row',
    gap: 12,
  },
  addressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    backgroundColor: '#FFF',
    gap: 10,
  },
  btnText: {
    fontSize: 14,
    color: '#2F2D2C',
    fontWeight: '700',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
  },
  boldText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2F2D2C',
  },
  subTextProduct: {
    fontSize: 13,
    color: '#9B9B9B',
    marginTop: 6,
    fontWeight: '500',
  },
  qtyPriceColumn: {
    alignItems: 'flex-end',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9B9B9B',
    marginBottom: 6,
  },
  priceProduct: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2F2D2C',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  discountTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2F2D2C',
  },
  discountSubtitle: {
    fontSize: 12,
    color: '#C67C4E',
    marginTop: 4,
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#9B9B9B',
    flex: 1,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2F2D2C',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 16,
  },
  finalTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#C67C4E',
    textAlign: 'right',
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 60,
    gap: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  walletIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldTextWallet: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2F2D2C',
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 13,
    color: '#C67C4E',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  orderBtn: {
    backgroundColor: '#C67C4E',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  orderBtnDisabled: {
    backgroundColor: '#DEDEDE',
    shadowOpacity: 0,
    elevation: 0,
  },
  orderBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2F2D2C',
    textAlign: 'center',
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#9B9B9B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  trackButton: {
    backgroundColor: '#C67C4E',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  noteDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FBE8D8',
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#2F2D2C',
    lineHeight: 20,
    fontWeight: '500',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2F2D2C',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    minHeight: 100,
    textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: 15,
    backgroundColor: '#FAFAFA',
    ...Platform.select({
      android: {
        paddingVertical: 12,
      },
    }),
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
});

export default Order;
