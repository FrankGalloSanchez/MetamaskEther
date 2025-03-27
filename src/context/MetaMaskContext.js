import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers'; // Ahora se importa ethers como un solo objeto
// No necesitas importar 'providers' o 'utils' de manera separada

const MetaMaskContext = createContext();

export const useMetaMask = () => {
  return useContext(MetaMaskContext);
};

export const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum); // Utilizamos el proveedor de ethers directamente
      setProvider(tempProvider);

      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
          getBalance(accounts[0], tempProvider);
        })
        .catch((error) => {
          console.error('User rejected the request');
        });
    } else {
      alert('MetaMask no está instalado. Por favor, instálalo.');
    }
  }, []);

  const getBalance = async (account, tempProvider) => {
    const balance = await tempProvider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance)); // Se usa ethers.utils.formatEther
  };

  const sendTransaction = async (recipient, amount) => {
    if (provider && account) {
      const signer = provider.getSigner();
      const tx = {
        to: recipient,
        value: ethers.utils.parseEther(amount), // Se usa ethers.utils.parseEther
      };

      try {
        const transactionResponse = await signer.sendTransaction(tx);
        await transactionResponse.wait(); // Esperar a que la transacción sea confirmada
        alert('Transacción completada!');
      } catch (error) {
        alert('Error al enviar la transacción');
      }
    }
  };

  return (
    <MetaMaskContext.Provider value={{ account, balance, sendTransaction }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
