import React, { useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import { Modal } from 'antd';
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
function Dashboard() {
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
    console.log('On Finish', values, type);
  };
  return (
    <div>
      <Header />
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
        isExpenseModalVisible={isIncomeModalVisible}
        handleExpenseCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      {/* <Modal
        style={{ fontWeight: 600 }}
        title="Add Expenses"
        onCancel={handleIncomeCancel}
        footer={null}
        visible={isIncomeModalVisible}
      >
        Income
      </Modal>
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Expenses"
        onCancel={handleExpenseCancel}
        footer={null}
        visible={isExpenseModalVisible}
      >
        Expense
      </Modal> */}
    </div>
  );
}

export default Dashboard;
