package com.wipro.poc.Entity;

import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;
    private String username; // link to Auth user

    private String fullName;
    private String email;
    private String phone;
    private Date dob;
    private String address;
    private Integer creditScore;
    private String employmentType;

    public Customer(Long customerId, String username, String fullName, String email, String phone, Date dob,
			String address, Integer creditScore, String employmentType, LocalDateTime createdAt) {
		super();
		this.customerId = customerId;
		this.username = username;
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
		this.dob = dob;
		this.address = address;
		this.creditScore = creditScore;
		this.employmentType = employmentType;
		this.createdAt = createdAt;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@CreationTimestamp
    private LocalDateTime createdAt;

	@Override
	public String toString() {
		return "Customer [customerId=" + customerId + ", username=" + username + ", fullName=" + fullName + ", email="
				+ email + ", phone=" + phone + ", dob=" + dob + ", address=" + address + ", creditScore=" + creditScore
				+ ", employmentType=" + employmentType + ", createdAt=" + createdAt + "]";
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Integer getCreditScore() {
		return creditScore;
	}

	public void setCreditScore(Integer creditScore) {
		this.creditScore = creditScore;
	}

	public String getEmploymentType() {
		return employmentType;
	}

	public void setEmploymentType(String employmentType) {
		this.employmentType = employmentType;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Customer(Long customerId, String fullName, String email, String phone, Date dob, String address,
			Integer creditScore, String employmentType, LocalDateTime createdAt) {
		super();
		this.customerId = customerId;
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
		this.dob = dob;
		this.address = address;
		this.creditScore = creditScore;
		this.employmentType = employmentType;
		this.createdAt = createdAt;
	}

	public Customer() {
		super();
	}

    // Getters & Setters
}
