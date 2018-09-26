<template>
  <div id="app">
    <loading-overlay v-if="$store.state.loading"></loading-overlay>
    <header>
      <div class="wrap">
        <div class="left-align">
          <router-link to="/" class="logo" exact>
            <font-awesome-icon icon="beer" /> Beers</router-link>
          <div class="search">
            <input v-model="search" required="required" placeholder="Search your favourite beer ..." type="text">
            <custom-button @click.native="searchBeer">
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      search: ''
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
    searchBeer() {
      this.$store.commit('addFilters', `&beer_name=${this.search}`)
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
@import '~styles/app';
</style>
