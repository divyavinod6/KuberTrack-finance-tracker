import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
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

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transaction`),
        transaction
      );
      console.log('document written with ID: ', docRef.id);
      toast.success('Transaction Added!');
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Couldnt add Transaction');
    }
  }
  useEffect(() => {
    // GET all doc from a collection
    fetchTransaction();
  }, [user]);

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
      setTransaction(transactionsArray);
      console.log('Transaction value: ', transactionsArray);
      toast.success('Transaction Fetched!');
    }
    setLoading(false);
  }
  return (
    <div>
      <Header />
      {loading ? (
        <p>loading...</p>
      ) : (
        <>
          <Cards
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
