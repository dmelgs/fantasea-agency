<template>
    <div class="container">
        <div class="row">
            <div class="col" id="input_col">
                <h4 style="text-align:left">Details: </h4>
                <div class="form-group">
                    <label for="name">Destination Name: </label>
                    <input type="text" disabled id="name" class="form-control" placeholder="Name of Destination"
                        v-model="destination_name">
                    <label for="province">Province: </label>
                    <input type="text" id="province" class="form-control" placeholder="Province"
                        v-model="destination_province">
                    <label for="price">Price: </label>
                    <input type="number" id="price" class="form-control" placeholder="Base price"
                        v-model="destination_price">
                    <label for="desc">Description: </label>
                    <textarea class="form-control" id="desc" maxlength="250" placeholder="Description"
                        v-model="destination_description"></textarea>
                </div>
            </div>

            <div class="col" id="coastal_act_column">
                <div class="checkedAct">Coastal Activties:</div>
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
                    <br>
                    <input type="checkbox" id="kayak" value="Kayaking" v-model="checkedActivities">
                    <label for="kayak">Kayaking</label>
                </div>
            </div>
            <div class="col" id="dest_pic_col">
                <h4 style="text-align:center">Destination Main Picture: </h4>
                <div>
                    <img class="imagePreviewWrapper" :src="previewImage" @click="selectImage">
                    <input class="inputFile" ref="fileInput" type="file" @input="pickFile">
                </div>
                <button type="button" class="btn btn-primary" @click="UpdateData">Update</button>
                <br>
                <p v-html="isResult" class="isResultTrue"></p>
            </div>
        </div>
        <div class="row">
            <div class="col" id="dest_gallery_col">
                <h4>Gallery</h4>
                <div class="card" style="width: 18rem;" v-for="gallery in viewGalleryList" :key="gallery.id">
                    <img class="card-img-top" :src="gallery.gallery_pics" alt="Card image cap">
                    <div class="card-body">
                         <button class="btn" id="carousel-btn" @click="removeImage(gallery.id)">Remove</button>
                    </div>
                </div>
                <!-- <Carousel :items-to-show="1.5">
                    <Slide v-for="gallery in viewGalleryList" :key="gallery.id">
                        <img class="carousel__item" :src="gallery.gallery_pics" />
                        <button class="btn" id="carousel-btn" @click="removeImage(gallery.id)">Remove</button>

                    </Slide>

                    <template #addons>
                        <Navigation />
                    </template>
                </Carousel> -->

            </div>
            <div class="col" id="dest_gallery_upload_col">
                <div>
                    <div v-for="(image, key) in images" :key="key">
                        <div>
                            <img class="preview" :ref="'image'" :src="image" />
                            {{ image.name }}
                        </div>
                    </div>
                    <input multiple accept="image/jpeg" type="file" @change="uploadImage">
                </div>
                <button type="button" class="btn btn-primary" @click="uploadToFireBase">Upload</button>
                <button type="button" class="btn btn-primary" @click="clearMedia">Clear</button>
            </div>
        </div>
        <button type="button" class="btn btn-danger" @click="CancelUpdate">BACK</button>
    </div>
</template>

<script>
/* eslint-disable */
import { getDatabase, ref, get, child, update, push, set, onValue, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';



export default {
    name: 'edit-destination',
    components: {
        Carousel,
        Slide,
        Navigation,
    },
    data() {
        return {
            username: '',
            checkedActivities: [],
            destination_name: '',
            destination_province: '',
            destination_price: '',
            destination_pic: '',
            previewImage: '',
            fileName: '',
            imageData: '',
            images: [],
            destination_description: '',
            mediaName: '',
            mediaData: '',
            viewGalleryList: [],
        };
    },
    mounted() {
        const db = getDatabase();
        const dbRef = ref(db);
        this.viewGalleryList = [];
        this.images = [];
        onAuthStateChanged(getAuth(), (user) => {  //get the currently signed-in user
            if (user) {
                this.userId = user.uid;
                get(child(dbRef, '/users/travel_agency/' + this.userId)).then((snapshot) => {
                    if (snapshot.exists()) {
                        this.username = snapshot.val().name;
                        console.log("Getting info for: " + this.username);
                        get(child(dbRef, '/destinations/' + this.$route.params.id)).then((snapshot) => {
                            if (snapshot.exists()) {
                                this.destination_name = snapshot.val().destination_name;
                                this.destination_province = snapshot.val().destination_province;
                                this.destination_price = snapshot.val().base_price;
                                this.checkedActivities.values = snapshot.val().activities;
                                this.previewImage = snapshot.val().destination_pic;
                                this.destination_description = snapshot.val().description;

                                const galleryRef = ref(db, '/gallery/' + this.username + '/' + this.$route.params.id);
                                onValue(galleryRef, (snapshot) => {
                                    snapshot.forEach((childSnapshot) => {
                                        this.viewGalleryList.push({
                                            'id': childSnapshot.key,
                                            'gallery_pics': childSnapshot.val().gallery_pic_url,
                                        })  //end push         
                                    }) // end 2nd ForEach
                                })  // end 2nd Onvalue 

                            }
                            else {
                                console.log("Destination not found in: " + '/destinations/' + this.$route.params.id);
                            }
                        });
                    }
                });
            } else {
                this.$router.push('/login')
            }
        });

    },

    methods: {
        async UpdateData() { //update method
            const db = getDatabase();
            const storage = getStorage();
            if (this.checkedActivities == "" || this.destination_province == "" || this.base_price == "" || this.destination_description == null) {
                alert('Some fields are missing');
                return;
            }
            if (this.destination_price <= 0) {
                alert('Invalid Price');
                return;
            }
            const storageRef = sRef(storage, 'travel_agency/' + this.username + '/destinations/' + this.destination_name + '/' + this.fileName);
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
                        update(ref(db, '/destinations/' + this.$route.params.id), {
                            destination_name: this.destination_name,
                            destination_province: this.destination_province,
                            base_price: this.destination_price,
                            description: this.destination_description,
                            activities: this.checkedActivities.toString(),
                            destination_pic: downloadURL,
                            pic_name: this.fileName,
                        }).then(() => {
                            console.log("update success: ")
                            this.$router.push('/traveldestination');
                        })
                            .catch((error) => {
                                console.log("update failed: ")
                            });

                    });
                }
            );
        },//end update

        async CancelUpdate() {
            this.$router.push('/traveldestination');
        },

        async pickFile() { //select file to upload
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
                this.fileName = file[0].name;
                this.imageData = file[0];
            }
        },

        uploadImage(e) {   //upload images
            let vm = this;
            var selectedFiles = e.target.files;
            for (let i = 0; i < selectedFiles.length; i++) {
                console.log(selectedFiles[i]);
                this.images.push(selectedFiles[i]);
            }

            for (let i = 0; i < this.images.length; i++) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.$refs.image[i].src = reader.result;

                    // console.log(this.$refs.image[i].src);
                };

                reader.readAsDataURL(this.images[i]);
                this.mediaName = this.images[i].name;
                this.mediaData = this.images[i]
            }
        },
        uploadToFireBase() { //write to database
            const db = getDatabase();
            const storage = getStorage();
            if (this.images == "" || this.images == null) {
                alert('no image to be uploaded')
                return;
            }
            const storageRef = sRef(storage, 'travel_agency/' + this.username + '/destinations/' + this.destination_name + '/' + this.mediaName);
            const uploadTask = uploadBytesResumable(storageRef, this.mediaData);
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
                        this.image = downloadURL;
                        const galleryRef = ref(db, '/gallery/' + this.username + '/' + this.$route.params.id);
                        const gallery = push(galleryRef);
                        set(gallery, {
                            gallery_pic_name: this.mediaName,
                            gallery_pic_url: downloadURL,
                        });
                        alert('image added to gallery')
                        this.images = []
                    });
                }
            );
        },

        clearMedia() {
            this.images = []
        },

        removeImage(id) { // method to remove images
            const db = getDatabase();
            console.log('to delete : ' + id);
            if (window.confirm("Do you really want to delete?")) {
                remove(ref(db, '/gallery/' + this.username + '/' + this.$route.params.id + '/' + id), {
                })
                    .then(() => {
                        console.log("removed success: ");
                    }).catch((error) => {
                        console.log(error);
                    });
            }
        }//end
    }//end methods
}
</script>

<style scoped>
.container {
    margin-top: 10%;
    margin-bottom: 5%;
}

.row {
    margin-top: 2%;
    margin-bottom: 2%;
    border-style: ridge;
    border-radius: 20px;
}

.col {
    margin-top: 2%;
    margin-bottom: 5%;

}

.imagePreviewWrapper {
    width: 200px;
    height: 200px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    margin-top: 2%;
    background-size: cover;
    background-position: center center;
    background-color: beige;
}

.form-group {
    text-align: left;
    margin-left: 5%;
}

.btn {
    margin: 1%;
    width: 150px;
    height: 50px;
}

.preview {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    align-items: center;
    margin-bottom: 2%;
    text-align: left;
}

#coastal_act_column {
    text-align: left;
    font-size: 20px;

}

.checkBoxes {
    margin-left: 5%;
}

h4 {
    text-align: left;
}

.carousel__prev--in-active,
.carousel__next--in-active {
    display: none;
}

.carousel {
    width: 350px;

}

.carousel__item {
    height: 200px;
    width: 200px;
    color: var(--vc-clr-white);
    background-color: #1a202c;
    font-size: 20px;
    border-radius: 8px;
    display: flex;
    justify-content: left;
    align-items: left;
}


#carousel-btn {
    color: white;
    background-color: #1a202c;
    opacity: 0.6;
}

#carousel-btn:hover {
    color: white;
    background-color: #444548;
    opacity: 0.8;
}

#dest_gallery_upload_col {
    margin-top: 10%;
    margin-right: 5%;
}

#dest_gallery_col {
    margin-left: 5%;

}
</style>