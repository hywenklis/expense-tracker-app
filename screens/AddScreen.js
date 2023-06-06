import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { Text, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import format from 'date-fns/format';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, currentUser } from 'firebase/auth';

const AddScreen = ({ navigation }) => {

  const [submitLoading, setSubmitLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Adicionar Finanças',
    });
  }, [navigation]);
  const [input, setInput] = useState('');
  const [amount, setAmount] = useState('');
  const createExpense = () => {
    const auth = getAuth();
    const db = getFirestore();
    if (input && amount && selDate && selectedLanguage && auth) {
      setSubmitLoading(true);
      addDoc(collection(db, 'expense'), {
        email: auth.currentUser?.email,
        text: input,
        price: amount,
        date: selDate,
        type: selectedLanguage,
        timestamp: serverTimestamp(),
        userDate: result,
      })
        .then(() => clearInputFields())
        .catch((error) => alert(error.message));
    } else {
      alert('Todos os campos são obrigatórios');
      setSubmitLoading(false);
    }
  };

  const clearInputFields = () => {
    alert('Criado com sucesso');
    setInput('');
    setAmount('');
    setSelDate(new Date());
    setSelectedLanguage('expense');
    navigation.navigate('Home');
    setSubmitLoading(false);
  };
  // Date Picker
  const [selDate, setSelDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setSelDate(currentDate);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const result = format(selDate, 'dd/MM/yyyy');

  // Select Dropdown
  const [selectedLanguage, setSelectedLanguage] = useState('expense');

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Adicione a descrição'
          value={input}
          onChangeText={(text) => setInput(text)}
        />

        {show && (
          <DateTimePicker
            testID='dateTimePicker'
            value={selDate}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />
        )}

        <TextInput
          style={styles.input}
          keyboardType='numeric'
          placeholder='Adicione o valor'
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <Text
          style={styles.input}
          placeholder='Selecione a data'
          value={result}
          onPress={showDatepicker}
        // editable={false}
        >
          {result ? result : new Date()}
        </Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)
          }
        >
          <Picker.Item label='Despesa' value='expense' />
          <Picker.Item label='Renda' value='income' />
        </Picker>

        <Button
          containerStyle={styles.button}
          title='Adicionar'
          onPress={createExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
