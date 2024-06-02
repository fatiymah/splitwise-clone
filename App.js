// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layout';
import Login from './Login';
import SignUp from './SignUp';
import AddExpense from './AddExpense';
import Expenses from './Expenses';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Login from './Login';
// import SignUp from './SignUp';
// import AddExpense from './AddExpense';
// import Expenses from './Expenses';
// import { auth, onAuthStateChanged } from './firebase';

// const ProtectedRoute = ({ element, ...rest }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });

//     return () => unsubscribe();
//   }, []);

//   return user ? (
//     <Route {...rest} element={element} />
//   ) : (
//     <Navigate to="/" replace />
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           <ProtectedRoute path="/add-expense" element={<AddExpense />} />
//           <ProtectedRoute path="/expenses" element={<Expenses />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
