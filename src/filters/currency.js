import AppFilters from './filters.module';

AppFilters.filter('currency', (numberFilter, liskFilter) => (amount, currency, decimal_places) => {
    const lisk = liskFilter (amount);
    let factor = 1;

    if (currency.tickers && currency.tickers.TYS && currency.tickers.TYS[currency.symbol]) {
      factor = currency.tickers.TYS[currency.symbol];
    } else if (currency.symbol !== 'TYS') {
      // Exchange rate not available for current symbol
      return 'N/A';
    }
    factor = 1;
    let decimals = (currency.symbol === 'TYS' || currency.symbol === 'BTC') ? decimal_places : 2;
    if (decimals && lisk > 0) {
      return numberFilter ((lisk * factor), decimals);
    } else {
      return numberFilter ((lisk * factor), 3).replace (/\.?0+$/, '');
    }
});
