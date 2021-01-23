<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{profile.username}}</h4>
            <p>{{profile.bio}}</p>
            <nuxt-link v-if="profile.username === $store.state.user.username" :to="{name: 'settings'}" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button v-else
              @click="onFollow" :disabled="followDisabled"
              class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i> {{profile.following ? 'Unfollow' : 'Follow'}} {{profile.username}}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" exact :class="{active: false}" :to="{name: 'profile', params: {username: profile.username} }">My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" exact :class="{active: $route.params.favorited}" :to="{name: 'profile', params: {username: profile.username}, query: { favorited: profile.username }}">Favorited Articles</nuxt-link>
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
                <span class="date">{{item.updatedAt}}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right"
                :disabled="item.favoriteDisabled"
                :class="{active: item.favorited}" @click="onFavorite(item)">
                <i class="ion-heart"></i> {{item.favoritesCount}}
              </button>
            </div>
            <nuxt-link :to="`/article/${item.slug}`" class="preview-link">
              <h1>{{item.title}}</h1>
              <p>{{item.body}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li v-for="item in totalPage" class="page-item" :class="{active: page === item}">
                <nuxt-link class="page-link" :to="{name: 'profile', params: {username: $route.query.author || $store.state.user.username}, query: { page: item, favorited: $route.query.favorited }}">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfile, listArticles, followUser, unfollowUser, favoriteArticle, unfavoriteArticle } from '@/api'
export default {
  name: 'ProfilePage',
  middleware: 'authenticated',
  async asyncData({ store, query, route }) {
    const { data:profile } = await getProfile({
      username: route.params.username
    });

    const limit = 20;
    const page = parseInt(query.page || 1);
    const { data } = await listArticles({
      author: route.params.username,
      favorited: query.favorited,
      limit,
      offset: (page-1)*limit
    });

    data.articles.forEach(item => item.favoriteDisabled = false);

    return {
      limit, page,
      followDisabled: false,
      articles: data.articles,
      articlesCount: data.articlesCount,
      totalPage: Math.ceil(data.articlesCount/limit),
      profile: profile.profile,
    }
  },
  watchQuery: ['page', 'favorited'],
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
    },
    async onFollow () {
      this.followDisabled = true;
      if (this.profile.following) {
        await unfollowUser({ username: this.profile.username});
        this.profile.following = false;
      } else {
        await followUser({ username: this.profile.username})
        this.profile.following = true;
      }
      this.followDisabled = false;
    }
  }
}
</script>
