import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { Text, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import format from 'date-fns/format';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { parse } from 'date-fns';

const UpdateScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [submitLoading, setSubmitLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Update Expense',
    });
  }, [navigation]);
  const [input, setInput] = useState('');
  const [amount, setAmount] = useState('');
  useEffect(() => {
    const db = getFirestore();
    const expenseRef = doc(db, 'expense', itemId);
    const unsubscribe = onSnapshot(expenseRef, (snapshot) => {
      const data = snapshot.data();
      setInput(data?.text || '');
      setAmount(data?.price || '');
      setSelDate(parse(data?.userDate, 'dd/MM/yyyy', new Date()));
      setSelectedLanguage(data?.type || 'expense');
    });
    return unsubscribe;
  }, []);

  const updateExpense = () => {
    if (input && amount && selDate && selectedLanguage) {
      setSubmitLoading(true);
      const db = getFirestore();
      const expenseRef = doc(db, 'expense', itemId);
      updateDoc(expenseRef, {
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
      setSubmitLoading(false);
      alert('All fields are mandatory');
    }
  };

  const clearInputFields = () => {
    alert('Updated Successfully');
    setInput('');
    setAmount('');
    setSelDate(new Date());
    setSelectedLanguage('expense');
    navigation.goBack();
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
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add Text"
          value={input}
          onChangeText={(text) => setInput(text)}
        />

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Add Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <Text style={styles.input} onPress={showDatepicker}>
          {result ? result : new Date()}
        </Text>

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)
          }
        >
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>

        <Button
          containerStyle={styles.button}
          title="Update"
          onPress={updateExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateScreen;

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