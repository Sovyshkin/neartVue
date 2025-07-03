<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      phone: "",
      email: "",
      first_name: "",
      last_name: "",
      description: "",
      password: "",
      image_url: "",
      message: "",
      fileObjects: [],
      imageUrlArray: [],
      isImageArray: [],
      fileNameArray: [],
      fileSizeArray: [],
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.phone ? this.phone.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.phone = input;
      e.target.value = this.formatPhoneNumber;
    },
    saveContent() {
      try {
        const textarea = document.getElementById("desc");
        let content = textarea.value;

        // Заменяем символы переноса строки на HTML-тег br
        content = content.replace(/\n/g, "<br>");

        // Сохраняем отступы с помощью тега pre
        content = content.replace(/^(\s+)/gm, "<pre>$1</pre>");

        this.content = content;

        return content;
      } catch (err) {
        console.log(err);
      }
    },
    async log() {
      try {
        if (this.phone && this.username) {
          const formData = new FormData();
          formData.append("file", this.fileObjects);
          formData.append("username", this.username);
          formData.append("email", this.email);
          formData.append("description", this.description);
          formData.append("first_name", this.first_name);
          formData.append("last_name", this.last_name);
          formData.append("phone", this.phone);

          console.log(formData);
          let response = await axios.post(
            "https://217.114.2.107:5000/artist_add",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          if (this.id) {
            setTimeout(() => {
              this.message = "";
            }, 2500);
          }
          setTimeout(() => {
            this.message = "";
          }, 2500);
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files) {
        Array.from(files).forEach((file) => {
          this.fileObjects.push(file);
          this.isImageArray.push(this.checkIsImage(file));
          this.displayContent(file);
        });
      }
    },

    displayContent(file) {
      if (this.isImageArray[this.isImageArray.length - 1]) {
        this.displayImage(file);
      } else {
        this.displayFile(file);
      }
    },

    checkIsImage(file) {
      return /image\/.*/.test(file.type);
    },

    displayImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrlArray.push(e.target.result);
      };
      reader.readAsDataURL(file);
    },

    displayFile(file) {
      this.fileNameArray.push(file.name);
      this.fileSizeArray.push(this.formatFileSize(file.size));
    },

    formatFileSize(size) {
      const units = ["Б", "КБ", "МБ"];
      let i = 0;
      while (size > 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
      }
      return `${(size | 0).toString()} ${units[i]}`;
    },

    async load_info() {
      try {
        let id = this.$route.query.id;
        let response = await axios.post(`/get_artist/${id}`);
        console.log(response);
        this.first_name = response.data.first_name;
        this.last_name = response.data.last_name;
        this.username = response.data.username;
        this.description = response.data.description;
        this.email = response.data.email;
        this.phone = response.data.phone;
        this.image_url = response.data.image_url;
      } catch (err) {
        console.log(err);
      }
    },
    async save() {
      try {
        if (this.phone && this.username) {
          const formData = new FormData();
          if (this.fileObjects[0]) {
            formData.append("file", this.fileObjects[0]);
          } else {
            formData.append("file", "base.jpg");
          }
          formData.append("username", this.username);
          formData.append("email", this.email);
          formData.append("description", this.description);
          formData.append("first_name", this.first_name);
          formData.append("last_name", this.last_name);
          formData.append("phone", this.phone);

          console.log(formData);
          let response = await axios.post(
            "https://217.114.2.107:5000/artist_update",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          this.message = response.data.message;
          if (this.message == "Успешно") {
            setTimeout(() => {
              this.message = "";
            }, 2500);
          }
          setTimeout(() => {
            this.message = "";
          }, 2500);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>

<template>
  <div class="card">
    <h1>Редактирование художника</h1>
    <div class="group">
      <input
        v-model="first_name"
        type="text"
        required
        name="name"
        placeholder="Введите имя"
      />
      <span class="group-value">Имя</span>
    </div>
    <div class="group">
      <input
        v-model="last_name"
        type="text"
        required
        name="surname"
        placeholder="Введите фамилию"
      />
      <span class="group-value">Фамилия</span>
    </div>
    <div class="group">
      <input
        v-model="email"
        type="email"
        required
        name="email"
        placeholder="Введите почту"
      />
      <span class="group-value">Почта</span>
    </div>
    <div class="group">
      <input
        :value="formatPhoneNumber"
        @input="updateValue($event)"
        type="tel"
        size="20"
        required
        name="number"
        placeholder="+7"
        maxlength="12"
      />
      <span class="group-value">Телефон</span>
    </div>
    <div class="group">
      <textarea
        name="desc"
        v-model="description"
        cols="30"
        rows="10"
        placeholder="Введите описание"
        id="desc"
      ></textarea>
      <span class="group-value">Описание</span>
    </div>
    <div class="group">
      <input
        v-model="username"
        type="text"
        required
        name="login"
        placeholder="Придумайте логин"
      />
      <span class="group-value">Логин</span>
    </div>
    <div class="group-file">
      <input
        type="file"
        id="file"
        @change="handleFileUpload"
        accept="image/*"
        multiple
      />
      <label class="select-img" for="file">Прикрепить изображения</label>
    </div>
    <div
      v-for="(imageUrl, index) in imageUrlArray"
      :key="index"
      class="image-container"
    >
      <img :src="imageUrl" alt="Uploaded Image" />
    </div>

    <div class="image-container" v-if="image_url && imageUrlArray.length == 0">
      <img :src="`https://217.114.2.107:5000/images/${image_url}`" alt="" />
    </div>

    <div v-if="!isImageArray.includes(true)" class="file-container">
      <span>{{ fileNameArray.join(", ") }}</span>
      <br />
      <small>{{ fileSizeArray.join(", ") }}</small>
    </div>
    <div class="wrap-btns" v-if="!message">
      <button class="btn" @click="save()">Сохранить</button>
    </div>
    <div
      class="msg"
      :class="{
        success: this.message == 'Пользователь сохранен',
        error: this.message != 'Пользователь сохранен',
      }"
      v-if="message"
    >
      {{ message }}
    </div>
  </div>
</template>
<style scoped>
.card {
  padding-top: 20px;
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: transparent;
  border: none;
}
.card:hover {
  transform: none;
  box-shadow: none;
}

h1 {
  font-weight: 700;
  font-size: 23px;
  line-height: 28px;
  text-align: center;
}

.wrap-btns {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
input,
textarea {
  width: 100%;
  border: 1px solid black;
  ;
  padding: 16px;
}

textarea {
  max-width: 450px;
  max-height: 300px;
  min-height: 70px;
}

input::placeholder,
textarea::placeholder {
  color: #a5a5a5;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
}
.group {
  position: relative;
  width: 100%;
}

.group-value {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  left: 12px;
  background-color: #f0f0f5;
  padding: 0 4px;
  color: #000;
  font-weight: 500;
  font-size: 12px;
  line-height: 13.66px;
}
.btn {
  background-color: #E8336E;
  
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}
input[type="file"] {
  border: none;
  display: none;
}

.group-file {
  padding: 15px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.9px dashed #000;
  ;
}

label {
  width: 100%;
  text-align: center;
  cursor: pointer;
  color: #000;
}
.image-container {
  margin: 0 auto;
  max-width: 400px;
  ;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-container {
  display: flex;
  align-items: center;
  gap: 7px;
}
</style>
