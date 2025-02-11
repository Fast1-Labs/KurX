import { useSignUp } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <TextInput
          style={[styles.textInput, { width: Dimensions.get('window').width / 3 }]}
          value={code}
          placeholder="Doğrulama Kodunu Giriniz"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Doğrula" onPress={onVerifyPress} color="cyan" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0a0f0d', '#064e3b', '#052e16']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.inputText}>Email</Text>

          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="email@email.com"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <Text style={styles.inputText}>Şifre</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="******"
            secureTextEntry
            onChangeText={(password) => setPassword(password)}
          />
          {password.length < 8 && (
            <Text style={styles.warningMessage}>Şifreniz en az 8 karakter olmalı!</Text>
          )}
          <Button title="Devam" onPress={onSignUpPress} color="cyan" />
          <View style={styles.button}>
            <Text style={[styles.buttonText, { color: 'white' }]}>Hesabınız var mı?</Text>
            <Link asChild href="/(auth)/sign-in">
              <Pressable style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Giriş yap</Text>
              </Pressable>
            </Link>
          </View>
        </View>
        <StatusBar style="light" />
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
  bodyContainer: {
    gap: 5,
    width: Dimensions.get('window').width,
  },
  title: {
    color: 'gainsboro',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 30,
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
  warningMessage: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    padding: 5,
  },
  buttonContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'darkgrey',
    padding: 10,
    backgroundColor: 'gainsboro',
  },
});
