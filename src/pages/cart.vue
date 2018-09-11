
<template>
  <div class="cart">
    <div class="error" v-if="error || isCartEmpty">
      <font-awesome-icon icon="cart-arrow-down" size="2x" />
      <p>Ooops, your cart is empty</p>
    </div>
    <div class="wrap">
      <div v-for="ci in cart" :key="ci.id" class="item">
        <img :src="`${ci.image_url}`">
        <router-link :to="`/beers/${ci.id}`" class="link">{{ci.name}}</router-link>
        <p>
          <b>{{ci.tagline}}</b>
        </p>
        <custom-button @click.native="remove(ci)">Remove from cart</custom-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cart: [],
      error: false
    }
  },
  created() {
    this.$store.commit('loadingOn')
    let ids = this.$store.state.cart.join('|')
    let length = this.$store.state.cart.length
    this.$http
      .get(`https://api.punkapi.com/v2/beers?per_page=${length}&ids=${ids}`)
      .then(
        resp => {
          console.log(resp)
          this.error = false
          this.cart = resp.data
        },
        err => {
          console.error(err)
          this.error = true
        }
      )
      .finally(() => {
        this.$store.commit('loadingOff')
      })
  },
  methods: {
    remove(el) {
      this.$store.commit('removeFromCart', el.id)
      this.cart.splice(this.cart.indexOf(el), 1)
    }
  },
  computed: {
    isCartEmpty() {
      return this.cart.length === 0
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~styles/variables';
.cart {
  height: 100%;
  margin-bottom: -41px;
  padding-bottom: 71px;
  .wrap {
    display: grid;
    gap: 16px;
  }
  .item {
    padding: 15px 10px;
    background-color: $grey;
    border: 1px solid #ccc;
    display: grid;
    grid: 50px / 100px 1fr 1fr 0.8fr;
    gap: 20px;
    align-items: center;
    img {
      height: 100%;
      justify-self: center;
    }
    .link {
      margin: 0;
      color: #000;
      font-size: 1.333em;
    }
  }
  .error {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    .fa-cart-arrow-down {
      display: block;
    }
  }
}
</style>
