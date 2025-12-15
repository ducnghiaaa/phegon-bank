package com.phegon.phegonbank.account.services;

import com.phegon.phegonbank.account.dtos.AccountDTO;
import com.phegon.phegonbank.account.entity.Account;
import com.phegon.phegonbank.account.repo.AccountRepo;
import com.phegon.phegonbank.auth_users.entity.User;
import com.phegon.phegonbank.auth_users.services.UserService;
import com.phegon.phegonbank.enums.AccountStatus;
import com.phegon.phegonbank.enums.AccountType;
import com.phegon.phegonbank.enums.Currency;
import com.phegon.phegonbank.exceptions.BadRequestException;
import com.phegon.phegonbank.exceptions.NotFoundException;
import com.phegon.phegonbank.res.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AccountServiceImpl implements AccountService {

    private final AccountRepo accountRepo;
    private final UserService userService;
    private final ModelMapper modelMapper;

    private final Random random = new Random();


    @Override
    public Account createAccount(AccountType accountType, User user) {
        log.info("Insdie createAccount()");

        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(accountType)
                .currency(Currency.USD)
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        return accountRepo.save(account);
    }

    @Override
    public Response<List<AccountDTO>> getMyAccounts() {
        return
    }


    @Override
    public Response<?> closeAccount(String accountNumber) {
        return null;
    }
    private String generateAccountNumber() {
        String accountNumber;
        do {
            // Generate a random 8-digit number (from 10,000,000 to 99,999,999)
            // and combine it with the "66" prefix.
            accountNumber = "66" + (random.nextInt(90000000) + 10000000);

        } while (accountRepo.findByAccountNumber(accountNumber).isPresent());


        log.info("account number generated {}", accountRepo);
        return accountNumber;
    }

}









