<template>
    <div
        v-if="loading"
        :class="(loading ? 'tyslin-loading tyslin-loading--full' : '')"/>
    <section v-else>

        <div
            v-if="total == 0"
            class="tyslin-empty">
            <i class="fa fa-cube tyslin-empty__icon"/>
            <p class="tyslin-empty__description">No token ID found</p>
        </div>

        <p
            v-if="total > 0"
            class="tyslin-total-items">{{ _nFormatNumber('token ID', 'Tokens ID', total, realTotal) }}</p>
        <table-base
            v-if="total > 0"
            :fields="fields"
            :items="items"
            class="tyslin-table--reward">
            <template
                slot="tokenId"
                slot-scope="props">
                {{ props.item.tokenId }}
            </template>

        </table-base>

        <b-pagination-nav
            v-if="total > 0 && total > perPage"
            v-model="currentPage"
            :total-rows="total"
            :per-page="perPage"
            :number-of-pages="pages"
            :link-gen="linkGen"
            :limit="7"
            align="center"
            class="tyslin-pagination"
            @change="onChangePaginate"
        />
    </section>
</template>
<script>
import mixin from '~/plugins/mixin'
import TableBase from '~/components/TableBase'

export default {
    components: {
        TableBase
    },
    mixins: [mixin],
    props: {
        token: {
            type: String,
            default: ''
        },
        holder: {
            type: String,
            default: ''
        },
        page: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parent: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        fields: {
            tokenId: { label: 'Token ID' }
        },
        loading: true,
        pagination: {},
        total: 0,
        realTotal: 0,
        items: [],
        currentPage: 1,
        perPage: 20,
        pages: 1
    }),
    watch: {
        $route (to, from) {
            const page = this.$route.query.page
            this.onChangePaginate(page)
        }
    },
    async mounted () {
        this.getDataFromApi()
    },
    methods: {
        async getDataFromApi () {
            let self = this

            self.currentPage = parseInt(this.$route.query.page)

            // Show loading.
            self.loading = true

            let params = {
                page: self.currentPage || 1,
                limit: self.perPage
            }

            let query = this.serializeQuery(params)
            let { data } = await this.$axios.get(`/api/tokens/${self.token}/nftHolder/${self.holder}?${query}`)
            console.log('data', data)
            self.items = data.items
            self.total = data.total
            self.realTotal = data.realTotal
            self.currentPage = data.currentPage
            self.pages = data.pages
            self.perPage = data.perPage

            // Hide loading.
            self.loading = false

            // return data
        },
        onChangePaginate (page) {
            let self = this
            self.currentPage = page

            self.getDataFromApi()
        },
        linkGen (pageNum) {
            return {
                query: {
                    page: pageNum
                },
                hash: this.parent
            }
        }
    }
}
</script>
