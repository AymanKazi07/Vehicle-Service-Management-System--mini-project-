package com.vehicleservice.controller;

import com.vehicleservice.dto.BillResponse;
import com.vehicleservice.model.Bill;
import com.vehicleservice.model.User;
import com.vehicleservice.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    private final BillingService billingService;

    public BillController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BillResponse> getBill(@AuthenticationPrincipal User user,
                                                @PathVariable String bookingId) {
        Bill bill = billingService.getBillByBookingId(bookingId, user);
        BillResponse res = new BillResponse(
                bill.getBillId(),
                bill.getBookingId(),
                bill.getDate(),
                bill.getVehicleRegNo(),
                bill.getOwnerName(),
                bill.getWorkshopName(),
                bill.getLines(),
                bill.getSubtotal(),
                bill.getGstRate(),
                bill.getGstAmount(),
                bill.getGrandTotal()
        );
        return ResponseEntity.ok(res);
    }
}
