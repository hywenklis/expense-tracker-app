import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Input, Button, Text, Image } from 'react-native-elements';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back to Login',
    });
  }, [navigation]);

  const signUp = () => {
    if (fullName && email && password) {
      setSubmitLoading(true);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((authUser) => {
          clearInputFields();
          authUser.user.updateProfile({
            displayName: fullName,
            photoURL:
              imageUrl ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
          });
        })
        .catch((err) => {
          Alert.alert('Erro', err.message);
          setSubmitLoading(false);
        });
    } else {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      setSubmitLoading(false);
    }
  };

  const clearInputFields = () => {
    Alert.alert('Sucesso', 'Conta criada com sucesso');
    navigation.replace('Home');
    setSubmitLoading(false);
    setFullName('');
    setEmail('');
    setPassword('');
    setImageUrl('');
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri:
              'https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1',
          }}
          style={styles.logo}
        />
        <Text h4 style={styles.title}>
          Crie sua conta
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder='Nome'
          type='text'
          autoFocus
          value={fullName}
          onChangeText={(text) => setFullName(text)}
          inputStyle={styles.input}
        />
        <Input
          placeholder='Email'
          type='text'
          value={email}
          onChangeText={(text) => setEmail(text)}
          inputStyle={styles.input}
        />
        <Input
          placeholder='Senha'
          type='text'
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          inputStyle={styles.input}
        />
        <Input
          placeholder='Foto do perfil URL (opcional)'
          type='text'
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={signUp}
          inputStyle={styles.input}
        />
      </View>
      <Button
        containerStyle={styles.button}
        title='Cadastrar'
        onPress={signUp}
        loading={submitLoading}
        buttonStyle={styles.submitButton}
        titleStyle={styles.submitButtonTitle}
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '80%',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    height: 50,
  },
  submitButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
