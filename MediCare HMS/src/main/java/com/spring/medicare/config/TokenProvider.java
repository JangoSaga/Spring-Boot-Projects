package com.spring.medicare.config;

import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class TokenProvider {
    private static final String SECRET = "medicare_hms_jwt_secret_key_2026_super_secure_sha";

    public String generateToken(String email, String role, Long userId) {
        long expiry = System.currentTimeMillis() + 864000000L; // 10 days
        String payload = email + ":" + role + ":" + userId + ":" + expiry;
        String signature = sign(payload);
        return Base64.getUrlEncoder().encodeToString((payload + "." + signature).getBytes(StandardCharsets.UTF_8));
    }

    public boolean validateToken(String token) {
        try {
            String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
            int lastDotIdx = decoded.lastIndexOf('.');
            if (lastDotIdx == -1) return false;
            String payload = decoded.substring(0, lastDotIdx);
            String signature = decoded.substring(lastDotIdx + 1);
            
            String[] payloadParts = payload.split(":");
            if (payloadParts.length < 4) return false;
            long expiry = Long.parseLong(payloadParts[3]);
            if (expiry < System.currentTimeMillis()) return false;

            return sign(payload).equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
        int lastDotIdx = decoded.lastIndexOf('.');
        String payload = decoded.substring(0, lastDotIdx);
        return payload.split(":")[0];
    }

    public String getRoleFromToken(String token) {
        String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
        int lastDotIdx = decoded.lastIndexOf('.');
        String payload = decoded.substring(0, lastDotIdx);
        return payload.split(":")[1];
    }

    public Long getUserIdFromToken(String token) {
        String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
        int lastDotIdx = decoded.lastIndexOf('.');
        String payload = decoded.substring(0, lastDotIdx);
        return Long.parseLong(payload.split(":")[2]);
    }

    private String sign(String payload) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((payload + SECRET).getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
