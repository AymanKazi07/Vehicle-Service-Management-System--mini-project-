package com.vehicleservice.store;

import com.vehicleservice.model.Booking;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class BookingStore {
    private final ConcurrentHashMap<String, Booking> bookingsById = new ConcurrentHashMap<>();

    public ConcurrentHashMap<String, Booking> getBookingsById() {
        return bookingsById;
    }

    public void put(Booking booking) {
        bookingsById.put(booking.getBookingId(), booking);
    }

    public Booking findById(String bookingId) {
        return bookingsById.get(bookingId);
    }

    public List<Booking> findByCustomerId(String customerId) {
        return bookingsById.values().stream()
                .filter(b -> customerId.equals(b.getCustomerId()))
                .collect(Collectors.toList());
    }

    public Collection<Booking> findAll() {
        return bookingsById.values();
    }

    public void clear() {
        bookingsById.clear();
    }
}
