<template>
  <div class="beers">
    <div class="wrap">
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
        <inline-loading v-if="inlineLoading" />
      </div>
    </div>
  </div>
</template>

<script>
import inlineLoading from '@/components/inline-loading'
export default {
  components: { inlineLoading },
  data() {
    return {
      beers: [],
      sumFilters: '',
      noList: false,
      currentPage: 1,
      isNextPageExist: true,
      inlineLoading: 0
    }
  },
  created() {
    this.getBeers()
  },
  watch: {
    isFiltersApplyed: 'getBeers'
  },
  methods: {
    getBeers() {
      // this.setSumFilters()
      if (!this.inlineLoading) {
        this.$store.commit('loadingOn')
      }
      this.$http
        .get(`https://api.punkapi.com/v2/beers?per_page=24&page=${this.currentPage}${this.$store.state.filters}`)
        .then(
          resp => {
            console.log(resp)
            // truncation of description
            for (let key in resp.data) {
              let el = resp.data[key]
              let h = el.name.length + el.tagline.length
              el.description = `${el.description.substring(0, el.name.length < 15 && h < 60 ? 150 : 100)}...`
            }
            if (resp.data.length) {
              if (!this.inlineLoading) {
                this.beers = resp.data
                this.noList = false
                if (resp.data.length < 23) {
                  this.isNextPageExist = false
                }
              } else {
                this.beers.push(...resp.data)
                if (resp.data.length < 23) {
                  this.isNextPageExist = false
                }
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
          this.inlineLoading = 0
          this.$store.commit('loadingOff')
        })
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
  computed: {
    isFiltersApplyed() {
      return this.$store.state.filters
    }
  }
}
</script>

<style lang="scss">
@import '~styles/variables';

.beers {
  height: 100%;
  margin-bottom: -41px;
  padding-bottom: 71px;
}
.list {
  display: grid;
  grid: auto / 1fr 1fr 1fr;
  gap: 16px 20px;
  .card {
    background: #f7f7f7;
    border: 1px solid #ccc;
    padding: 28px 22px;
    font-size: 15px;
    display: grid;
    grid: 270px / 3fr 1fr;
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
  grid-column: 1 / 4;
}
.spinner {
  grid-column: 1 / 4;
  margin-bottom: 24px;
}
.error-msg {
  font-size: 22px;
  text-align: center;
}

.tar {
  text-align: right;
}
</style>
