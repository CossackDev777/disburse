package net.disburse.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

@Configuration
public class Web3jConfig {
    @Bean
    public Web3j web3j() {
        // Replace with your Ethereum node URL (e.g., Infura, Alchemy, or local node)
        return Web3j.build(new HttpService("https://mainnet.infura.io/v3/c93cfa56e46948db8916111ab20f4714"));
    }
}
