<template>
  <div id="app">
    <header>
      <div class="wrap">
        <div class="left-align">
          <div class="bars">
            <font-awesome-icon icon="bars" />
          </div>
          <router-link to="/" class="logo" exact>Beers</router-link>
          <div class="search">
            <input required="required" placeholder="My favourite beer" type="text">
            <custom-button @click.native="getBeers">
              <font-awesome-icon icon="search" />
            </custom-button>
          </div>
        </div>
        <router-link to="/cart" class="cart">
          <div v-if="sumCart" class="circle">{{sumCart}}</div>
          <font-awesome-icon icon="shopping-cart" size="2x" />
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
  created() {
    this.$store.commit('fillCart')
  },
  computed: {
    sumCart() {
      return this.$store.state.cart.length
    }
  }
}
</script>

<style lang="scss">
@import '~styles/app';
</style>
