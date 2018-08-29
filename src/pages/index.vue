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
              <input v-model="name" required="required" type="text">
            </form>
            <a @click="searchBeer" class="btn">Go!</a>
          </div>
          <p class="small">or apply some filters</p>
          <h4>Filters:</h4>
          <form>
            <div class="field">ABV greater than
              <input v-model="abvGtFilter" type="text">
            </div>
            <div class="field">ABV less than
              <input v-model="abvLtFilter" type="text">
            </div>
            <a class="btn" @click="getSumFilters">Apply</a>
            <div class="tar">
              <a @click="resetAll" class="link">Reset all</a>
            </div>
          </form>
        </aside>
        <div v-if="noList===1" class="error-msg">
          Sorry! We have no results from your search. <br> Please change your request and try again.
        </div>
        <div class="single-beer" v-if="noList===2">
          <div>
            <h2>{{singleBeer.name}}</h2>
            <p>{{singleBeer.description}}</p>
            <p>ABV: {{singleBeer.abv}}</p>
            <!-- <p>Boil volume: {{singleBeer.boil_volume.value}} {{singleBeer.boil_volume.unit}}</p> -->
            <p>EBC: {{singleBeer.ebc}}</p>
            <p>IBU: {{singleBeer.ibu}}</p>
            <p>
              <b>{{singleBeer.tagline}}</b>
            </p>
          </div>
          <img :src="`${singleBeer.image_url}`" alt=" ">
        </div>
        <div v-if="noList===0 " class="list ">
          <div v-for="i in resultItems " :key="i.id " class="card ">
            <h3>{{i.name}}</h3>
            <p>{{i.tagline}}</p>
            <p>{{i.description}}</p>
            <a @click="getSingleBeer(i.id) ">Learn more</a>
          </div>
        </div>
      </div>
    </section>
    <div class="pagination">
      <div class="wrap">
        <div @click="changePage(-1)" class="prev">
          <div class="arrow left"></div> Previous page
        </div>
        <div class="current-page">{{currPage}}</div>
        <div @click="changePage(1)" class="next">Next page
          <div class="arrow right"></div>
        </div>
      </div>
    </div>
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
      name: '',
      noList: 0,
      singleBeer: {},
      currPage: 1
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
          this.resultItems = resp.data
        },
        err => {
          console.error(err)
        }
      )
    },
    resetAll() {
      ;(this.sumFilters = ''),
        (this.abvGtFilter = ''),
        (this.abvLtFilter = ''),
        (this.name = ''),
        (this.singleBeer = '')
      this.applyFilters()
      this.noList = 0
    },
    searchBeer() {
      this.sumFilters = ''
      // need to clear all with no refresh
      let arr = this.name.split(' ')
      let names = arr.join('_')
      this.$http.get(`https://api.punkapi.com/v2/beers?beer_name=${names}`).then(
        resp => {
          console.log(resp)
          if (resp.data.length) {
            this.resultItems = resp.data
            this.noList = 0
          } else {
            this.noList = 1
          }
        },
        err => {
          console.error(err)
        }
      )
    },
    getSingleBeer(id) {
      this.noList = 2
      this.$http.get(`https://api.punkapi.com/v2/beers/${id}`).then(
        resp => {
          this.singleBeer = resp.data[0]
        },
        err => {
          console.error(err)
        }
      )
    },
    changePage(dir) {
      if (this.currPage === 1 && dir === -1) return

      let nextPage = this.currPage + dir
      this.$http.get(`https://api.punkapi.com/v2/beers?${this.sumFilters}&page=${nextPage}`).then(
        resp => {
          if (resp.data.length === 0) return
          this.resultItems = resp.data
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          })
          this.currPage = nextPage
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
$d-grey: #ddd;

body {
  margin: 0;
  font-family: 'Arial';
  padding-bottom: 80px;
  position: relative;
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
    margin: 80px 0 20px;

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
          cursor: pointer;
        }
      }
    }
    .error-msg {
      margin-left: 360px;
      font-size: 22px;
      text-align: center;
    }
    .single-beer {
      margin-left: 360px;
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
  }
  .pagination {
    background-color: $grey;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #ccc;
    .wrap {
      max-width: 400px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .prev,
      .next {
        cursor: pointer;
        .arrow {
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          display: inline-block;
          &.right {
            border-left: 6px solid #000;
          }
          &.left {
            border-right: 6px solid #000;
          }
        }
      }
      .current-page {
        font-size: 18px;
      }
    }
  }
}
.tar {
  text-align: right;
}
</style>
