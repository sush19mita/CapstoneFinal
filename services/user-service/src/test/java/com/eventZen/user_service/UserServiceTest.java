package com.eventZen.user_service;

import com.eventzen.userservice.model.User;
import com.eventzen.userservice.repository.UserRepository;
import com.eventzen.userservice.service.UserService;
import com.eventzen.userservice.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister_EmailAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.register("Test", "test@test.com", "pass123", "CUSTOMER");
        });

        assertEquals("Email already registered", exception.getMessage());
    }

    @Test
    void testLogin_UserNotFound_ThrowsException() {
        when(userRepository.findByEmail("notfound@test.com"))
            .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.login("notfound@test.com", "pass123");
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testGetProfile_UserExists_ReturnsUser() {
        User mockUser = new User();
        mockUser.setName("Test User");
        mockUser.setEmail("test@test.com");
        mockUser.setRole(User.Role.CUSTOMER);

        when(userRepository.findByEmail("test@test.com"))
            .thenReturn(Optional.of(mockUser));

        User result = userService.getProfile("test@test.com");

        assertEquals("Test User", result.getName());
        assertEquals("test@test.com", result.getEmail());
    }
}