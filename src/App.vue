<template>
  <div id="app">
    <header>
      <div class="wrap">
        <router-link to="/" class="logo" exact>Beers</router-link>
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
