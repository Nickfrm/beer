<template>
  <div id="app">
    <header>
      <div class="wrap">
        <router-link to="/" class="logo" exact>Beers</router-link>
        <router-link to="/cart" class="cart">
          <font-awesome-icon icon="shopping-cart" size="2x" />
        </router-link>
      </div>
    </header>
    <router-view/>
    <loading-overlay v-if="$store.state.loading"></loading-overlay>
  </div>
</template>


<script>
export default {
  // created() {
  //   // this.$store.commit('fillCart')
  // }
}
</script>

<style lang="scss">
@import '~styles/app';
</style>
