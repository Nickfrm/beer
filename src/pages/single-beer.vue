<template>
  <div class="single-beer">
    <div class="wrap">
      <div>
        <div class="img"><img :src="`${beer.image_url}`" alt=" "></div>
        <custom-button v-if="checkIfAdded(beer.id)" @click.native="removeFromCart(beer)" class="light">Remove from cart
          <font-awesome-icon icon="trash" />
        </custom-button>
        <custom-button v-else @click.native="addToCart(beer.id)">Add to cart
          <font-awesome-icon icon="cart-plus" />
        </custom-button>
      </div>
      <div>
        <h3>{{beer.name}}</h3>
        <p class="tagline">{{beer.tagline}}</p>
        <h4>Description:</h4>
        <p class="desc">{{beer.description}}</p>
        <h4>Characteristics:</h4>
        <div class="params">
          <div class="row">
            <p>First brewed date:</p>
            <div class="dots"></div>
            <p>{{beer.first_brewed}}</p>
          </div>
          <div class="row">
            <p>Alcohol by volume:</p>
            <div class="dots"></div>
            <p> {{beer.abv}}</p>
          </div>
          <div class="row">
            <p>Boil volume: </p>
            <div class="dots"></div>
            <p>{{beer.boil_volume.value}} {{beer.boil_volume.unit}}</p>
          </div>
          <div class="row">
            <p>European Brewing Convention:</p>
            <div class="dots"></div>
            <p> {{beer.ebc}}</p>
          </div>
          <div class="row">
            <p>International Bittering Units:</p>
            <div class="dots"></div>
            <p> {{beer.ibu}}</p>
          </div>
          <div class="row">
            <p>Malt:</p>
            <div class="dots"></div>
            <p> {{beer.ingredients.malt[0].name}}, {{beer.ingredients.malt[0].amount.value}} {{beer.ingredients.malt[0].amount.unit}}</p>
          </div>
          <div class="row">
            <p>Yeast:</p>
            <div class="dots"></div>
            <p> {{beer.ingredients.yeast}}</p>
          </div>
        </div>
        <!-- <div class="params">
          <p>First brewed date:
            <b>{{beer.first_brewed}}</b>
          </p>
          <p>Alcohol by volume: {{beer.abv}}</p>
          <p>Boil volume: {{beer.boil_volume.value}} {{beer.boil_volume.unit}}</p>
          <p>European Brewing Convention: {{beer.ebc}}</p>
          <p>International Bittering Units: {{beer.ibu}}</p>
          <p>Malt: {{beer.ingredients.malt[0].name}}, {{beer.ingredients.malt[0].amount.value}} {{beer.ingredients.malt[0].amount.unit}}</p>
          <p>Yeast: {{beer.ingredients.yeast}}</p>
        </div> -->
        <h4>Perfect for:</h4>
        <ul>
          <li v-for="i in beer.food_pairing" :key="i">{{i}}</li>
        </ul>
        <h4>Brewers tips:</h4>
        <p class="tips">{{beer.brewers_tips}}</p>
        <!-- <custom-button v-if="checkIfAdded(beer.id)" @click.native="removeFromCart(beer)" class="light">Remove from cart</custom-button>
        <custom-button v-else @click.native="addToCart(beer.id)">Add to cart
          <font-awesome-icon icon="credit-card" />
        </custom-button>
        <router-link class="link" to="/cart">Check your cart</router-link> -->
      </div>

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
  height: 100%;
  margin-bottom: -41px;
  padding-bottom: 71px;
  .fa-cart-plus,
  .fa-trash,
  .fa-check {
    font-size: 15px;
    margin-left: 12px;
  }
  .wrap {
    display: grid;
    grid: auto / 280px 1fr;
    gap: 30px;
    justify-items: center;
    border-radius: 4px;
    > div {
      width: 100%;
    }
  }
  h3 {
    margin: 0;
  }
  p {
    margin: 8px 0;
  }
  .tagline,
  .desc,
  .params,
  ul {
    margin-bottom: 30px;
  }
  .tagline {
    font-size: 19px;
  }
  .params {
    display: grid;
    grid-gap: 8px 0;
    .row {
      display: grid;
      grid: auto / auto 1fr auto;

      p {
        margin: 0;
      }
      .dots {
        border-bottom: 1px solid #dadada;
        margin: 0 8px;
      }
    }
  }
  ul {
    padding-left: 18px;
  }
  .img {
    height: 450px;
    width: 100%;
    text-align: center;
    padding: 20px;
    background-color: #fcfcfc;
    border: 1px solid #ccc;
    border-radius: 5px;
    img {
      height: 100%;
    }
  }
  .btn-cta {
    width: 100%;
    height: 36px;
    margin-top: 20px;
    display: inline-block;
    .fa-credit-card {
      font-size: 16px;
      margin-left: 12px;
    }
  }
  .link {
    display: inline-block;
    margin-left: 20px;
  }
}
</style>
