package com.vehicleservice.scheduler;

import com.vehicleservice.model.Job;
import java.time.LocalDate;
import java.util.Comparator;

public class ShortJobComparator implements Comparator<Job> {
    @Override
    public int compare(Job a, Job b) {
        if (a == b) return 0;
        if (a == null) return 1;
        if (b == null) return -1;

        // 1. Appointment date (null-safe)
        LocalDate dateA = a.getDate() != null ? a.getDate() : LocalDate.MAX;
        LocalDate dateB = b.getDate() != null ? b.getDate() : LocalDate.MAX;
        int dateCmp = dateA.compareTo(dateB);
        if (dateCmp != 0) {
            return dateCmp;
        }

        // 2. Shortest duration
        int durA = a.getExpectedMinutes() != null ? a.getExpectedMinutes() : 0;
        int durB = b.getExpectedMinutes() != null ? b.getExpectedMinutes() : 0;
        int durCmp = Integer.compare(durA, durB);
        if (durCmp != 0) {
            return durCmp;
        }

        // 3. Booking time (createdAt)
        if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
        if (a.getCreatedAt() != null) return -1;
        if (b.getCreatedAt() != null) return 1;

        return 0;
    }
}
