package com.cryptovista.service;

import com.cryptovista.model.Coin;
import com.cryptovista.model.User;
import com.cryptovista.model.Watchlist;

public interface WatchlistService {

    Watchlist findUserWatchlist(Long userId) throws Exception;

    Watchlist createWatchList(User user);

    Watchlist findById(Long id) throws Exception;

    Coin addItemToWatchlist(Coin coin,User user) throws Exception;
}
