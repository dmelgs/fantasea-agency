import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { initializeApp } from "firebase/app"


const firebaseConfig = {
  apiKey: "AIzaSyByhzEl9XakL_RF75Cx_FUbJJ6thUvxHj0",
  authDomain: "fantasea-4140a.firebaseapp.com",
  databaseURL: "https://fantasea-4140a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fantasea-4140a",
  storageBucket: "fantasea-4140a.appspot.com",
  messagingSenderId: "580000967593",
  appId: "1:580000967593:web:3348c89b652d3fac65f2b8"
};


// Initialize Firebase
let app = createApp(App)

initializeApp(firebaseConfig);
app.config.globalProperties.firebaseConfig = firebaseConfig;

app.use(router).mount('#app')