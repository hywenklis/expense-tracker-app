import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, Avatar, ListItem } from 'react-native-elements'
import { getAuth, signOut, currentUser } from 'firebase/auth'
import { getFirestore, collection, orderBy, onSnapshot } from 'firebase/firestore'
import { StatusBar } from 'expo-status-bar'
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons'
import CustomListItem from '../components/CustomListItem'
import { color } from 'react-native-elements/dist/helpers'

const HomeScreen = ({ navigation }) => {
  const auth = getAuth()
  const signOutUser = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch((error) => alert(error.message))
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Finanças',
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            <Text style={{ fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation])

  // transactions
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      collection(db, 'expense'),
      orderBy('timestamp', 'desc'),
      (snapshot) => {
        setTransactions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
        setTotalIncome(
          snapshot.docs.map((doc) =>
            doc.data().email === auth.currentUser?.email && doc.data().type === 'income' ? doc.data().price : 0
          )
        )
        setTotalExpense(
          snapshot.docs.map((doc) =>
            doc.data().email === auth.currentUser?.email && doc.data().type === 'expense' ? doc.data().price : 0
          )
        )
      }
    )
    return unsubscribe
  }, [])

  // stufff
  const [totalIncome, setTotalIncome] = useState([])
  const [income, setIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState([])
  const [expense, setExpense] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  useEffect(() => {
    if (totalIncome) {
      if (totalIncome.length === 0) {
        setIncome(0)
      } else {
        setIncome(totalIncome.reduce((a, b) => Number(a) + Number(b), 0))
      }
    }
    if (totalExpense) {
      if (totalExpense.length === 0) {
        setExpense(0)
      } else {
        setExpense(totalExpense.reduce((a, b) => Number(a) + Number(b), 0))
      }
    }
  }, [totalIncome, totalExpense])

  useEffect(() => {
    if (income || expense) {
      setTotalBalance(income - expense)
    } else {
      setTotalBalance(0)
    }
  }, [income, expense])

  const [filter, setFilter] = useState([])
  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter(
          (transaction) => transaction.data.email === auth.currentUser?.email
        )
      )
    }
  }, [transactions])

  return (
    <>
      <View style={styles.container}>
        <StatusBar style='dark' />
        <View style={styles.fullName}>
          <Avatar
            size='medium'
            rounded
            source={{
              uri: currentUser?.photoURL,
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Bem vindo</Text>
            <Text h4 style={{ color: '#4A2D5D' }}>
              {auth.currentUser.displayName}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={{ textAlign: 'center', color: 'aliceblue' }}>
              Saldo Total
            </Text>
            <Text h3 style={{ textAlign: 'center', color: 'aliceblue' }}>
              R$ {totalBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Feather name='arrow-up' size={18} color='#35c44b' />
                <Text
                  style={{
                    textAlign: 'center',
                    marginLeft: 5,
                    color: '#35c44b',
                  }}
                >
                  Renda
                </Text>
              </View>
              <Text h4 style={{ textAlign: 'center', color: '#d1edce' }}>
                {`R$ ${income?.toFixed(2)}`}
              </Text>
            </View>
            <View>
              <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end' }}>
                <Text style={{ textAlign: 'center', marginRight: 5, color: '#db0d29' }}>
                  Despesa
                </Text>
                <Feather name='arrow-down' size={18} color='#db0d29' />
              </View>
              <Text h4 style={{ textAlign: 'center', color: '#edced5' }}>
                {`R$ ${expense?.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.recentTitle}>
          <Text h4 style={{ color: '#4A2D5D' }}>
            Últimas Atualizações
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('All')}
          >
            <Text style={styles.seeAll}>Todos</Text>
          </TouchableOpacity>
        </View>

        {filter?.length > 0 ? (
          <View style={styles.recentTransactions}>
            {filter?.slice(0, 3).map((info) => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.containerNull}>
            <FontAwesome5 name='list-alt' size={24} color='#EF8A76' />
            <Text h4 style={{ color: '#4A2D5D' }}>
              No Transactions
            </Text>
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign name='home' size={24} color='#66AFBB' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate('Add')}
          activeOpacity={0.5}
        >
          <AntDesign name='plus' size={24} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('All')}
        >
          <FontAwesome5 name='list-alt' size={24} color='#EF8A76' />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  fullName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4A2D5D',
  },
  userName: {
    fontSize: 24,
    color: '#4A2D5D',
  },
  card: {
    backgroundColor: '#6f3499',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTop: {
    marginBottom: 20,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  cardAmount: {
    textAlign: 'center',
    fontSize: 28,
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4A2D5D',
    padding: 10,
    borderRadius: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cardBottomItem: {
    alignItems: 'center',
  },
  cardBottomText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4A2D5D',
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seeAll: {
    fontWeight: 'bold',
    color: '#308c26',
    fontSize: 16,
  },
  recentTransactions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionText: {
    flex: 1,
    fontSize: 16,
    color: '#4A2D5D',
  },
  containerNull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTransactionsText: {
    marginTop: 10,
    color: '#4A2D5D',
    fontSize: 18,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  plusButton: {
    backgroundColor: '#4A2D5D',
    padding: 18,
    borderRadius: 50,
  },
});