import Home from '@/views/home/Home.vue'
import Center from '@/views/center/Center.vue'
import UserAdd from '@/views/user-manage/UserAdd.vue'
import UserList from '@/views/user-manage/UserList.vue'
import NewsAdd from '@/views/news-manage/NewsAdd.vue'
import NewsList from '@/views/news-manage/NewsList.vue'
import ProductAdd from '@/views/product-manage/ProductAdd.vue'
import ProductList from '@/views/product-manage/ProductList.vue'
const routes = [
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/center',
        component: Center,
    },
    {
        path: '/user-manage/adduser',
        component: UserAdd,
        needAuth: true,
    },
    {
        path: '/user-manage/userlist',
        component: UserList,
        needAuth: true,
    },

    {
        path: '/news-manage/addnews',
        component: NewsAdd,
    },
    {
        path: '/news-manage/newslist',
        component: NewsList,
    },

    {
        path: '/product-manage/addproduct',
        component: ProductAdd,
    },
    {
        path: '/product-manage/productlist',
        component: ProductList,
    },
    {
        path: '/',
        redirect: '/home',
    },
]

export default routes
