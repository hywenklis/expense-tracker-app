import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Animated, Alert } from 'react-native';
import { Input, Button, Image, Text } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const auth = getAuth();

  const signIn = () => {
    if (email && password) {
      setSubmitLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          Alert.alert('Sucesso', 'Login realizado com sucesso');
          clearInputFields();
        })
        .catch(() => {
          Alert.alert('Erro', 'Erro ao fazer login. Verifique suas credenciais.');
          setSubmitLoading(false);
        });
    } else {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      setSubmitLoading(false);
    }
  };

  const clearInputFields = () => {
    navigation.replace('Home');
    setEmail('');
    setPassword('');
  };

  const containerOpacity = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Login',
    });
  }, [navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <StatusBar style='light' />
      <Image
        source={{
          uri:
            'https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1',
        }}
        style={styles.logo}
      />
      <KeyboardAvoidingView behavior='padding' style={styles.formContainer}>
        <Input
          placeholder='Email'
          value={email}
          onChangeText={(text) => setEmail(text)}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          placeholderTextColor='#888'
        />
        <Input
          placeholder='Senha'
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          onSubmitEditing={signIn}
          placeholderTextColor='#888'
        />

        <Button
          title='Entrar'
          onPress={signIn}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          loading={submitLoading}
        />
        <Button
          title='Cadastrar'
          onPress={() => navigation.navigate('Register')}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.outlineButton}
          titleStyle={styles.outlineButtonTitle}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    height: 50,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    height: 50,
  },
  outlineButtonTitle: {
    color: '#007bff',
  },
});
