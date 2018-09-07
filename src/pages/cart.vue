
<template>
  <loading-overlay v-if="loading"></loading-overlay>
  <div v-else class="cart">
    <div class="wrap">
      <div class="error" v-if="error || isCartEmpty">Ooops, your cart is empty</div>
      <div v-for="i in addedToCart" :key="i.id" class="item" v-if="i.id">
        <img :src="`${i.image_url}`" alt=" ">
        <h4>{{i.name}}</h4>
        <p>
          <b>{{i.tagline}}</b>
        </p>
        <custom-button @click.native="removeFromList(i, i.id)">Remove from cart</custom-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addedToCart: [],
      loading: 0,
      error: false
    }
  },
  created() {
    this.loading = 1
    let ids = this.$store.state.cart.join('|')
    let length = this.$store.state.cart.length
    console.log(ids)
    this.$http
      .get(`https://api.punkapi.com/v2/beers?per_page=${length}&ids=${ids}`)
      .then(
        resp => {
          console.log(resp)
          this.error = false
          this.addedToCart = resp.data
        },
        err => {
          console.error(err)
          this.error = true
        }
      )
      .finally(() => {
        this.loading = 0
      })
  },
  methods: {
    removeFromList(el, id) {
      this.removeFromCart(id)
      this.addedToCart.splice(this.addedToCart.indexOf(el), 1)
    },
    removeFromCart(id) {
      this.$store.commit({
        type: 'removeFromCart',
        id: id
      })
    }
  },
  computed: {
    isCartEmpty: function() {
      if (this.addedToCart.length === 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~styles/variables';
.cart {
  padding-bottom: 20px;
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
    h4 {
      margin: 0;
    }
  }
  .error {
    display: flex;
    height: calc(100vh - 120px);
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
  }
}
</style>
