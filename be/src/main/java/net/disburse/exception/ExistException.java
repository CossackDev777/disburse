package net.disburse.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class ExistException extends RuntimeException {
    public ExistException(String message) {
        super(message);
    }
}
