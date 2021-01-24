<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="tagList" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api'
export default {
  name: 'EditArticlePage',
  middleware: 'authenticated',
  async asyncData ({route}) {
    let data = {};
    if (route.query.slug) {
      const { data:article } = await getArticle({slug: route.query.slug});
      data = article.article
    }

    const { title, description, body, tagList=[] } = data;
    return {
      title: title || '',
      description: description || '',
      body: body || '',
      tagList: tagList.join(',')
    }
  },
  methods: {
    async onSubmit() {
      const article = {
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList.split(',')
      }
      const formData = { article }
      let xhrRequers = createArticle;
      if (this.$route.query.slug) {
        formData.slug = this.$route.query.slug;
        xhrRequers = updateArticle;
      }
      const { data } = await xhrRequers(formData);
      this.$router.push(`/article/${data.article.slug}`);
    }
  },
  components: {}
}
</script>
