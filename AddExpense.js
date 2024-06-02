import React, { useState, useEffect } from 'react';
import { readUsers } from './firebase';
import { auth, addExpense_ } from './firebase';
import "./AddExpense.css";
import LogoutButton from './Logout'; 

const AddExpense = ({ user }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState('');
  const [image, setImage] = useState(null); // State to store the uploaded image
  const [showReport, setShowReport] = useState(false); // State to control the visibility of the report
  const [settlements, setSettlements] = useState({}); // State to store settlement information

  useEffect(() => {
    readUsers(setUsers);
  }, []);

  useEffect(() => {
    if (participants.length > 0) {
      generateReport();
    }
  }, [participants]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', orderAmount: 0, paidAmount: 0 }]);
  };

  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const calculateSettlements = () => {
    const balances = {};
    participants.forEach((participant) => {
      if (!balances[participant.name]) balances[participant.name] = 0;
      balances[participant.name] += participant.paidAmount - participant.orderAmount;
    });
    return balances;
  };

  const generateReport = () => {
    const settlementsData = calculateSettlements();
    let reportText = '';
    Object.keys(settlementsData).forEach((participant) => {
      if (settlementsData[participant] > 0) {
        Object.keys(settlementsData).forEach((otherParticipant) => {
          if (settlementsData[otherParticipant] < 0) {
            const amountToPay = Math.min(settlementsData[participant], Math.abs(settlementsData[otherParticipant]));
            settlementsData[participant] -= amountToPay;
            settlementsData[otherParticipant] += amountToPay;
            reportText += `${participant} has to pay ${amountToPay} to ${otherParticipant}\n`;
          }
        });
      }
    });
    setReport(reportText);
    setShowReport(true); // Show the report
    setSettlements(settlementsData); // Set settlement state
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleAddExpense = () => {
    const participantData = participants.map((participant) => ({
      name: participant.name,
      orderAmount: participant.orderAmount,
      paidAmount: participant.paidAmount,
      userId: participant.userId
    }));
    // Include the current user as a participant
    // participantData.push({
    //   name: user.email,
    //   orderAmount: 0,
    //   paidAmount: 0,
    //   userId: user.uid
    // });
    addExpense_ (description, amount, date, participants);
    // setDescription('');
    // setAmount(0);
    // setDate('');
    // setParticipants([]);
  };



  console.log(participants);
  console.log("participants---------------------------------=================================");



  return (
    <div className="expensepage">
      <h2>Expense Report</h2>
      <form>
        <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
        <input type="date" onChange={(e) => setDate(e.target.value)} />
        <h3>Participants</h3>
        {participants.map((participant, index) => (
          <div key={index}>
            <select onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}>
              <option value="" className="bold-option">Select Participant</option>
              {Object.keys(users).map((userId) => (
                <option key={userId} value={users[userId].username}>{users[userId].username}</option>
              ))}
            </select>
            <div>
              <label htmlFor={`paidAmount-${index}`}>Paid Amount: </label>
              <input type="number" placeholder="Paid Amount" onChange={(e) => handleParticipantChange(index, 'orderAmount', e.target.value)} />
            </div>
            <div>
              <label htmlFor={`orderAmount-${index}`}>Order Amount: </label>
              <input type="number" placeholder="Order Amount" onChange={(e) => handleParticipantChange(index, 'paidAmount', e.target.value)} />
            </div>
           
          </div>
        ))}
        <button type="button" onClick={handleAddParticipant}>Add Participant</button>
      </form>
      {/* Image Upload Section */}
      <div className="Upload_">
        <h3>Upload PNG Photo:</h3>
        <input type="file" accept=".png" onChange={handleImageChange} />
        {/* Display uploaded image */}
        {image && <img className="uploaded-image" src={URL.createObjectURL(image)} alt="Uploaded" />}
      </div>
      {/* Generate Report Button */}
      {<button onClick={generateReport && handleAddExpense (description, amount, date, participants)}>Generate Report</button> }
      {/* // <button onClick={generateReport}>Generate Report</button> */}
      
      {/* Report Section */
      showReport && (
        <div className="Report_">
          <h3>Report:</h3>
          <pre>{report}</pre>
         
          

        </div>
          
      )
      }
      {/* {showReport && (
        <div className="Report_">
          <h3>Report:</h3>
          <pre>{report}</pre>
        </div>
        
      )} */}
      
     
      

<LogoutButton />
    </div>
    
  );
  
  console.log(participants);
  console.log("participants---------------------------------=================================");


};

export default AddExpense;
