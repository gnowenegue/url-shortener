new Vue({
  el: '#app',
  data: {
    slug: '',
    url: '',
    shortenedUrl: '',
    err: '',
    rules: {
      required: value => !!value || 'Required.',
    },
    loaded: false,
    urls: {},
    totalPages: 1,
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.loaded = true;
  },
  methods: {
    async onSubmit(e) {
      this.err = '';
      this.shortenedUrl = '';

      const validationResult = this.$refs.form.validate();
      if (!validationResult) return;

      try {
        const response = await fetch('/url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug: this.slug, url: this.url }),
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.errorMessage);
        } else {
          this.$refs.form.resetValidation();
          this.shortenedUrl = result.shortenedUrl;
          this.slug = '';
          this.url = '';
          this.fetchData();
        }
      } catch (error) {
        this.err = error.message;
      }
    },
    async fetchData(pageSize = 10, currentPage = 0) {
      try {
        const response = await fetch(
          `/url?pageSize=${pageSize}&currentPage=${currentPage}`,
          {}
        );
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.errorMessage);
        } else {
          this.urls = result;
          this.totalPages = Math.ceil(result.totalCount / result.pageSize);
        }
      } catch (error) {
        this.err = error.message;
      }
    },
    focusUrlField() {
      document.getElementById('url').focus();
    },
    pagination(page) {
      this.fetchData(10, page - 1);
    },
    openUrl(url) {
      window.open(url);
    },
  },
  vuetify: new Vuetify(),
});
