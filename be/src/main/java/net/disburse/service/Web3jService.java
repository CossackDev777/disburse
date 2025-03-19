package net.disburse.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.Bool;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.Arrays;

@Service
public class Web3jService {

    private final Web3j web3j;

    @Value("${ethereum.private.key}")
    private String privateKey;

    @Value("${ethereum.contract.address}")
    private String contractAddress;

    @Value("${ethereum.wallet.address}")
    private String walletAddress;

    public Web3jService(Web3j web3j) {
        this.web3j = web3j;
    }

    public String mintToken(BigInteger amount, boolean useUSDC) throws Exception {
        Credentials credentials = Credentials.create(privateKey);

        // Get transaction nonce
        EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
                walletAddress, DefaultBlockParameterName.LATEST).send();
        BigInteger nonce = ethGetTransactionCount.getTransactionCount();

        // Define gas settings
        BigInteger gasLimit = DefaultGasProvider.GAS_LIMIT;
        BigInteger gasPrice = DefaultGasProvider.GAS_PRICE;

        // Encode Mint Function Call
        Function function = new Function(
                "mint",
                Arrays.asList(new Uint256(amount), new Bool(useUSDC)),
                Arrays.asList()
        );
        String encodedFunction = FunctionEncoder.encode(function);

        // Create transaction
        RawTransaction rawTransaction = RawTransaction.createTransaction(
                nonce, gasPrice, gasLimit, contractAddress, encodedFunction);

        // Sign transaction
        byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
        String hexValue = Numeric.toHexString(signedMessage);

        // Send transaction
        EthSendTransaction response = web3j.ethSendRawTransaction(hexValue).send();

        if (response.hasError()) {
            throw new RuntimeException("Transaction failed: " + response.getError().getMessage());
        }

        return response.getTransactionHash();
    }
}