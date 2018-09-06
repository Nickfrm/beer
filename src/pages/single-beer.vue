<template>
  <loading-overlay v-if="loading"></loading-overlay>
  <div v-else class="single-beer">
    <div class="wrap">
      <h2>{{beer.name}}</h2>
      <p>{{beer.description}}</p>
      <p>ABV: {{beer.abv}}</p>
      <!-- <p>Boil volume: {{beer.boil_volume.value}} {{beer.boil_volume.unit}}</p> -->
      <p>EBC: {{beer.ebc}}</p>
      <p>IBU: {{beer.ibu}}</p>
      <p>
        <b>{{beer.tagline}}</b>
      </p>
    </div>
    <img :src="`${beer.image_url}`" alt=" ">
  </div>
</template>
<script>
export default {
  data() {
    return {
      beer: {},
      loading: 0
    }
  },
  created() {
    this.loading = 1
    console.log(this.$route)
    this.$http
      .get(`https://api.punkapi.com/v2/beers/${this.$route.params.id}`)
      .then(resp => (this.beer = resp.data[0]), err => console.error(err))
      .finally(() => {
        this.loading = 0
      })
  }
}
</script>
<style lang="scss">
@import '~styles/variables';
.single-beer {
  padding: 20px 30px;
  background-color: $grey;
  border: 1px solid #ccc;
  display: grid;
  grid: auto / 1fr 1fr;
  gap: 20px;
  justify-items: center;
  img {
    max-height: 350px;
  }
}
</style>
