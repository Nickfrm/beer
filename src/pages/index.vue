<template>
  <div class="beers">
    <div class="wrap">
      <div class="filters-wrap">
        <h3>Filters:</h3>
        <!-- <button @click="toggleDropdown" class="menu btn-icon">
        <font-awesome-icon v-if="!dropdown" icon="bars" />
        <font-awesome-icon v-else icon="times" />
        <div class="focus"></div>
      </button> -->
        <!-- <div class="dropdown-overflow" :class="{active:dropdown}" @click.self="toggleDropdown"> -->
        <!-- <div class="dropdown" :class="{active:dropdown}"> -->
        <!-- <div class="wrap"> -->
        <div class="filters">
          <div>
            <custom-select v-model="filters.abv" :items="getQueryRanges(abvs, 'abv')" :class="{active:filters.abv}" none="Alcohol by volume" />
            <custom-select v-model="filters.ibu" :items="getQueryRanges(ibus, 'ibu')" :class="{active:filters.ibu}" none="Choose bitterness" />
            <custom-select v-model="filters.dateOfBrew" :items="getQueryRanges(brewedDates, 'brewed')" :class="{active:filters.dateOfBrew}" none="Date of brew" />
          </div>
          <div>
            <input type="text" v-model="filters.hops" placeholder="The hops you want">
            <input type="text" v-model="filters.malt" placeholder="The malt you want">
            <input type="text" v-model="filters.food" placeholder="The food you want">
          </div>
          <div class="ebc">
            <div class="radio">
              <label :class="{checked:filters.ebc==='ebc_lt=20'}"><input type="radio" value="ebc_lt=20" v-model="filters.ebc">
                <div class="check"></div>
                Light Beer
              </label>
            </div>
            <span>OR</span>
            <div class="radio">
              <label :class="{checked:filters.ebc==='ebc_gt=20'}"><input type="radio" value="ebc_gt=20" v-model="filters.ebc">
                <div class="check"></div>
                Dark Beer
              </label>
            </div>
            <!-- <input type="range" min="1" max="2"> -->
          </div>
        </div>
        <custom-button @click.native="setSumFilters">Apply filters</custom-button>
        <custom-link type="button" @click.native="resetAll">Reset All</custom-link>
        <!-- </div> -->
        <!-- </div> -->
        <!-- </div> -->
      </div>
      <h3>Results:</h3>
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
          <custom-button v-if="checkIfAdded(i.id)" @click.native="removeFromCart(i)" class="light">Remove from cart</custom-button>
          <custom-button v-else @click.native="addToCart(i.id)">Add to cart
            <font-awesome-icon icon="cart-plus" />
          </custom-button>
        </div>
        <custom-button v-if="isNextPageExist && !inlineLoading" @click.native="loadMore" class="light loading">Load more...</custom-button>
        <inline-loading v-if="inlineLoading" />
      </div>
    </div>
  </div>
</template>

<script>
// import inlineLoading from '@/components/inline-loading'
export default {
  // components: { inlineLoading },
  data() {
    return {
      dropdown: false,
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
      ],
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
    isSearch: 'getBeers'
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
    removeFromCart(el) {
      this.$store.commit('removeFromCart', el)
    },
    checkIfAdded(id) {
      return this.$store.state.cart.includes(id)
    },
    toggleDropdown() {
      this.dropdown = !this.dropdown
    },
    getQueryRanges(arr, queryName) {
      return arr.map(e => {
        let id = ''
        for (const k in e) {
          if (e.hasOwnProperty(k) && k !== 'name') {
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
      let sumFilters = ''
      for (let key in this.filters) {
        let el = this.filters[key]
        if (el) {
          if (['hops', 'malt', 'food', 'name'].includes(key)) {
            if (key === 'name') key = 'beer_name'
            sumFilters += `&${key}=${el}`
          } else {
            sumFilters += `&${el}`
          }
        }
      }
      this.$store.commit('addFilters', sumFilters)
      // this.$router.push('/')
      // this.getBeers()
    },
    resetAll() {
      this.$store.commit('removeFilters')
      Object.keys(this.filters).forEach(k => (this.filters[k] = ''))
      // this.$router.push('/')
      // this.getBeers()
    }
  },
  computed: {
    isSearch() {
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

.menu {
  border: none;
  background: none;
  padding: 0;
  width: 22px;

  .fa-bars,
  .fa-times {
    font-size: 26px;
    color: $l-main;
    transition: all 0.3s ease;

    &:hover {
      color: $main;
    }
  }
}

.dropdown-overflow {
  position: absolute;
  top: 71px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  height: 100vh;
  pointer-events: none;
  transition: all 0.1s ease-out;

  &.active {
    background-color: rgba(0, 0, 0, 0.15);
    pointer-events: auto;
  }
}
.filters-wrap {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ccc;
}
.filters {
  display: grid;
  grid: auto / repeat(3, 1fr);
  grid-gap: 40px;
  margin-bottom: 12px;
  select {
    width: 100%;
    height: 28px;
    font-size: 14px;
    border: 1px solid #ccc;
    color: #aaa;
    padding-left: 10px;
    margin-bottom: 12px;

    &.active {
      color: #333;
      border-color: #bbb;
    }

    option {
      color: #333;
    }
  }

  input[type='text'] {
    height: 28px;
    padding: 0 10px;
    width: 100%;
    margin-bottom: 12px;

    &::placeholder {
      color: #aaa;
      font-size: 14px;
    }
  }

  .ebc {
    font-size: 14px;
    color: #333;
    display: grid;
    grid: auto/ 1fr auto 1fr;
    grid-gap: 32px;
    color: #aaa;
    margin-top: 5px;
    .radio {
      position: relative;
      label {
        cursor: pointer;
        line-height: 20px;
        // position: relative;
        &.checked {
          color: #000;
        }
      }
      input {
        display: none;
        &:checked ~ .check {
          border-color: $l-main;
        }
        &:checked ~ .check::before {
          background: $l-main;
        }
      }
      .check {
        position: absolute;
        top: 0;
        right: 0;
        height: 22px;
        width: 22px;
        cursor: pointer;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 100%;
        &::before {
          display: block;
          position: absolute;
          content: '';
          border-radius: 100%;
          height: 14px;
          width: 14px;
          top: 3px;
          left: 3px;
          margin: auto;
          transition: background 0.25s ease;
        }
      }
      span {
        line-height: 20px;
      }
    }
  }

  // input[type='range'] {
  //   -webkit-appearance: none;
  //   border: none;
  //   width: 100px;
  // }

  // input[type='range']::-webkit-slider-thumb {
  //   -webkit-appearance: none;
  //   height: 20px;
  //   width: 20px;
  //   background-color: $l-main;
  //   border-radius: 50%;
  //   cursor: pointer;
  //   transition: all 0.2s ease;
  //   margin-top: -2px;

  //   &:hover {
  //     background-color: $main;
  //   }
  // }

  // input[type='range']:focus {
  //   outline: none;
  // }

  // input[type='range']::-ms-track {
  //   width: 100%;
  //   cursor: pointer;
  //   background: transparent;
  //   border-color: transparent;
  //   color: transparent;
  // }
  // input[type='range']::-webkit-slider-runnable-track {
  //   width: 100%;
  //   height: 16px;
  //   cursor: pointer;
  //   background: $grey;
  //   // border: 1px solid $grey;
  //   border-radius: 20px;
  // }
}

.btn-cta {
  margin-right: 20px;
  padding: 0 40px;
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
    border-radius: 4px;
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
        text-transform: uppercase;
        font-size: 14px;
      }
    }
    .btn-cta {
      width: 100%;
      grid-column: 1 / 3;
      margin-top: 10px;
      .fa-cart-plus {
        font-size: 15px;
        margin-left: 12px;
      }
    }
  }
}
.btn-cta.loading {
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
