package com.cryptovista.service;

import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.ReadContext;
import com.cryptovista.model.CoinDTO;
import com.cryptovista.response.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class ChatBotServiceImpl implements ChatBotService {

    @Value("${gemini.api.key}")
    private String API_KEY;

    private final RestTemplate restTemplate = new RestTemplate();

    private double convertToDouble(Object value) {
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        } else {
            throw new IllegalArgumentException("Unsupported data type: " + value.getClass().getName());
        }
    }

    public CoinDTO makeApiRequest(String currencyName) {
        String url = "https://api.coingecko.com/api/v3/coins/" + currencyName.toLowerCase();
        ResponseEntity<Map> responseEntity = restTemplate.getForEntity(url, Map.class);

        if (responseEntity.getBody() != null) {
            Map<String, Object> responseBody = responseEntity.getBody();
            Map<String, Object> image = (Map<String, Object>) responseBody.get("image");
            Map<String, Object> marketData = (Map<String, Object>) responseBody.get("market_data");

            CoinDTO coinInfo = new CoinDTO();
            coinInfo.setId((String) responseBody.get("id"));
            coinInfo.setSymbol((String) responseBody.get("symbol"));
            coinInfo.setName((String) responseBody.get("name"));
            coinInfo.setImage((String) image.get("large"));
            coinInfo.setCurrentPrice(convertToDouble(((Map<String, Object>) marketData.get("current_price")).get("usd")));

            return coinInfo;
        }
        return null;
    }

    private String getChatbotResponse(String prompt) {
        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + prompt + "\" }]}]}";
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);
        String responseBody = response.getBody();

        if (responseBody != null) {
            ReadContext ctx = JsonPath.parse(responseBody);
            return ctx.read("$.candidates[0].content.parts[0].text", String.class);
        }
        return "I'm sorry, but I couldn't understand your question.";
    }

    @Override
    public ApiResponse getCoinDetails(String prompt) {
        String chatbotResponse = getChatbotResponse(prompt);

        ApiResponse response = new ApiResponse();
        response.setMessage(chatbotResponse);
        return response;
    }

    @Override
    public CoinDTO getCoinByName(String coinName) {
        return makeApiRequest(coinName);
    }

    @Override
    public String simpleChat(String prompt) {
        return getChatbotResponse(prompt);
    }
}
