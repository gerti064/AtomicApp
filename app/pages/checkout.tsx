import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type PaymentMethod = 'card' | 'cash' | 'bank';

type DeliveryMethod = 'delivery' | 'pickup';

type OrderData = {
  items: CartItem[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  deliveryInfo: {
    method: DeliveryMethod;
    address?: string;
    city?: string;
    zipCode?: string;
    notes?: string;
  };
  paymentInfo: {
    method: PaymentMethod;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardName?: string;
  };
  total: number;
  deliveryFee: number;
  tax: number;
  finalTotal: number;
};

export default function CheckoutScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Form data
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    city: 'Skopje',
    zipCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  // Form validation
  const [errors, setErrors] = useState<any>({});

  const formatCurrency = (v?: number) => {
    if (v == null) return '—';
    try {
      return new Intl.NumberFormat(undefined, { 
        style: 'currency', 
        currency: 'MKD', 
        maximumFractionDigits: 0 
      }).format(v);
    } catch {
      return `${v} MKD`;
    }
  };

  const loadCart = async () => {
    setLoading(true);
    try {
      const raw = await SecureStore.getItemAsync('cart');
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      
      if (cart.length === 0) {
        Alert.alert(
          'Empty Cart',
          'Your cart is empty. Please add some items before checkout.',
          [{ text: 'OK', onPress: () => router.push('/(tabs)/Orders') }]
        );
        return;
      }
      
      setItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
      // Trigger entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 150 : 0; // 150 MKD delivery fee
  const tax = Math.round(subtotal * 0.18); // 18% VAT
  const total = subtotal + deliveryFee + tax;

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateStep1 = () => {
    const newErrors: any = {};
    
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(customerInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    
    if (deliveryMethod === 'delivery') {
      if (!deliveryInfo.address.trim()) newErrors.address = 'Address is required';
      if (!deliveryInfo.city.trim()) newErrors.city = 'City is required';
      if (!deliveryInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: any = {};
    
    if (paymentMethod === 'card') {
      if (!paymentInfo.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(paymentInfo.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!paymentInfo.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        newErrors.expiryDate = 'Format: MM/YY';
      }
      
      if (!paymentInfo.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
      
      if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const generateOrderId = () => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const processOrder = async () => {
    if (!validateStep3()) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const orderData: OrderData = {
        items,
        customerInfo,
        deliveryInfo: {
          method: deliveryMethod,
          ...(deliveryMethod === 'delivery' ? deliveryInfo : {}),
        },
        paymentInfo: {
          method: paymentMethod,
          ...(paymentMethod === 'card' ? {
            cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4),
            cardName: paymentInfo.cardName,
          } : {}),
        },
        total: subtotal,
        deliveryFee,
        tax,
        finalTotal: total,
      };
      
      // Save order to storage
      const orderId = generateOrderId();
      const orders = await SecureStore.getItemAsync('orders');
      const orderHistory = orders ? JSON.parse(orders) : [];
      
      orderHistory.push({
        id: orderId,
        ...orderData,
        date: new Date().toISOString(),
        status: 'confirmed',
      });
      
      await SecureStore.setItemAsync('orders', JSON.stringify(orderHistory));
      
      // Clear cart
      await SecureStore.setItemAsync('cart', JSON.stringify([]));
      
      Alert.alert(
        'Order Confirmed! 🎉',
        `Your order ${orderId} has been confirmed and will be processed shortly.\n\nTotal: ${formatCurrency(total)}`,
        [
          {
            text: 'View Orders',
            onPress: () => router.push('/(tabs)/Orders')
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.push('/(tabs)'),
            style: 'default'
          }
        ]
      );
      
    } catch (error) {
      console.error('Order processing error:', error);
      Alert.alert(
        'Order Failed',
        'There was an error processing your order. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map(step => (
        <View key={step} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive,
            currentStep > step && styles.stepCircleCompleted,
          ]}>
            <Text style={[
              styles.stepNumber,
              currentStep >= step && styles.stepNumberActive,
            ]}>
              {currentStep > step ? '✓' : step}
            </Text>
          </View>
          <Text style={[
            styles.stepLabel,
            currentStep >= step && styles.stepLabelActive,
          ]}>
            {['Customer', 'Delivery', 'Payment', 'Review'][step - 1]}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderCustomerInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👤 Customer Information</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            value={customerInfo.firstName}
            onChangeText={(text) => setCustomerInfo({...customerInfo, firstName: text})}
            placeholder="John"
            placeholderTextColor="#666"
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>
        
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            value={customerInfo.lastName}
            onChangeText={(text) => setCustomerInfo({...customerInfo, lastName: text})}
            placeholder="Doe"
            placeholderTextColor="#666"
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={customerInfo.email}
          onChangeText={(text) => setCustomerInfo({...customerInfo, email: text})}
          placeholder="john.doe@example.com"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={customerInfo.phone}
          onChangeText={(text) => setCustomerInfo({...customerInfo, phone: text})}
          placeholder="+389 70 123 456"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>
    </View>
  );

  const renderDeliveryInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🚚 Delivery Options</Text>
      
      <View style={styles.optionGroup}>
        <TouchableOpacity
          style={[styles.optionCard, deliveryMethod === 'delivery' && styles.optionCardActive]}
          onPress={() => setDeliveryMethod('delivery')}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>🚚</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Home Delivery</Text>
              <Text style={styles.optionSubtitle}>Delivered to your door</Text>
            </View>
            <Text style={styles.optionPrice}>+{formatCurrency(150)}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.optionCard, deliveryMethod === 'pickup' && styles.optionCardActive]}
          onPress={() => setDeliveryMethod('pickup')}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>🏪</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Store Pickup</Text>
              <Text style={styles.optionSubtitle}>Pick up from our store</Text>
            </View>
            <Text style={styles.optionPrice}>Free</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {deliveryMethod === 'delivery' && (
        <View style={styles.deliveryForm}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={deliveryInfo.address}
              onChangeText={(text) => setDeliveryInfo({...deliveryInfo, address: text})}
              placeholder="Street address, apartment, suite, etc."
              placeholderTextColor="#666"
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={deliveryInfo.city}
                onChangeText={(text) => setDeliveryInfo({...deliveryInfo, city: text})}
                placeholder="Skopje"
                placeholderTextColor="#666"
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>
            
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>ZIP Code</Text>
              <TextInput
                style={[styles.input, errors.zipCode && styles.inputError]}
                value={deliveryInfo.zipCode}
                onChangeText={(text) => setDeliveryInfo({...deliveryInfo, zipCode: text})}
                placeholder="1000"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Delivery Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={deliveryInfo.notes}
              onChangeText={(text) => setDeliveryInfo({...deliveryInfo, notes: text})}
              placeholder="Any special instructions for delivery..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderPaymentInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>💳 Payment Method</Text>
      
      <View style={styles.optionGroup}>
        <TouchableOpacity
          style={[styles.optionCard, paymentMethod === 'card' && styles.optionCardActive]}
          onPress={() => setPaymentMethod('card')}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>💳</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Credit/Debit Card</Text>
              <Text style={styles.optionSubtitle}>Visa, MasterCard, etc.</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.optionCard, paymentMethod === 'cash' && styles.optionCardActive]}
          onPress={() => setPaymentMethod('cash')}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>💵</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Cash on Delivery</Text>
              <Text style={styles.optionSubtitle}>Pay when you receive</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.optionCard, paymentMethod === 'bank' && styles.optionCardActive]}
          onPress={() => setPaymentMethod('bank')}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>🏦</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Bank Transfer</Text>
              <Text style={styles.optionSubtitle}>Direct bank payment</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      {paymentMethod === 'card' && (
        <View style={styles.paymentForm}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={[styles.input, errors.cardNumber && styles.inputError]}
              value={paymentInfo.cardNumber}
              onChangeText={(text) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(text)})}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={19}
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={[styles.input, errors.expiryDate && styles.inputError]}
                value={paymentInfo.expiryDate}
                onChangeText={(text) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(text)})}
                placeholder="MM/YY"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={5}
              />
              {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
            </View>
            
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError]}
                value={paymentInfo.cvv}
                onChangeText={(text) => setPaymentInfo({...paymentInfo, cvv: text})}
                placeholder="123"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
              {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={[styles.input, errors.cardName && styles.inputError]}
              value={paymentInfo.cardName}
              onChangeText={(text) => setPaymentInfo({...paymentInfo, cardName: text})}
              placeholder="John Doe"
              placeholderTextColor="#666"
              autoCapitalize="words"
            />
            {errors.cardName && <Text style={styles.errorText}>{errors.cardName}</Text>}
          </View>
        </View>
      )}
    </View>
  );

  const renderOrderReview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📋 Order Review</Text>
      
      {/* Order Items */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Items ({items.length})</Text>
        {items.map(item => (
          <View key={item.id} style={styles.reviewItem}>
            <View style={styles.reviewItemInfo}>
              <Text style={styles.reviewItemName}>{item.name}</Text>
              <Text style={styles.reviewItemDetails}>Qty: {item.quantity} × {formatCurrency(item.price)}</Text>
            </View>
            <Text style={styles.reviewItemPrice}>
              {formatCurrency(item.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Customer Info */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Customer</Text>
        <Text style={styles.reviewText}>
          {customerInfo.firstName} {customerInfo.lastName}
        </Text>
        <Text style={styles.reviewText}>{customerInfo.email}</Text>
        <Text style={styles.reviewText}>{customerInfo.phone}</Text>
      </View>
      
      {/* Delivery Info */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Delivery</Text>
        <Text style={styles.reviewText}>
          {deliveryMethod === 'delivery' ? '🚚 Home Delivery' : '🏪 Store Pickup'}
        </Text>
        {deliveryMethod === 'delivery' && (
          <>
            <Text style={styles.reviewText}>{deliveryInfo.address}</Text>
            <Text style={styles.reviewText}>{deliveryInfo.city}, {deliveryInfo.zipCode}</Text>
            {deliveryInfo.notes && (
              <Text style={styles.reviewText}>Note: {deliveryInfo.notes}</Text>
            )}
          </>
        )}
      </View>
      
      {/* Payment Info */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Payment</Text>
        <Text style={styles.reviewText}>
          {paymentMethod === 'card' && '💳 Credit/Debit Card'}
          {paymentMethod === 'cash' && '💵 Cash on Delivery'}
          {paymentMethod === 'bank' && '🏦 Bank Transfer'}
        </Text>
        {paymentMethod === 'card' && paymentInfo.cardNumber && (
          <Text style={styles.reviewText}>
            **** **** **** {paymentInfo.cardNumber.slice(-4)}
          </Text>
        )}
      </View>
      
      {/* Order Total */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>{formatCurrency(deliveryFee)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (18%)</Text>
          <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460']} style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading checkout...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460']} style={styles.screen}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <BlurView intensity={20} style={styles.header}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.headerGradient}
            >
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>🛒 Checkout</Text>
              <View style={styles.headerRight} />
            </LinearGradient>
          </BlurView>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {currentStep === 1 && renderCustomerInfo()}
            {currentStep === 2 && renderDeliveryInfo()}
            {currentStep === 3 && renderPaymentInfo()}
            {currentStep === 4 && renderOrderReview()}
          </ScrollView>

          {/* Footer */}
          <BlurView intensity={30} style={styles.footer}>
            <LinearGradient
              colors={['rgba(10,10,10,0.95)', 'rgba(26,26,46,0.9)']}
              style={styles.footerGradient}
            >
              <View style={styles.footerTotal}>
                <Text style={styles.footerTotalLabel}>Total</Text>
                <Text style={styles.footerTotalValue}>{formatCurrency(total)}</Text>
              </View>
              
              <View style={styles.footerButtons}>
                {currentStep > 1 && (
                  <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                    <Text style={styles.backButtonText}>← Previous</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
                  onPress={currentStep === 4 ? processOrder : nextStep}
                  disabled={processing}
                >
                  {processing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.nextButtonText}>
                      {currentStep === 4 ? 'Place Order' : 'Next →'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },

  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },

  // Step Indicator Styles
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  stepCircleCompleted: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  stepNumber: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#fff',
  },

  // Content Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // Input Styles
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    flex: 0.48,
  },
  inputLabel: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },

  // Option Card Styles
  optionGroup: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  optionCardActive: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(102,126,234,0.1)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  optionPrice: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Form Styles
  deliveryForm: {
    marginTop: 20,
  },
  paymentForm: {
    marginTop: 20,
  },

  // Review Styles
  reviewSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewSectionTitle: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  reviewItemInfo: {
    flex: 1,
  },
  reviewItemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewItemDetails: {
    color: '#ccc',
    fontSize: 14,
  },
  reviewItemPrice: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },

  // Order Summary Styles
  orderSummary: {
    backgroundColor: 'rgba(102,126,234,0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    marginTop: 8,
    paddingTop: 16,
  },
  summaryTotalLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    color: '#667eea',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Footer Styles
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  footerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerTotalLabel: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  footerTotalValue: {
    color: '#667eea',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
  },
  backButtonText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  nextButtonFull: {
    marginRight: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});