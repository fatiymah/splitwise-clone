import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCmmlkLB67YbCyCF5kAxAJ4aUjCA2rpLKI",
  authDomain: "splitwise-clonee.firebaseapp.com",
  projectId: "splitwise-clonee",
  storageBucket: "splitwise-clonee.appspot.com",
  messagingSenderId: "564610415199",
  appId: "1:564610415199:web:d8ab3fad1d4f533bbe79ea",
  measurementId: "G-K64PF6T661"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };

export const writeUserData = (userId, name, email) => {
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email
  });
};

export const addExpense_ = async (description, amount, date, participants) => {
  try {
    // Reference for the 'expenses' node
    const expensesRef = ref(db, 'expenses');
    const newExpenseRef = push(expensesRef);
    
    const expenseData = {
      description,
      amount,
      date,
      participants,
      status: "unsettled"
    };

    // Write the new expense to the 'expenses' node
    await set(newExpenseRef, expenseData);

    // Write the expense data to each participant's 'expenses' node
    const participantPromises = participants.map(participant => {

      const userExpensesRef = ref(db, `users/${participant.userId}/expenses`);
      const newUserExpenseRef = push(userExpensesRef);
      return set(newUserExpenseRef, {
        description,
        amount,
        date,
        participant: participant.name,
        status: "unsettled"
      });
    });

    // Await all participant expense writes to complete
    await Promise.all(participantPromises);
    
  } catch (error) {
    console.error("Error writing expense data:", error);
  }
};



// export const addExpense_ = (description, amount, date, participants) => {
//   const expensesRef = ref(db, 'expenses');
//   const newExpenseRef = push(expensesRef);
//   const expenseData = {
//     description,
//     amount,
//     date,
//     participants,
//     status: "unsettled"
//   };
  
//   set(newExpenseRef, expenseData).then(() => {
//     participants.forEach(participant => {
//       const userExpensesRef = ref(db, `users/${participant.userId}/expenses`);
//       const newUserExpenseRef = push(userExpensesRef);
//       set(newUserExpenseRef, {
//         ...expenseData,
//         participant: participant.name
//       });
//     });
//   });
// };

export const updateExpenseStatus = (expenseId, status) => {
  const expenseRef = ref(db, `expenses/${expenseId}`);
  update(expenseRef, { status });

  onValue(expenseRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.participants) {
      data.participants.forEach(participant => {
        const userExpenseRef = ref(db, `users/${participant.userId}/expenses/${expenseId}`);
        update(userExpenseRef, { status });
      });
    }
  });
};

export const readExpenses = (callback) => {
  const expensesRef = ref(db, 'expenses');
  onValue(expensesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const readSettlements = (callback) => {
  const settlementsRef = ref(db, 'settlements');
  onValue(settlementsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const readUsers = (callback) => {
  const usersRef = ref(db, 'users');
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export { onAuthStateChanged };
