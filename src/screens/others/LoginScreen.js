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

export default function LoginScreen() {
    const navigation = useNavigation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            login(email, password);
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
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your coffee journey</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Email Address</Text>
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

                    <Text style={[styles.label, { marginTop: 24 }]}>Password</Text>
                    <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
                        <MaterialIcons 
                            name="lock" 
                            size={20} 
                            color={focusedInput === 'password' ? '#C67C4E' : '#B7B7B7'} 
                            style={styles.inputIcon} 
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
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

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <AnimatedButton
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </AnimatedButton>

                    <View style={styles.signupLinkContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.6}>
                            <Text style={styles.signupLink}>Sign Up</Text>
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
    },
    header: {
        height: 280,
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
        marginTop: 40,
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
        marginTop: -40,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 16,
    },
    forgotPasswordText: {
        color: '#C67C4E',
        fontSize: 14,
        fontWeight: '700',
    },
    loginButton: {
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
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    signupLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
    },
    signupText: {
        color: '#9B9B9B',
        fontSize: 15,
        fontWeight: '500',
    },
    signupLink: {
        color: '#C67C4E',
        fontSize: 15,
        fontWeight: '800',
    },
});
