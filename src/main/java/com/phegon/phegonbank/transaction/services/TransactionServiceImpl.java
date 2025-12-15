package com.phegon.phegonbank.transaction.services;


import com.phegon.phegonbank.account.entity.Account;
import com.phegon.phegonbank.account.repo.AccountRepo;
import com.phegon.phegonbank.auth_users.entity.User;
import com.phegon.phegonbank.auth_users.services.UserService;
import com.phegon.phegonbank.enums.TransactionStatus;
import com.phegon.phegonbank.enums.TransactionType;
import com.phegon.phegonbank.exceptions.BadRequestException;
import com.phegon.phegonbank.exceptions.InsufficientBalanceException;
import com.phegon.phegonbank.exceptions.InvalidTransactionException;
import com.phegon.phegonbank.exceptions.NotFoundException;
import com.phegon.phegonbank.notification.dtos.NotificationDTO;
import com.phegon.phegonbank.notification.services.NotificationService;
import com.phegon.phegonbank.res.Response;
import com.phegon.phegonbank.transaction.dtos.TransactionDTO;
import com.phegon.phegonbank.transaction.dtos.TransactionRequest;
import com.phegon.phegonbank.transaction.entity.Transaction;
import com.phegon.phegonbank.transaction.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepo transactionRepo;
    private final AccountRepo accountRepo;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ModelMapper modelMapper;


    @Override
    @Transactional
    public Response<?> createTransaction(TransactionRequest transactionRequest) {

        return null;
    }


    @Override
    @Transactional
    public Response<List<TransactionDTO>> getTransactionsForMyAccount(String accountNumber, int page, int size) {

        return null;


    }


    private void handleDeposit(TransactionRequest request, Transaction transaction) {

        return null
    }


    private void handleWithdrawal(TransactionRequest request, Transaction transaction) {

        return null
    }

    private void handleTransfer(TransactionRequest request, Transaction transaction) {

        return null
    }


    private void sendTransactionNotifications(Transaction tnx) {

        retrun null;
    }

}












