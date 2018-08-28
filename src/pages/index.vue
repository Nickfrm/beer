<template>
  <div class="grid">
    Test: {{def}}
    <div v-for="i in items" :key="i.id" class="card">
      <h1>{{i.name}}</h1>
      <p>{{i.tagline}}</p>
      <p>{{i.description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      def: 'test',
      items: []
    }
  },
  created() {
    this.$http.get('https://api.punkapi.com/v2/beers').then(
      resp => {
        console.log(resp)
        this.items = resp.data
      },
      err => {
        console.error(err)
      }
    )
  }
  // methods: {

  // },
  // computed: {

  // },
  // watch: {

  // }
}
</script>

<style lang="scss">
.grid {
  display: grid;
  grid: 300px / repeat(4, 1fr);
  gap: 20px;
  .card {
    background: #f7f7f7;
    border: 1px solid #ccc;
    padding: 20px;
  }
}
</style>
