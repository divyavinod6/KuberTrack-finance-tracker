import React, { useRef } from 'react';
import { Line, Pie } from '@ant-design/charts';

function ChartsComponent({ sortedTransactions }) {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const data = sortedTransactions.map((item) => {
    return {
      date: item.date,
      amount: item.amount,
    };
  });

  const spendingData = sortedTransactions
    .filter((transaction) => transaction.type === 'expense')
    .map((transaction) => ({
      tag: transaction.tag,
      amount: transaction.amount,
    }));

  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount }; // creating new object with same properties
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  const config = {
    data: data,
    width: 900,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
  };
  const spendingConfig = {
    data: Object.values(finalSpendings),
    width: 500,
    autoFit: true,
    angleField: 'amount',
    colorField: 'tag',
  };

  return (
    <div className="charts-wrapper">
      <div>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (lineChartRef.current = chartInstance)}
        />
      </div>
      <div>
        <h2 style={{ marginTop: 0 }}>Your Spendings</h2>
        <Pie
          {...spendingConfig}
          onReady={(chartInstance) => (pieChartRef.current = chartInstance)}
        />
      </div>
    </div>
  );
}

export default ChartsComponent;
