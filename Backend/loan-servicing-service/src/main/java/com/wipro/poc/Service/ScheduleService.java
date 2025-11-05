package com.wipro.poc.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wipro.poc.Entity.LoanAccount;
import com.wipro.poc.Entity.RepaymentInstallment;
import com.wipro.poc.Repository.RepaymentInstallmentRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class ScheduleService {

  private final RepaymentInstallmentRepository installmentRepo;

  public ScheduleService(RepaymentInstallmentRepository installmentRepo) {
    this.installmentRepo = installmentRepo;
  }

  @Transactional
  public List<RepaymentInstallment> generateSchedule(LoanAccount acc) {
    // EMI formula: A = P * r * (1+r)^n / ((1+r)^n - 1)
    BigDecimal monthlyRate = acc.getAnnualInterestRate()
        .divide(BigDecimal.valueOf(12 * 100.0), 10, RoundingMode.HALF_UP);
    int n = acc.getTermMonths();
    BigDecimal P = acc.getPrincipal();

    BigDecimal onePlusRPowerN = (BigDecimal.ONE.add(monthlyRate)).pow(n);
    BigDecimal numerator = P.multiply(monthlyRate).multiply(onePlusRPowerN);
    BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);
    BigDecimal emi = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

    List<RepaymentInstallment> result = new ArrayList<>();
    BigDecimal outstanding = P;
    LocalDate due = acc.getStartDate().plusMonths(1);

    for (int k = 1; k <= n; k++) {
      BigDecimal interest = outstanding.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
      BigDecimal principalComp = emi.subtract(interest).setScale(2, RoundingMode.HALF_UP);
      if (k == n) { // adjust last to clear rounding
        principalComp = outstanding;
        emi = principalComp.add(interest).setScale(2, RoundingMode.HALF_UP);
      }

      RepaymentInstallment inst = new RepaymentInstallment();
      inst.setAccount(acc);
      inst.setInstallmentNo(k);
      inst.setDueDate(due);
      inst.setPrincipalComponent(principalComp);
      inst.setInterestComponent(interest);
      inst.setInstallmentAmount(emi);
      inst.setPaidAmount(BigDecimal.ZERO);
      inst.setStatus("DUE");
      result.add(inst);

      outstanding = outstanding.subtract(principalComp);
      due = due.plusMonths(1);
    }

    return installmentRepo.saveAll(result);
  }
}
