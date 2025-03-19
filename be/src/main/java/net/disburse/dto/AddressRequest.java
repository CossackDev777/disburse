package net.disburse.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    private String address;
    private String nickname;
    private long chain;
    private Integer userId;
}
