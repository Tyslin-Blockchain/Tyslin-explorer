<template>
    <div
        v-if="loading"
        :class="(loading ? 'tyslin-loading tyslin-loading--full' : '')"/>
    <section v-else>
        <div class="card tyslin-card tyslin-card--token">
            <div class="tyslin-card__header">
                <h2
                    class="tyslin-card__headline"
                    v-html="tokenName"/>&nbsp;
                <i
                    v-if="moreInfo"
                    class="fa fa-check-circle token-status"
                    aria-hidden="true"/>
                <h6 class="mb-0">{{ symbol }}</h6>
            </div>
            <div class="tyslin-card__body">
                <b-row>
                    <b-col md="6">
                        <table
                            v-if="token"
                            class="tyslin-card__table">
                            <tbody>
                                <tr>
                                    <td>Total Supply</td>
                                    <td>{{ formatUnit(formatNumber(token.totalSupplyNumber), symbol) }}</td>
                                </tr>
                                <tr>
                                    <td>Holders</td>
                                    <td>{{ formatNumber(holdersCount) }}
                                        {{ holdersCount > 1 ? 'addresses' : 'address' }}</td>
                                </tr>
                                <tr>
                                    <td>Transfers</td>
                                    <td>{{ formatNumber(tokenTxsCount) }}</td>
                                </tr>
                                <tr>
                                    <td>Official Site</td>
                                    <td
                                        v-if="moreInfo">
                                        <a
                                            :href="moreInfo.website"
                                            target="_blank"
                                            class="text-truncate">{{ moreInfo.website }}</a>
                                    </td>
                                    <td
                                        v-else>
                                        Not Available,
                                        <nuxt-link
                                            :to="{name: 'tokens-slug-info', params: {slug: hash}}"
                                            class="text-truncate">Update</nuxt-link> ?
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>
                    <b-col md="6">
                        <table
                            v-if="token"
                            class="tyslin-card__table">
                            <tbody>
                                <tr>
                                    <td>Contract</td>
                                    <td>
                                        <nuxt-link
                                            :to="{name: 'address-slug', params: {slug: token.hash}}"
                                            class="text-truncate">{{ token.hash }}</nuxt-link>
                                    </td>
                                </tr>
                                <tr v-if="token.type === 'trc20'">
                                    <td>Decimal</td>
                                    <td>{{ token.decimals }}</td>
                                </tr>
                                <tr>
                                    <td>Links</td>
                                    <td class="token-info-link">
                                        <ul
                                            v-if="moreInfo && moreInfo.communities"
                                            class="list-inline s-icons">
                                            <li
                                                v-for="(community, key) in moreInfo.communities"
                                                :key="key"
                                                class="list-inline-item">
                                                <a
                                                    :title="community.title"
                                                    :href="community.url">
                                                    <i :class="community.icon"/>
                                                </a>
                                            </li>
                                        </ul>
                                        <span v-else>
                                            Not Available,
                                            <nuxt-link
                                                :to="{name: 'tokens-slug-info', params: {slug: hash}}"
                                                class="text-truncate">Update</nuxt-link> ?
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Filtered By</td>
                                    <td>
                                        <div class="input-group input-group-sm filter-address">
                                            <input
                                                v-model="addressFilter"
                                                type="text"
                                                class="form-control form-control-sm"
                                                placeholder="Address"
                                                aria-label="Address"
                                                @keyup.enter="filterAddress(addressFilter, token.type)">
                                            <div class="input-group-append">
                                                <button
                                                    class="btn btn-primary btn-primary-sm"
                                                    type="button"
                                                    @click="filterAddress(addressFilter, token.type)">
                                                    <i class="fa fa-filter"/>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>
                </b-row>
            </div>
        </div>

        <b-row>
            <b-col>
                <b-tabs
                    ref="allTabs"
                    v-model="tabIndex"
                    class="tyslin-tabs">
                    <!--:title="'Token Transfers (' + formatNumber(tokenTxsCount) + ')'"-->
                    <b-tab
                        title="Token Transfers"
                        href="#tokenTransfers">
                        <table-token-tx
                            v-if="token.type === 'trc20'"
                            :token="hash"
                            :parent="'#tokenTransfers'"
                            :page="this"/>
                        <table-token-tx-nft
                            v-if="token.type === 'trc721'"
                            :token="hash"
                            :parent="'#tokenTransfers'"
                            :page="this"/>
                    </b-tab>
                    <!--:title="'Token Holders (' + formatNumber(holdersCount) + ')'"-->
                    <b-tab
                        title="Token Holders"
                        href="#tokenHolders">
                        <table-token-holder
                            v-if="token.type === 'trc20'"
                            :address="hash"
                            :parent="'#tokenHolders'"
                            :page="this"/>
                        <table-token-nft-holder
                            v-if="token.type === 'trc721'"
                            :address="hash"
                            :parent="'#tokenHolders'"
                            :page="this"/>
                    </b-tab>
                    <b-tab
                        v-if="address && address.isContract && smartContract"
                        title="Code"
                        href="#code"
                        @click="refreshCodeMirror">
                        <read-source-code
                            ref="readSourceCode"
                            :token="hash"
                            :smartcontract="smartContract"
                            :address="address"/>
                    </b-tab>
                    <b-tab
                        v-if="smartContract"
                        title="Read Contract"
                        href="#readContract">
                        <read-contract
                            :contract="hash"/>
                    </b-tab>
                </b-tabs>
            </b-col>
        </b-row>
    </section>
</template>
<script>
import mixin from '~/plugins/mixin'
import TableTokenTx from '~/components/TableTokenTx'
import TableTokenTxNft from '~/components/TableTokenTxNft'
import TableTokenHolder from '~/components/TableTokenHolder'
import TableTokenNftHolder from '~/components/TableTokenNftHolder'
import ReadContract from '~/components/ReadContract'
import ReadSourceCode from '~/components/ReadSourceCode'

export default {
    components: {
        ReadSourceCode,
        TableTokenTx,
        TableTokenTxNft,
        ReadContract,
        TableTokenHolder,
        TableTokenNftHolder
    },
    mixins: [mixin],
    head () {
        return {
            title: 'Token ' + this.$route.params.slug + ' Info'
        }
    },
    data () {
        return {
            hash: null,
            token: null,
            tokenName: null,
            symbol: null,
            loading: true,
            tokenTxsCount: 0,
            holdersCount: 0,
            moreInfo: null,
            addressFilter: null,
            address: null,
            smartContract: null,
            holderBalance: 0,
            tabIndex: 0
        }
    },
    computed: {
        hashTab () {
            return this.$route.hash || '#tokenTransfers'
        }
    },
    created () {
        this.hash = this.$route.params.slug
    },
    async mounted () {
        let self = this

        self.loading = true

        // Init breadcrumbs data.
        this.$store.commit('breadcrumb/setItems', {
            name: 'tokens-slug',
            to: { name: 'tokens-slug', params: { slug: self.hash } }
        })

        let params = {}

        if (self.hash) {
            params.token = self.hash
        }

        params.list = 'token'
        let query = this.serializeQuery(params)

        let responses = await Promise.all([
            self.$axios.get('/api/tokens/' + self.hash),
            self.$axios.get('/api/counting' + '?' + query)
        ])

        self.token = responses[0].data
        self.tokenName = responses[0].data.name
        self.symbol = responses[0].data.symbol

        self.tokenTxsCount = responses[1].data.tokenTxs

        self.holdersCount = responses[1].data.tokenHolders

        self.loading = false
        self.moreInfo = responses[0].data.moreInfo
        self.getAccountFromApi()
    },
    methods: {
        async getAccountFromApi () {
            let self = this

            let { data } = await this.$axios.get('/api/accounts/' + self.hash)
            self.address = data
            self.smartContract = data.contract
        },
        onSwitchTab: function () {
            const allTabs = this.$refs.allTabs
            const location = window.location
            const value = this.tabIndex
            if (allTabs) {
                if (location.hash !== allTabs.tabs[value].href) {
                    this.$router.replace({
                        hash: allTabs.tabs[value].href
                    })
                } else {
                    location.hash = allTabs.tabs[value].href
                }
            }
        }
    }
}
</script>
