package com.spring.medicare;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.spring.medicare.config.TokenProvider;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

@SpringBootTest
class MedicareApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void testTokenProvider() {
		TokenProvider provider = new TokenProvider();
		String email = "alex@patient.com";
		String role = "PATIENT";
		Long userId = 15L;
		String token = provider.generateToken(email, role, userId);
		System.out.println("Generated token: " + token);
		
		String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
		System.out.println("Decoded string: " + decoded);
		int lastDotIdx = decoded.lastIndexOf('.');
		String payload = decoded.substring(0, lastDotIdx);
		String signature = decoded.substring(lastDotIdx + 1);
		System.out.println("Payload from token: " + payload);
		System.out.println("Signature from token: " + signature);
		
		// Recalculate signature
		// TokenProvider signature calculation uses its private sign method, we can invoke generateToken and see what signature is matched
		boolean isValid = provider.validateToken(token);
		System.out.println("Is valid: " + isValid);
		assertTrue(isValid);
	}

}
