package net.disburse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReCaptchaResponse {
    private boolean success;
    private double score;
    private String action;
    private String challege_ts;
    private String hostname;
}
