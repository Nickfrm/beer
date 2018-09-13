<template>
  <div id="app">
    <header>
      <div class="wrap">
        <div class="dropdown-overflow" :class="{active:dropdown}" @click.self="toggleDropdown">
          <div class="dropdown" :class="{active:dropdown}">
            <div class="wrap">
              <div class="filters">
                <div>
                  <custom-select v-model="filters.abv" :items="getQueryRanges(abvs, 'abv')" :class="{active:filters.abv}" none="Alcohol by volume" />
                  <custom-select v-model="filters.ibu" :items="getQueryRanges(ibus, 'ibu')" :class="{active:filters.ibu}" none="Bitterness" />
                  <custom-select v-model="filters.dateOfBrew" :items="getQueryRanges(brewedDates, 'brewed')" :class="{active:filters.dateOfBrew}" none="Date of brew" />
                </div>
                <div>
                  <input type="text" v-model="filters.hops" placeholder="The hops you want">
                  <input type="text" v-model="filters.malt" placeholder="The malt you want">
                  <input type="text" v-model="filters.food" placeholder="The food you want">
                </div>
                <div class="ebc">
                  <label>
                    <input type="radio" value="ebc_lt=20" v-model="filters.ebc"> Light beer
                  </label> /
                  <label>
                    <input type="radio" value="ebc_gt=20" v-model="filters.ebc"> Dark beer
                  </label>
                </div>
              </div>
              <custom-button @click.native="setSumFilters">Apply filters</custom-button>
              <custom-link type="button" @click.native="resetAll">Reset All</custom-link>
            </div>
          </div>
        </div>
        <div class="left-align">
          <button @click="toggleDropdown" class="menu btn-icon">
            <font-awesome-icon v-if="!dropdown" icon="bars" />
            <font-awesome-icon v-else icon="times" />
            <div class="focus"></div>
          </button>
          <router-link to="/" class="logo" exact>Beers</router-link>
          <div class="search">
            <input v-model="filters.name" required="required" placeholder="My favourite beer is ..." type="text">
            <custom-button @click.native="setSumFilters">
              <font-awesome-icon icon="search" />
            </custom-button>
          </div>
        </div>
        <router-link to="/cart" class="cart btn-icon">
          <div v-if="sumCart" class="circle">{{sumCart}}</div>
          <font-awesome-icon icon="shopping-cart" />
          <div class="focus"></div>
        </router-link>
      </div>
    </header>
    <router-view/>
    <footer>
      <div class="wrap">All right reserved. 2018</div>
    </footer>
    <loading-overlay v-if="$store.state.loading"></loading-overlay>
  </div>
</template>


<script>
export default {
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
      ]
    }
  },
  created() {
    this.$store.commit('fillCart')
    this.$store.commit('fillFilters')
  },
  computed: {
    sumCart() {
      return this.$store.state.cart.length
    }
  },
  methods: {
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
      console.log(sumFilters)
      // this.toggleDropdown()
      this.$router.push('/')
    },
    resetAll() {
      this.$store.commit('removeFilters')
      Object.keys(this.filters).forEach(k => (this.filters[k] = ''))
      // this.toggleDropdown()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
@import '~styles/app';
</style>
