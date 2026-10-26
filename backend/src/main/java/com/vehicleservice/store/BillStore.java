package com.vehicleservice.store;

import com.vehicleservice.model.Bill;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class BillStore {
    private final ConcurrentHashMap<String, Bill> billsByBookingId = new ConcurrentHashMap<>();

    public ConcurrentHashMap<String, Bill> getBillsByBookingId() {
        return billsByBookingId;
    }

    public void put(Bill bill) {
        billsByBookingId.put(bill.getBookingId(), bill);
    }

    public Bill findByBookingId(String bookingId) {
        return billsByBookingId.get(bookingId);
    }

    public Collection<Bill> findAll() {
        return billsByBookingId.values();
    }

    public void clear() {
        billsByBookingId.clear();
    }
}
