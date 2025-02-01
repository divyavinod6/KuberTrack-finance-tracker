import React, { useState } from 'react';
import { Radio, Select, Table } from 'antd';
import searchImg from '../../assets/search.svg';
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  //const [selectedTag, setSelectedTag] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const { Option } = Select;
  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
  ];

  // error solve here

  let filteredTransactions = (transactions || []).filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.type?.includes(typeFilter)
  );

  /*
  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && tagMatch && typeMatch
  })
  */
  let sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(a.Date) - new Date(b.date);
    } else if (sortKey === 'amount') {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportCSV() {
    const formattedData = transactions.map((item) => ({
      ...item,
      date: new Date(item.date).toISOString().split('T')[0], // Formatting dates
    }));

    var csv = unparse({
      fields: ['name', 'type', 'tag', 'date', 'amount'],
      data: formattedData,
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importCSV(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          console.log('RESULTS >>>>>', results);

          for (const transaction of results.data) {
            // write each transaction to firebase
            console.log('Transactions: ', transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success('All Transactions Added');
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div style={{ width: '97%', padding: '0rem 2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div className="input-flex">
          <img src={searchImg} alt="Search" width="16" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expenses</Option>
        </Select>
      </div>
      <div className="my-table">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <h2> My Transactions</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Radio.Button value="">No Sorting</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              width: '400px',
            }}
          >
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              onChange={importCSV}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <Table dataSource={sortedTransactions} columns={columns} />;
      </div>
    </div>
  );
}

export default TransactionTable;
