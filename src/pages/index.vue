<template>
  <div>
    <section class="beers">
      <div class="wrap">
        <aside id="sidebar">
          <h5>Search your beer:</h5>
          <div class="form search">
            <input v-model="filters.name" required="required" placeholder="My favourite beer" type="text">
            <custom-button @click.native="getBeers">Go!</custom-button>
          </div>
          <h5>Filters:</h5>
          <div class="form filters">
            <div class="form-field">
              <custom-select v-model="filters.abv" :items="getQueryRanges(abvs, 'abv')" :class="{active:filters.abv}" none="Alcohol by volume" />
              <custom-select v-model="filters.ibu" :items="getQueryRanges(ibus, 'ibu')" :class="{active:filters.ibu}" none="Bitterness" />
              <div class="ebc">
                <label>
                  <input type="radio" value="ebc_lt=20" v-model="filters.ebc"> Light beer
                </label>
                <label>
                  <input type="radio" value="ebc_gt=20" v-model="filters.ebc"> Dark beer
                </label>
              </div>
              <custom-select v-model="filters.dateOfBrew" :items="getQueryRanges(brewedDates, 'brewed')" :class="{active:filters.dateOfBrew}" none="Date of brew" />
              <input type="text" v-model="filters.hops" placeholder="The hops you want">
              <input type="text" v-model="filters.malt" placeholder="The malt you want">
              <input type="text" v-model="filters.food" placeholder="The food you want">
            </div>
            <custom-button @click.native="getBeers">Apply</custom-button>
            <div class="tar">
              <custom-link type="button" @click.native="resetAll">Reset All</custom-link>
            </div>
          </div>
        </aside>
        <div class="main">
          <div v-if="noList" class="error-msg">
            Sorry! We have no results from your search. <br> Please change your request and try again.
          </div>
          <div v-else class="list ">
            <div v-for="i in beers " :key="i.id " class="card ">
              <div class="content">
                <h4>{{i.name}}</h4>
                <b>{{i.tagline}}</b>
                <p>{{i.description}}</p>
                <router-link :to="`/beers/${i.id}`">Learn more...</router-link>
              </div>
              <img :src="`${i.image_url}`" alt=" ">
              <custom-button @click.native="addToCart(i.id)" :disabled="checkIfAdded(i.id)">Add to cart
                <font-awesome-icon icon="credit-card" />
              </custom-button>
            </div>
            <custom-button v-if="isNextPageExist && !inlineLoading" @click.native="loadMore" class="light">Load more...</custom-button>
            <inlineLoading v-if="inlineLoading" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import inlineLoading from '@/components/inline-loading'
export default {
  components: { inlineLoading },
  data() {
    return {
      beers: [],
      filters: {
        abv: '',
        ibu: '',
        ebc: '',
        dateOfBrew: '',
        hops: '',
        malt: '',
        food: '',
        name: ''
      },
      sumFilters: '',
      noList: false,
      singleBeer: {},
      currentPage: 1,
      isNextPageExist: true,
      inlineLoading: 0,
      brewedDates: [
        { name: '2007-2009', before: '12-2009', after: '01-2007' },
        { name: '2009-2011', before: '12-2011', after: '01-2009' },
        { name: '2011-2013', before: '12-2013', after: '01-2011' },
        { name: '2013-2015', before: '12-2015', after: '01-2013' }
      ],
      ibus: [
        { name: 'Slight bitterness', lt: 10 },
        { name: 'Medium bitterness', lt: 45, gt: 25 },
        { name: 'Strong bitterness', lt: 80, gt: 45 },
        { name: 'Try not to cry', lt: 120, gt: 80 }
      ],
      abvs: [
        { name: 'Very low alcoholic', lt: 4 },
        { name: 'Low alcoholic', gt: 4, lt: 10 },
        { name: 'Medium alcoholic', gt: 10, lt: 20 },
        { name: 'High alcoholic', gt: 20, lt: 35 },
        { name: 'Blowing your mind', gt: 35 }
      ]
    }
  },
  created() {
    this.getBeers()
  },
  methods: {
    getBeers() {
      this.setSumFilters()
      this.$store.commit('loadingOn')
      this.$http
        .get(`https://api.punkapi.com/v2/beers?per_page=24&page=${this.currentPage}${this.sumFilters}`)
        .then(
          resp => {
            console.log(resp)
            // truncation of description
            for (let key in resp.data) {
              let el = resp.data[key]
              el.description = `${el.description.substring(0, el.name.length < 15 ? 100 : 50)}...`
            }
            if (resp.data.length) {
              this.beers = resp.data
              this.noList = false
              if (resp.data.length < 23) {
                this.isNextPageExist = false
              }
            } else {
              this.noList = true
            }
          },
          err => {
            console.error(err)
          }
        )
        .finally(() => {
          this.$store.commit('loadingOff')
        })
    },
    getQueryRanges(arr, queryName) {
      return arr.map(e => {
        let id = ''
        for (const k in e) {
          if (e.hasOwnProperty(k) && k != 'name') {
            const el = e[k]
            if (el) {
              if (id) id += '&'
              id += `${queryName}_${k}=${el}`
            }
          }
        }
        return {
          id,
          name: e.name
        }
      })
    },
    setSumFilters() {
      this.sumFilters = ''
      for (let key in this.filters) {
        let el = this.filters[key]
        if (el) {
          if (['hops', 'malt', 'food', 'name'].includes(key)) {
            if (key === 'name') key = 'beer_name'
            this.sumFilters += `&${key}=${el}`
          } else {
            this.sumFilters += `&${el}`
          }
        }
      }
    },
    resetAll() {
      this.sumFilters = ''
      Object.keys(this.filters).forEach(k => (this.filters[k] = ''))
      this.applyFilters()
      this.noList = false
    },
    loadMore() {
      this.currentPage += 1
      this.inlineLoading = 1
      this.getBeers()
    },
    addToCart(id) {
      this.$store.commit({
        type: 'addToCart',
        id: id
      })
    },
    checkIfAdded(id) {
      return this.$store.state.cart.includes(id)
    }
  },
  computed: {}
}
</script>

<style lang="scss">
@import '~styles/variables';
section.beers {
  margin: 0 0 20px;
  // min-height: calc(100vh - 151px);
  aside {
    width: 338px;
    overflow: auto;
    padding: 20px 30px;
    background-color: $grey;
    border: 1px solid #ccc;
    position: fixed;
    top: 75px;
    .search {
      margin-bottom: 20px;
      display: grid;
      grid: auto / 2fr 1fr;
      grid-gap: 20px;
    }
    input[type='text'] {
      height: 26px;
      padding: 0 10px;
      border: 1px solid #ccc;
      &::placeholder {
        color: #aaa;
        font-size: 14px;
      }
    }
    .filters {
      .form-field {
        margin-bottom: 32px;
        display: grid;
        grid-gap: 16px;
        select {
          width: 100%;
          height: 28px;
          font-size: 14px;
          border: 1px solid #ccc;
          color: #aaa;
          padding-left: 10px;
          &.active {
            color: #333;
            border-color: #bbb;
          }
          option {
            color: #333;
          }
        }
        .ebc {
          display: grid;
          grid: auto / 1fr 1fr;
          font-size: 14px;
          align-items: center;
          color: #333;
          div {
            display: flex;
          }
        }
      }
      .btn-cta {
        width: 100%;
        margin-bottom: 16px;
      }
      .link {
        text-align: right;
      }
    }
  }
  .main {
    display: grid;
    grid: 200px / 1fr 2fr;
    gap: 32px;
    .list {
      grid-column-start: 2;
      display: grid;
      grid: auto / repeat(2, 1fr);
      gap: 16px;
      .card {
        background: #f7f7f7;
        border: 1px solid #ccc;
        padding: 20px;
        font-size: 15px;
        display: grid;
        grid: 210px / 2fr 1fr;
        gap: 16px;
        justify-items: center;
        img {
          max-height: calc(100% - 38px);
          max-width: 100%;
          align-self: center;
        }
        .content {
          display: grid;
          grid-template-rows: repeat(3, auto) 1fr;
          a {
            align-self: end;
          }
        }
        .btn-cta {
          width: 100%;
          line-height: 26px;
          grid-column: 1 / 3;
          margin-top: 10px;
          .fa-credit-card {
            font-size: 16px;
            margin-left: 12px;
          }
        }
      }
    }
    .btn-cta.light {
      width: 100%;
      margin-top: 8px;
      height: 32px;
      line-height: 32px;
      grid-column: 1 / 3;
      margin-bottom: 24px;
    }
    .spinner {
      grid-column: 1 / 3;
      margin-bottom: 24px;
    }
    .error-msg {
      font-size: 22px;
      text-align: center;
    }
  }
}

.tar {
  text-align: right;
}
</style>
