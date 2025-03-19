package net.disburse.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.function.Function;

public interface JwtService {

    public String generateToken(String userName, Collection<? extends GrantedAuthority> authorities);

    public String extractEmail(String token);

    public Date extractExpiration(String token);

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    public Boolean validateToken(String token, UserDetails userDetails);
}
