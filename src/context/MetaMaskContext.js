import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);

      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setAccount(accounts[0]);
          toast.success('MetaMask conectado con éxito');
          getBalance(accounts[0], tempProvider);
        })
        .catch((error) => {
          toast.error('Usuario rechazó la solicitud de conexión');
        });
    } else {
      toast.error('MetaMask no está instalado. Por favor, instálalo.');
    }
  }, []);

  const getBalance = async (account, tempProvider) => {
    const balance = await tempProvider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  const sendTransaction = async (recipient, amount) => {
    if (provider && account) {
      const signer = provider.getSigner();
      const tx = {
        to: recipient,
        value: ethers.utils.parseEther(amount),
      };

      try {
        const transactionResponse = await signer.sendTransaction(tx);
        toast.info('Enviando transacción...');
        await transactionResponse.wait();
        toast.success('Transacción completada con éxito!');
      } catch (error) {
        toast.error('Error al enviar la transacción');
      }
    }
  };

  return (
    <MetaMaskContext.Provider value={{ account, balance, sendTransaction }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </MetaMaskContext.Provider>
  );
};
