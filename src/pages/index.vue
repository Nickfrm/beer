<template>
  <div>

    <section class="beers">
      <div class="wrap">
        <aside>
          <h4>Search your beer:</h4>
          <form @submit.prevent="searchBeer" class="search">
            <input v-model="filters.name" required="required" placeholder="My favourite beer" type="text">
            <custom-button>Go!</custom-button>
            <p class="small">or apply some filters</p>
          </form>
          <h4>Filters:</h4>
          <form @submit.prevent="applyFilters" class="filters">
            <div class="form-field">
              <select v-model="filters.abv" :class="{active:filters.abv!==''}">
                <option disabled value="">Alcohol by volume</option>
                <option value="abv_lt=4">Very low alcoholic</option>
                <option value="abv_gt=4&abv_lt=10">Low alcoholic</option>
                <option value="abv_gt=10&abv_lt=20">Medium alcoholic</option>
                <option value="abv_gt=20&abv_lt=35">High alcoholic</option>
                <option value="abv_gt=35">Blowing your mind</option>
              </select>
              <select v-model="filters.ibu" :class="{active:filters.ibu!==''}">
                <option disabled value="">Bitterness</option>
                <option value="ibu_lt=10">Slight bitterness</option>
                <option value="ibu_gt=10&ibu_lt=25">Average bitterness</option>
                <option value="ibu_gt=25&ibu_lt=45">Medium bitterness</option>
                <option value="ibu_gt=45&ibu_lt=80">Strong bitterness</option>
                <option value="ibu_gt=80&ibu_lt=120">Try not to cry</option>
              </select>
              <div class="ebc">
                <div>
                  <input type="radio" id="one" value="ebc_lt=20" v-model="filters.ebc">
                  <label for="one">Light beer</label>
                </div>
                <div>
                  <input type="radio" id="two" value="ebc_gt=20" v-model="filters.ebc">
                  <label for="two">Dark beer</label>
                </div>
              </div>
              <select v-model="filters.dateOfBrew" :class="{active:filters.dateOfBrew!==''}">
                <option disabled value="">Date of brew</option>
                <option value="brewed_after=01-2005&brewed_before=12-2007">2005 - 2007</option>
                <option value="brewed_after=01-2007&brewed_before=12-2009">2007 - 2009</option>
                <option value="brewed_after=01-2009&brewed_before=12-2011">2009 - 2011</option>
                <option value="brewed_after=01-2011&brewed_before=12-2013">2011 - 2013</option>
                <option value="brewed_after=01-2013&brewed_before=12-2015">2013 - 2015</option>
              </select>
              <input type="text" v-model="filters.hops" placeholder="The hops you want">
              <input type="text" v-model="filters.malt" placeholder="The malt you want">
              <input type="text" v-model="filters.food" placeholder="The food you want">
            </div>
            <custom-button>Apply</custom-button>
            <div class="tar">
              <custom-link type="button" @click.native="resetAll">Reset All</custom-link>
            </div>
          </form>
        </aside>
        <div class="main">
          <div class="pagination">
            <div class="nav">
              <div @click="changePage(prevPage)" class="prev">
                <div class="arrow left"></div> Previous page
              </div>
              <div class="current-page">{{currentPage}}</div>
              <div @click="changePage(nextPage)" class="next">Next page
                <div class="arrow right"></div>
              </div>
            </div>
          </div>
          <div v-if="noList===1" class="error-msg">
            Sorry! We have no results from your search. <br> Please change your request and try again.
          </div>
          <div v-if="noList===0 " class="list ">
            <div v-for="i in resultItems " :key="i.id " class="card ">
              <h3>{{i.name}}</h3>
              <p>{{i.tagline}}</p>
              <p>{{i.description}}</p>
              <router-link :to="`/beers/${i.id}`">Learn more</router-link>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
// import customButton from '@/components/button'
export default {
  // components: { customButton },
  data() {
    return {
      resultItems: [],
      filters: {
        abv: '',
        ibu: '',
        ebc: '',
        dateOfBrew: '',
        hops: '',
        // hopsNew: '',
        malt: '',
        // maltNew: '',
        food: '',
        // foodNew: '',
        sumFilters: '',
        name: ''
        // nameNew: ''
      },
      noList: 0,
      singleBeer: {},
      currentPage: 1,
      totalPages: 0
    }
  },
  created() {
    this.$http.get('https://api.punkapi.com/v2/beers?per_page=24').then(
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
      // this.getNewString('hops')
      // this.getNewString('malt')
      // this.getNewString('food')
      this.filters.sumFilters = `${this.filters.abv}&${this.filters.ibu}&${this.filters.ebc}&${
        this.filters.dateOfBrew
      }&${this.filters.hops}&${this.filters.malt}&${this.filters.food}`
    },
    getNewString(el) {
      let arr = this.filters[`${el}`].split(' ')
      this.filters[`${el}New`] = arr.join('_')
    },
    applyFilters() {
      this.getSumFilters()
      this.$http.get(`https://api.punkapi.com/v2/beers?${this.filters.sumFilters}`).then(
        resp => {
          this.resultItems = resp.data
          console.log(resp)
        },
        err => {
          console.error(err)
        }
      )
    },
    resetAll() {
      ;(this.filters.sumFilters = ''),
        (this.filters.abv = ''),
        (this.filters.ibu = ''),
        (this.filters.ebc = ''),
        (this.filters.dateOfBrew = ''),
        (this.filters.hops = ''),
        // (this.filters.hopsNew = ''),
        (this.filters.malt = ''),
        // (this.filters.maltNew = ''),
        (this.filters.food = ''),
        // (this.filters.foodNew = ''),
        (this.filters.name = ''),
        // (this.filters.nameNew = ''),
        (this.filters.singleBeer = '')
      this.applyFilters()
      this.noList = 0
    },
    searchBeer() {
      this.filters.sumFilters = ''
      // need to clear all with no refresh
      // let arr = this.name.split(' ')
      // let names = arr.join('_')
      // this.getNewString('name')
      this.$http.get(`https://api.punkapi.com/v2/beers?beer_name=${this.filters.name}`).then(
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
    // Pagination methods
    changePage(page) {
      if (this.currentPage === 1 && page === this.prevPage) return

      this.$http.get(`https://api.punkapi.com/v2/beers?${this.filters.sumFilters}&page=${page}`).then(
        resp => {
          if (resp.data.length === 0) return
          this.resultItems = resp.data
          this.currentPage = page
        },
        err => {
          console.error(err)
        }
      )
    }
  },
  computed: {
    nextPage: function() {
      return this.currentPage + 1
    },
    prevPage: function() {
      return this.currentPage - 1
    }
    // totalPages: function() {
    //   return (this.totalPages = )
    // }
  }
}
</script>

<style lang="scss">
@import '~styles/variables';
section.beers {
  margin: 0 0 20px;
  min-height: calc(100vh - 151px);
  aside {
    width: 270px;
    max-height: 450px;
    overflow: auto;
    padding: 20px 30px;
    background-color: $grey;
    border: 1px solid #ccc;
    position: fixed;
    top: 76px;
    h4 {
      margin-top: 0;
    }
    .search {
      margin-bottom: 20px;
      display: grid;
      grid: auto / 2fr 1fr;
      grid-gap: 20px;

      .small {
        font-size: 13px;
        color: #666;
      }
    }
    input[type='text'] {
      height: 26px;
      padding: 0 10px;
      border: 1px solid #ccc;
      &::placeholder {
        color: #aaa;
        font-size: 14px;
      }
    }
    .filters {
      .form-field {
        margin-bottom: 32px;
        display: grid;
        grid-gap: 16px;
        select {
          width: 100%;
          height: 28px;
          font-size: 14px;
          border: 1px solid #ccc;
          color: #aaa;
          padding-left: 10px;
          &.active {
            color: #333;
            border-color: #bbb;
          }
          option {
            color: #333;
          }
        }
        .ebc {
          display: grid;
          grid: auto / 1fr 1fr;
        }
      }
      .btn-cta {
        width: 100%;
        margin-bottom: 16px;
      }
      .link {
        text-align: right;
      }
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
}
.pagination {
  .nav {
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-left: 360px;
    border-top: 1px solid #ccc;
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
          margin-left: 8px;
        }
        &.left {
          border-right: 6px solid #000;
          margin-right: 8px;
        }
      }
    }
    .current-page {
      font-size: 18px;
    }
  }
}

.tar {
  text-align: right;
}
</style>
