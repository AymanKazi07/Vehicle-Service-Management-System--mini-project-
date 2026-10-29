package com.vehicleservice.store;

import com.vehicleservice.model.User;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserStore {
    private final ConcurrentHashMap<String, User> usersById = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> userIdByEmail = new ConcurrentHashMap<>();

    public ConcurrentHashMap<String, User> getUsersById() {
        return usersById;
    }

    public ConcurrentHashMap<String, String> getUserIdByEmail() {
        return userIdByEmail;
    }

    public void put(User user) {
        if (user == null || user.getId() == null) return;
        usersById.put(user.getId(), user);
        if (user.getEmail() != null) {
            userIdByEmail.put(user.getEmail().toLowerCase(), user.getId());
        }
    }

    public User findById(String id) {
        if (id == null) return null;
        return usersById.get(id);
    }

    public User findByEmail(String email) {
        if (email == null) return null;
        String id = userIdByEmail.get(email.toLowerCase());
        return id != null ? usersById.get(id) : null;
    }

    public Collection<User> findAll() {
        return usersById.values();
    }

    public void remove(String id) {
        if (id == null) return;
        User user = usersById.remove(id);
        if (user != null && user.getEmail() != null) {
            userIdByEmail.remove(user.getEmail().toLowerCase());
        }
    }

    public void clear() {
        usersById.clear();
        userIdByEmail.clear();
    }
}
