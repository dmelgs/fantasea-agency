<template>
  <div class="thisMain">
    <div class="container">
      <main role="main">
        <div class="jumbotron p-3 p-md-5 text-white rounded bg-dark">

          <div class="col-md-6 px-0">
            <h1 class="display-4 font-italic">FantaSea Home Page</h1>
            <p class="lead my-3">FantaSea: a pump boat hailing application that enables the customer to book a travel
              destination that contains various ocean recreational activities created by the travel agency.</p>
            <p class="lead mb-0"><a href="#" class="text-white font-weight-bold">Continue reading...</a></p>
          </div>
        </div>

        <div class="row mb-2">

          <div class="col-md-6" v-for="destination in promoList" :key="destination.key">
            <div class="card flex-md-row mb-4 box-shadow h-md-250">
              <div class="card-body d-flex flex-column align-items-start">
                <strong class="d-inline-block mb-2 text-primary">What's Hot</strong>
                <h3 class="mb-0">
                  <a class="text-dark" href="#" @click="viewDestination(destination.destinationName)">
                    {{ destination.destinationName }}</a>
                </h3>
                <div class="mb-1 text-muted">{{ destination.basePrice }} Php</div>
                <p class="card-text mb-auto">{{ destination.description }}</p>
                <a href="#" @click="viewDestination(destination.destinationName)">View More</a>
              </div>
              <img class="card-img-right flex-auto d-none d-md-block" :src="destination.pic" alt="Card image cap">
            </div>
          </div>

        </div>

        <div class="row mb-2" v-for="destination in postList" :key="destination.key">
          <div class="card flex-md-row mb-4 box-shadow h-md-250">
            <div class="card-body d-flex flex-column align-items-start">
              <strong class="d-inline-block mb-2 text-primary">Destination</strong>
              <h3 class="mb-0">
                <a class="text-dark" href="#" @click="viewDestination(destination.destinationName)">{{
                    destination.destinationName
                }}</a>
              </h3>
              <div class="mb-1 text-muted">{{ destination.basePrice }} Php</div>
              <p class="card-text mb-auto">{{ destination.description }}</p>
              <a href="#" @click="viewDestination(destination.destinationName)">View More</a>
            </div>
            <img class="card-img-right flex-auto d-none d-md-block" :src="destination.pic" alt="Card image cap">
          </div>
        </div>

        <div>
          <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
            <button class="modal__close" @click="showModal = false">
              <mdi-close></mdi-close>
            </button>
            <span class="modal__title">{{ destnation_title }}</span>
            <div class="modal__content">
              <div class="container-sm">
                <div class="row">
                  <img class="card-img-top" :src="pic" alt="Card image">
                  <div class="card-body">
                    <h4 class="card-title">Located in: {{ province }}</h4>
                    <p class="card-text">{{ description }}</p>
                    <h4 class="card-title" style="text-align:left">Agency Name:<a class="text-dark" @click="goToAgency(agency_name)">
                        <strong>{{ agency_name }}</strong></a> </h4>
                    <h4 class="card-title" style="text-align:left">Activites: <strong>{{ activities }}</strong> </h4>
                    <h4 class="card-title" style="text-align:left">Price: <strong>{{ price }} Php</strong> </h4>
                    <h4 class="card-title" style="text-align:left">Gallery</h4>
                  </div>
                  <div class="col-sm" v-for="images in viewGalleryList" :key="images.key">
                    <div>
                      <img class="img-thumbnail" style="width:250px" :src="images.gallery_pics">
                    </div>
                  </div>
                  <h4 class="card-title" style="text-align:left">Reviews: </h4>
                  <div class="row" v-for="feedback in reviewList" :key="feedback">
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
          </vue-final-modal>
        </div>



      </main>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
import { getDatabase, ref, get, child, update, onValue, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { $vfm, VueFinalModal, ModalsContainer } from 'vue-final-modal';

export default {
  name: 'Home',
  components: {
    VueFinalModal,
    ModalsContainer
  },
  data() {
    return {
      postList: [],
      promoList: [],
      showModal: false,
      viewGalleryList: [],
    }
  },
  mounted() {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.fetchData();
        this.fetchPromo();
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    async fetchData() {

      const db = getDatabase();
      const storage = getStorage();
      const dbRef = ref(db, '/destinations/');
      onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const storageRef = sRef(storage, '/travel_agency/' + childSnapshot.val().agency_name + '/destinations/' + childSnapshot.val().destination_name + '/' + childSnapshot.val().pic_name)
          getDownloadURL(storageRef).then((downloadURL) => {
            this.postList.push({
              'destinationName': childSnapshot.key,
              'pic': downloadURL,
              'activities': childSnapshot.val().activities,
              'agency': childSnapshot.val().agency_name,
              'province': childSnapshot.val().destination_province,
              'basePrice': childSnapshot.val().base_price,
              'description': childSnapshot.val().description
            })
          }) //end getDownloadUrl                                                     
        })// end forEach
      })//end onValue
    }, // end fetchData

    async fetchPromo() {
      const db = getDatabase();
      const storage = getStorage();
      const dbRef = ref(db, '/promo/');
      onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          this.promo = childSnapshot.key;
          const dbRef = ref(db, '/destinations/');
          onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              if (this.promo == childSnapshot.key) {
                const storageRef = sRef(storage, '/travel_agency/' + childSnapshot.val().agency_name + '/destinations/' + childSnapshot.val().destination_name + '/' + childSnapshot.val().pic_name)
                getDownloadURL(storageRef).then((downloadURL) => {
                  this.promoList.push({
                    'destinationName': childSnapshot.key,
                    'pic': downloadURL,
                    'activities': childSnapshot.val().activities,
                    'agency': childSnapshot.val().agency_name,
                    'province': childSnapshot.val().destination_province,
                    'basePrice': childSnapshot.val().base_price,
                    'description': childSnapshot.val().description,
                  })
                }) //end getDownloadUrl        
              }
            })// end forEach
          })//end onValue

        })
      })
    },
    viewDestination(id) {
      const db = getDatabase();
      this.showModal = true
      this.viewGalleryList = [];

      let viewDetail = this;
      const messageRef = ref(db, '/destinations/');
      onValue(messageRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().destination_name == id) {

            this.destnation_title = childSnapshot.key
            this.agency_name = childSnapshot.val().agency_name;
            this.activities = childSnapshot.val().activities;
            this.description = childSnapshot.val().description;
            this.price = childSnapshot.val().base_price;
            this.province = childSnapshot.val().destination_province;
            this.pic = childSnapshot.val().destination_pic;

            const galleryRef = ref(db, '/gallery/' + childSnapshot.val().agency_name + '/' + id);
            onValue(galleryRef, (snapshot) => {
              snapshot.forEach((childSnapshot) => {

                this.viewGalleryList.push({
                  'id': childSnapshot.key,
                  'gallery_pics': childSnapshot.val().gallery_pic_url,
                })  //end push         
              }) // end 2nd ForEach
            })  // end 2nd Onvalue 
          }
        }); //end forEach 
      });  //end onValue

      //put review here
      let viewReviews = this;
      const reviewsRef = ref(db, '/feedback/' + this.agency_name);
      onValue(reviewsRef, (snapshot) => {
        let data = snapshot.val();
        let reviewList = [];
        Object.keys(data).forEach((key) => {
          if (this.destnation_title == data[key].subjectTxt) {
            reviewList.push({
              id: key,
              customer_name: data[key].username,
              content: data[key].messageTxt,
              rating: data[key].rating,
              time: data[key].time_sent + ' On ' + data[key].date_sent,
              destination_name: data[key].subjectTxt,
            });
          }
          viewReviews.reviewList = reviewList;
        })
      })

    },//end view method
    async goToAgency(id) {
      this.$router.push({ name: 'profile', params: { id: id } })
    }
  }
}
</script>

<style scoped>
.sidenavLeft {
  height: 80%;
  max-width: 150px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-top: 10%;
  cursor: pointer;
}

.sidenavRight {
  height: 80%;
  max-width: 150px;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-top: 10%;
  cursor: pointer;
}

.container {
  padding-top: 2%;
  margin-bottom: 5%;
  margin-top: 10%;
}

.thisMain {
  margin-left: 150px;
  /* Same as the width of the sidenav */
  padding: 0px 10px;
  margin-right: 150px;
  /* Same as the width of the sidenav */
}

.carousel__item {
  height: 500px;
  width: 100%;
  color: var(--vc-clr-white);
  background-image: linear-gradient(rgb(69, 206, 234), rgb(231, 153, 63));
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}

.carousel_destination {
  margin-top: 10%
}

.card-img-right {
  height: 100%;
  width: 150px;
  border-radius: 0 3px 3px 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
}

.card-text {
  text-align: left;
}

.carousel_text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 50px;
}

.blog-header {
  line-height: 1;
  border-bottom: 1px solid #e5e5e5;
}

.blog-header-logo {
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-size: 2.25rem;
}

.card {
  height: 250px;
  margin-top: 5%;
}

.border-top {
  border-top: 1px solid #e5e5e5;
}

.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}

.box-shadow {
  box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
}

/*
 * Blog name and description
 */
.blog-title {
  margin-bottom: 0;
  font-size: 2rem;
  font-weight: 400;
}

.blog-description {
  font-size: 1.1rem;
  color: #999;
}

.jumbotron {
  background-image: linear-gradient(rgb(69, 206, 234), rgb(231, 153, 63));
}

::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  margin-top: 5%;
  margin-bottom: 5%;
}

::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}

.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal__content {
  flex-grow: 1;
  overflow-y: scroll;
  width: auto;
  height: 700px;
}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.card-img-top {
  height: 300px;
  width: 300px;
  margin: auto;
}
</style>