import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import Web3 from "web3"
import { StripePayment } from './StripePayment'
import { Navigate, useNavigate } from 'react-router';
import PaymentModal from "./PaymentModal";
import { ethers } from "ethers"
import { getAuth } from '@/auth';

const Trusds = () => {

  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();


  const columns = useMemo(
    () => [
      {
        accessorFn: (row: { TRUSD: any; }) => row.TRUSD,
        id: "TRUSD",
        Header: "TRUSD",
        enableSorting: true,
        meta: {
          className: "min-w-[150px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row: { balance: any; }) => row.balance,
        id: "Balance",
        Header: "Balance",
        enableSorting: true,
        meta: {
          className: "min-w-[150px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row: { contractAddress: any; }) => row.contractAddress,
        id: "Contract Address",
        Header: "Contract Address",
        enableSorting: false,
        meta: {
          className: "min-w-[250px]",
          cellClassName: "text-gray-600 font-mono",
        },
      },
      {
        accessorFn: (row: { Address: any; }) => row.Address,
        id: "Address",
        Header: "Address",
        enableSorting: false,
        meta: {
          className: "min-w-[250px]",
          cellClassName: "text-gray-600 font-mono",
        },
      },
      {
        id: "actions",
        Header: "Action",
        enableSorting: false,
        cell: ({ }) => (
          <div className="flex justify-center space-x-2">
            <button
              className="px-3 py-2 rounded bg-blue-600 text-white w-full btn-primary"
              onClick={() => openModal("buy")}
            >
              Buy
            </button>
            <button
              className="px-3 py-2 rounded bg-red-600 text-white w-full btn-danger"
              onClick={() => openModal("redeem")}
            >
              Redeem
            </button>
          </div>
        ),
        meta: {
          className: "min-w-[200px]",
          cellClassName: "text-gray-600 font-mono",
        },
      }
    ],
    []
  );

  //////modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "buy" or "redeem"
  const [price, SetPrice] = useState('0');

  // Function to open modal and set type
  const openModal = (type: React.SetStateAction<string>) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // Function to close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement; // Type assertion
    if (target.id === "modalOverlay") {
      setIsModalOpen(false);
      setPriceval('')
    }
  };


  // Define modal content dynamically
  const auth_token = getAuth()?.access_token;
  const getModalContent = () => {
    if (modalType === "buy") {
      return {
        title: "Buy TRUSD",
        buttonText: "Confirm Purchase",
        action: () => {
          setIsModalOpen(false);  // Close the current modal
          setTimeout(() => setIsPayModalOpen(true), 1); // Small delay to avoid UI flicker
          setPriceval('');
          console.log("------", price)
          // setIsPayModalOpen(true)
        },
        color: "bg-blue-500",
      };
    } else if (modalType === "redeem") {
      return {
        title: "Redeem TRUSD",
        buttonText: "Confirm Redeem",
        action: () => {
          // Send a request to the backend
          fetch("http://localhost:8080/api/redeem-trusd", {
            method: "POST",
            headers: { Authorization: `Bearer ${auth_token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: 10, // Replace with the actual amount to redeem
              userId: 123
            }),
          })
          .then((response) => {
            if (!response.ok) {
                throw new Error("Request failed with status: " + response.status);
            }
            return response.json(); // Now we expect a JSON response
          })
          .then((data) => {
              console.log("Redeem successful:", data);
              alert(`Status: ${data.status}\nMessage: ${data.message}`);
          })
          .catch((error) => {
              console.error("Error redeeming TRUSD:", error);
              alert("Redeem failed. Please try again.");
          });
        },
        color: "bg-blue-500",
      };
    }
    return {};
  };

  const { title, buttonText, action, color } = getModalContent();

  //---------Stripe window dialog --------//
  const [isOpenStripe, setIsOpenStripe] = useState(false);
  const openStripeModal = () => setIsOpenStripe(true);
  const closeStripeModal = () => setIsOpenStripe(false);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  //TRUSD
  var [balance, setBalance] = useState<string>("0");
  const [priceval, setPriceval] = useState('');
  const pricevalchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPriceval(value);
      SetPrice(value)
    }
  };

  // const INFURA_URL = "https://mainnet.infura.io/v3/c93cfa56e46948db8916111ab20f4714";
  const HOLESKY_RPC = "https://ethereum-holesky.publicnode.com";
  const web3 = new Web3(new Web3.providers.HttpProvider(HOLESKY_RPC));
  const TRUSD_CONTRACT_ADDRESS = "0x6b5E4921aCDb2f63960cD4ad7b4169DD92142850";
  // Your Metamask Address

  const METAMASK_ADDRESS = localStorage.connectedAccount;
  const TRUSD_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "initialAuthority",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "usdcAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "usdtAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "feeVaultAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "authority",
          "type": "address"
        }
      ],
      "name": "AccessManagedInvalidAuthority",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "caller",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "delay",
          "type": "uint32"
        }
      ],
      "name": "AccessManagedRequiredDelay",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "caller",
          "type": "address"
        }
      ],
      "name": "AccessManagedUnauthorized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ECDSAInvalidSignature",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "name": "ECDSAInvalidSignatureLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "ECDSAInvalidSignatureS",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "ERC20Blocked",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "ERC20InsufficientFrozenBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "ERC20InsufficientUnfrozenBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ERC20NotCustodian",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "ERC2612ExpiredSignature",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "signer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC2612InvalidSigner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "maxLoan",
          "type": "uint256"
        }
      ],
      "name": "ERC3156ExceededMaxLoan",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC3156InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "ERC3156UnsupportedToken",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "currentNonce",
          "type": "uint256"
        }
      ],
      "name": "InvalidAccountNonce",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidShortString",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "str",
          "type": "string"
        }
      ],
      "name": "StringTooLong",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "authority",
          "type": "address"
        }
      ],
      "name": "AuthorityUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "EIP712DomainChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensFrozen",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensUnfrozen",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "UserBlocked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "UserUnblocked",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "USDC",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "USDT",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "authority",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "availableBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "available",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "blocked",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "eip712Domain",
      "outputs": [
        {
          "internalType": "bytes1",
          "name": "fields",
          "type": "bytes1"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "version",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "verifyingContract",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "internalType": "uint256[]",
          "name": "extensions",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeVault",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "flashFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IERC3156FlashBorrower",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "flashLoan",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "freeze",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "frozen",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isConsumingScheduledOp",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "maxFlashLoan",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "useUSDC",
          "type": "bool"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "nonces",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "permit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "redeem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "redemptionFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newAuthority",
          "type": "address"
        }
      ],
      "name": "setAuthority",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newFee",
          "type": "uint256"
        }
      ],
      "name": "setRedemptionFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const getTRUSDBalance = async (): Promise<void> => {
    try {
      const contract = new web3.eth.Contract(TRUSD_ABI, TRUSD_CONTRACT_ADDRESS);
      const balanceWei: string = await contract.methods.balanceOf(METAMASK_ADDRESS).call();
      // Assuming TRUSD uses 18 decimals like ERC-20
      const formattedBalance = web3.utils.fromWei(balanceWei, "ether");
      const DecimalBalance = (formattedBalance: number) => {
        return formattedBalance.toFixed(4);
      }
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching TRUSD balance:", error);
      setBalance("0");
    }
  };
  const addressValue = localStorage.connectedAccount ? localStorage.connectedAccount : ""; // Set empty if null
  const TrusdData = [
    { id: 1, TRUSD: "TRUSD", contractAddress: "0x6b5E4921aCDb2f63960cD4ad7b4169DD92142850", Address: addressValue , balance: balance }
  ];
  useEffect(() => {
    getTRUSDBalance();
  }, []);


  return (
    <>
      <div className="card card-grid min-w-full">
        <div className="card-header flex-wrap gap-2">
          <h3 className="card-title font-medium text-sm">{''}</h3>

          <div className="flex flex-wrap gap-2 lg:gap-5">
            <div className="flex">
              {/* <label className="input input-sm">
                <KeenIcon icon="magnifier" />
                <input
                  placeholder="Search By Name"
                  type="text"
                  value={filter}
                  onChange={(event) => {
                    setFilter(event.target.value);
                  }}
                />
              </label> */}
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataGrid
            loading={false}
            data={TrusdData}
            columns={columns}
            rowSelect={false}
            pagination={{ size: 5 }}
            sorting={[{ id: "TRUSD", desc: true }]}
          />
        </div>

        {/* Modal Window */}
        {isModalOpen && (
          <div
            id="modalOverlay"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOutsideClick}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <h2 className="text-xl font-semibold mb-4">{title}</h2>

              {/* Current Balance */}
              <p className="text-lg">
                Balance: <span className="text-blue-600">{ }</span>
              </p>

              {/* Input for Amount */}
              <input
                type="number"
                value={priceval}
                onChange={pricevalchange}
                className="border border-gray-300 p-2 rounded w-full mt-3"
              />

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {setIsModalOpen(false), setPriceval('')}}
                  className="px-2 py-2 bg-danger-500 text-white rounded btn-danger w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={action}
                  className={`px-2 py-2 bg-primary-500 text-white btn-primary w-full rounded ${color}`}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        )}

        {isOpenStripe && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeStripeModal}
          >
            {/* Modal Content */}
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <h2 className="text-xl font-semibold">This is a Dialog</h2>
              <p className="mt-2">Here is some content inside the modal.</p>
              <button
                onClick={closeStripeModal}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <PaymentModal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} onPaymentSuccess={() => console.log("Payment Successful!")} />
        <div className="modal" id="myModal">
          <div className="modal-dialog">
            <div className="modal-content">

              {/* <!-- Modal Header --> */}
              <div className="modal-header">
                <h4 className="modal-title">Modal Heading</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              {/* <!-- Modal body --> */}
              <div className="modal-body">
                Modal body..
              </div>

              {/* <!-- Modal footer --> */}
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { Trusds }