package com.cryptovista.service;

import com.cryptovista.model.CoinDTO;
import com.cryptovista.response.ApiResponse;

public interface ChatBotService {
    ApiResponse getCoinDetails(String coinName);

    CoinDTO getCoinByName(String coinName);

    String simpleChat(String prompt);
}
