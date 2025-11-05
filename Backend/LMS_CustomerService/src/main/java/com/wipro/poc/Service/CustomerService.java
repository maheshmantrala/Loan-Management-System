package com.wipro.poc.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.wipro.poc.Entity.Customer;
import com.wipro.poc.Exception.CustomerNotFoundException;
import com.wipro.poc.Repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + id));
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

	public Customer updateCustomer(Long id, Customer customer) {
		// TODO Auto-generated method stub
		 Customer existingCustomer = customerRepository.findById(id)
		            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

		    existingCustomer.setFullName(customer.getFullName());
		    existingCustomer.setEmail(customer.getEmail());
		    existingCustomer.setPhone(customer.getPhone());
		    existingCustomer.setDob(customer.getDob());
		    existingCustomer.setAddress(customer.getAddress());
		    existingCustomer.setCreditScore(customer.getCreditScore());
		    existingCustomer.setEmploymentType(customer.getEmploymentType());

		    return customerRepository.save(existingCustomer);
	}
}
