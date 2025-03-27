import './App.css';
import React, { useState } from 'react';
import { useMetaMask, MetaMaskProvider } from './context/MetaMaskContext';

function App() {
  const { account, balance, sendTransaction } = useMetaMask();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendTransaction = () => {
    if (recipient && amount) {
      sendTransaction(recipient, amount);
    }
  };

  return (
    <div className="App">
      <h1>Conecta MetaMask</h1>
      {account ? (
        <>
          <p>Dirección de la cuenta: {account}</p>
          <p>Saldo: {balance} ETH</p>
          <div>
            <input
              type="text"
              placeholder="Dirección del destinatario"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cantidad de Ether"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleSendTransaction}>Enviar Ether</button>
          </div>
        </>
      ) : (
        <p>Conéctate a MetaMask</p>
      )}
    </div>
  );
}

export default function WrappedApp() {
  return (
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  );
}
