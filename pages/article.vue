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
          <button class="btn btn-sm btn-outline-secondary">
            <i class="ion-plus-round"></i>
            &nbsp;
            {{article.following ? 'Unfollow' : 'Follow'}} {{article.author.username}}
          </button>
          &nbsp;&nbsp;
          <button class="btn btn-sm btn-outline-primary"
            :class="{active: article.favorited}">
            <i class="ion-heart"></i>
            &nbsp;
            Favorite Post <span class="counter">({{article.favoritesCount}})</span>
          </button>
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
          <button class="btn btn-sm btn-outline-secondary">
            <i class="ion-plus-round"></i>
            &nbsp;
            {{article.following ? 'Unfollow' : 'Follow'}} {{article.author.username}}
          </button>
          &nbsp;&nbsp;
          <button class="btn btn-sm btn-outline-primary"
            :class="{active: article.favorited}">
            <i class="ion-heart"></i>
            &nbsp;
            Favorite Post <span class="counter">({{article.favoritesCount}})</span>
          </button>
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
              <span class="mod-options">
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
import { getArticle, getComments, addComments, deleteComments } from '@/api'
export default {
  name: 'ArticlePage',
  async asyncData ({ route }) {
    const { data:article } = await getArticle({slug: route.params.slug});
    const { data:comments } = await getComments({ slug: article.article.slug });
    console.log(232, comments, article);
    return {
      article: article.article,
      comments: comments.comments,
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
      console.log(222, data);
    }
  },
  components: {}
}
</script>
