import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore";
import LogoutButton from './Logout'; 

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "expenses"));
        setExpenses(querySnapshot.docs.map(doc => doc.data()));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const calculateBalances = () => {
    let balances = {};
    expenses.forEach(expense => {
      const { amount, payer, participants } = expense;
      const total = parseFloat(amount);

      if (!balances[payer]) balances[payer] = 0;
      balances[payer] += total;

      participants.forEach(participant => {
        const { name, amount } = participant;
        if (!balances[name]) balances[name] = 0;
        balances[name] -= parseFloat(amount);
      });
    });
    return balances;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (expenses.length === 0) {
    return <div>No expenses to calculate. Please add expenses first.</div>;
  }

  const balances = calculateBalances();

  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.description}: {expense.amount} paid by {expense.payer}
          </li>
        ))}
      </ul>
      <h2>Balances</h2>
      <ul>
        {Object.keys(balances).map((user, index) => (
          <li key={index}>
            {user}: {balances[user]}
          </li>
        ))}
      </ul>

      
      <LogoutButton /> {/* Renders the logout button for users to log out */}
    </div>
  );
};

export default Expenses;
