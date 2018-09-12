<template>
  <div id="app">
    <header>
      <div class="wrap">
        <div class="dropdown-overflow" :class="{active:dropdown}">
          <div class="dropdown" :class="{active:dropdown}">
            <div class="wrap"></div>
          </div>
        </div>
        <div class="left-align">
          <button @click="toggleDropdown" class="menu">
            <font-awesome-icon v-if="!dropdown" icon="bars" />
            <font-awesome-icon v-else icon="times" />
          </button>
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
  data() {
    return {
      dropdown: false
    }
  },
  created() {
    this.$store.commit('fillCart')
  },
  computed: {
    sumCart() {
      return this.$store.state.cart.length
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdown = !this.dropdown
      console.log(this.dropdown)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/app';
</style>
