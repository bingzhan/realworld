<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{article.title}}</h1>

        <div class="article-meta">
          <nuxt-link :to="{name: 'profile', params: { username: article.author.username }}">
            <img :src="article.author.image" />
          </nuxt-link>
          <div class="info">
            <nuxt-link :to="{name: 'profile', params: { username: article.author.username }}" class="author">{{article.author.username}}</nuxt-link>
            <span class="date">{{article.updatedAt}}</span>
          </div>
          <template v-if="article.author.username === $store.state.user.username">
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{
                name: 'editor',
                query: { slug: article.slug }
              }">
              <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm"
              :class="{disabled: disableDelete}"
              @click="rmArticle">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </template>
          <template v-else>
            <button class="btn btn-sm btn-outline-secondary"
              @click="onFollow" :disabled="followDisabled">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{article.following ? 'Unfollow' : 'Follow'}} {{article.author.username}}
            </button>
            &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary"
              :class="{active: article.favorited}"
              :disabled="favoriteDisabled"
              @click="onFavorite">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">({{article.favoritesCount}})</span>
            </button>
          </template>
        </div>

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta">
          <nuxt-link :to="{name: 'profile', params: { username: article.author.username }}">
            <img :src="article.author.image" />
          </nuxt-link>
          <div class="info">
            <nuxt-link :to="{name: 'profile', params: { username: article.author.username }}" class="author">{{article.author.username}}</nuxt-link>
            <span class="date">{{article.updatedAt}}</span>
          </div>
          <template v-if="article.author.username === $store.state.user.username">
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{
                name: 'editor',
                query: { slug: article.slug }
              }">
              <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm"
              :class="{disabled: disableDelete}"
              @click="rmArticle">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </template>
          <template v-else>
            <button class="btn btn-sm btn-outline-secondary"
              @click="onFollow" :disabled="followDisabled">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{article.following ? 'Unfollow' : 'Follow'}} {{article.author.username}}
            </button>
            &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary"
              :class="{active: article.favorited}"
              :disabled="favoriteDisabled"
              @click="onFavorite">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">({{article.favoritesCount}})</span>
            </button>
          </template>
        </div>
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <form class="card comment-form" @submit.prevent="submitComment">
            <div class="card-block">
              <textarea v-model="commentForm" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
              <img :src="$store.state.user.image" class="comment-author-img" />
              <button class="btn btn-sm btn-primary">
               Post Comment
              </button>
            </div>
          </form>

          <div class="card" v-for="item in comments">
            <div class="card-block">
              <p class="card-text">{{item.body}}</p>
            </div>
            <div class="card-footer">
              <nuxt-link :to="{name: 'profile', params: { username: item.author.username }}" class="comment-author">
                <img :src="item.author.image" class="comment-author-img" />
              </nuxt-link>
              &nbsp;
              <nuxt-link :to="{name: 'profile', params: { username: item.author.username }}" class="comment-author">{{item.author.username}}</nuxt-link>
              <span class="date-posted">{{item.updatedAt}}</span>
              <span class="mod-options" v-if="false">
                <i class="ion-edit"></i>
                <i class="ion-trash-a"></i>
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { getArticle, deleteArticle,
  unfollowUser, followUser,
  unfavoriteArticle, favoriteArticle,
  getComments, addComments, deleteComments } from '@/api'
export default {
  name: 'ArticlePage',
  async asyncData ({ route }) {
    const { data:article } = await getArticle({slug: route.params.slug});
    const { data:comments } = await getComments({ slug: article.article.slug });
    console.log(232, comments, article);
    return {
      article: article.article,
      comments: comments.comments,
      followDisabled: false,
      favoriteDisabled: false,
      disableDelete: false,
      commentForm: '',
    }
  },
  computed: {},
  methods: {
    async submitComment () {
      const { data } = await addComments({
        slug: this.article.slug,
        comment: {
          body: this.commentForm
        }
      });
      // console.log(222, data);
    },
    async rmArticle () {
      this.disableDelete = true;
      await deleteArticle(this.article.slug);
      this.disableDelete = false;
      this.$router.push(`/profile/${this.article.author.username}`);
    },
    async onFollow () {
      this.followDisabled = true;
      if (this.article.author.following) {
        await unfollowUser({ username: this.article.author.username});
        this.article.author.following = false;
      } else {
        await followUser({ username: this.article.author.username})
        this.article.author.following = true;
      }
      this.followDisabled = false;
    },
    async onFavorite () {
      this.favoriteDisabled = true;
      if (this.article.favorited) {
        await unfavoriteArticle(this.article.slug);
        this.article.favorited = false;
        this.article.favoritesCount -= 1;
      } else {
        await favoriteArticle(this.article.slug)
        this.article.favorited = true;
        this.article.favoritesCount += 1;
      }
      this.favoriteDisabled = false;
    }
  },
  components: {}
}
</script>
