
<template>
  <div class="cart">
    <div class="wrap">
      <h3>My Cart</h3>
      <div class="error tac" v-if="error || isCartEmpty">
        <font-awesome-icon icon="cart-arrow-down" />
        <p>
          <b>Your cart is empty.</b> <br> To add products please check our
          <router-link to="/">catalog.</router-link>
        </p>
      </div>
      <div v-for="ci in cart" :key="ci.id" class="item">
        <img :src="`${ci.image_url}`">
        <router-link :to="`/beers/${ci.id}`" class="link">{{ci.name}}</router-link>
        <!-- <p>
          <b>{{ci.tagline}}</b>
        </p> -->
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
  h3 {
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .item {
    padding: 12px;
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    display: grid;
    // grid: 30px / 40px 1fr 1fr 0.8fr;
    grid: 30px / 40px 3fr 1fr;
    gap: 20px;
    align-items: center;
    border-radius: 4px;
    img {
      height: 100%;
      justify-self: center;
    }
    .link {
      margin: 0;
      color: #000;
      font-size: 19px;
    }
    .btn-cta {
      height: 30px;
      line-height: 30px;
    }
  }
  .error {
    // display: flex;
    // flex-direction: column;
    // height: 100%;
    // align-items: center;
    // justify-content: center;
    p {
      line-height: 26px;
      b {
        font-size: 20px;
        font-weight: 700;
      }
    }

    .fa-cart-arrow-down {
      display: block;
      margin: auto;
      font-size: 40px;
      color: #232323;
    }
  }
}
</style>
