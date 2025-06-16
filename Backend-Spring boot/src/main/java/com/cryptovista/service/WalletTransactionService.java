package com.cryptovista.service;

import com.cryptovista.domain.WalletTransactionType;
import com.cryptovista.model.Wallet;
import com.cryptovista.model.WalletTransaction;

import java.util.List;

public interface WalletTransactionService {
    WalletTransaction createTransaction(Wallet wallet,
                                        WalletTransactionType type,
                                        String transferId,
                                        String purpose,
                                        Long amount
    );

    List<WalletTransaction> getTransactions(Wallet wallet, WalletTransactionType type);

}
