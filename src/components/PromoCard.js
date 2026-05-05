import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PromoCard = () => (
  <View style={styles.promoContainer}>
    <LinearGradient
      colors={['#C67C4E', '#ED975D']}
      style={styles.promoCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.promoContent}>
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>Promo</Text>
        </View>
        <Text style={styles.promoTitle}>Buy one get{"\n"}one FREE</Text>
        <Text style={styles.promoSubtitle}>Only for today. Terms apply.</Text>
      </View>
      <View style={styles.promoGraphic}>
        {/* Abstract graphic circles for elegance */}
        <View style={styles.promoCircleLarge} />
        <View style={styles.promoCircleSmall} />
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  promoContainer: {
    paddingHorizontal: 0,
    marginTop: 20,
    marginBottom: 24,
  },
  promoCard: {
    height: 156,
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center',
  },
  promoBadge: {
    backgroundColor: '#ED5151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  promoBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.5,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  promoSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'left',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  promoGraphic: {
    position: 'absolute',
    right: -20,
    top: -20,
    zIndex: 1,
  },
  promoCircleLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    right: -20,
    top: -20,
  },
  promoCircleSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.05)',
    position: 'absolute',
    right: 50,
    top: 70,
  },
});

export default React.memo(PromoCard);
