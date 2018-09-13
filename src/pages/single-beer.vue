<template>
  <div class="single-beer">
    <div class="wrap">
      <div>
        <h2>{{beer.name}}</h2>
        <p>{{beer.description}}</p>
        <div class="grid">
          <p>First brewed date: {{beer.first_brewed}}</p>
          <p>Alcohol by volume: {{beer.abv}}</p>
          <p>Boil volume: {{beer.boil_volume.value}} {{beer.boil_volume.unit}}</p>
          <p>European Brewing Convention: {{beer.ebc}}</p>
          <p>International Bittering Units: {{beer.ibu}}</p>
          <p>Malt: {{beer.ingredients.malt[0].name}}, {{beer.ingredients.malt[0].amount.value}} {{beer.ingredients.malt[0].amount.unit}}</p>
        </div>
        <p>Yeast: {{beer.ingredients.yeast}}</p>

        Perfect for:
        <ul>
          <li v-for="i in beer.food_pairing" :key="i">{{i}}</li>
        </ul>
        <p>
          <b>{{beer.tagline}}</b>
        </p>
        <custom-button v-if="checkIfAdded(beer.id)" @click.native="removeFromCart(beer)" class="light">Remove from cart</custom-button>
        <custom-button v-else @click.native="addToCart(beer.id)">Add to cart
          <font-awesome-icon icon="credit-card" />
        </custom-button>
        <router-link class="btn-cta light check" to="/cart">Check your cart</router-link>
      </div>
      <img :src="`${beer.image_url}`" alt=" ">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      beer: {}
    }
  },
  created() {
    this.$store.commit('loadingOn')
    this.$http
      .get(`https://api.punkapi.com/v2/beers/${this.$route.params.id}`)
      .then(resp => (this.beer = resp.data[0]), err => console.error(err))
      .finally(() => {
        this.$store.commit('loadingOff')
      })
  },
  computed: {
    isInCart() {
      return this.$store.state.cart.includes(this.beer.id)
    }
  },
  methods: {
    addToCart(id) {
      this.$store.commit({
        type: 'addToCart',
        id: id
      })
      console.log(this.$store.state.cart)
    },
    removeFromCart(el) {
      this.$store.commit('removeFromCart', el)
    },
    checkIfAdded(id) {
      return this.$store.state.cart.includes(id)
    }
  }
}
</script>
<style lang="scss">
@import '~styles/variables';
.single-beer {
  padding-bottom: 24px;
  .wrap {
    padding: 30px;
    background-color: $grey;
    border: 1px solid #ccc;
    display: grid;
    grid: auto / 3fr 2fr;
    gap: 20px;
    justify-items: center;
    img {
      height: 450px;
    }
    .btn-cta {
      width: 250px;
      height: 36px;
      margin-top: 20px;
      display: inline-block;
      .fa-credit-card {
        font-size: 16px;
        margin-left: 12px;
      }
      &.check {
        margin-left: 20px;
        line-height: 36px;
        text-align: center;
        padding: 0;
      }
    }
    .grid {
      display: grid;
      grid: auto / 1fr 1fr;
      gap: 0 20px;
      p {
        margin-bottom: 0;
      }
    }
  }
}
</style>
