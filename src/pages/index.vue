<template>
  <loading-overlay v-if="loading"></loading-overlay>
  <div v-else>
    <section class="beers">
      <div class="wrap">
        <aside id="sidebar">
          <h5>Search your beer:</h5>
          <form @submit.prevent="searchBeer" class="search">
            <input v-model="filters.name" required="required" placeholder="My favourite beer" type="text">
            <custom-button>Go!</custom-button>
            <p class="small">or apply some filters</p>
          </form>
          <h5>Filters:</h5>
          <form @submit.prevent="applyFilters" class="filters">
            <div class="form-field">
              <select v-model="filters.abv" :class="{active:filters.abv!==''}">
                <option disabled value="">Alcohol by volume</option>
                <option value="abv_lt=4">Very low alcoholic</option>
                <option value="abv_gt=4&abv_lt=10">Low alcoholic</option>
                <option value="abv_gt=10&abv_lt=20">Medium alcoholic</option>
                <option value="abv_gt=20&abv_lt=35">High alcoholic</option>
                <option value="abv_gt=35">Blowing your mind</option>
              </select>
              <select v-model="filters.ibu" :class="{active:filters.ibu!==''}">
                <option disabled value="">Bitterness</option>
                <option value="ibu_lt=10">Slight bitterness</option>
                <option value="ibu_gt=10&ibu_lt=25">Average bitterness</option>
                <option value="ibu_gt=25&ibu_lt=45">Medium bitterness</option>
                <option value="ibu_gt=45&ibu_lt=80">Strong bitterness</option>
                <option value="ibu_gt=80&ibu_lt=120">Try not to cry</option>
              </select>
              <div class="ebc">
                <div>
                  <input type="radio" id="one" value="ebc_lt=20" v-model="filters.ebc">
                  <label for="one">Light beer</label>
                </div>
                <div>
                  <input type="radio" id="two" value="ebc_gt=20" v-model="filters.ebc">
                  <label for="two">Dark beer</label>
                </div>
              </div>
              <select v-model="filters.dateOfBrew" :class="{active:filters.dateOfBrew!==''}">
                <option disabled value="">Date of brew</option>
                <option value="brewed_after=01-2005&brewed_before=12-2007">2005 - 2007</option>
                <option value="brewed_after=01-2007&brewed_before=12-2009">2007 - 2009</option>
                <option value="brewed_after=01-2009&brewed_before=12-2011">2009 - 2011</option>
                <option value="brewed_after=01-2011&brewed_before=12-2013">2011 - 2013</option>
                <option value="brewed_after=01-2013&brewed_before=12-2015">2013 - 2015</option>
              </select>
              <input type="text" v-model="filters.hops" placeholder="The hops you want">
              <input type="text" v-model="filters.malt" placeholder="The malt you want">
              <input type="text" v-model="filters.food" placeholder="The food you want">
            </div>
            <custom-button>Apply</custom-button>
            <div class="tar">
              <custom-link type="button" @click.native="resetAll">Reset All</custom-link>
            </div>
          </form>
        </aside>
        <div class="main">
          <div v-if="noList" class="error-msg">
            Sorry! We have no results from your search. <br> Please change your request and try again.
          </div>
          <div v-if="!noList" class="list ">
            <div v-for="i in resultItems " :key="i.id " class="card ">
              <div class="content">
                <h4>{{i.name}}</h4>
                <b>{{i.tagline}}</b>
                <p>{{i.description}}</p>
                <router-link :to="`/beers/${i.id}`">Learn more...</router-link>
              </div>
              <img :src="`${i.image_url}`" alt=" ">
              <custom-button @click.native="addToCart(i.id)">Add to cart
                <font-awesome-icon icon="credit-card" />
              </custom-button>
            </div>
            <custom-button v-if="!noList && isNextPageExist && inlineLoading===0" @click.native="loadMore" class="light">Load more...</custom-button>
            <inlineLoading v-if="inlineLoading===1"></inlineLoading>
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
      resultItems: [],
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
      loading: 0,
      inlineLoading: 0
    }
  },
  updated() {
    if (window.innerHeight < 750) {
      document.getElementById('sidebar').style.bottom = '25px'
    }
  },
  created() {
    this.loading = 1
    this.$http
      .get('https://api.punkapi.com/v2/beers?per_page=24')
      .then(
        resp => {
          console.log(resp)
          // truncation of description
          for (let key in resp.data) {
            if (resp.data[key].name.length < 15) {
              resp.data[key].description = `${resp.data[key].description.substring(0, 100)}...`
            } else {
              resp.data[key].description = `${resp.data[key].description.substring(0, 50)}...`
            }
          }
          this.resultItems = resp.data
        },
        err => {
          console.error(err)
        }
      )
      .finally(() => {
        this.loading = 0
      })
  },
  methods: {
    getSumFilters() {
      this.sumFilters = ''
      for (let key in this.filters) {
        if (this.filters[key] !== '') {
          if (key === 'hops' || key === 'malt' || key === 'food') {
            this.sumFilters += `&${key}=${this.filters[key]}`
          } else {
            this.sumFilters += `&${this.filters[key]}`
          }
        }
      }
    },
    applyFilters() {
      this.getSumFilters()
      this.loading = 1
      this.$http
        .get(`https://api.punkapi.com/v2/beers?per_page=24${this.sumFilters}`)
        .then(
          resp => {
            console.log(resp)
            for (let key in resp.data) {
              if (resp.data[key].name.length < 15) {
                resp.data[key].description = `${resp.data[key].description.substring(0, 100)}...`
              } else {
                resp.data[key].description = `${resp.data[key].description.substring(0, 50)}...`
              }
            }
            if (resp.data.length) {
              this.resultItems = resp.data
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
          this.loading = 0
        })
    },
    resetAll() {
      this.sumFilters = ''
      Object.keys(this.filters).forEach(k => (this.filters[k] = ''))
      this.applyFilters()
      this.noList = false
    },
    searchBeer() {
      this.filters.sumFilters = ''
      // let arr = this.name.split(' ')
      // let names = arr.join('_')
      this.loading = 1
      this.$http
        .get(`https://api.punkapi.com/v2/beers?beer_name=${this.filters.name}`)
        .then(
          resp => {
            console.log(resp)
            for (let key in resp.data) {
              let el = resp.data[key]
              if (el.name.length < 15) {
                el.description = `${el.description.substring(0, 100)}...`
              } else {
                el.description = `${el.description.substring(0, 50)}...`
              }
            }
            if (resp.data.length) {
              this.resultItems = resp.data
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
          this.loading = 0
        })
    },
    loadMore() {
      this.currentPage += 1
      this.inlineLoading = 1
      if (this.filters.name === '') {
        this.$http
          .get(`https://api.punkapi.com/v2/beers?per_page=24&page=${this.currentPage}&${this.sumFilters}`)
          .then(
            resp => {
              for (let key in resp.data) {
                let el = resp.data[key]
                if (el.name.length < 15) {
                  el.description = `${el.description.substring(0, 100)}...`
                } else {
                  el.description = `${el.description.substring(0, 50)}...`
                }
              }
              this.resultItems.push(...resp.data)
              if (resp.data.length < 23) {
                this.isNextPageExist = false
              }
            },
            err => {
              console.error(err)
            }
          )
          .finally(() => {
            this.inlineLoading = 0
          })
      } else {
        this.$http
          .get(`https://api.punkapi.com/v2/beers?per_page=24&page=${this.currentPage}&beer_name=${this.filters.name}`)
          .then(
            resp => {
              for (let key in resp.data) {
                let el = resp.data[key]
                if (el.name.length < 15) {
                  el.description = `${el.description.substring(0, 100)}...`
                } else {
                  el.description = `${el.description.substring(0, 50)}...`
                }
              }
              this.resultItems.push(...resp.data)
              if (resp.data.length < 23) {
                this.isNextPageExist = false
              }
            },
            err => {
              console.error(err)
            }
          )
          .finally(() => {
            this.inlineLoading = 0
          })
      }
    },
    addToCart(id) {
      this.$store.commit({
        type: 'addToCart',
        id: id
      })
      console.log(this.$store.state.cart)
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
    width: 266px;
    // max-height: 450px;
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

      .small {
        font-size: 13px;
        color: #666;
      }
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
