package com.vehicleservice.scheduler;

import com.vehicleservice.config.AppProperties;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.*;
import com.vehicleservice.store.MechanicStore;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

@Component
public class SlotAllocator {
    private final MechanicStore mechanicStore;
    private final AppProperties appProperties;

    public SlotAllocator(MechanicStore mechanicStore, AppProperties appProperties) {
        this.mechanicStore = mechanicStore;
        this.appProperties = appProperties;
    }

    public static class AllocationResult {
        private final String mechanicId;
        private final LocalDate date;
        private final LocalTime slotStart;
        private final LocalTime estimatedEnd;

        public AllocationResult(String mechanicId, LocalDate date, LocalTime slotStart, LocalTime estimatedEnd) {
            this.mechanicId = mechanicId;
            this.date = date;
            this.slotStart = slotStart;
            this.estimatedEnd = estimatedEnd;
        }

        public String getMechanicId() {
            return mechanicId;
        }

        public LocalDate getDate() {
            return date;
        }

        public LocalTime getSlotStart() {
            return slotStart;
        }

        public LocalTime getEstimatedEnd() {
            return estimatedEnd;
        }
    }

    public synchronized AllocationResult allocateSlot(String jobId, Category category, LocalDate requestedDate,
                                                      int durationMinutes, QueueClass queueClass) {
        // Find eligible mechanics who handle this vehicle category
        List<Mechanic> eligibleMechanics = mechanicStore.findAll().stream()
                .filter(m -> m.getCategories() != null && m.getCategories().contains(category))
                .toList();

        if (eligibleMechanics.isEmpty()) {
            throw new ApiException("No mechanic available for vehicle category: " + category);
        }

        int startHour = appProperties.getWorkStartHour();
        int endHour = appProperties.getWorkEndHour();
        int totalDaySlots = endHour - startHour; // usually 18 - 9 = 9 slots

        int slotsNeeded;
        if (queueClass == QueueClass.LONG) {
            // Long job reserves whole day(s)
            slotsNeeded = totalDaySlots;
        } else {
            slotsNeeded = (int) Math.ceil((double) durationMinutes / 60.0);
            if (slotsNeeded > totalDaySlots) {
                slotsNeeded = totalDaySlots;
            }
            if (slotsNeeded <= 0) {
                slotsNeeded = 1;
            }
        }

        // Search dates starting from requestedDate up to 30 days ahead
        LocalDate currentDate = requestedDate;
        for (int dayOffset = 0; dayOffset < 30; dayOffset++, currentDate = currentDate.plusDays(1)) {
            for (Mechanic mechanic : eligibleMechanics) {
                TreeMap<LocalDate, List<Slot>> schedule = mechanicStore.getSlotsForMechanic(mechanic.getId());
                List<Slot> daySlots = schedule.computeIfAbsent(currentDate, d -> createDefaultDaySlots(d, mechanic.getId(), startHour, endHour));

                if (queueClass == QueueClass.LONG) {
                    // Check if entire day is free
                    boolean allFree = daySlots.stream().noneMatch(Slot::isBooked);
                    if (allFree) {
                        for (Slot slot : daySlots) {
                            slot.setBooked(true);
                            slot.setJobId(jobId);
                            slot.setMechanicId(mechanic.getId());
                        }
                        LocalTime slotStart = LocalTime.of(startHour, 0);
                        LocalTime estimatedEnd = LocalTime.of(endHour, 0);
                        return new AllocationResult(mechanic.getId(), currentDate, slotStart, estimatedEnd);
                    }
                } else {
                    // Find consecutive free slots of length slotsNeeded
                    int consecutive = 0;
                    int startIndex = -1;
                    for (int i = 0; i < daySlots.size(); i++) {
                        if (!daySlots.get(i).isBooked()) {
                            if (consecutive == 0) {
                                startIndex = i;
                            }
                            consecutive++;
                            if (consecutive == slotsNeeded) {
                                break;
                            }
                        } else {
                            consecutive = 0;
                            startIndex = -1;
                        }
                    }

                    if (consecutive == slotsNeeded && startIndex != -1) {
                        for (int i = startIndex; i < startIndex + slotsNeeded; i++) {
                            Slot s = daySlots.get(i);
                            s.setBooked(true);
                            s.setJobId(jobId);
                            s.setMechanicId(mechanic.getId());
                        }
                        LocalTime slotStart = daySlots.get(startIndex).getStartTime();
                        LocalTime estimatedEnd = slotStart.plusMinutes(durationMinutes);
                        return new AllocationResult(mechanic.getId(), currentDate, slotStart, estimatedEnd);
                    }
                }
            }
        }

        throw new ApiException("No free slot could be found for the requested booking within the next 30 days.");
    }

    private List<Slot> createDefaultDaySlots(LocalDate date, String mechanicId, int startHour, int endHour) {
        List<Slot> slots = new ArrayList<>();
        for (int h = startHour; h < endHour; h++) {
            slots.add(new Slot(
                    date,
                    LocalTime.of(h, 0),
                    LocalTime.of(h + 1, 0),
                    false,
                    null,
                    mechanicId
            ));
        }
        return slots;
    }
}
