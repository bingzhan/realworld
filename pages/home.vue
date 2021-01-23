<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="$store.state.user">
                <nuxt-link class="nav-link" exact
                  :class="{ active: tab === 'your_feed'}"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" exact
                  :class="{ active: tab === 'global_feed'}"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link class="nav-link" exact
                  :class="{
                    active: tab === 'tag'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"># {{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="item in articles">
            <div class="article-meta">
              <nuxt-link :to="`/profile/${item.author.username}`">
                <img :src="item.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="`/profile/${item.author.username}`" class="author">{{ item.author.username }}</nuxt-link>
                <span class="date">{{ item.updatedAt }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right"
                :disabled="item.favoriteDisabled"
                :class="{active: item.favorited}" @click="onFavorite(item)">
                <i class="ion-heart"></i> {{ item.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="`/article/${item.slug}`" class="preview-link">
              <h1>{{ item.title }}</h1>
              <p>{{ item.body }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li v-for="item in totalPage" class="page-item" :class="{active: page === item}">
                <nuxt-link class="page-link" :to="{name: 'home',query: { page: item, tab: tab }}">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link class="tag-pill tag-default"
                v-for="item in tagList"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item
                  }
                }">{{ item }}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { listArticles, feedArticles, getTags, favoriteArticle, unfavoriteArticle } from '@/api';
export default {
  name: 'HomePage',
  async asyncData ({ query }) {
    const limit = 20;
    const page = parseInt(query.page || 1);
    const tab = query.tab || 'global_feed';
    const tag = query.tag;
    const loadArticles = tab === 'your_feed' ? feedArticles : listArticles;
    const [ articleList, tagList ] = await Promise.all([
      loadArticles({limit, tag, offset: (page-1)*limit}),
      getTags()
    ]);
    articleList.data.articles.forEach(item => {
      item.favoriteDisabled = false;
    });
    return {
      limit,
      page,
      totalPage: Math.ceil(articleList.data.articlesCount/limit),
      articles: articleList.data.articles,
      articlesCount: articleList.data.articlesCount,
      tagList: tagList.data.tags,
      tag, tab
    }
  },
  watchQuery: ['page', 'tab', 'tag'],
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        await unfavoriteArticle(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        await favoriteArticle(article.slug)
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    }
  }
}
</script>
