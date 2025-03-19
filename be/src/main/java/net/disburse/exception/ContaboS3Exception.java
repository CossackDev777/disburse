package net.disburse.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ContaboS3Exception extends RuntimeException {

    private final HttpStatus httpStatus;

    public ContaboS3Exception(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

}
