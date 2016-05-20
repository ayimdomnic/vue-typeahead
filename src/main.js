import Vue from 'vue'

export default {
  data () {
    return {
      items: [],
      query: '',
      current: -1,
      loading: false,
      queryParamName: 'q'
    }
  },

  ready () {
    if (! this.onHit) {
      this.warn('`onHit` method')
    }
  },

  computed: {
    hasItems () {
      return this.items.length > 0
    },

    isEmpty () {
      return !this.query
    },

    isDirty () {
      return !!this.query
    }
  },

  methods: {
    warn (msg) {
      Vue.util.warn('Typeahead requires the ' + msg)
    },

    update () {
      if (! this.query) {
        this.reset()
        return
      }

      if (this.minChars && this.query.length < this.minChars) {
        return
      }

      this.loading = true

      this.fetch().then((response) => {
        if (this.query) {
          let data = response.data
          data = this.prepareResponseData ? this.prepareResponseData(data) : data
          this.items = this.limit ? data.slice(0, this.limit) : data
          this.current = -1
          this.loading = false
        }
      })
    },

    fetch () {
      if (!this.$http) {
        this.warn('`vue-resource` plugin')
        return
      }

      if (!this.src) {
        this.warn('`src` property')
        return
      }

      let queryParam = {
        [this.queryParamName]: this.query
      }

      return this.$http.get(this.src, Object.assign(queryParam, this.data))
    },

    reset () {
      this.items = []
      this.query = ''
      this.loading = false
    },

    setActive (index) {
      this.current = index
    },

    activeClass (index) {
      return {
        active: this.current == index
      }
    },

    hit () {
      if (this.current === -1) return

      this.onHit(this.items[this.current])
    },

    up () {
      if (this.current > 0)
        this.current--
      else if (this.current == -1)
        this.current = this.items.length - 1
      else
        this.current = -1
    },

    down () {
      if (this.current < this.items.length-1)
        this.current++
      else
        this.current = -1
    }
  }
}