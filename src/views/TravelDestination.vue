<template>
  <div class="container-fluid">
    <div class="row">
      <nav class="col-md-2 d-none d-md-block bg-light sidebar">
        <div class="sidebar-sticky">
          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Account Settings</span>
            <a class="d-flex align-items-center text-muted" href="#">
              <span data-feather="plus-circle"></span>
            </a>
          </h6>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" @click="openCreate">
                Create Destination
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="openDestination">
                View All
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <main role="main" class="mainColumn">
        <div class="col-md-9">
          <div class="tab-content">
            <h4>Create Destination</h4>
            <div class="tab-pane fade active show" id="account-general" v-show="showCreate">
              <div class="card-body media align-items-center">
                <img :src="previewImage" alt="destination_pic" class="d-block ui-w-80">
                <div class="media-body ml-4">
                  <label class="btn btn-outline-primary">
                    Select Image
                    <input type="file" class="account-settings-fileinput" ref="fileInput" @input="pickFile"
                      accept="image/*">

                  </label> &nbsp;
                  <button type="button" class="btn btn-default md-btn-flat" @click="ResetButton">Reset</button>
                  <div class="text-light small mt-1">Allowed JPG or PNG</div>
                </div>
              </div>
              <hr class="border-light m-0">

              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Destination Name</label>
                  <input type="text" class="form-control mb-1" v-model="destination_name">
                </div>
                <div class="form-group">
                  <label class="form-label">Province</label>
                  <input type="text" class="form-control" v-model="destination_province">
                </div>
                <div class="form-group">
                  <label class="form-label">Price</label>
                  <input type="text" class="form-control mb-1" v-model="destination_price">
                </div>
                <div class="form-group">
                  <div class="checkedAct">Coastal Activties: {{ checkedActivities }}</div>
                  <div class="checkBoxes">
                    <input type="checkbox" id="snorkeling" value="Snorkeling" v-model="checkedActivities">
                    <label for="snorkeling">Snorkeling</label>
                    <br>
                    <input type="checkbox" id="islandTour" value="Island Tour" v-model="checkedActivities">
                    <label for="islandTour">Island Tour</label>
                    <br>
                    <input type="checkbox" id="scuba" value="Scuba Diving" v-model="checkedActivities">
                    <label for="scuba">Scuba Diving</label>
                    <br>
                    <input type="checkbox" id="waterski" value="Water Skiing" v-model="checkedActivities">
                    <label for="waterski">Water Skiing</label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Other Activity: </label>
                  <input type="text" class="form-control mb-1" v-model="checkedActivities">
                </div>

                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" maxlength="250" placeholder="Input Some Description Here "
                    v-model="destination_description"></textarea>
                </div>
              </div>

              <div class="text-right mt-3">
                <button type="button" class="btn btn-primary" @click.prevent="createDestination"> Create
                </button>&nbsp;
                <button type="button" class="btn btn-default">Cancel</button>
              </div>
            </div> <!-- Create Tab -->

            <div class="tab-pane fade active show" v-show="showDestination">
              <table class="table">
                <thead>
                  <tr>
                    <th>Destination name</th>
                    <th>Main image</th>
                    <th>Province</th>
                    <th>Base Price</th>
                    <th>Activties</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="data in list" :key="data.destinationName">
                    <td>{{ data.destinationName }}</td>
                    <td> <img class="imagePreviewWrapper" :src="data.pic" @click="selectImage(data.pic)"></td>
                    <td> {{ data.province }} </td>
                    <td> {{ data.price }} </td>
                    <td> {{ data.acts }} </td>
                    <td>
                      <button @click.prevent="goEdit(data.destinationName)" class="btn btn-primary">Edit</button>
                    </td>
                    <td>
                      <button @click.prevent="deleteData(data.destinationName)" class="btn btn-danger">Delete</button>
                    </td>
                    <td>
                      <button @click="promoteDestination(data.destinationName)" class="btn btn-success">Promote</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> <!-- Destination Tab -->

          </div>
        </div>
        <div>
          <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
            <button class="modal__close" @click="showModal = false">
              <mdi-close></mdi-close>
            </button>
            <span class="modal__title">Promote Destination</span>
            <div class="modal__content">
              <div class="container">
                <div class="row" v-show="!isConfirm">

                  <div class="card" style="width: 18rem;">
                    <div class="card-body">
                      <h5 class="card-title">5$</h5>
                      <h6 class="card-subtitle mb-2 text-muted">Advertise Destination</h6>
                      <p class="card-text">Promote your destination for 14 Days</p>
                      <button class="btn btn-primary" @click="buyFirst(5, 14)">Buy</button>
                    </div>
                  </div>

                  <div class="card" style="width: 18rem;">
                    <div class="card-body">
                      <h5 class="card-title">10$</h5>
                      <h6 class="card-subtitle mb-2 text-muted">Advertise Destination</h6>
                      <p class="card-text">Promote your destination for 23 Days.</p>
                      <button class="btn btn-primary" @click="buySecond(10, 23)">Buy</button>
                    </div>
                  </div>

                  <div class="card" style="width: 18rem;">
                    <div class="card-body">
                      <h5 class="card-title">15$</h5>
                      <h6 class="card-subtitle mb-2 text-muted">Advertise Destination</h6>
                      <p class="card-text">Promote your destination for 35 days</p>
                      <button class="btn btn-primary" @click="buyThird(15, 35)">Buy</button>
                    </div>
                  </div>
                 
                </div>
                 <div class="paypal-container" v-show="isConfirm">
                   <h6>Select a payment method</h6>
                    <div ref="paypal"> </div>
                    <button class="btn btn-danger" @click="isConfirm = false">Cancel</button>
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
import { getDatabase, ref, get, child, update, onValue, remove, set,push } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { $vfm, VueFinalModal, ModalsContainer } from 'vue-final-modal';


export default {
  name: 'traveldestination',
  data() {
    return {
      showDestination: true,
      showCreate: false,
      showModal: false,
      userId: '',
      destination_name: '',
      destination_province: '',
      destination_description: '',
      checkedActivities: [],
      previewImage: null,
      username: '',
      imageName: '',
      list: [],
      imageUrl: '',
      isResultBad: '',
      days: '',
      loaded: false,
      showpaypal: false,
      loadding: false,
      paidFor: false,
      amount: '',
      isConfirm: false,
    }
  },
  components: {
    VueFinalModal,
    ModalsContainer
  },
  mounted: function () {
    const db = getDatabase();
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.userId = user.uid;
        this.fetchData();
        const script = document.createElement("script");
        script.src =
          "https://www.paypal.com/sdk/js?client-id=AYtniZK6_e3Ceyu_3KGu6dVXDkWf1F35IteUTlOLetwMMCqQyK8_NS8vDqNxsQz4LNuFb0MryfYEkEe1";
        script.addEventListener("load", this.setLoaded);
        document.body.appendChild(script);
        this.date = this.getDate();
        this.time = this.getTime();
        this.currentYear = this.getCurrentYear();
        document.getElementById("input_day").disabled = false;
      }//end if
      else {
        this.$router.push('/login')
      }
    })//end onAuth
  },
  methods: {
    setLoaded: function (resp) {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {             
                  description: this.days,
                  amount: {
                    currency_code: "USD",
                    value: this.amount
                  }
                }
              ]
            });
          },
          onApprove: async (data, actions, resp) => {
            this.loadding = true;
            const order = await actions.order.capture();
            this.data;
            this.paidFor = true;
            this.loadding = false;
            const db = getDatabase();
            set(ref(db, '/promo/' + this.destination_name), {
              destination_name: this.destination_name,
              agency_id: this.userId,
              days: this.days,
              amount: this.amount,
              date_purchased: this.date,
              time_purchased: this.time,
              payID : data.paymentID 
            }).then(() => {
              const transactionRef = ref(db, '/transactions/' + this.userId);
              const transaction = push(transactionRef);
              set(transaction, {
                destination_name: this.destination_name,
                type: 'promo',
                days: this.days,
                amount: this.amount,
                date_purchased: this.date,
                time_purchased: this.time,
                payID : data.paymentID 
              });
              console.log('destination promoted')
              document.getElementById("input_day").disabled = false;
            })

          },
          onError: err => {
            console.log(err);
          }
        })
        .render(this.$refs.paypal);
    },
    openCreate() {
      this.showCreate = true
      this.showDestination = false
    },

    openDestination() {
      this.showDestination = true
      this.showCreate = false
    },

    async pickFile() {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
        console.log("file name: " + file[0].name)
        this.imageName = file[0].name
        this.imageData = file[0]

      }
    },

    async createDestination() { //method create destination
      const db = getDatabase();
      const storage = getStorage();
      if (this.destination_name == "" || this.destination_province == "" || this.destination_description == "" ||
        this.previewImage == null || this.previewImage == "" || this.destination_price == null) {
        this.isResultBad = "All fields must not be empty";
        alert("All fields must not be empty");
        return;
      }
      if (this.destination_name.length < 6) {
        this.isResultBad = "Name should be six characters above";
        alert("Name should be six characters above");
        return;
      }
      if (this.checkedActivities.length <= 0) {
        this.isResultBad = "No actitvites checked";
        alert("No actitvites checked");
        return;
      }
      if (this.destination_price <= 0) {
        alert("Include a base price");
        this.isResultBad = "Include a base price";
        return;
      }
      const metadata = {
        contentType: 'image/jpeg/png',
      };
      const storageRef = sRef(storage, 'travel_agency/' + this.username + '/destinations/' + this.destination_name + '/' + this.imageName);
      const uploadTask = uploadBytesResumable(storageRef, this.imageData);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            this.previewImage = downloadURL;
            set(ref(db, '/destinations/' + this.destination_name), {
              agency_id: this.userId,
              destination_name: this.destination_name,
              agency_name: this.username,
              destination_province: this.destination_province,
              base_price: this.destination_price,
              destination_pic: downloadURL,
              pic_name: this.imageName,
              description: this.destination_description,
              activities: this.checkedActivities.toString(),
            })
              .then(() => {
                this.destination_name = "";
                this.destination_province = "";
                this.destination_price = "";
                this.previewImage = null;
                this.checkedActivities = [];
                this.$router.go
                alert("Succesfully Created")
              })
              .catch((error) => {
                alert("error" + error.message)
              });
          });
        });

    },

    async fetchData() {
      const db = getDatabase();
      const adbRef = ref(db, '/destinations/');
      onValue(adbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().agency_id == this.userId) {
            this.list.push({
              'destinationName': childSnapshot.key,
              'pic': childSnapshot.val().destination_pic,
              'province': childSnapshot.val().destination_province,
              'price': childSnapshot.val().base_price,
              'acts': childSnapshot.val().activities,
              'pic_name': childSnapshot.val().pic_name,
            }); //end push
          } // end if
        });
      }, {
        onlyOnce: true
      });
    },//end fetch data
    async goEdit(id) {
      this.$router.push({ name: 'edit-destination', params: { id: id } })
    },
    async deleteData(id) {
      const db = getDatabase();
      const dataBaseRef = ref(db, '/destinations/');
      if (window.confirm("Do you really want to delete?")) {
        remove(ref(db, '/destinations/' + id), {
        })
          .then(() => {
            console.log("removed success: ");
          }).catch((error) => {
            console.log(error);
          });
      }
    },//end delete data

    //get date,time,yr method
    getDate: function () {
      return new Date().toLocaleDateString();
    },
    getTime: function () {
      return new Date().toLocaleTimeString();
    },
    getCurrentYear: function () {
      return new Date().getFullYear();
    },
    promoteDestination(id) {
      this.destination_name = id;
      console.log(this.destination_name);
      this.showModal = true;
    },
    buyFirst(amount, days) {
      this.amount = amount
      this.days = days
      this.isConfirm = true
       console.log(this.amount +'/'+ this.days)
    },
    buySecond(amount, days) {
      this.amount = amount
      this.days = days
       this.isConfirm = true
      console.log(this.amount +'/'+ this.days)
    },
    buyThird(amount, days) {
      this.amount = amount
      this.days = days
       this.isConfirm = true
      console.log(this.amount +'/'+ this.days)
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
  margin: auto;
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

.form-group {
  text-align: left;
  color: #4E5155;
}

.checkbox {
  margin: auto;
}

.table {
  margin-top: 5%;
  width: 1200px;
  font-size: 12px;
}

.imagePreviewWrapper {
  width: 200px;
  height: 200px;
}

::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 700px;
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
  height: 350px;
}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}


.card-deck .card {
  width: 300px;
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

.card-title {
  font-size: 30px;
  font-weight: bold;
}
</style>