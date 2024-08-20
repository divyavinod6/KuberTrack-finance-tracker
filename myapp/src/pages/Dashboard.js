import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
import TransactionTable from '../components/TransactionTable';
import {
  addDoc,
  collection,
  query,
  getDocs,
  Transaction,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';

function Dashboard() {
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(newTransaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transaction`),
        newTransaction
      );
      console.log('document written with ID: ', docRef.id);
      toast.success('Transaction Added!');
      // Update the transaction state with the new transaction
      setTransaction((prevTransactions) => {
        const updatedTransactions = [...prevTransactions, newTransaction];
        calculateBalance(updatedTransactions); // Update balance with the latest transactions
        return updatedTransactions;
      });
      // let newArr = transaction;
      // newArr.push(transaction);
      // setTransaction(newArr);
      // calculateBalance();
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Couldnt add Transaction');
    }
  }
  useEffect(() => {
    // GET all doc from a collection
    if (user) {
      fetchTransaction();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance(transaction);
  }, [transaction]);

  const calculateBalance = (transaction) => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transaction.forEach((transaction) => {
      if (transaction.type === 'income') {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    //
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };
  async function fetchTransaction() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transaction`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      if (JSON.stringify(transactionsArray) !== JSON.stringify(transaction)) {
        setTransaction(transactionsArray);
        console.log('Transaction value: ', transactionsArray);
        toast.success('Transaction Fetched!!');
      }
    }
    setLoading(false);
  }
  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transaction} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
