import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = useState('');

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  const handleGoogleAuth = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await googleAuth();

      if (!setActive) {
        throw new Error('setActive is not defined');
      }

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.push('/(tabs)');
      } else {
        throw new Error('Google sign-in failed to create a session.');
      }
    } catch (error) {
      console.error('Error while logging in with Google', error);
      setError('Google sign-in failed. Please try again.');
    }
  }, [googleAuth, setActive, router]);

  return (
    <LinearGradient colors={['#0a0f0d', '#064e3b', '#052e16']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Giriş Yap</Text>
          <Text style={styles.inputText}>Email</Text>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="email@email.com"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <Text style={styles.inputText}>Şifre</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="******"
            secureTextEntry
            onChangeText={(password) => setPassword(password)}
          />
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          <Pressable style={styles.googleButton} onPress={handleGoogleAuth}>
            <Text style={styles.signInGoogleText}>Google ile giriş yap</Text>
            <FontAwesome name="google" size={20} color="black" />
          </Pressable>
          <Button title="Giriş yap" onPress={onSignInPress} color="cyan" />
          <View style={styles.signupContainer}>
            <Text style={styles.bottomText}>Kayıtlı hesabınız yok mu?</Text>
            <Link href="/sign-up" asChild>
              <Pressable style={styles.signupButton}>
                <Text style={styles.signupText}>Kayıt ol</Text>
              </Pressable>
            </Link>
          </View>
          <StatusBar style="light" />
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'gainsboro',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 30,
  },
  bodyContainer: {
    gap: 5,
    width: Dimensions.get('window').width,
  },
  textInput: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  inputText: {
    color: 'gainsboro',
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  bottomText: {
    color: 'gainsboro',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signupContainer: {
    gap: 20,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: 'gainsboro',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
    width: Dimensions.get('window').width / 2,
  },
  signupText: {
    color: 'purple',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  errorMessage: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: Dimensions.get('window').width / 2,
    alignSelf: 'center',
  },
  signInGoogleText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
