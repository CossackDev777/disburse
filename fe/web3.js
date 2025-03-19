import Web3 from "web3"

// Replace with your Infura Project ID
const INFURA_URL = "https://mainnet.infura.io/v3/c93cfa56e46948db8916111ab20f4714";
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

// Your Smart Contract Address
const contractAddress = "0x6b5E4921aCDb2f63960cD4ad7b4169DD92142850";

async function getBalance() {
    try {
        const balance = await web3.eth.getBalance(contractAddress);
        console.log(`Balance: ${web3.utils.fromWei(balance, "ether")} ETH`);
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}


const balance = await web3.eth.getBalance(contractAddress)
console.log("---------",balance)

getBalance();