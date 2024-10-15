import React, { useState } from 'react';
import { Flex, Radio, Select, Table } from 'antd';
import searchImg from '../../assets/search.svg';
import { unparse } from 'papaparse';

function TransactionTable({ transactions }) {
  const [search, setSearch] = useState('');
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

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  function exportCSV() {
    const formattedData = transactions.map((item) => ({
      ...item,
      date: new Date(item.date).toISOString().split('T')[0], // Formatting date
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

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(a.Date) - new Date(b.date);
    } else if (sortKey === 'amount') {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });
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
          <img src={searchImg} width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
