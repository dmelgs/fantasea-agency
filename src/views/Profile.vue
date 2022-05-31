<template>
  <div class="container db-social">
    <div class="jumbotron jumbotron-fluid bg-dark"></div>
    <div class="container-fluid bg-light">
      <div class="row justify-content-center">
        <div class="col-xl-11">
          <div class="widget head-profile has-shadow">
            <div class="widget-body pb-0">
              <div class="row d-flex align-items-center">
                <div
                  class="col-xl-4 col-md-4 d-flex justify-content-lg-start justify-content-md-start justify-content-center">
                  <ul>
                    <li v-show="postList.length > -1">
                      <div class="counter">{{postList.length}}</div>
                      <div class="heading">Post</div>
                    </li>               
                  </ul>
                </div>
                <div class="col-xl-4 col-md-4 d-flex justify-content-center">
                  <div class="image-default">
                    <img class="rounded-circle" :src="previewImage" @click="selectImage">
                  </div>
                  <div class="infos">
                    <h2 v-html="username"></h2>
                    <div class="location">{{ address }}</div>

                  </div>
                </div>
                <div
                  class="col-xl-4 col-md-4 d-flex justify-content-lg-end justify-content-md-end justify-content-center">
                  <div class="follow">
                    <button class="btn btn-primary" v-if="isUser"
                      @click.prevent="updateProfile(agency_name)">Edit</button>
                  </div>
                </div>
              </div>
              <div class="row d-flex align-items-center">
                <div class="col-xl-4 col-md-4 d-flex justify-content-start">
                  <div class="contact-info">
                    <label>Contact Info: </label>
                    <div class="email">Email: {{ email }}</div>
                    <div class="contact-num"> Contact Number: +63{{ number }}</div>
                    <div class="social-media">Social Medias:
                      <a href="">{{ fb_link }}</a><br>
                      <a href="">{{ insta_link }}</a> <br>
                      <a href="">{{ twitter_link }}</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row ">
                <div class="col">
                  <div class="navigation-profile">
                    <ul class="nav justify-content-left">
                      <li class="nav-item">
                        <a class="nav-link " @click="ViewPosts">Posts</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" @click="ViewMedias">Medias</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" @click="ViewReviews">Reviews</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="row" v-for="data in postList" :key="data.destinationName" v-show="isViewDestination">
                <hr class="featurette-divider">
                <div class="row featurette">
                  <div class="col-md-7">
                    <h2 class="featurette-heading">{{ data.destinationName }}
                      <span class="text-muted"> In {{ data.province }}</span>
                    </h2>
                    <p class="lead">
                      Activties : {{ data.activities }} <br>
                      Base Price: {{ data.basePrice }} <br>
                      Offered by: {{ data.agency }}
                    </p>
                  </div>
                  <div class="col-md-5">
                    <img class="img-thumbnail" :src="data.pic">
                  </div>
                </div>
                <hr class="featurette-divider">
              </div>
              <div class="row" v-show="isViewMedia">
                <div class="col" v-for="gallery in galleryList" :key="gallery.key" style="width:400px">
                  <div class="card" style="width:300px">
                    <img class="card-img-top" :src="gallery.pic_url" alt="Card image" style="width:100%">
                    <div class="card-body">
                      <h4 class="card-title">{{ gallery.dest_name }}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="isViewReview">
                <div class="rows" v-for="feedback in reviewList" :key="feedback.id">
                  <div class="card card-white post" style="text-align:left">
                    <div class="post-heading">
                      <div class="float-left meta">
                        <div class="title h5">
                          <a href="#"><b>{{ feedback.customer_name }}</b></a>
                          provided a feedback on {{ feedback.destination_name }}
                        </div>
                        <h6 class="text-muted time">{{ feedback.time }}</h6>
                        Rating: {{ feedback.rating }}/5
                      </div>
                    </div>
                    <div class="post-description">
                      <p>{{ feedback.content }}</p>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";



export default {
  name: 'profile_page',
  data() {
    return {
      username: '',
      previewImage: null,
      postList: [],
      agency_name: '',
      currentUser_email: '',
      isUser: false,
      isViewMedia: false,
      isViewDestination: true,
      isViewReview: false,
      galleryList: [],
      galleryName: [],
    };
  },
  async beforeCreate() {

    const db = getDatabase();
    onAuthStateChanged(getAuth(), (user) => {  //get the currently signed-in user
      if (user) {
        this.currentUser_email = user.email;
        const adbRef = ref(db, '/users/travel_agency/');
        onValue(adbRef, (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (this.$route.params.id == childSnapshot.val().name) {
              console.log("you are viewing :" + childSnapshot.val().name + " profile")
              this.username = childSnapshot.val().name;
              this.agency_name = childSnapshot.val().name;
              this.previewImage = childSnapshot.val().profile_pic;
              this.address = childSnapshot.val().address;
              this.email = childSnapshot.val().email;
              this.number = childSnapshot.val().contact_number;
              this.fb_link = childSnapshot.val().fb_link;
              this.insta_link = childSnapshot.val().insta_link;
              this.twitter_link = childSnapshot.val().twitter_link;
              this.fetchData();
              this.fetchReviews();
              if (this.email == this.currentUser_email) {
                this.isUser = true;

              }
            }
          })
        })
      }
      else {
        this.$router.push('/login')
      }
    });
  },
  methods: {
    async fetchData() {
      //database references
      const db = getDatabase();
      const storage = getStorage();
      const dbRef = ref(db, '/destinations/');
      //
      onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().agency_name == this.$route.params.id) {
            const storageRef = sRef(storage, '/travel_agency/' + childSnapshot.val().agency_name + '/destinations/' + childSnapshot.val().destination_name + '/' + childSnapshot.val().pic_name)
            getDownloadURL(storageRef).then((downloadURL) => {
              this.postList.push({
                'destinationName': childSnapshot.key,
                'pic': downloadURL,
                'activities': childSnapshot.val().activities,
                'agency': childSnapshot.val().agency_name,
                'province': childSnapshot.val().destination_province,
                'basePrice': childSnapshot.val().base_price,
              })

            })
          }//end if
        })// end forEach
      })//end onValue

      const galleryRef = ref(db, '/gallery/' + this.$route.params.id);
      onValue(galleryRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          this.gallery_dest_name = childSnapshot.key
          console.log(childSnapshot.key)
          const galleryRef = ref(db, '/gallery/' + this.$route.params.id + '/' + this.gallery_dest_name);
          onValue(galleryRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              this.galleryList.push({
                'key': childSnapshot.key,
                'pic_url': childSnapshot.val().gallery_pic_url,
                'dest_name': this.gallery_dest_name,
              })
            })
          })
        })// end forEach
      })//end onValue

    }, // end fetchDataMethod
    updateProfile(id) {
      this.$router.push({ name: 'settings', params: { id: id } })
    },
    ViewPosts() {
      this.isViewDestination = true;
      this.isViewMedia = false;
      this.isViewReview = false;
    },
    ViewMedias() {
      this.isViewDestination = false;
      this.isViewMedia = true;
      this.isViewReview = false;
    },
    ViewReviews() {
      this.isViewDestination = false;
      this.isViewMedia = false;
      this.isViewReview = true;
    },
    async fetchReviews() { //get reviews
      const db = getDatabase();
      let viewReviews = this;
      const reviewsRef = ref(db, '/feedback/' + this.$route.params.id);
      onValue(reviewsRef, (snapshot) => {
        let data = snapshot.val();
        let reviewList = [];
        if (snapshot.exists()) {
          Object.keys(data).forEach((key) => {
            reviewList.push({
              id: key,
              customer_name: data[key].username,
              content: data[key].messageTxt,
              rating: data[key].rating,
              time: data[key].time_sent + ' On ' + data[key].date_sent,
              destination_name: data[key].subjectTxt,
            });
            viewReviews.reviewList = reviewList;
          })
        }
      })
    }
  }
}
</script>

<style scoped>
body {
  margin-top: 20px;
  background: #eee;
}

.db-social .jumbotron {
  margin: 0;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: bottom center;
  color: #fff !important;
  height: 300px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, .3);
  padding: 0;
}

.container-fluid {
  padding: 30px 30px;
}

.db-social .head-profile {
  margin-top: -120px;
  border-radius: 4px;
  position: relative;
}

.widget {
  background: rgb(255, 255, 255);
  border-radius: 0;
  border: none;
  margin-bottom: 30px;
}

.has-shadow {
  box-shadow: 0 1px 15px 1px rgba(52, 40, 104, .08);
}

.db-social .head-profile:before {
  content: "";
  height: 20px;
  width: 90%;
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 4px 4px 0 0;
}

.db-social .head-profile:after {
  content: "";
  height: 20px;
  width: 80%;
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 4px 4px 0 0;
}

.db-social .widget-body {
  padding: 1rem 1.4rem;
}

.widget-body {
  padding: 1.4rem;
}

.pb-0,
.py-0 {
  padding-bottom: 0 !important;
}

@media screen and (max-height: 450px),
(max-width: 450px) {
  .db-social .image-default img {
    width: 120px;
    position: absolute;
    top: -80px;
    left: 0;
    right: 0;
    margin: 0 auto;
    box-shadow: 0 0 10px 10px rgb(124, 125, 124);
    z-index: 10;
  }
}

.db-social .image-default img {
  max-width: 150px;
  min-width: 150px;
  max-height: 150px;
  min-height: 150px;
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  margin: 0 auto;
  box-shadow: 0 0 2px 6px rgb(221, 220, 220);
  z-index: 10;
}

.db-social .infos {
  text-align: center;
  margin-top: 4rem;
  margin-bottom: 1rem;
  line-height: 2.0rem;
  width: 300px;
}

.db-social .contact-info {
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.5rem;
  margin-left: 1rem;
  text-align: left;
}

.db-social .contact-num {
  font-size: 1rem;
}

.db-social h2 {
  color: #2c304d;
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: .2rem;
}

.db-social .location {
  color: #aea9c3;
  font-size: 1rem;
}

.db-social .email {
  font-size: 1rem;
}

.db-social .follow .btn {
  padding: 10px 30px;
}

.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
}

.btn-shadow,
.btn-shadow a {
  color: #5d5386;
  background-color: #fff;
  border-color: #fff;
  box-shadow: 0 1px 15px 1px rgba(52, 40, 104, .15);
}

.db-social .head-profile .actions {
  display: inline-block;
  vertical-align: middle;
  margin-left: .5rem;
}

.actions {
  z-index: 999;
  display: block;
}

.actions.dark .dropdown-toggle {
  color: #2c304d;
}

.actions .dropdown-toggle {
  color: #98a8b4;
  background: none;
  border: none;
  padding: 0;
  font-size: 1.7rem;
}

.actions .dropdown-menu {
  border: none;
  min-width: auto;
  font-size: 1rem;
  border-radius: 4px;
  padding: 1.4rem 1.8rem;
  text-align: left;
  box-shadow: 1px 1px 30px rgba(0, 0, 0, .15);
}

.actions .dropdown-menu .dropdown-item {
  padding: .5rem 0;
}

.actions .dropdown-menu a {
  color: #2c304d;
  font-weight: 500;
}

.db-social .head-profile li:first-child {
  padding-left: 0;
}

.db-social .head-profile li {
  display: inline-block;
  text-align: center;
  padding: 0 1rem;
}

.db-social .head-profile li .counter {
  color: #2c304d;
  font-size: 1.4rem;
  font-weight: 600;
}

.db-social .head-profile li .heading {
  color: #aea9c3;
  font-size: 1rem;
}

.imagePreviewWrapper {
  max-width: 150px;
  max-height: 150px;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
  background-size: cover;
  background-position: center center;
  border-radius: 50%;
  box-shadow: 0.5px 0.5px 10px rgb(210, 210, 210);
}

.navigation-profile {
  border-radius: 10px;
  margin-top: 1%;
  margin-bottom: 2%;
  background-color: #cbd0d6;

}

.nav-link {
  color: rgb(66, 64, 64);
  background-color: #cbd0d6;
  margin: 2%;
  border-radius: 20px;
}

.nav-link:hover {
  background-color: rgb(104, 100, 100);
  color: rgb(235, 227, 227);
  box-shadow: 1px 1px 10px rgb(70, 70, 70);
}

.img-thumbnail {
  width: 300px;
  height: 300px;
  display: inline-flex;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
  border-radius: 8px;
  margin-bottom: 3%;
  box-shadow: 0.5px 0.5px 10px rgb(169, 167, 167);
}

@media (min-width: 40em) {
  .featurette-heading {
    font-size: 50px;
  }
}

.btn {
  box-shadow: 1px 1px 0px grey;
  border-radius: 10px;
  min-width: 120px;
  min-height: 50px;
  text-align: center;
  margin-right: 5%;
  color: #fbfbfb;
}

.btn:hover {
  box-shadow: 1px 1px 10px grey;
}

.chatbox {
  position: fixed;
  bottom: 0;
  left: 40%;
  top: 45%;

}

.card-img-top {
  height: 300px;

}

.card {
  margin-bottom: 5%;
  box-shadow: 0 0 10px grey;
}

.card-white .card-heading {
  color: #333;
  background-color: #fff;
  border-color: #ddd;
  border: 1px solid #dddddd;
}

.card-white .card-footer {
  background-color: #fff;
  border-color: #ddd;
}

.card-white .h5 {
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.card-white .time {
  font-size: 12px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.post .post-heading {
  height: 95px;
  padding: 20px 15px;
}

.post .post-heading .avatar {
  width: 60px;
  height: 60px;
  display: block;
  margin-right: 15px;
}

.post .post-heading .meta .title {
  margin-bottom: 0;
}

.post .post-heading .meta .title a {
  color: black;
}

.post .post-heading .meta .title a:hover {
  color: #aaaaaa;
}

.post .post-heading .meta .time {
  margin-top: 8px;
  color: #999;
}

.post .post-image .image {
  width: 100%;
  height: auto;
}

.post .post-description {
  padding: 15px;
}

.post .post-description p {
  font-size: 14px;
}

.post .post-description .stats {
  margin-top: 20px;
}

.post .post-description .stats .stat-item {
  display: inline-block;
  margin-right: 15px;
}

.post .post-description .stats .stat-item .icon {
  margin-right: 8px;
}

.post .post-footer {
  border-top: 1px solid #ddd;
  padding: 15px;
}

.post .post-footer .input-group-addon a {
  color: #454545;
}

.post .post-footer .comments-list {
  padding: 0;
  margin-top: 20px;
  list-style-type: none;
}

.post .post-footer .comments-list .comment {
  display: block;
  width: 100%;
  margin: 20px 0;
}

.post .post-footer .comments-list .comment .avatar {
  width: 35px;
  height: 35px;
}

.post .post-footer .comments-list .comment .comment-heading {
  display: block;
  width: 100%;
}

.post .post-footer .comments-list .comment .comment-heading .user {
  font-size: 14px;
  font-weight: bold;
  display: inline;
  margin-top: 0;
  margin-right: 10px;
}

.post .post-footer .comments-list .comment .comment-heading .time {
  font-size: 12px;
  color: #aaa;
  margin-top: 0;
  display: inline;
}

.post .post-footer .comments-list .comment .comment-body {
  margin-left: 50px;
}

.post .post-footer .comments-list .comment>.comments-list {
  margin-left: 50px;
}
</style>