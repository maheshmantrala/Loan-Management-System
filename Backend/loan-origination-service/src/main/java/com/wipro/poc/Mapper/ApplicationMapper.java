package com.wipro.poc.Mapper;

import com.wipro.poc.DTO.ApplicationCreateRequest;
import com.wipro.poc.DTO.ApplicationDTO;
import com.wipro.poc.Entity.LoanApplication;

public final class ApplicationMapper {
    private ApplicationMapper() {}

    public static LoanApplication toEntity(ApplicationCreateRequest req) {
        LoanApplication a = new LoanApplication();
        a.setCustomerId(req.getCustomerId());
        a.setLoanType(req.getLoanType());
        a.setAmount(req.getAmount());
        a.setTermMonths(req.getTermMonths());
        a.setInterestRate(req.getInterestRate());
        a.setStatus("DRAFT");
        return a;
    }

    public static ApplicationDTO toDTO(LoanApplication a) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(a.getId());
        dto.setCustomerId(a.getCustomerId());
        dto.setLoanType(a.getLoanType());
        dto.setAmount(a.getAmount());
        dto.setTermMonths(a.getTermMonths());
        dto.setInterestRate(a.getInterestRate());
        dto.setStatus(a.getStatus());
        dto.setCreatedAt(a.getCreatedAt());
        // 🔸 NEW
        dto.setServicingAccountId(a.getServicingAccountId());
        return dto;
    }
}
