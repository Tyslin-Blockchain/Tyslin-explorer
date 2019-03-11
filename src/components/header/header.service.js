import AppHeader from './header.module';

const HeaderConstrcutor = function ($rootScope) {

    this.updateBlockStatus = res => {
        if (res.success) {
            $rootScope.blockStatus = {
                height:    res.height,
                fee:       res.fee,
                milestone: res.milestone,
                reward:    res.reward,
                supply:    res.supply,
                nethash:   res.nethash
            };
        }
    };

    this.updatePriceTicker = res => {
        if (res.success) {
            $rootScope.currency.tickers = res.tickers;
        }

        // When ticker for user-stored currency is not available - switch to LSK temporarly
        if ($rootScope.currency.symbol !== 'TYS' && (!$rootScope.currency.tickers || !$rootScope.currency.tickers.TYS || !$rootScope.currency.tickers.TYS[$rootScope.currency.symbol])) {
            $rootScope.currency.symbol = 'TYS';
        }
    };

    // @todo shouldn't this be in run inetad of header?
    $rootScope.delegateProposals = {};
    this.updateDelegateProposals = res => {
        $rootScope.delegateProposals = {};
        if (res.success) {
            for (let proposal of res.proposals) {
                $rootScope.delegateProposals[proposal.name.toLowerCase()] = proposal;
            }
        }
    };

    return this;
};

AppHeader.factory('Header',
  ($rootScope, $socket) => HeaderConstrcutor);
