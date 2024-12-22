import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
import TransactionTable from '../components/TransactionTable';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ChartsComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';
// import moment from 'moment';

function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
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
      date: values.date.format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    console.log('New Transaction', newTransaction);
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transaction`),
        transaction
      );
      console.log('document written with ID:- ', docRef.id);
      if (!many) toast.success('Transaction Added!');
      // Update the transaction state with the new transaction
      // setTransaction((prevTransactions) => {
      //   const updatedTransactions = [...prevTransactions, transaction];
      //   calculateBalance(updatedTransactions); // Update balance with the latest transactions
      //   return updatedTransactions;
      // });
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (error) {
      console.error('Error adding document: ', error);
      //if(!many) toast.error("Couldn't add transaction");
      toast.error('Couldnt add Transaction');
    }
  }

  useEffect(() => {
    // GET all doc from a collection
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (!isNaN(amount)) {
        if (transaction.type === 'income') {
          incomeTotal += amount;
        } else if (transaction.type === 'expense') {
          expensesTotal += amount;
        }
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transaction`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshot
        transactionsArray.push(doc.data());
      });
      if (JSON.stringify(transactionsArray) !== JSON.stringify(transactions)) {
        setTransactions(transactionsArray);
        console.log('Transaction value: ', transactionsArray);
        toast.success('Transaction Fetched!!');
      }
    } else {
      toast.error('No User');
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.data);
  });
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
          {transactions != [] ? (
            <ChartsComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
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
          <TransactionTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
