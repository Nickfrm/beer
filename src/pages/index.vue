<template>
  <div>
    <header>
      <div class="wrap">
        <a class="logo">Beers</a>
        <a class="cart">Cart</a>
      </div>
    </header>
    <section class="beers">
      <div class="wrap">
        <aside class="filters">
          <h4>Filters:</h4>
        </aside>
        <div class="list">
          <div v-for="i in items" :key="i.id" class="card">
            <h3>{{i.name}}</h3>
            <p>{{i.tagline}}</p>
            <p>{{i.description}}</p>
            <a>Learn more</a>
          </div>
        </div>
      </div>
    </section>
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
$l-grey: #fcfcfc;
$grey: #f4f4f4;
body {
  margin: 0;
  font-family: 'Arial';
  header {
    position: fixed;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #ccc;
    background-color: $l-grey;
    .wrap {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      a {
        &.logo {
          font-size: 28px;
          font-weight: 900;
          color: #232323;
        }
        &.cart {
          text-transform: uppercase;
          font-weight: 700;
        }
      }
    }
  }
  .wrap {
    max-width: 1000px;
    margin: 0 auto;
  }
  section.beers {
    margin: 80px 0 40px;
    .wrap {
    }
    .filters {
      width: 270px;
      height: 400px;
      padding: 0 30px;
      background-color: $grey;
      border: 1px solid #ccc;
      position: fixed;
    }
    .list {
      display: grid;
      grid: 250px / repeat(3, 1fr);
      gap: 15px;
      margin-left: 360px;
      .card {
        background: #f7f7f7;
        border: 1px solid #ccc;
        padding: 20px;
        font-size: 15px;
        h3 {
          margin-top: 0;
          overflow: hidden;
          max-width: 140px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        p {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        a {
          font-weight: 700;
          color: #333;
        }
      }
    }
  }
}
</style>
