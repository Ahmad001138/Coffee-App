import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../../store/AuthContext';
import AnimatedButton from '../../components/AnimatedButton';

export default function SignupScreen() {
    const navigation = useNavigation();
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState('');

    const handleSignup = () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            signup({ name, email, password });
            navigation.navigate('Home');
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <LinearGradient
                        colors={['rgba(20, 20, 20, 1)', 'rgba(40, 40, 40, 1)']}
                        style={styles.headerGradient}
                    >
                        <AnimatedButton
                            style={styles.backButton}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <MaterialIcons name="arrow-back-ios-new" size={20} color="#FFF" />
                        </AnimatedButton>

                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Join our coffee community today</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={[styles.inputWrapper, focusedInput === 'name' && styles.inputWrapperFocused]}>
                        <MaterialIcons 
                            name="person" 
                            size={20} 
                            color={focusedInput === 'name' ? '#C67C4E' : '#B7B7B7'} 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor="#B7B7B7"
                            value={name}
                            onChangeText={setName}
                            onFocus={() => setFocusedInput('name')}
                            onBlur={() => setFocusedInput('')}
                        />
                    </View>

                    <Text style={[styles.label, { marginTop: 20 }]}>Email Address</Text>
                    <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputWrapperFocused]}>
                        <MaterialIcons 
                            name="email" 
                            size={20} 
                            color={focusedInput === 'email' ? '#C67C4E' : '#B7B7B7'} 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#B7B7B7"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput('')}
                        />
                    </View>

                    <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
                    <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
                        <MaterialIcons 
                            name="lock" 
                            size={20} 
                            color={focusedInput === 'password' ? '#C67C4E' : '#B7B7B7'} 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Create a password"
                            placeholderTextColor="#B7B7B7"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setFocusedInput('password')}
                            onBlur={() => setFocusedInput('')}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                            <MaterialIcons
                                name={showPassword ? "visibility" : "visibility-off"}
                                size={22}
                                color={focusedInput === 'password' ? '#C67C4E' : '#B7B7B7'}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, { marginTop: 20 }]}>Confirm Password</Text>
                    <View style={[styles.inputWrapper, focusedInput === 'confirm' && styles.inputWrapperFocused]}>
                        <MaterialIcons 
                            name="lock" 
                            size={20} 
                            color={focusedInput === 'confirm' ? '#C67C4E' : '#B7B7B7'} 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm your password"
                            placeholderTextColor="#B7B7B7"
                            secureTextEntry={!showPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onFocus={() => setFocusedInput('confirm')}
                            onBlur={() => setFocusedInput('')}
                        />
                    </View>

                    <AnimatedButton
                        style={[styles.signupButton, loading && styles.disabledButton]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        )}
                    </AnimatedButton>

                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.6}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        height: 260,
    },
    headerGradient: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: 30,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.5,
        textAlign: 'left',
        ...Platform.select({ android: { includeFontPadding: false } }),
    },
    subtitle: {
        fontSize: 16,
        color: '#B7B7B7',
        marginTop: 8,
        fontWeight: '500',
        textAlign: 'left',
        ...Platform.select({ android: { includeFontPadding: false } }),
    },
    formContainer: {
        paddingHorizontal: 24,
        marginTop: -30,
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        borderRadius: 24,
        paddingVertical: 32,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2F2D2C',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderWidth: 1.5,
        borderColor: '#F3F3F3',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputWrapperFocused: {
        borderColor: '#C67C4E',
        backgroundColor: '#FFF0E6',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#2F2D2C',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'left',
        ...Platform.select({
            android: {
                paddingVertical: 0,
                textAlignVertical: 'center',
            },
        }),
    },
    signupButton: {
        backgroundColor: '#C67C4E',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        shadowColor: '#C67C4E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: '#DEDEDE',
        shadowOpacity: 0,
        elevation: 0,
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
    },
    loginText: {
        color: '#9B9B9B',
        fontSize: 15,
        fontWeight: '500',
    },
    loginLink: {
        color: '#C67C4E',
        fontSize: 15,
        fontWeight: '800',
    },
});
