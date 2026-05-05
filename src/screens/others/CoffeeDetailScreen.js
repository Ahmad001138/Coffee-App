// screens/CoffeeDetail.js
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform, ToastAndroid, Alert, Modal, TextInput, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../store/CartContext';
import { useFavorites } from '../../store/FavoritesContext';
import { useReviews } from '../../store/ReviewContext';
import { useAuth } from '../../store/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedButton from '../../components/AnimatedButton';

const { width, height } = Dimensions.get('window');

const CoffeeDetail = ({ route }) => {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { addReview, deleteReview, reviews, getAverageRating, getReviewCount } = useReviews();
  const { coffee } = route?.params || {};

  const safeCoffee = useMemo(() => coffee, [coffee]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Local state for review modal
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (!safeCoffee) {
    return (
      <View style={styles.container}>
        <Text>Unable to find that coffee.</Text>
      </View>
    );
  }
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const liked = isFavorite(safeCoffee?.id);

  const [showMore, setShowMore] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  const maxLength = 110;
  const isLongText = safeCoffee.description.length > maxLength;
  const shortText = isLongText
    ? safeCoffee.description.slice(0, maxLength)
    : safeCoffee.description;

  const onAddToCart = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    const priceNumber = parseFloat(String(safeCoffee.price).replace(/[^0-9.]/g, '')) || 0;
    addToCart({
      ...safeCoffee,
      selectedSize,
      price: priceNumber,
      quantity: 1,
    });
    Platform.OS === 'android' ? ToastAndroid.show('Added to cart', ToastAndroid.SHORT) : Alert.alert('Success', 'Added to cart');
    navigation.navigate('Home', { screen: 'CartTab' });
  };

  const handleSubmitReview = () => {
    if (!userComment.trim()) {
      Alert.alert('Hold on', 'Please write a small comment about your coffee!');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      addReview(safeCoffee.id, {
        userName: 'You',
        rating: userRating,
        comment: userComment,
      });
      setIsSubmitting(false);
      setReviewModalVisible(false);
      setUserComment('');
      setUserRating(5);
      Platform.OS === 'android' ? ToastAndroid.show('Review added! Thanks!', ToastAndroid.SHORT) : Alert.alert('Review Added', 'Thanks for your feedback!');
    }, 1000);
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to remove your feedback?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteReview(safeCoffee.id, reviewId);
            Platform.OS === 'android' ? ToastAndroid.show('Review deleted', ToastAndroid.SHORT) : null;
          }
        },
      ]
    );
  };

  const coffeeReviews = reviews[safeCoffee.id] || [];
  const avgRating = getAverageRating(safeCoffee.id, safeCoffee.rating);
  const totalReviews = getReviewCount(safeCoffee.id);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Header Image Area */}
        <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
          <Image source={safeCoffee.image} style={styles.image} />
          <View style={styles.headerButtons}>
            <AnimatedButton
              style={styles.iconButton}
              onPress={() => navigation.navigate('Home')}
            >
              <MaterialIcons name="arrow-back-ios-new" size={20} color="#2F2D2C" />
            </AnimatedButton>
            <AnimatedButton
              style={styles.iconButton}
              onPress={() => {
                if (!isLoggedIn) {
                  navigation.navigate('Login');
                  return;
                }
                if (liked) {
                  removeFavorite(safeCoffee.id);
                  Platform.OS === 'android' ? ToastAndroid.show('Removed from favourites', ToastAndroid.SHORT) : Alert.alert('Removed from favourites');
                } else {
                  addFavorite(safeCoffee);
                  Platform.OS === 'android' ? ToastAndroid.show('Added to favourites', ToastAndroid.SHORT) : Alert.alert('Added to favourites');
                }
              }}
            >
              <MaterialIcons
                name={liked ? 'favorite' : 'favorite-border'}
                size={22}
                color={liked ? '#ED5151' : '#2F2D2C'}
              />
            </AnimatedButton>
          </View>
        </Animated.View>

        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Title Section */}
          <View style={styles.titleRow}>
            <View style={styles.titleTextBlock}>
              <Text style={styles.name}>{safeCoffee.name}</Text>
              <Text style={styles.subText}>with {safeCoffee.type === 'espresso' ? 'Milk' : 'Chocolate'}</Text>
            </View>
            <AnimatedButton
              style={styles.addReviewBtn}
              onPress={() => {
                if (!isLoggedIn) {
                  navigation.navigate('Login');
                  return;
                }
                setReviewModalVisible(true);
              }}
            >
              <MaterialIcons name="rate-review" size={18} color="#C67C4E" />
              <Text style={styles.addReviewBtnText}>Rate</Text>
            </AnimatedButton>
          </View>

          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={24} color="#FBBE21" />
            <Text style={styles.ratingText}>{avgRating} <Text style={{ color: '#808080', fontSize: 13, fontWeight: '500' }}>({totalReviews} reviews)</Text></Text>
            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <MaterialCommunityIcons name="seed" size={20} color="#C67C4E" />
              </View>
              <View style={styles.tag}>
                <MaterialCommunityIcons name="water" size={20} color="#C67C4E" />
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {showMore ? safeCoffee.description : shortText}
            {isLongText && (
              <Text onPress={() => setShowMore(!showMore)} style={styles.readMore}>
                {showMore ? ' Read Less' : '... Read More'}
              </Text>
            )}
          </Text>

          {/* Size Selector */}
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeContainer}>
            {['S', 'M', 'L'].map(size => (
              <AnimatedButton
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeButtonActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextActive,
                  ]}
                >
                  {size}
                </Text>
              </AnimatedButton>
            ))}
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.reviewCount}>{coffeeReviews.length} New</Text>
          </View>

          {coffeeReviews.length === 0 ? (
            <View style={styles.emptyReviewBox}>
              <Text style={styles.emptyReviewText}>No reviews yet. Be the first to share your experience!</Text>
            </View>
          ) : (
            coffeeReviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewUserRow}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{rev.userName[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewUserName}>{rev.userName}</Text>
                    <View style={styles.revStarsRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <MaterialIcons
                          key={s}
                          name="star"
                          size={12}
                          color={s <= rev.rating ? "#FBBE21" : "#E0E0E0"}
                        />
                      ))}
                      <Text style={styles.revDate}>{rev.date}</Text>
                    </View>
                  </View>
                  {rev.userName === 'You' && (
                    <AnimatedButton onPress={() => handleDeleteReview(rev.id)}>
                      <MaterialIcons name="delete-outline" size={22} color="#ED5151" />
                    </AnimatedButton>
                  )}
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))
          )}
        </Animated.View>
      </ScrollView>

      {/* Add Review Modal */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate this Coffee</Text>
              <AnimatedButton onPress={() => setReviewModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color="#2F2D2C" />
              </AnimatedButton>
            </View>

            <View style={styles.starSelector}>
              {[1, 2, 3, 4, 5].map((s) => (
                <AnimatedButton key={s} onPress={() => setUserRating(s)}>
                  <MaterialIcons
                    name={s <= userRating ? "star" : "star-border"}
                    size={48}
                    color="#FBBE21"
                  />
                </AnimatedButton>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="How was your coffee? (e.g. Rich, smooth, love it!)"
              placeholderTextColor="#9B9B9B"
              multiline
              value={userComment}
              onChangeText={setUserComment}
            />

            <AnimatedButton
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmitReview}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>{isSubmitting ? 'Posting...' : 'Post Review'}</Text>
            </AnimatedButton>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{safeCoffee.price}</Text>
        </View>
        <AnimatedButton
          style={styles.buyButtonWrapper}
          onPress={onAddToCart}
        >
          <LinearGradient
            colors={['#C67C4E', '#ED975D']}
            style={styles.buyButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </LinearGradient>
        </AnimatedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  imageContainer: {
    height: height * 0.45,
    width: '100%',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 24,
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
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F2D2C',
    marginBottom: 6,
    letterSpacing: -0.5,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  subText: {
    fontSize: 14,
    color: '#9B9B9B',
    marginBottom: 20,
    fontWeight: '500',
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  addReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#C67C4E',
    flexShrink: 0,
  },
  addReviewBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C67C4E',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F2D2C',
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 12,
  },
  tag: {
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F2D2C',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#9B9B9B',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  readMore: {
    color: '#C67C4E',
    fontWeight: '700',
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  sizeButton: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#FFF',
  },
  sizeButtonActive: {
    borderColor: '#C67C4E',
    backgroundColor: '#FFF0E6',
  },
  sizeText: {
    fontSize: 15,
    color: '#2F2D2C',
    fontWeight: '500',
  },
  sizeTextActive: {
    color: '#C67C4E',
    fontWeight: '700',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewCount: {
    fontSize: 15,
    color: '#C67C4E',
    fontWeight: '700',
  },
  emptyReviewBox: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyReviewText: {
    fontSize: 15,
    color: '#9B9B9B',
    textAlign: 'center',
    lineHeight: 22,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E8E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#C67C4E',
    fontWeight: '800',
    fontSize: 18,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2F2D2C',
    marginBottom: 2,
  },
  revStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  revDate: {
    fontSize: 11,
    color: '#A9A9A9',
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2F2D2C',
  },
  closeBtn: {
    backgroundColor: '#F3F3F3',
    padding: 8,
    borderRadius: 20,
  },
  starSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  reviewInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 20,
    height: 140,
    fontSize: 15,
    color: '#2F2D2C',
    textAlign: 'left',
    textAlignVertical: 'top',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  submitBtn: {
    backgroundColor: '#C67C4E',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#9B9B9B',
    marginBottom: 4,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#C67C4E',
  },
  buyButtonWrapper: {
    flex: 1.5,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  buyButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CoffeeDetail;
