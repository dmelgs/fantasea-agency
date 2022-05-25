<template>
  <div class="container-fluid">
    <div class="row">
      <nav class="col-md-2 d-none d-md-block bg-light sidebar">
        <div class="sidebar-sticky">
          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Manage Pump boat</span>
            <a class="d-flex align-items-center text-muted" href="#">
              <span data-feather="plus-circle"></span>
            </a>
          </h6>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" @click="openQueue">
                View Queueing
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="openPumpBoat">
                View Registered Pump Boats
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <main role="main" class="mainColumn">
        <div v-show="showQueue">
          <h6>Available Pumpboats</h6>
          <table class="table table-bordered ">
            <thead>
              <tr>
                <th>Boat Name</th>
                <th>Capacity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in list" :key="data.pumpboat_name">
                <td>{{ data.pumpboat_name }}</td>
                <td>{{ data.seating_capacity }}</td>
                <td> <button @click.prevent="addToQueue(data.pumpboat_name, data.seating_capacity)"
                    class="btn btn-success">Add to Queue</button></td>
              </tr>
            </tbody>
          </table>
          <hr>
          <h6>Queue System</h6>
          <table class="table table-bordered ">
            <thead>
              <tr>
                <th>Boat Name</th>
                <th>Time Queued</th>
                <th>Date</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="queue in queueList" :key="queue.pumpboat_name">
                <td>{{ queue.pumpboat_name }}</td>
                <td>{{ queue.time_queued }}</td>
                <td>{{ queue.date_queued }}</td>
                <td>{{ queue.seating_capacity }}</td>
                <td>{{ queue.status }}</td>
                <td> <button @click.prevent="removeQueue(queue.pumpboat_name)" class="btn btn-danger">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-show="showPumpBoat">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Boat Name</th>
                <th scope="col">Seating Capacity</th>
                <th scope="col">Contact Number</th>
                <th scope="col">Emailr</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in list" :key="data.pumpboat_name">
                <td>{{ data.pumpboat_name }}</td>
                <td>{{ data.seating_capacity }}</td>
                <td>{{ data.contact_number }}</td>
                <td>{{ data.email }}</td>
                <td> <button @click.prevent="messageBoat(data.pumpboat_name)" class="btn btn-success">Message</button></td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getDatabase, ref, get, child, onValue, remove, set ,push} from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth'


export default {
  name: 'pumpboat',
  data() {
    return {
      showQueue: true,
      showPumpBoat: false,
      agency_username: '',
      list: [],
      queueList: [],
      timestamp: '',
      date: '',
      time: '',
      currentYear: '',
    }
  },
  mounted() {
    this.date = this.getDate();
    this.time = this.getTime();
    this.timestamp = this.getTimestamp();
    this.currentYear = this.getCurrentYear();
    const db = getDatabase();
    const dbRef = ref(db);
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.userId = user.uid;
        get(child(dbRef, 'users/travel_agency/' + this.userId)).then((snapshot) => {
          if (snapshot.exists()) {
            this.agency_username = snapshot.val().name;
            //call fetch method
            this.fetchPumpBoat(snapshot.val().name);
            this.queueData(snapshot.val().name);

          }
        })
      }//end ifUser 
      else {
        this.$router.push('/login')
      }
    }); //end onAuthstatechanged
  },
  methods: {
    openQueue() {
      this.showPumpBoat = false;
      this.showQueue = true;
    },
    openPumpBoat() {
      this.showPumpBoat = true;
      this.showQueue = false;
    },
    fetchPumpBoat(id) { // fetch all pump boats for specific agency
      const db = getDatabase();
      const adbRef = ref(db, '/appusers/BoatID/');
      onValue(adbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().agencyname == id) {
            this.list.push({
              'pumpboat_name': childSnapshot.val().username,
              'seating_capacity': childSnapshot.val().seatingcapacity,
              'contact_number': childSnapshot.val().phonenumber,
              'email': childSnapshot.val().email,
            })
            console.log('pump boat found   ' + childSnapshot.val().firstname + childSnapshot.val().lastname)
          }
        })
      })
    },

    async queueData(id) { // fetch all pump boats queueing
      const db = getDatabase();
      const dbRef = ref(db, '/queue/' + id);
      onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          this.queueList.push({
            'pumpboat_name': childSnapshot.key,
            'time_queued': childSnapshot.val().time_queued,
            'date_queued': childSnapshot.val().date_queued,
            'seating_capacity': childSnapshot.val().capacity,
            'status': childSnapshot.val().status,
          });

        });
      }, {
        onlyOnce: true
      });
    },

    addToQueue(id, num) { // add pump boat to queue
      const db = getDatabase();
      const dbRef = ref(db);
      if (window.confirm("Add Pump Boat to Queue?")) {
        get(child(dbRef, '/queue/' + this.agency_username + '/' + id)).then((snapshot) => {
          if (snapshot.exists()) { //check if boat already queueing
            alert('already in queue')
            return;
          }
          set(ref(db, '/queue/' + this.agency_username + '/' + id), {
            boat_name: id,
            time_queued: this.time,
            date_queued: this.date,
            capacity: num,
            status: 'Online',
            activity: 'Waiting',
            agency_username: this.agency_username,
            //
          }).then(() => {
            this.queueList.push({ //put data into array 
              'pumpboat_name': id,
              'time_queued': this.time,
              'date_queued': this.date,
              'seating_capacity': num,
              'status': 'Online',
            });
            alert("Pump boat added into queue: ")
          }).catch((error) => {
            console.log(error);
          });
        })
      }
    },

    removeQueue(id) {
      const db = getDatabase();
      if (window.confirm("Do you really want to delete?")) {
        let i = this.queueList.map(data => data.id).indexOf(id) // find index of your object
        this.queueList.splice(i, 1) // remove it from array      
        remove(ref(db, '/queue/' + this.agency_username + '/' + id), {
        })
          .then(() => {
            console.log("removed success: ")
          }).catch((error) => {
            console.log(error);
          });
      }
    },

    //dates
    getDate: function () {
      return new Date().toLocaleDateString();
    },
    getTime: function () {
      return new Date().toLocaleTimeString();
    },
    getTimestamp: function () {
      return Date.now();
    },
    getCurrentYear: function () {
      return new Date().getFullYear();
    },
    messageBoat(id) {
      const db = getDatabase();
      const messageRef = ref(db, '/messages/' + this.agency_username + '/' + id);
      const amessageRef = ref(db, '/MessageUsers/' + id);
      const message = push(messageRef);
      set(message, {
        username: this.agency_username,
        content: 'Hello, ' + id,
        date_sent: this.date,
        time_sent: this.time,
      });
      const Amessage = push(amessageRef);
      set(Amessage, {
        subject: 'Message',
        messageToTxt: id,
        messageTxt: 'Hello, ' + id,
        username: this.agency_username,
        date_sent: this.date,
        time_sent: this.time,
      });
      console.log('convo initiated')
      this.$router.push({ name: 'inbox', params: { id: id } })
    },
  }
}
</script>

<style scoped>
.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

/*
 * Sidebar
 */

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  /* Behind the navbar */
  padding: 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
  position: -webkit-sticky;
  position: fixed;
  top: 48px;
  /* Height of navbar */
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto;
  /* Scrollable contents if viewport is shorter than content. */
}

.nav-item {
  margin-left: 5%;
}

.sidebar .nav-link {
  text-align: left;
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar .nav-link:hover {
  background-color: #999;
  color: white;
  border-radius: 30px;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

.mainColumn {
  width: 800px;
  margin-left: 20%;
  margin-top: 7%;
  margin-right: 5%;
  color: black;
  margin-bottom: 5%;
}

.ui-w-80 {
  width: 150px !important;
  height: 150px;
  background-color: #999;
  border-radius: 10px;
  margin: auto;
}

.btn-default {
  border-color: rgba(24, 28, 33, 0.1);
  background: rgba(0, 0, 0, 0);
  color: #4E5155;
}

label.btn {
  margin-bottom: 0;
}

.btn-outline-primary {
  border-color: #26B4FF;
  background: transparent;
  color: #26B4FF;
}

.btn {
  cursor: pointer;
}

.text-light {
  color: #babbbc !important;
}


.card {
  background-clip: padding-box;
  box-shadow: 0 1px 4px rgba(24, 28, 33, 0.012);
}

.row-bordered {
  overflow: hidden;
}

.account-settings-fileinput {
  position: absolute;
  visibility: hidden;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.account-settings-links .list-group-item.active {
  font-weight: bold !important;
}

html:not(.dark-style) .account-settings-links .list-group-item.active {
  background: transparent !important;
}

.light-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(24, 28, 33, 0.03) !important;
}

.light-style .account-settings-links .list-group-item.active {
  color: #4e5155 !important;
}

.material-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(24, 28, 33, 0.03) !important;
}

.material-style .account-settings-links .list-group-item.active {
  color: #4e5155 !important;
}

.dark-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(255, 255, 255, 0.03) !important;
}

.dark-style .account-settings-links .list-group-item.active {
  color: #fff !important;
}

.light-style .account-settings-links .list-group-item.active {
  color: #4E5155 !important;
}

.light-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(24, 28, 33, 0.03) !important;
}
</style>