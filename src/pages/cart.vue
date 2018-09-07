
<template>
  <loading-overlay v-if="loading"></loading-overlay>
  <div v-else class="cart">
    <div class="wrap">
      <div v-for="i in addedToCart" :key="i.id" class="item" v-if="i.id">
        <img :src="`${i.image_url}`" alt=" ">
        <h4>{{i.name}}</h4>
        <p>
          <b>{{i.tagline}}</b>
        </p>
        <custom-button @click.native="removeFromCart(addedToCart[i].id)">Remove from cart</custom-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addedToCart: [],
      loading: 0
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
          this.addedToCart = resp.data
        },
        err => {
          console.error(err)
        }
      )
      .finally(() => {
        this.loading = 0
      })
  },
  computed: {}
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
}
</style>
