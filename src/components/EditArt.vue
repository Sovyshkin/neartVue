<script>
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      description: "",
      id: "",
      price: "",
      status: "",
      size: "",
      unique_value: "",
      artist: {},
      artists: [],
      fileObjects: [],
      imageUrlArray: [],
      isImageArray: [],
      fileNameArray: [],
      fileSizeArray: [],
      img_urls: [],
      img_remove: [],
      mainStatus: ["Нет в наличии", "В наличии", "Доступно под заказ"],
      message: "",
      statusRes: "",
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

    formatDate() {
      const date = new Date();

      // Получаем компоненты даты
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      // Форматируем строку в нужном формате
      return `${day}.${month}.${year}`;
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
        let response = await axios.get(`/get_artists`);
        console.log(response);
        this.artists = response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async load_info() {
      try {
        this.id = this.$route.query.id;
        let response = await axios.get(`/get_picture/${this.id}`);
        console.log(response);
        
        this.title = response.data.title;
        this.description = this.htmlToText(response.data.description);
        this.price = response.data.price;
        let artistID = response.data.artist_id;
        this.status = response.data.status;
        this.size = response.data.size;
        this.artists.forEach((artist) => {
          if (artist.id == artistID) {
            this.artist = artist;
          }
        });
        // Сохраняем оригинальные URL в img_urls
        this.img_urls = response.data.img_urls;
        // Отображаем изображения
        this.imageUrlArray = response.data.img_urls.map(
          (item) => `https://217.114.2.107:5000/images/${item}`
        );
        this.unique_value = Boolean(response.data.unique_value);
      } catch (err) {
        console.log(err);
      }
    },

    removeImg(url) {
      try {
        // Удаляем из массива для отображения
        this.imageUrlArray = this.imageUrlArray.filter((item) => item !== url);

        // Удаляем соответствующий URL из img_urls
        const filename = url.replace("https://217.114.2.107:5000/images/", "");
        this.img_urls = this.img_urls.filter((item) => item !== filename);
      } catch (err) {
        console.error("Ошибка при удалении изображения:", err);
      }
    },

    async save() {
      try {
        this.description = this.saveContent(this.description);
        const formData = new FormData();

        // Добавляем новые файлы
        this.fileObjects.forEach((file) => {
          formData.append("files", file);
        });

        // Добавляем URL существующих изображений, которые нужно сохранить
        if (this.img_urls.length > 0) {
          formData.append("img_urls", this.img_urls.join(","));
        }

        // Остальные поля остаются без изменений
        formData.append("artist_id", this.artist.id);
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("price", this.price);
        formData.append("status", this.status);
        formData.append("size", this.size);
        formData.append("unique_value", this.unique_value ? 1 : 0);
        formData.append("picture_id", this.id);
        formData.append("created_at", new Date().toISOString());

        console.log([...formData.entries()]);

        let response = await axios.post("/update_picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.message = response.data.message;
        this.statusRes = response.status;

        setTimeout(() => {
          this.message = "";
        }, 2500);
      } catch (err) {
        console.error("Ошибка при сохранении:", err);
        this.message = "Произошла ошибка при сохранении";
        this.statusRes = "error";
        setTimeout(() => {
          this.message = "";
          this.statusRes = "";
        }, 4000);
      }
    },

    async deleteArt() {
      try {
        let response = await axios.delete(`/picture/${this.id}`);
        console.log(response);
        this.message = response.data.message;
        this.statusRes = response.status;
        setTimeout(() => {
          if (response.status == 200) {
            this.$router.go(-1);
          }
          this.message = "";
        }, 2500);
      } catch (err) {
        console.log(err);
      }
    },

    htmlToText(html) {
      if (!html) return "";
      return html
        .replace(/<br\s*\/?>/gi, "\n") // Заменяем <br> на перенос строки
        .replace(/<\/?pre>/gi, "") // Удаляем теги <pre>
        .replace(/&lt;/g, "<") // Восстанавливаем <
        .replace(/&gt;/g, ">") // Восстанавливаем >
        .replace(/&amp;/g, "&"); // Восстанавливаем &
    },
  },
  async mounted() {
    await this.load_artists();
    await this.load_info();
  },
};
</script>

<template>
  <div class="wrapper">
    <h1>Редактирование картины</h1>
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
      <img
        @click="removeImg(imageUrl)"
        class="cross"
        src="../assets/cross.png"
        alt=""
      />
    </div>
    <div class="wrap-btns" v-if="!message">
      <button class="btn delete" @click="deleteArt()">Удалить</button>
      <button class="btn" @click="save()">Сохранить</button>
    </div>
    <div
      class="msg"
      :class="{
        success: this.statusRes == '200',
        error: this.statusRes != '200',
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
  gap: 20px;
}

.btn {
  padding: 15px 40px;
  background-color: #e8336e;

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
  padding: 16px;
  background: none;
  outline: none;
}

textarea {
  max-width: 450px;
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
  position: relative;
  margin: 0 auto;
  max-width: 400px;
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

.cross {
  position: absolute;
  top: 2%;
  right: 2%;
  cursor: pointer;
}

.delete {
  background-color: #cf0032;
}
</style>
