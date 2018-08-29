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
          <h4>Search your beer:</h4>
          <div class="search">
            <form>
              <input v-model="name" type="text">
            </form>
            <a @click="searchBeer" class="btn">Go!</a>
          </div>
          <p class="small">or apply some filters</p>
          <h4>Filters:</h4>
          <div class="field">ABV greater than
            <form><input v-model="abvGtFilter" type="text"></form>
          </div>
          <div class="field">ABV less than
            <form><input v-model="abvLtFilter" type="text"></form>
          </div>
          <a class="btn" @click="getSumFilters">Apply</a>
          <div class="tar">
            <a @click="resetFilters" class="link">Reset all filters</a>
          </div>

        </aside>
        <div class="list">
          <div v-for="i in resultItems" :key="i.id" class="card">
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
      resultItems: [],
      abvGtFilter: '',
      abvLtFilter: '',
      sumFilters: '',
      name: ''
    }
  },
  created() {
    this.$http.get('https://api.punkapi.com/v2/beers').then(
      resp => {
        console.log(resp)
        this.resultItems = resp.data
      },
      err => {
        console.error(err)
      }
    )
  },
  methods: {
    getSumFilters() {
      if (this.sumFilters) {
        this.sumFilters = ''
      }
      if (this.abvGtFilter) {
        this.sumFilters += `abv_gt=${this.abvGtFilter}`
      }
      if (this.abvLtFilter) {
        this.sumFilters += `&abv_lt=${this.abvLtFilter}`
      }
      this.applyFilters()
    },
    applyFilters() {
      this.$http.get(`https://api.punkapi.com/v2/beers?${this.sumFilters}`).then(
        resp => {
          console.log(resp)
          this.resultItems = resp.data
        },
        err => {
          console.error(err)
        }
      )
    },
    resetFilters() {
      ;(this.sumFilters = ''), (this.abvGtFilter = ''), (this.abvLtFilter = '')
      this.applyFilters()
    },
    searchBeer() {
      this.sumFilters = ''
      let arr = this.name.split(' ')
      let names = arr.join('_')
      console.log(names)
      this.$http.get(`https://api.punkapi.com/v2/beers?beer_name=${names}`).then(
        resp => {
          console.log(resp)
          this.resultItems = resp.data
        },
        err => {
          console.error(err)
        }
      )
    }
  }
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

    .filters {
      width: 270px;
      padding: 20px 30px;
      background-color: $grey;
      border: 1px solid #ccc;
      position: fixed;
      h4 {
        margin-top: 0;
      }
      .search {
        margin-bottom: 20px;
        display: grid;
        grid: 20px / 2fr 1fr;
        gap: 20px;
        input {
          height: 14px;
          padding: 0 10px;
        }
        .btn {
          font-size: 12px;
          padding: 0 15px;
          height: 20px;
          line-height: 20px;
          margin: 0;
        }
      }
      .small {
        font-size: 13px;
        color: #666;
      }
      .field {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        input {
          width: 35px;
        }
      }
      .btn {
        font-size: 14px;
        font-weight: 700;
        background-color: #000;
        color: #fff;
        display: block;
        padding: 10px 15px;
        text-align: center;
        text-transform: uppercase;
        margin-top: 20px;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .link {
        font-size: 13px;
        color: #555;
        text-align: right;
        cursor: pointer;
      }
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
.tar {
  text-align: right;
}
</style>
