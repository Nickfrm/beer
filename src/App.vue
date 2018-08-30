<template>
  <div id="app">
    <header>
      <div class="wrap">
        <router-link to="/" class="logo" exact>Beers</router-link>
        <router-link to="/cart" class="cart">Cart</router-link>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '~styles/app';
</style>
