<template>
    <div
        v-if="loading"
        :class="(loading ? 'tyslin-loading tyslin-loading--full' : '')"/>
    <section v-else>
        <div class="card tyslin-card tyslin-card--block">
            <div class="tyslin-card__header">
                <h3
                    v-if="block"
                    class="tyslin-card__headline">Block
                    <span class="d-none d-lg-inline-block headline__block-number">#{{ block.number }}</span>
                </h3>
                <div
                    v-if="block"
                    class="block-breadcrumb">
                    <div class="block-breadcrumb__prev">
                        <i class="tm tm-chevrons-left"/>
                        <nuxt-link :to="{name: 'blocks-slug', params: {slug: block.number - 1}}">Prev</nuxt-link>
                    </div>
                    <span class="block-breadcrumb__divider">|</span>
                    <div class="block-breadcrumb__next">
                        <nuxt-link :to="{name: 'blocks-slug', params: {slug: block.number + 1}}">Next</nuxt-link>
                        <i class="tm tm-chevrons-right"/>
                    </div>
                </div>
            </div>
            <div class="tyslin-card__body">
                <table
                    v-if="block"
                    class="tyslin-card__table">
                    <tbody>
                        <tr>
                            <td>Height</td>
                            <td>{{ block.number }}</td>
                        </tr>
                        <tr>
                            <td>Epoch</td>
                            <td>
                                <nuxt-link :to="{name: 'epochs-slug', params: {slug: Math.ceil(block.number / 900)}}">
                                    {{ Math.ceil(block.number / 900) }}</nuxt-link>
                            </td>
                        </tr>
                        <tr v-if="timestamp_moment">
                            <td>TimeStamp</td>
                            <td v-html="timestamp_moment"/>
                        </tr>
                        <tr>
                            <td>Transactions</td>
                            <td>{{ (block.e_tx || block.e_tx >= 0) ? block.e_tx : block.transactions.length }}
                                transactions</td>
                        </tr>
                        <tr>
                            <td>Hash</td>
                            <td>
                                <read-more
                                    :text="block.hash"
                                    class="d-sm-none" />
                                <read-more
                                    :text="block.hash"
                                    :max-chars="20"
                                    class="d-none d-sm-block d-md-none"/>
                                <read-more
                                    :text="block.hash"
                                    :max-chars="40"
                                    class="d-none d-md-block d-lg-none"/>
                                <span class="d-none d-lg-block">{{ block.hash }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Parent Hash</td>
                            <td>
                                <nuxt-link :to="{name: 'blocks-slug', params: {slug: block.number - 1}}">
                                    <read-more
                                        :text="block.parentHash"
                                        class="d-sm-none" />
                                    <read-more
                                        :text="block.parentHash"
                                        :max-chars="20"
                                        class="d-none d-sm-block d-md-none"/>
                                    <read-more
                                        :text="block.parentHash"
                                        :max-chars="40"
                                        class="d-none d-md-block d-lg-none"/>
                                    <span class="d-none d-lg-block">{{ block.parentHash }}</span>
                                </nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Created By</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'address-slug', params: {slug: block.signer}}"
                                    class="d-sm-none">
                                    <read-more
                                        v-if="block.signer"
                                        :text="block.signer" />
                                    <read-more
                                        v-else
                                        :text="block.miner" />
                                </nuxt-link>
                                <nuxt-link
                                    :to="{name: 'address-slug', params: {slug: block.signer}}"
                                    class="d-none d-sm-block d-md-none">
                                    <read-more
                                        v-if="block.signer"
                                        :text="block.signer"
                                        :max-chars="20" />
                                    <read-more
                                        v-else
                                        :text="block.miner"
                                        :max-chars="20" />
                                </nuxt-link>
                                <nuxt-link
                                    :to="{name: 'address-slug', params: {slug: block.signer}}"
                                    class="d-none d-md-block">
                                    <span
                                        v-if="block.signer"
                                        :text="block.signer"
                                        :maxChars="20">{{ block.signer }}</span>
                                    <span
                                        v-else
                                        :maxChars="20">{{ block.miner }}</span>
                                </nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Finality</td>
                            <td>{{ block.finality }} %</td>
                        </tr>
                        <tr>
                            <td>Gas Used</td>
                            <td>{{ formatNumber(block.gasUsed) }}</td>
                        </tr>
                        <tr>
                            <td>Gas Limit</td>
                            <td>{{ formatNumber(block.gasLimit) }}</td>
                        </tr>
                        <!--tr>
                            <td>Nonce</td>
                            <td>
                                <read-more
                                    :text="block.nonce"
                                    class="d-sm-none"/>
                                <read-more
                                    :text="block.nonce"
                                    :max-chars="20"
                                    class="d-none d-sm-block"/>
                            </td>
                        </tr-->
                        <tr>
                            <td>Extra Data</td>
                            <td>
                                <read-more
                                    :text="block.extraData"
                                    class="d-sm-none"/>
                                <read-more
                                    :text="block.extraData"
                                    :max-chars="20"
                                    class="d-none d-sm-block d-md-none"/>
                                <read-more
                                    :text="block.extraData"
                                    :max-chars="40"
                                    class="d-none d-md-block"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!--:title="'Transactions (' + formatNumber(totalTxsCount) + ')'"-->
        <b-tabs
            ref="allTabs"
            v-model="tabIndex"
            class="tyslin-tabs"
            @input="onSwitchTab">
            <b-tab
                :active="hashTab === '#transactions'"
                title="Transactions"
                href="#transactions">
                <table-tx
                    v-if="hashTab === '#transactions'"
                    :block="block.number.toString()"
                    :block_timestamp="block.timestamp"
                    :parent="'transactions'"
                    :page="this"/>
            </b-tab>
            <!--:title="'BlockSigner (' + formatNumber(blockSignerCount) + ')'"-->
            <b-tab
                :active="hashTab === '#blockSigner'"
                title="BlockSigner"
                href="#blockSigner">
                <block-signer
                    v-if="hashTab === '#blockSigner'"
                    :block="number"
                    :parent="'blockSigner'"
                    :page="this"/>
            </b-tab>
        </b-tabs>
    </section>
</template>
<script>
import mixin from '~/plugins/mixin'
import TableTx from '~/components/TableTx'
import ReadMore from '~/components/ReadMore'
import BlockSigner from '~/components/BlockSigner'

export default {
    components: {
        TableTx,
        ReadMore,
        BlockSigner
    },
    mixins: [mixin],
    head () {
        return {
            title: 'Block ' + this.$route.params.slug + ' Info'
        }
    },
    data () {
        return {
            number: null,
            block: null,
            epoch: null,
            timestamp_moment: null,
            loading: true,
            totalTxsCount: 0,
            blockSignerCount: 0,
            tabIndex: 0
        }
    },
    computed: {
        hashTab () {
            return this.$route.hash || '#transactions'
        }
    },
    created () {
        let number = this.$route.params.slug
        if (number) {
            this.number = number.toString()
        }
    },
    async mounted () {
        let self = this

        self.loading = true

        // Init breadcrumbs data.
        this.$store.commit('breadcrumb/setItems', {
            name: 'blocks-slug',
            to: { name: 'blocks-slug', params: { slug: self.number } }
        })

        let params = {}

        if (self.number) {
            params.block = self.number
        }
        params.list = 'blocks'

        let query = this.serializeQuery(params)

        let responses = await Promise.all([
            this.$axios.get('/api/blocks/' + this.$route.params.slug),
            this.$axios.get('/api/counting' + '?' + query)
        ])

        this.block = responses[0].data
        let moment = self.$moment(responses[0].data.timestamp)
        this.timestamp_moment = `${moment.fromNow()} <small>(${moment.format('lll')} +UTC)</small>`

        self.totalTxsCount = responses[1].data.totalTxes

        self.blockSignerCount = responses[1].data.blockSigners

        self.loading = false
    },
    methods: {
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
