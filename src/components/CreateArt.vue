<script>
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      description: "",
      price: "",
      status: "В наличии",
      size: "",
      unique_value: false,
      artist: {},
      artists: [],
      fileObjects: [],
      imageUrlArray: [],
      isImageArray: [],
      fileNameArray: [],
      fileSizeArray: [],
      mainStatus: ["Нет в наличии", "В наличии", "Доступно под заказ"],
      message: "",
    };
  },
  methods: {
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

    async save() {
      try {
        if (this.fileObjects.length > 0) {
          this.description = this.saveContent(this.description)
          const formData = new FormData();
          this.fileObjects.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("artist_id", this.artist.id);
          formData.append("title", this.title);
          formData.append("description", this.description);
          formData.append("price", this.price);
          formData.append("size", this.size);
          formData.append("status", this.status);
          formData.append("unique_value", Number(this.unique_value));

          console.log(formData);
          let response = await axios.post(
            "http://217.114.2.107:5000/add_picture",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          this.message = response.data.message;
          setTimeout(() => {
            this.message = "";
            if (response.status == 200) {
              this.$router.go(-1);
            }
          }, 2500);
        } else {
          this.message = "Добавьте хотя бы одно изображение!";
          setTimeout(() => {
            this.message = "";
          }, 4000);
        }
      } catch (err) {
        console.log(err);
      }
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
    async load_artists() {
      try {
        let response = await axios.get(`http://217.114.2.107:5000/get_artists`);
        console.log(response);
        this.artists = response.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.load_artists();
  },
};
</script>

<template>
  <div class="wrapper">
    <h1>Загрузка картины</h1>
    <div class="group">
      <input
        v-model="title"
        type="text"
        required
        name="title"
        placeholder="Введите название"
      />
      <span class="group-value">Название</span>
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
        v-model="price"
        type="text"
        required
        name="price"
        placeholder="Введите стоимость"
      />
      <span class="group-value">Стоимость</span>
    </div>
    <div class="group">
      <input
        v-model="size"
        type="text"
        required
        name="size"
        placeholder="Укажите размер картины (90x70 см)"
      />
      <span class="group-value">Размер</span>
    </div>
    <div class="group">
      <select name="" id="" v-model="status">
        <option :value="item" v-for="(item, i) in mainStatus" :key="i">
          {{ item }}
        </option>
      </select>
      <span class="group-value">Статус</span>
    </div>
    <div class="group">
      <select v-model="unique_value">
        <option :value="true">Да</option>
        <option :value="false">Нет</option>
      </select>
      <span class="group-value">Уникальность</span>
    </div>
    <div class="group">
      <select name="" id="" v-model="artist">
        <option :value="item" v-for="(item, i) in artists" :key="i">
          {{ item.username }}
        </option>
      </select>
      <span class="group-value">Художник</span>
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
    <div class="wrap-btns" v-if="!message">
      <button class="btn" @click="save()">Загрузить</button>
    </div>
    <div
      class="msg"
      :class="{
        success: this.message == 'Успешно',
        error: this.message != 'Успешно',
      }"
      v-if="message"
    >
      {{ message }}
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
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
}

.btn {
  padding: 15px 40px;
  background-color: #E8336E;
  
  color: #fff;
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
}
input,
textarea,
select {
  width: 100%;
  border: 1px solid black;
  ;
  padding: 16px;
  background: none;
  outline: none;
}

textarea {
  max-width: 500px;
  max-height: 300px;
  min-height: 70px;
}

input::placeholder,
textarea::placeholder,
select::placeholder {
  color: #a5a5a5;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
}
.group {
  position: relative;
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
