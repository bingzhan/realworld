import { request } from '@/plugins/request'

export const login = data => request({ method: 'POST', url: '/api/users/login', data });
export const register = data => request({ method: 'POST', url: '/api/users', data });
// export const logout = data => request({ method: 'POST', url: '/api/users/login', data });


export const getUserInfo = data => request({ method: 'GET', url: '/api/user' });
export const updateUserInfo = data => request({ method: 'PUT', url: '/api/user', data });

export const getProfile = ({username}) => request({ method: 'GET', url: `/api/profiles/${username}` });

export const followUser = ({username}) => request({ method: 'POST', url: `/api/profiles/${username}/follow` });
export const unfollowUser = ({username}) => request({ method: 'DELETE', url: `/api/profiles/${username}/follow` });

export const listArticles = (params) => request({ method: 'GET', url: `/api/articles`, params });
export const feedArticles = (params) => request({ method: 'GET', url: `/api/articles/feed`, params });
export const getArticle = ({slug}) => request({ method: 'GET', url: `/api/articles/${slug}` });
export const createArticle = (data) => request({ method: 'POST', url: `/api/articles`, data });
export const updateArticle = ({slug, ...data}) => request({ method: 'PUT', url: `/api/articles/${slug}`, data });
export const deleteArticle = (slug) => request({ method: 'DELETE', url: `/api/articles/${slug}` });

export const favoriteArticle = (slug) => request({ method: 'POST', url: `/api/articles/${slug}/favorite` });
export const unfavoriteArticle = (slug) => request({ method: 'DELETE', url: `/api/articles/${slug}/favorite` });

export const getComments = ({slug}) => request({ method: 'GET', url: `/api/articles/${slug}/comments` });
export const addComments = ({slug, ...data}) => request({ method: 'POST', url: `/api/articles/${slug}/comments`, data });
export const deleteComments = ({slug, id}) => request({ method: 'DELETE', url: `/api/articles/${slug}/comments/${id}` });

export const getTags = () => request({ method: 'GET', url: `/api/tags` });
