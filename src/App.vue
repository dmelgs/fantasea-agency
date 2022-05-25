<template>
  <div v-if="isLoggedIn">
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container">
        <button class="navbar-toggler leftNavbarToggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item " id="homeNav">
              <a class="nav-link">
                <router-link to="/"> <img class="navLogo" alt="Logo"
                    src="https://firebasestorage.googleapis.com/v0/b/fantasea-4140a.appspot.com/o/app_media%2Ffantasea.png?alt=media&token=334feb29-1f3b-49a2-96f5-2a57a3b42b3b">
                </router-link>
              </a>
            </li>
            <li class="nav-item">
              <a class="navbar-brand">
                <router-link to="/pumpboat">
                  <img class="navImage" alt="pumpboat"
                    src="https://firebasestorage.googleapis.com/v0/b/fantasea-4140a.appspot.com/o/app_media%2Fboat.png?alt=media&token=2a56831e-94de-4cb7-9878-f0b1f6677e41">
                </router-link>
                <div class="hoverIcon">
                  Pump Boats
                </div>
              </a>
            </li>
            <li class="nav-item">
              <a class="navbar-brand">
                <router-link to="/traveldestination">
                  <img class="navImage" alt="destination"
                    src="https://firebasestorage.googleapis.com/v0/b/fantasea-4140a.appspot.com/o/app_media%2Fcoconut.png?alt=media&token=6f78d582-ea4b-468a-8524-ad5e97f2ea07">
                </router-link>
                <div class="hoverIcon">
                  Travel Destination
                </div>
              </a>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="navbar-brand" @click="isNotif = !isNotif">
                <div class="pending_sign" v-show="pending">!</div>
                <img class="navImage" alt="notifications"
                  src="https://firebasestorage.googleapis.com/v0/b/fantasea-4140a.appspot.com/o/app_media%2Fbell.png?alt=media&token=b12a9635-7ecd-4ed0-930b-0ddc1da21137">
                <div class="showNotif" v-show="isNotif">
                  <div class="container">
                    <h4>Notifications</h4>
                    <h6 style="text-align:left">Pendings</h6>
                    <div class="row" style="background-color:wheat" v-for="pending in pendingList" :key="pending.key">
                      <p style="text-align:left">{{ pending.destination_name }} booked by: <br>
                        {{ pending.customer_name }} is currently on pending on {{ pending.transaction_date }}</p>
                    </div>
                    <h6 style="text-align:left">Bookings</h6>
                    <div class="row" style="background-color:wheat" v-for="booking in bookingList" :key="booking.key">
                      <p style="text-align:left">
                        {{ booking.destination_name }} accepted by: {{ booking.boat_name }} <br>
                        booked by: {{ booking.customer_name }} status: {{ booking.ticketStatus }}
                      </p>
                    </div>
                    <hr>
                      <h6 style="text-align:left">Feedbacks</h6>
                    <div class="row" style="background-color:wheat" v-for="feedback in reviewList" :key="feedback.key">
                      <p style="text-align:left">
                        {{feedback.customer_name}} provided a feedback for {{feedback.destination_name}} on {{feedback.time}}
                      </p>
                    </div>
                  </div>
                </div>
              </a>

            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" @click="showMore = !showMore" style="color:white;">
                {{ agency_name }}
              </a>
              <div class="showmore-content" v-show="showMore">
                <a class="s-content" @click.prevent="goProfile(agency_name)">
                  Profile
                </a>
                <a class="s-content" @click.prevent="goInbox(agency_name)">
                  Inbox
                </a>
                <a class="s-content" @click.prevent="goSettings(agency_name)">
                  Settings
                </a>
                <hr>
                <a class="s-content" @click.prevent="logOut">
                  Sign out
                </a>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </nav>
    <nav class="navbar fixed-bottom navbar-expand-sm" style="height:50px">
      <div class="container">

      </div>
    </nav>
  </div>
  <router-view />
</template>

<script>
/* eslint-disable */
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getDatabase, ref, get, child, onValue } from "firebase/database";
import { $vfm, VueFinalModal, ModalsContainer } from 'vue-final-modal'

export default {
  name: 'App',
  components: {
    VueFinalModal,
    ModalsContainer
  },

  data() {
    return {
      isUserId: '',
      isLoggedIn: false,
      agency_name: '',
      showMore: false,
      isNotif: false,
      bookingList: [],
      pendingList: [],
      reviewList:[],
    };
  },
  mounted() {
    const auth = getAuth();
    const db = getDatabase();
    const dbRef = ref(db);
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.isUserId = user.uid;
        get(child(dbRef, '/users/travel_agency/' + this.isUserId)).then((snapshot) => {
          if (snapshot.exists()) {
            this.isLoggedIn = true
            this.$router.push('/');
            this.agency_name = snapshot.val().name

            //
            let viewReviews = this;
            const reviewsRef = ref(db, '/feedback/' + this.agency_name);
            onValue(reviewsRef, (snapshot) => {
              let data = snapshot.val();
              let reviewList = [];
               Object.keys(data).forEach((key) => {
                 console.log(data[key].messageTxt)
                  reviewList.push({
                      id : key,
                      customer_name : data[key].username,
                      content : data[key].messageTxt,
                      rating: data[key].rating,
                      time : data[key].time_sent + ' On ' + data[key].date_sent,
                      destination_name : data[key].subjectTxt,
                  });
                  viewReviews.reviewList = reviewList;
               })
            })

            //start
            let viewPending = this;
            const pendingRef = ref(db, '/Pending/');
            onValue(pendingRef, (snapshot) => {
              let data = snapshot.val();
              let pendingList = [];
              Object.keys(data).forEach((key) => {
                if (data[key].agency_name == this.agency_name) {
                  this.pending = true;
                  pendingList.push({
                    id: key,
                    customer_name: data[key].username,
                    boat_name: data[key].boat_name,
                    destination_name: data[key].destination_name,
                    scheduled_date: data[key].date_sched,
                    transaction_date: data[key].date_sent,
                    payID: data[key].payID,
                  });
                }
                viewPending.pendingList = pendingList;
              })
            })
            //end 

            //start
            // get all Bookings
            let viewBooking = this;
            const bookingRef = ref(db, '/boatbooking/');
            onValue(bookingRef, (snapshot) => {
              let data = snapshot.val();
              let bookingList = [];
              Object.keys(data).forEach((key) => {
                console.log(key)
                if (data[key].agency_name == this.agency_name) {
                  bookingList.push({
                    reference_id: key,
                    customer_name: data[key].customer_name,
                    boat_name: data[key].pump_boat_name,
                    scheduled_date: data[key].date_scheduled,
                    transaction_date: data[key].date_booked,
                    price: data[key].price,
                    destination_name: data[key].destination_name,
                    destination_province: data[key].destination_province,
                    destination_activities: data[key].activities,
                    boat_capacity: data[key].seating_capacity,
                    payID: data[key].payID,
                    ticketStatus: data[key].ticketStatus,
                  });
                }
                viewBooking.bookingList = bookingList;
              })
            })
            //end
          }
          else {
            this.isLoggedIn = false
            alert('Unauthorize access is forbidden');
            signOut(auth).then(() => {
            })
            this.$router.push('/login');
          }
        })
      } else {
        signOut(auth).then(() => {
        })
        this.isLoggedIn = false
        this.$router.push('/login');
      }
    })
  },
  methods: {
    logOut() {
      signOut(getAuth()).then(() => {
        this.isSignIn = false;
        this.$router.push('/login')
        console.log("Signed out");
      }).catch((error) => {
        console.log(error.message);
      });
    },
    goProfile(id) {
      this.$router.push({ name: 'profile', params: { id: id } })
    },
    goSettings(id) {
      this.$router.push({ name: 'settings', params: { id: id } })
    },
    goInbox(id) {
      this.$router.push({ name: 'inbox', params: { id: id } })
    }
  }
}


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


.btn {
  width: auto;
}

.nav-item {
  margin: auto;
}

.dropdown {
  padding-left: 10px;
  margin: auto;
  width: auto;
}

.dropdown:hover {
  border-radius: 10px;
  color: #2c3e50;

}


.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;

}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.navbar {
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  height: 100px;
  background-color: #5e93c8;
}

.imageProfile {
  max-width: 30px;
  max-height: 20px;
  border-radius: 50%;
  box-shadow: 0px 0px 0px 2px white;
}

#homeNav {
  float: left;
}

.navImage {
  width: 30px;
  height: 30px;
  border-radius: 20%;
  filter: invert(100%);

}

.navImage:hover {
  background-color: rgb(75, 75, 75);
  box-shadow: 0px 0px 10px rgb(111, 111, 111);
  width: 40px;
  height: 40px;
}

.navLogo {
  width: 30px;
  height: 30px;
  display: block;
  background-size: cover;
  background-color: #f1f1f1;
  border-radius: 50%;
}

.hoverIcon {
  display: none;
  padding: 20px;
}

.navbar-brand:hover .hoverIcon {
  display: block;
  position: absolute;
  font-size: 12px;
  text-align: center;
  background-color: #616060;
  color: #c2c5c9;
  border-radius: 10px;
  opacity: 0.8;
  cursor: pointer;
}

.navbar-brand {
  cursor: pointer;
  color: white;
}

@media only screen and (max-width: 620px) {

  /* For mobile phones: */
  .menu,
  .main,
  .right {
    width: 100%;
  }
}

.showmore-content {
  display: inline-block;
  position: absolute;
  height: 150px;
  width: 150px;
  background: white;
  margin-top: 10%;
  top: 50%;
  right: 50%;
  left: -10%;
  box-shadow: 0 0 5px grey;
  border-radius: 10px;
  margin-bottom: 5%;
  color: #2c3e50;
}

.s-content {
  text-align: center;
  padding: 10px 40px;
  color: #2c3e50;
  text-decoration: none;
  width: 100px;
}

.s-content:hover {
  border-radius: 10px;
  background-color: #c2c2c3;
  color: white;
}

.nav-link:hover {
  cursor: pointer;
  color: white;
}

.showNotif {
  display: inline-block;
  position: absolute;
  height: 450px;
  width: 300px;
  background: white;
  top: 65%;
  right: 17.5%;
  box-shadow: 0 0 5px grey;
  border-radius: 10px;
  margin-bottom: 5%;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 10px;
}

.pending_sign {
  position: absolute;
  font-size: 25px;
  right: 20.5%;
  color: yellow;

}
</style>
