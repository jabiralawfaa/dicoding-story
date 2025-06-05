var M=r=>{throw TypeError(r)};var A=(r,e,t)=>e.has(r)||M("Cannot "+t);var c=(r,e,t)=>(A(r,e,"read from private field"),t?t.call(r):e.get(r)),k=(r,e,t)=>e.has(r)?M("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),v=(r,e,t,i)=>(A(r,e,"write to private field"),i?i.call(r,t):e.set(r,t),t),I=(r,e,t)=>(A(r,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();const y={BASE_URL:"https://story-api.dicoding.dev/v1",DEFAULT_LANGUAGE:"id-id",CACHE_NAME:"DicodingStory-V1",DATABASE_NAME:"dicoding-story-database",DATABASE_VERSION:1,OBJECT_STORE_NAME:"stories"},w={REGISTER:`${y.BASE_URL}/register`,LOGIN:`${y.BASE_URL}/login`,GET_ALL_STORIES:`${y.BASE_URL}/stories`,GET_STORY_DETAIL:r=>`${y.BASE_URL}/stories/${r}`,POST_STORY:`${y.BASE_URL}/stories`,POST_GUEST_STORY:`${y.BASE_URL}/stories/guest`};class S{static async register({name:e,email:t,password:i}){return await(await fetch(w.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:i})})).json()}static async login({email:e,password:t}){return await(await fetch(w.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})})).json()}static async getAllStories({token:e,page:t=1,size:i=10,location:a=0}){return await(await fetch(`${w.GET_ALL_STORIES}?page=${t}&size=${i}&location=${a}`,{method:"GET",headers:{Authorization:`Bearer ${e}`}})).json()}static async getStoryDetail({id:e,token:t}){return await(await fetch(w.GET_STORY_DETAIL(e),{method:"GET",headers:{Authorization:`Bearer ${t}`}})).json()}static async postStory({token:e,description:t,photo:i,lat:a,lon:o}){const n=new FormData;return n.append("description",t),n.append("photo",i),a&&n.append("lat",a),o&&n.append("lon",o),await(await fetch(w.POST_STORY,{method:"POST",headers:{Authorization:`Bearer ${e}`},body:n})).json()}static async postGuestStory({description:e,photo:t,lat:i,lon:a}){const o=new FormData;return o.append("description",e),o.append("photo",t),i&&o.append("lat",i),a&&o.append("lon",a),await(await fetch(w.POST_GUEST_STORY,{method:"POST",body:o})).json()}}const{DATABASE_NAME:F,DATABASE_VERSION:R,OBJECT_STORE_NAME:p}=y;class f{static async openDB(){return new Promise((e,t)=>{if(!("indexedDB"in window)){t(new Error("Browser ini tidak mendukung IndexedDB"));return}const i=indexedDB.open(F,R);i.onerror=a=>{t(new Error("Error membuka database: "+a.target.errorCode))},i.onsuccess=a=>{e(a.target.result)},i.onupgradeneeded=a=>{const o=a.target.result;o.objectStoreNames.contains(p)||(o.createObjectStore(p,{keyPath:"id"}),console.log(`Object store ${p} berhasil dibuat`))}})}static async saveStories(e){try{const i=(await this.openDB()).transaction(p,"readwrite"),a=i.objectStore(p);return e.forEach(o=>{a.put(o)}),new Promise((o,n)=>{i.oncomplete=()=>{o(!0),console.log("Cerita berhasil disimpan ke IndexedDB")},i.onerror=s=>{n(new Error("Gagal menyimpan cerita: "+s.target.errorCode))}})}catch(t){throw console.error("Error saat menyimpan cerita:",t),t}}static async saveStory(e){try{const i=(await this.openDB()).transaction(p,"readwrite");return i.objectStore(p).put(e),new Promise((o,n)=>{i.oncomplete=()=>{o(!0),console.log("Cerita berhasil disimpan ke IndexedDB")},i.onerror=s=>{n(new Error("Gagal menyimpan cerita: "+s.target.errorCode))}})}catch(t){throw console.error("Error saat menyimpan cerita:",t),t}}static async getAllStories(){try{const a=(await this.openDB()).transaction(p,"readonly").objectStore(p).getAll();return new Promise((o,n)=>{a.onsuccess=()=>{o(a.result)},a.onerror=s=>{n(new Error("Gagal mengambil cerita: "+s.target.errorCode))}})}catch(e){throw console.error("Error saat mengambil cerita:",e),e}}static async getStoryById(e){try{const o=(await this.openDB()).transaction(p,"readonly").objectStore(p).get(e);return new Promise((n,s)=>{o.onsuccess=()=>{n(o.result)},o.onerror=u=>{s(new Error("Gagal mengambil cerita: "+u.target.errorCode))}})}catch(t){throw console.error("Error saat mengambil cerita:",t),t}}static async deleteStory(e){try{const o=(await this.openDB()).transaction(p,"readwrite").objectStore(p).delete(e);return new Promise((n,s)=>{o.onsuccess=()=>{n(!0),console.log(`Cerita dengan ID ${e} berhasil dihapus`)},o.onerror=u=>{s(new Error("Gagal menghapus cerita: "+u.target.errorCode))}})}catch(t){throw console.error("Error saat menghapus cerita:",t),t}}static async clearAllStories(){try{const a=(await this.openDB()).transaction(p,"readwrite").objectStore(p).clear();return new Promise((o,n)=>{a.onsuccess=()=>{o(!0),console.log("Semua cerita berhasil dihapus")},a.onerror=s=>{n(new Error("Gagal menghapus semua cerita: "+s.target.errorCode))}})}catch(e){throw console.error("Error saat menghapus semua cerita:",e),e}}}class T{async getAllStories(e){try{const t=await S.getAllStories(e);return!t.error&&t.listStory&&await f.saveStories(t.listStory),t}catch(t){console.error("Error in getAllStories model:",t),console.log("Mencoba mengambil data dari IndexedDB...");try{return{error:!1,listStory:await f.getAllStories(),message:"Data diambil dari penyimpanan lokal"}}catch(i){throw console.error("Error mengambil data dari IndexedDB:",i),t}}}async getStoryDetail(e,t){try{const i=await S.getStoryDetail({id:e,token:t});return!i.error&&i.story&&await f.saveStory(i.story),i}catch(i){console.error("Error in getStoryDetail model:",i),console.log("Mencoba mengambil data detail dari IndexedDB...");try{const a=await f.getStoryById(e);if(a)return{error:!1,story:a,message:"Data detail diambil dari penyimpanan lokal"};throw new Error("Data tidak ditemukan di penyimpanan lokal")}catch(a){throw console.error("Error mengambil data detail dari IndexedDB:",a),i}}}async addStory(e){try{const t=await S.postStory(e);if(!t.error){const{token:i}=e,a=await S.getAllStories({token:i});!a.error&&a.listStory&&await f.saveStories(a.listStory)}return t}catch(t){throw console.error("Error in addStory model:",t),t}}async getStoriesFromIndexedDB(){try{return{error:!1,listStory:await f.getAllStories(),message:"Data diambil dari penyimpanan lokal"}}catch(e){return console.error("Error mengambil data dari IndexedDB:",e),{error:!0,message:"Gagal mengambil data dari penyimpanan lokal"}}}async deleteStoryFromIndexedDB(e){try{return await f.deleteStory(e),{error:!1,message:"Cerita berhasil dihapus dari penyimpanan lokal"}}catch(t){return console.error("Error menghapus data dari IndexedDB:",t),{error:!0,message:"Gagal menghapus data dari penyimpanan lokal"}}}}class U{constructor({storiesContainer:e,mapContainer:t}){this.storiesContainer=e,this.mapContainer=t}showLoading(){this.storiesContainer.innerHTML='<p class="loading-text">Memuat cerita...</p>'}hideLoading(){}updateAuthButtons(e){const t=document.querySelector("#loginButton"),i=document.querySelector("#logoutButton"),a=document.querySelector("#notificationButton"),o=document.querySelector("#savedButton");e?(t.style.display="none",i.style.display="inline-block",a.style.display="inline-block",o.style.display="inline-block"):(t.style.display="inline-block",i.style.display="none",a.style.display="none",o.style.display="none")}setLogoutButtonEvent(e){document.querySelector("#logoutButton").addEventListener("click",e)}redirectToHome(){window.location.href="#/",window.location.reload()}showLoginMessage(){this.storiesContainer.innerHTML=`
      <div class="empty-state" role="alert" aria-live="polite">
        <p>Silakan login untuk melihat cerita</p>
      </div>
    `}showEmptyState(){this.storiesContainer.innerHTML=`
      <div class="empty-state" role="alert" aria-live="polite">
        <p>Tidak ada cerita yang tersedia</p>
      </div>
    `}showError(e){this.storiesContainer.innerHTML=`
      <div class="error-state" role="alert" aria-live="assertive">
        <p>${e}</p>
      </div>
    `}showStories(e,t){this.storiesContainer.innerHTML="",e.forEach(i=>{this.storiesContainer.innerHTML+=t.createStoryItemTemplate(i)})}initMap(e){if(this.mapContainer&&typeof L<"u"){const t=L.map(this.mapContainer).setView([-2.548926,118.0148634],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(t),e.forEach(i=>{i.lat&&i.lon&&L.marker([i.lat,i.lon]).addTo(t).bindPopup(`
            <div class="popup-content">
              <h2>${i.name}</h2>
              <img src="${i.photoUrl}" alt="${i.name}" style="width: 100%; max-width: 200px;">
              <p>${i.description}</p>
            </div>
          `).openPopup()})}else this.mapContainer?console.error("Leaflet library is not loaded"):console.error("Map container not found")}afterRender(){this.addAccessibilityStyles();const e=document.getElementById("main-content");e&&setTimeout(()=>{e.focus()},100)}addAccessibilityStyles(){if(!document.getElementById("accessibility-styles")){const e=document.createElement("style");e.id="accessibility-styles",e.textContent=`
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #005fcc;
          color: #fff;
          padding: 8px;
          z-index: 100;
          transition: top 0.3s;
        }
        .skip-link:focus {
          top: 0;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `,document.head.appendChild(e)}}}const B="dicoding_story_auth",l={saveAuth({token:r,name:e,userId:t}){localStorage.setItem(B,JSON.stringify({token:r,name:e,userId:t}))},getAuth(){return JSON.parse(localStorage.getItem(B))||{token:null}},destroyAuth(){localStorage.removeItem(B)},isUserSignedIn(){const{token:r}=this.getAuth();return!!r}};class H{constructor({storyModel:e,homeView:t,templateCreator:i}){this.storyModel=e,this.homeView=t,this.templateCreator=i}async init(){this.homeView.showLoading(),await this.showStories(),this.initAuthButtons()}initAuthButtons(){const e=l.isUserSignedIn();this.homeView.updateAuthButtons(e),this.homeView.setLogoutButtonEvent(()=>{l.destroyAuth(),this.homeView.redirectToHome()})}async showStories(){try{if(!l.isUserSignedIn()){this.homeView.showLoginMessage();return}const{token:e}=l.getAuth();let t;try{t=await this.storyModel.getAllStories({token:e,location:1})}catch(a){console.error("Error fetching from API:",a),t=await this.storyModel.getStoriesFromIndexedDB()}if(t.error){this.homeView.showError(t.message);return}const i=t.listStory;i&&i.length>0?(this.homeView.showStories(i,this.templateCreator),this.homeView.initMap(i)):this.homeView.showEmptyState()}catch(e){console.error("Error in showStories presenter:",e),this.homeView.showError("Terjadi kesalahan saat memuat cerita")}finally{this.homeView.hideLoading()}}}const P=r=>`
  <div class="story-item" role="article" aria-labelledby="title-${r.id}">
    <div class="story-item__header">
      <img class="story-item__image" src="${r.photoUrl}" alt="${r.name}" aria-describedby="desc-${r.id}">
    </div>
    <div class="story-item__content">
      <h2 class="story-item__title" id="title-${r.id}">
        <a href="#/detail/${r.id}" aria-label="Lihat detail cerita dari ${r.name}">${r.name}</a>
      </h2>
      <p class="story-item__date">${new Date(r.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"})}</p>
      <p class="story-item__description" id="desc-${r.id}">${r.description}</p>
    </div>
  </div>
`,D=r=>`
  <div class="story-detail" role="article" aria-labelledby="detail-title">
    <h2 class="story-detail__title" id="detail-title" tabindex="-1">${r.name}</h2>
    <p class="story-detail__date">${new Date(r.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"})}</p>
    
    <img class="story-detail__image" src="${r.photoUrl}" alt="Foto cerita: ${r.name}">
    
    <div class="story-detail__content">
      <p class="story-detail__description" id="detail-description">${r.description}</p>
    </div>
    
    ${r.lat&&r.lon?'<div id="detail-map" class="story-detail__map" tabindex="0" role="application" aria-label="Peta lokasi cerita"></div>':""}
  </div>
`;class ${async render(){return`
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Dicoding Story</h1>
        
        <div class="story-action" role="navigation" aria-label="Navigasi utama">
          <a href="#/add" class="btn btn-primary" aria-label="Tambah cerita baru">Tambah Cerita</a>
          <a href="#/saved" class="btn btn-success" id="savedButton" style="display: none;" aria-label="Lihat cerita tersimpan">Cerita Tersimpan</a>
          <a href="#/notification" class="btn btn-info" id="notificationButton" style="display: none;" aria-label="Pengaturan notifikasi">Notifikasi</a>
          <a href="#/login" class="btn btn-secondary" id="loginButton" aria-label="Masuk ke akun">Login</a>
          <button class="btn btn-danger" id="logoutButton" style="display: none;" aria-label="Keluar dari akun">Logout</button>
        </div>

        <div id="map" class="map-container" tabindex="0" role="application" aria-label="Peta lokasi cerita"></div>
        
        <div id="stories" class="stories-container" role="main">
          <div class="stories-list" id="stories-list">
            <p class="loading-text" aria-live="polite">Memuat cerita...</p>
          </div>
        </div>
      </section>
    `}async afterRender(){typeof L<"u"&&(L.Icon.Default.prototype.options.iconUrl="/images/leaflet/marker-icon.svg",L.Icon.Default.prototype.options.shadowUrl="/images/leaflet/marker-shadow.svg",L.Icon.Default.prototype.options.iconSize=[25,41],L.Icon.Default.prototype.options.shadowSize=[41,41]);const e=document.querySelector("#stories-list"),t=document.querySelector("#map"),i=new T,a=new U({storiesContainer:e,mapContainer:t});await new H({storyModel:i,homeView:a,templateCreator:{createStoryItemTemplate:P}}).init()}}class j{async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){}}class G{constructor({storyModel:e,storyView:t}){this.storyModel=e,this.storyView=t}async showAllStories(e){try{this.storyView.showLoading();const t=await this.storyModel.getAllStories(e);if(t.error){this.storyView.showError(t.message);return}this.storyView.showStories(t.listStory)}catch(t){this.storyView.showError("Terjadi kesalahan saat memuat cerita"),console.error("Error in showAllStories presenter:",t)}finally{this.storyView.hideLoading()}}async showStoryDetail(e,t){try{this.storyView.showLoading();const i=await this.storyModel.getStoryDetail(e,t);if(i.error){this.storyView.showError(i.message);return}this.storyView.showStoryDetail(i.story)}catch(i){this.storyView.showError("Terjadi kesalahan saat memuat detail cerita"),console.error("Error in showStoryDetail presenter:",i)}finally{this.storyView.hideLoading()}}async addStory(e){try{this.storyView.showLoading();const t=await this.storyModel.addStory(e);return t.error?(this.storyView.showError(t.message),!1):(this.storyView.showSuccess("Cerita berhasil ditambahkan"),!0)}catch(t){return this.storyView.showError("Terjadi kesalahan saat menambahkan cerita"),console.error("Error in addStory presenter:",t),!1}finally{this.storyView.hideLoading()}}}class z{constructor({storiesContainer:e,mapContainer:t=null,templateCreator:i}){this.storiesContainer=e,this.mapContainer=t,this.templateCreator=i}showLoading(){this.storiesContainer.innerHTML='<p class="loading-text">Memuat cerita...</p>'}hideLoading(){}showError(e){this.storiesContainer.innerHTML=`<p class="error-text">${e}</p>`}showSuccess(e){alert(e)}showStories(e){if(e.length===0){this.storiesContainer.innerHTML='<p class="empty-text">Tidak ada cerita yang tersedia</p>';return}this.storiesContainer.innerHTML="",e.forEach(t=>{const i=document.createElement("div");i.innerHTML=this.templateCreator.createStoryItemTemplate(t),this.storiesContainer.appendChild(i.firstElementChild)}),this.mapContainer&&e.some(t=>t.lat&&t.lon)&&this.showStoriesOnMap(e)}showStoryDetail(e){this.storiesContainer.innerHTML=this.templateCreator.createStoryDetailTemplate(e),this.mapContainer&&e.lat&&e.lon&&this.showStoryLocationOnMap(e)}showStoriesOnMap(e){if(!this.mapContainer)return;const t=L.map(this.mapContainer).setView([-2.548926,118.0148634],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(t),e.filter(i=>i.lat&&i.lon).forEach(i=>{L.marker([i.lat,i.lon]).addTo(t).bindPopup(`
            <h3>${i.name}</h3>
            <p>${i.description}</p>
          `).openPopup()})}showStoryLocationOnMap(e){if(!this.mapContainer||!e.lat||!e.lon)return;const t=document.getElementById("detail-map");if(!t)return;const i=L.map(t).setView([e.lat,e.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(i),L.marker([e.lat,e.lon]).addTo(i).bindPopup(`
        <div class="popup-content">
          <h2>${e.name}</h2>
          <p>${e.description}</p>
        </div>
      `).openPopup()}}function x(r){const e=r.split("/");return{resource:e[1]||null,id:e[2]||null}}function K(r){let e="";return r.resource&&(e=e.concat(`/${r.resource}`)),r.id&&(e=e.concat("/:id")),e||"/"}function N(){return location.hash.replace("#","")||"/"}function J(){const r=N(),e=x(r);return K(e)}function W(){const r=N();return x(r)}function Y(){const{id:r}=W();return r}class Q{constructor(){this.map=null}async render(){return`
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div id="story" class="story-detail-container" role="main">
          <h1 class="page-title" id="main-content" tabindex="-1">Detail Cerita</h1>
          <p class="loading-text" aria-live="polite">Memuat cerita...</p>
        </div>
      </section>
    `}async afterRender(){typeof L<"u"&&(L.Icon.Default.prototype.options.iconUrl="/images/leaflet/marker-icon.svg",L.Icon.Default.prototype.options.shadowUrl="/images/leaflet/marker-shadow.svg",L.Icon.Default.prototype.options.iconSize=[25,41],L.Icon.Default.prototype.options.shadowSize=[41,41]),this.addAccessibilityStyles();const e=document.querySelector("#story"),t=document.getElementById("main-content"),i=()=>{this.map&&(this.map.remove(),this.map=null,console.log("Peta dibersihkan saat meninggalkan halaman detail"))};window.addEventListener("hashchange",i),t&&setTimeout(()=>{t.focus()},100);try{if(!l.isUserSignedIn()){e.innerHTML=`
          <div class="error-state" role="alert">
            <p>Silakan login untuk melihat detail cerita</p>
            <a href="#/login" class="btn btn-primary">Login</a>
          </div>
        `;return}const a=Y();if(!a){e.innerHTML=`
          <div class="error-state" role="alert" aria-live="assertive">
            <p>ID cerita tidak ditemukan</p>
          </div>
        `;return}const o=new T,n=new z({storiesContainer:e,templateCreator:{createStoryDetailTemplate:D}});n.showStoryDetail=d=>{if(e.innerHTML=D(d),d.lat&&d.lon){const E=document.querySelector("#detail-map");E&&typeof L<"u"&&(this.map&&this.map.remove(),this.map=L.map(E).setView([d.lat,d.lon],13),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),L.marker([d.lat,d.lon]).addTo(this.map).bindPopup(`
                <div class="popup-content">
                  <h2>${d.name}</h2>
                  <p>${d.description}</p>
                </div>
              `).openPopup())}};const s=new G({storyModel:o,storyView:n}),{token:u}=l.getAuth();await s.showStoryDetail(a,u)}catch(a){console.error("Error:",a),e.innerHTML=`
        <div class="error-state" role="alert" aria-live="assertive">
          <p>Terjadi kesalahan saat memuat cerita</p>
        </div>
      `}}addAccessibilityStyles(){if(!document.getElementById("accessibility-styles")){const e=document.createElement("style");e.id="accessibility-styles",e.textContent=`
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #005fcc;
          color: #fff;
          padding: 8px;
          z-index: 100;
          transition: top 0.3s;
        }
        .skip-link:focus {
          top: 0;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `,document.head.appendChild(e)}}}class X{constructor(){this.map=null,this.marker=null,this.currentPosition=null,this.stream=null,this.cleanupCamera=null,this.mapContainer=null,this.mapInitialized=!1,this.mapInitializationAttempted=!1,this.coordinatesContainer=null,this.observer=null,this.ACCESSIBILITY_MESSAGES={CAMERA_ACTIVE:"Kamera aktif, siap mengambil foto",CAMERA_ERROR:"Gagal mengakses kamera, silakan coba lagi atau gunakan opsi unggah",LOCATION_LOADING:"Sedang mendapatkan lokasi Anda, harap tunggu",LOCATION_SUCCESS:"Lokasi berhasil didapatkan dan ditampilkan pada peta",LOCATION_ERROR:"Gagal mendapatkan lokasi, silakan pilih lokasi secara manual pada peta",LOCATION_UPDATED:"Lokasi diperbarui pada peta",LOCATION_SELECTED:"Lokasi baru dipilih dari peta",FORM_SUBMITTING:"Sedang mengirim cerita, harap tunggu",FORM_SUCCESS:"Cerita berhasil dikirim! Anda akan dialihkan ke halaman utama",FORM_ERROR:"Terjadi kesalahan saat mengirim cerita, silakan coba lagi",PHOTO_REQUIRED:"Silakan pilih foto untuk melanjutkan"}}getTemplate(){return`
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Tambah Cerita Baru</h1>
        
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div class="form-container">
          <form id="addStoryForm">
            <div class="form-group">
              <label for="description">Cerita</label>
              <textarea id="description" name="description" rows="5" required aria-describedby="descriptionHelp"></textarea>
              <small id="descriptionHelp" class="form-text">Ceritakan pengalaman Anda</small>
            </div>
            
            <div class="form-group">
              <label for="photo">Foto</label>
              <div class="photo-capture-container">
                <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required aria-describedby="photoHelp">
                <button type="button" id="openCameraButton" class="btn btn-secondary">Buka Kamera</button>
                <small id="photoHelp" class="form-text">Pilih foto atau ambil foto dengan kamera</small>
              </div>
              <div class="camera-container" id="cameraContainer" hidden aria-hidden="true">
                <video id="cameraPreview" autoplay playsinline aria-label="Pratinjau kamera"></video>
                <button type="button" id="captureButton" class="btn btn-primary" aria-label="Ambil foto dari kamera">Ambil Foto</button>
                <button type="button" id="closeCameraButton" class="btn btn-secondary" aria-label="Tutup kamera">Tutup Kamera</button>
              </div>
              <canvas id="photoCanvas" hidden></canvas>
              <div id="imagePreview" class="image-preview" aria-live="polite"></div>
            </div>
            
            <div class="form-group">
              <label for="locationMap">Lokasi</label>
              <div class="location-controls">
                <button type="button" id="getLocationButton" class="btn btn-secondary" aria-describedby="locationHelp">Gunakan Lokasi Saya</button>
                <span id="locationStatus" aria-live="polite"></span>
              </div>
              <small id="locationHelp" class="form-text">Klik pada peta untuk memilih lokasi atau gunakan lokasi saat ini</small>
              <div id="locationMap" class="location-map" tabindex="0" aria-label="Peta untuk memilih lokasi" role="application" aria-describedby="locationHelp"></div>
              <input type="hidden" id="lat" name="lat">
              <input type="hidden" id="lon" name="lon">
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Kirim Cerita</button>
            </div>
          </form>
          
          <div id="addStoryMessage" class="message" role="status" aria-live="polite"></div>
        </div>
      </section>
    `}showLoading(){const e=document.querySelector("#submitButton");e&&(e.disabled=!0,e.innerHTML='<span class="loading-spinner"></span> Mengirim...')}hideLoading(){const e=document.querySelector("#submitButton");e&&(e.disabled=!1,e.innerHTML="Kirim Cerita")}initFileInput(e){const t=document.querySelector("#photo");t&&t.addEventListener("change",e)}setupCleanupHandlers(){this.cleanupCamera=()=>{if(this.stream){this.stream.getTracks().forEach(i=>i.stop()),this.stream=null;const t=document.querySelector("#cameraPreview");t&&(t.srcObject=null),console.log("Kamera dimatikan saat meninggalkan halaman")}},window.addEventListener("hashchange",this.cleanupCamera),window.addEventListener("beforeunload",this.cleanupCamera);const e=document.getElementById("app")||document.body;e&&(this.observer=new MutationObserver(t=>{t.forEach(i=>{i.type==="childList"&&!e.contains(document.querySelector("#addStoryForm"))&&(this.cleanupCamera&&(this.cleanupCamera(),window.removeEventListener("hashchange",this.cleanupCamera),window.removeEventListener("beforeunload",this.cleanupCamera),console.log("Event listener dibersihkan")),this.observer.disconnect())})}),this.observer.observe(e,{childList:!0,subtree:!0}))}redirectToHome(e=2e3){setTimeout(()=>{window.location.href="#/"},e)}showError(e){const t=document.createElement("div");t.className="alert error",t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive"),t.textContent=e;const i=document.querySelector(".alert.error");i&&i.remove();const a=document.querySelector("#addStoryForm");a.insertBefore(t,a.firstChild),setTimeout(()=>{t.remove()},5e3)}showSuccess(e){const t=document.createElement("div");t.className="alert success",t.setAttribute("role","alert"),t.setAttribute("aria-live","polite"),t.textContent=e;const i=document.querySelector(".alert.success");i&&i.remove();const a=document.querySelector("#addStoryForm");a.insertBefore(t,a.firstChild)}initMap(){if(this.mapInitializationAttempted=!0,this.mapContainer=document.getElementById("locationMap"),!this.mapContainer)return console.error("Map container not found"),null;if(typeof L>"u")return console.error("Leaflet library is not loaded"),null;try{return this.map=L.map(this.mapContainer).setView([-2.548926,118.0148634],5),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),this.createCoordinatesContainer(),this.map.on("click",e=>{this.updateMarker(e.latlng.lat,e.latlng.lng),this.announceLocationUpdate("Lokasi baru dipilih dari peta")}),this.mapInitialized=!0,this.map}catch(e){return console.error("Error initializing map:",e),null}}createCoordinatesContainer(){this.coordinatesContainer&&this.coordinatesContainer.remove(),this.coordinatesContainer=document.createElement("div"),this.coordinatesContainer.className="coordinates-info",this.coordinatesContainer.setAttribute("role","status"),this.coordinatesContainer.setAttribute("aria-live","polite"),this.coordinatesContainer.style.backgroundColor="rgba(255, 255, 255, 0.8)",this.coordinatesContainer.style.padding="8px",this.coordinatesContainer.style.borderRadius="4px",this.coordinatesContainer.style.marginTop="10px",this.coordinatesContainer.style.fontSize="14px",this.coordinatesContainer.style.fontWeight="bold",this.coordinatesContainer.style.boxShadow="0 1px 5px rgba(0,0,0,0.4)",this.mapContainer.parentNode.insertBefore(this.coordinatesContainer,this.mapContainer.nextSibling)}displayCoordinates(e,t){this.coordinatesContainer||this.createCoordinatesContainer();const i=e.toFixed(6),a=t.toFixed(6);this.coordinatesContainer.innerHTML=`
      <div>Koordinat yang dipilih:</div>
      <div>Latitude: ${i}</div>
      <div>Longitude: ${a}</div>
    `}updateMarker(e,t){if(!this.map){console.error("Map belum diinisialisasi");return}this.marker&&this.map.removeLayer(this.marker);try{this.marker=L.marker([e,t]).addTo(this.map),this.currentPosition={lat:e,lng:t};const i=document.querySelector("#lat"),a=document.querySelector("#lon");i&&a&&(i.value=e,a.value=t),this.displayCoordinates(e,t),this.map.setView([e,t],13)}catch(i){console.error("Error saat menambahkan marker:",i)}}getCurrentPosition(){return new Promise((e,t)=>{if(!navigator.geolocation){this.announceLocationUpdate("Geolokasi tidak didukung oleh browser Anda"),t(new Error("Geolocation is not supported by your browser"));return}this.announceLocationUpdate("Sedang mendapatkan lokasi Anda, harap tunggu"),this.map||(this.mapContainer=document.getElementById("locationMap"),this.mapContainer&&this.initMap()),navigator.geolocation.getCurrentPosition(i=>{const{latitude:a,longitude:o}=i.coords;this.map?(this.updateMarker(a,o),this.announceLocationUpdate("Lokasi berhasil didapatkan dan ditampilkan pada peta"),this.displayCoordinates(a,o)):(console.error("Peta belum diinisialisasi saat mencoba memperbarui marker"),this.announceLocationUpdate("Gagal menampilkan lokasi pada peta, silakan coba lagi")),e({lat:a,lng:o})},i=>{let a="Gagal mendapatkan lokasi";switch(i.code){case i.PERMISSION_DENIED:a="Izin geolokasi ditolak";break;case i.POSITION_UNAVAILABLE:a="Informasi lokasi tidak tersedia";break;case i.TIMEOUT:a="Waktu permintaan lokasi habis";break;case i.UNKNOWN_ERROR:a="Terjadi kesalahan yang tidak diketahui";break}this.announceLocationUpdate(a),t(new Error(a))},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})})}initCameraButton(e,t,i){const a=document.querySelector("#openCameraButton"),o=document.querySelector("#closeCameraButton"),n=document.querySelector("#captureButton");a&&a.addEventListener("click",e),o&&o.addEventListener("click",t),n&&n.addEventListener("click",i)}initLocationButton(e){const t=document.querySelector("#getLocationButton");t&&t.addEventListener("click",e)}initFormSubmit(e){const t=document.querySelector("#addStoryForm");t&&t.addEventListener("submit",i=>{i.preventDefault(),e(i)})}openCamera(){const e=document.querySelector("#cameraContainer"),t=document.querySelector("#cameraPreview"),i=document.querySelector("#openCameraButton");return e&&t?(e.hidden=!1,e.setAttribute("aria-hidden","false"),i.disabled=!0,navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(a=>(this.stream=a,t.srcObject=a,this.announceAccessibilityMessage("Kamera aktif, siap mengambil foto"),a)).catch(a=>{throw console.error("Error accessing camera:",a),this.announceAccessibilityMessage("Gagal mengakses kamera, silakan coba lagi atau gunakan opsi unggah"),this.closeCamera(),a})):Promise.reject(new Error("Camera elements not found"))}closeCamera(){const e=document.querySelector("#cameraContainer"),t=document.querySelector("#cameraPreview"),i=document.querySelector("#openCameraButton");this.stream&&(this.stream.getTracks().forEach(a=>a.stop()),this.stream=null),t&&(t.srcObject=null),e&&(e.hidden=!0,e.setAttribute("aria-hidden","true")),i&&(i.disabled=!1)}capturePhoto(){const e=document.querySelector("#cameraPreview"),t=document.querySelector("#photoCanvas"),i=document.querySelector("#imagePreview"),a=document.querySelector("#photo");e&&t&&i&&(t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toBlob(n=>{const s=document.createElement("img");s.src=URL.createObjectURL(n),s.alt="Preview foto yang diambil",i.innerHTML="",i.appendChild(s);const u=new File([n],"camera-photo.jpg",{type:"image/jpeg"}),d=new DataTransfer;d.items.add(u),a&&(a.files=d.files),this.closeCamera()},"image/jpeg",.8))}handleFileInput(e){const t=e.target.files[0],i=document.querySelector("#imagePreview");if(t&&i){const a=new FileReader;a.onload=o=>{const n=document.createElement("img");n.src=o.target.result,n.alt="Preview foto yang diunggah",i.innerHTML="",i.appendChild(n)},a.readAsDataURL(t)}}getFormData(){const e=document.querySelector("#description").value,t=document.querySelector("#photo"),i=document.querySelector("#lat"),a=document.querySelector("#lon");return{description:e,photo:t.files[0],lat:i&&i.value?parseFloat(i.value):null,lon:a&&a.value?parseFloat(a.value):null}}resetForm(){const e=document.querySelector("#addStoryForm"),t=document.querySelector("#imagePreview");e&&e.reset(),t&&(t.innerHTML=""),this.marker&&this.map&&(this.map.removeLayer(this.marker),this.marker=null),this.currentPosition=null}announceAccessibilityMessage(e){if(!document.querySelector("#accessibilityAnnouncer")){const a=document.createElement("div");a.id="accessibilityAnnouncer",a.className="sr-only",a.setAttribute("aria-live","polite"),document.body.appendChild(a)}const i=document.querySelector("#accessibilityAnnouncer");i.textContent=e}announceLocationUpdate(e){const t=document.querySelector("#locationStatus");t&&(t.textContent=e),this.announceAccessibilityMessage(e)}}const Z="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";class b{static async requestPermission(){return"Notification"in window?"serviceWorker"in navigator?"PushManager"in window?await Notification.requestPermission()==="granted":(console.warn("This browser does not support push messaging"),!1):(console.warn("This browser does not support service workers"),!1):(console.warn("This browser does not support notifications"),!1)}static async registerServiceWorker(){if(!("serviceWorker"in navigator))throw new Error("Service Worker not supported");try{const e=await navigator.serviceWorker.register("/sw.js",{scope:"/"});return console.log("Service Worker registered successfully:",e),await navigator.serviceWorker.ready,e}catch(e){throw console.error("Service Worker registration failed:",e),e}}static urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),i=(e+t).replace(/-/g,"+").replace(/_/g,"/"),a=window.atob(i),o=new Uint8Array(a.length);for(let n=0;n<a.length;++n)o[n]=a.charCodeAt(n);return o}static async subscribeToPush(){try{const e=await navigator.serviceWorker.ready;let t=await e.pushManager.getSubscription();return t||(t=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(Z)})),console.log("Push subscription:",t),await this.sendSubscriptionToServer(t),localStorage.removeItem("notificationsDisabled"),t}catch(e){throw console.error("Failed to subscribe to push notifications:",e),e}}static async sendSubscriptionToServer(e){const{token:t}=l.getAuth();if(!t)throw new Error("User not authenticated");const i={endpoint:e.endpoint,keys:{p256dh:btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("p256dh")))),auth:btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("auth"))))}};try{const o=await(await fetch(`${y.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(i)})).json();if(o.error)throw new Error(o.message||"Failed to subscribe to notifications");return console.log("Subscription sent to server successfully:",o),o}catch(a){throw console.error("Failed to send subscription to server:",a),a}}static async unsubscribeFromPush(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(!t){console.log("No subscription found"),localStorage.setItem("notificationsDisabled","true");return}await t.unsubscribe(),await this.sendUnsubscriptionToServer(t.endpoint),localStorage.setItem("notificationsDisabled","true"),console.log("Successfully unsubscribed from push notifications")}catch(e){throw console.error("Failed to unsubscribe from push notifications:",e),e}}static async sendUnsubscriptionToServer(e){const{token:t}=l.getAuth();if(!t)throw new Error("User not authenticated");try{const a=await(await fetch(`${y.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e})})).json();if(a.error)throw new Error(a.message||"Failed to unsubscribe from notifications");return console.log("Unsubscription sent to server successfully:",a),a}catch(i){throw console.error("Failed to send unsubscription to server:",i),i}}static async isSubscribed(){try{return!("serviceWorker"in navigator)||!("PushManager"in window)?!1:!!await(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch(e){return console.error("Error checking subscription status:",e),!1}}static async showLocalNotification(e,t={}){if(!("Notification"in window)){console.warn("This browser does not support notifications");return}if(Notification.permission==="granted"){const i=new Notification(e,{icon:"/favicon.png",badge:"/favicon.png",...t});return setTimeout(()=>{i.close()},5e3),i}else console.warn("Notification permission not granted")}static async initializeNotifications(){try{if(await this.registerServiceWorker(),localStorage.getItem("notificationsDisabled")==="true")return console.log("User has disabled notifications, skipping auto-subscription"),!1;const t=await this.requestPermission();return t&&l.isUserSignedIn()&&(await this.isSubscribed()||(await this.subscribeToPush(),console.log("Push notifications initialized successfully"))),t}catch(e){throw console.error("Failed to initialize notifications:",e),e}}}class ee{constructor({storyModel:e,addStoryView:t}){this.storyModel=e,this.addStoryView=t}async init(){this.addStoryView.initMap(),this.addStoryView.initCameraButton(()=>this.openCamera(),()=>this.closeCamera(),()=>this.capturePhoto()),this.addStoryView.initLocationButton(()=>this.getCurrentPosition()),this.addStoryView.initFormSubmit(e=>this.submitStory(e)),this.addStoryView.initFileInput(e=>this.addStoryView.handleFileInput(e)),this.addStoryView.setupCleanupHandlers()}async openCamera(){try{await this.addStoryView.openCamera()}catch(e){console.error("Error opening camera:",e)}}closeCamera(){this.addStoryView.closeCamera()}capturePhoto(){this.addStoryView.capturePhoto()}async getCurrentPosition(){try{await this.addStoryView.getCurrentPosition()}catch(e){console.error("Error getting position:",e)}}async submitStory(e){try{this.addStoryView.showLoading();const t=this.addStoryView.getFormData();if(!t.photo){this.addStoryView.showError("Silakan pilih foto untuk melanjutkan"),this.addStoryView.hideLoading();return}const{token:i}=l.getAuth(),a={token:i,...t},o=await this.storyModel.addStory(a);if(o.error){this.addStoryView.showError(o.message||"Terjadi kesalahan saat menambahkan cerita");return}this.addStoryView.showSuccess("Cerita berhasil ditambahkan");try{await b.showLocalNotification("Story berhasil dibuat",{body:`Anda telah membuat story baru dengan deskripsi: ${t.description.substring(0,50)}${t.description.length>50?"...":""}`})}catch(n){console.error("Error showing notification:",n)}this.addStoryView.resetForm(),this.addStoryView.redirectToHome(2e3)}catch(t){console.error("Error submitting story:",t),this.addStoryView.showError("Terjadi kesalahan saat menambahkan cerita")}finally{this.addStoryView.hideLoading()}}}const te=()=>{typeof L<"u"&&(L.Icon.Default.prototype.options.iconUrl="/images/leaflet/marker-icon.svg",L.Icon.Default.prototype.options.shadowUrl="/images/leaflet/marker-shadow.svg",L.Icon.Default.prototype.options.iconSize=[25,41],L.Icon.Default.prototype.options.shadowSize=[41,41])};class ie{constructor(){this.view=new X,this.model=new T,this.presenter=new ee({storyModel:this.model,addStoryView:this.view})}async render(){return this.view.getTemplate()}async afterRender(){if(te(),!l.isUserSignedIn()){window.location.href="#/login";return}setTimeout(async()=>{await this.presenter.init()},100)}}class q{async login({email:e,password:t}){try{const i=await S.login({email:e,password:t});return i.error||l.saveAuth({token:i.loginResult.token,name:i.loginResult.name,userId:i.loginResult.userId}),i}catch(i){throw console.error("Error in login model:",i),i}}async register({name:e,email:t,password:i}){try{return await S.register({name:e,email:t,password:i})}catch(a){throw console.error("Error in register model:",a),a}}isUserSignedIn(){return l.isUserSignedIn()}getAuth(){return l.getAuth()}logout(){l.destroyAuth()}}class V{constructor({authModel:e,authView:t}){this.authModel=e,this.authView=t}async login({email:e,password:t}){try{this.authView.showLoading();const i=await this.authModel.login({email:e,password:t});return i.error?(this.authView.showError(i.message),!1):(this.authView.showSuccess("Login berhasil"),!0)}catch(i){return this.authView.showError("Terjadi kesalahan saat login"),console.error("Error in login presenter:",i),!1}finally{this.authView.hideLoading()}}async register({name:e,email:t,password:i}){try{this.authView.showLoading();const a=await this.authModel.register({name:e,email:t,password:i});return a.error?(this.authView.showError(a.message),!1):(this.authView.showSuccess("Registrasi berhasil, silakan login"),!0)}catch(a){return this.authView.showError("Terjadi kesalahan saat registrasi"),console.error("Error in register presenter:",a),!1}finally{this.authView.hideLoading()}}checkAuth(){const e=this.authModel.isUserSignedIn();return this.authView.updateAuthUI(e),e}logout(){this.authModel.logout(),this.authView.updateAuthUI(!1),this.authView.showSuccess("Logout berhasil")}}class O{constructor({loginButton:e,logoutButton:t,loginForm:i=null,registerForm:a=null}){this.loginButton=e,this.logoutButton=t,this.loginForm=i,this.registerForm=a}showLoading(){if(this.loginForm){const e=this.loginForm.querySelector('button[type="submit"]');e&&(e.disabled=!0,e.textContent="Memproses...")}if(this.registerForm){const e=this.registerForm.querySelector('button[type="submit"]');e&&(e.disabled=!0,e.textContent="Memproses...")}}hideLoading(){if(this.loginForm){const e=this.loginForm.querySelector('button[type="submit"]');e&&(e.disabled=!1,e.textContent="Login")}if(this.registerForm){const e=this.registerForm.querySelector('button[type="submit"]');e&&(e.disabled=!1,e.textContent="Register")}}showError(e){alert(e)}showSuccess(e){alert(e)}updateAuthUI(e){e?(this.loginButton&&(this.loginButton.style.display="none"),this.logoutButton&&(this.logoutButton.style.display="inline-block")):(this.loginButton&&(this.loginButton.style.display="inline-block"),this.logoutButton&&(this.logoutButton.style.display="none"))}setupLoginForm(e){this.loginForm&&this.loginForm.addEventListener("submit",async t=>{t.preventDefault();const i=this.loginForm.querySelector("#email").value,a=this.loginForm.querySelector("#password").value;await e({email:i,password:a})})}setupRegisterForm(e){this.registerForm&&this.registerForm.addEventListener("submit",async t=>{t.preventDefault();const i=this.registerForm.querySelector("#name").value,a=this.registerForm.querySelector("#email").value,o=this.registerForm.querySelector("#password").value;await e({name:i,email:a,password:o})})}setupLogoutButton(e){this.logoutButton&&this.logoutButton.addEventListener("click",()=>{e()})}}class ae{async render(){return`
      <section class="container">
        <h1 class="page-title">Login</h1>
        
        <div class="form-container">
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            
            <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </form>
          
          <div id="loginMessage" class="message"></div>
        </div>
      </section>
    `}async afterRender(){const e=document.querySelector("#loginForm"),t=document.querySelector("#loginMessage"),i=new q,a=new O({loginForm:e,loginButton:null,logoutButton:null});a.showLoading=()=>{t.textContent="Sedang login...",t.classList.add("info"),t.classList.remove("error","success");const n=e.querySelector('button[type="submit"]');n&&(n.disabled=!0,n.textContent="Memproses...")},a.hideLoading=()=>{const n=e.querySelector('button[type="submit"]');n&&(n.disabled=!1,n.textContent="Login")},a.showError=n=>{t.textContent=n||"Login gagal",t.classList.add("error"),t.classList.remove("success","info")},a.showSuccess=n=>{t.textContent=n||"Login berhasil!",t.classList.add("success"),t.classList.remove("error","info"),setTimeout(()=>{window.location.href="#/",window.location.reload()},1e3)};const o=new V({authModel:i,authView:a});e.addEventListener("submit",async n=>{n.preventDefault();const s=document.querySelector("#email").value,u=document.querySelector("#password").value;try{await o.login({email:s,password:u})}catch(d){console.error("Error:",d),a.showError("Terjadi kesalahan saat login")}})}}class oe{async render(){return`
      <section class="container">
        <h1 class="page-title">Daftar Akun</h1>
        
        <div class="form-container">
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" minlength="8" required>
              <small>Password minimal 8 karakter</small>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Daftar</button>
            </div>
            
            <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </form>
          
          <div id="registerMessage" class="message"></div>
        </div>
      </section>
    `}async afterRender(){const e=document.querySelector("#registerForm"),t=document.querySelector("#registerMessage"),i=new q,a=new O({registerForm:e,loginButton:null,logoutButton:null});a.showLoading=()=>{t.textContent="Sedang mendaftar...",t.classList.add("info"),t.classList.remove("error","success");const n=e.querySelector('button[type="submit"]');n&&(n.disabled=!0,n.textContent="Memproses...")},a.hideLoading=()=>{const n=e.querySelector('button[type="submit"]');n&&(n.disabled=!1,n.textContent="Daftar")},a.showError=n=>{t.textContent=n||"Pendaftaran gagal",t.classList.add("error"),t.classList.remove("success","info")},a.showSuccess=n=>{t.textContent=n||"Pendaftaran berhasil! Silakan login.",t.classList.add("success"),t.classList.remove("error","info"),setTimeout(()=>{window.location.href="#/login"},2e3)};const o=new V({authModel:i,authView:a});e.addEventListener("submit",async n=>{n.preventDefault();const s=document.querySelector("#name").value,u=document.querySelector("#email").value,d=document.querySelector("#password").value;try{await o.register({name:s,email:u,password:d})}catch(E){console.error("Error:",E),a.showError("Terjadi kesalahan saat mendaftar")}})}}class re{constructor(){this.isSubscribed=!1}getTemplate(){return`
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Pengaturan Notifikasi</h1>
        
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div class="notification-settings">
          <div class="setting-item">
            <h2>Push Notifications</h2>
            <p>Terima notifikasi ketika ada update terbaru dari aplikasi</p>
            
            <div class="notification-status" id="notificationStatus">
              <span class="status-text">Memeriksa status notifikasi...</span>
            </div>
            
            <div class="notification-controls" id="notificationControls">
              <button type="button" id="enableNotifications" class="btn btn-primary" style="display: none;">
                Aktifkan Notifikasi
              </button>
              <button type="button" id="disableNotifications" class="btn btn-secondary" style="display: none;">
                Nonaktifkan Notifikasi
              </button>
            </div>
            
            <div class="notification-info">
              <h3>Tentang Push Notifications</h3>
              <ul>
                <li>Anda akan menerima notifikasi ketika berhasil membuat story baru</li>
                <li>Notifikasi akan muncul meskipun aplikasi tidak sedang dibuka</li>
                <li>Anda dapat mengatur izin notifikasi melalui pengaturan browser</li>
                <li>Data notifikasi disimpan secara aman dan tidak dibagikan dengan pihak ketiga</li>
              </ul>
            </div>
          </div>
          
          <div class="setting-item">
            <h2>Test Notification</h2>
            <p>Kirim notifikasi test untuk memastikan fitur berfungsi dengan baik</p>
            <button type="button" id="testNotification" class="btn btn-outline">
              Kirim Test Notification
            </button>
          </div>
        </div>
        
        <div id="notificationMessage" class="message" role="status" aria-live="polite"></div>
      </section>
    `}async afterRender(){await this.checkNotificationStatus(),this.initEventListeners()}async checkNotificationStatus(){const e=document.querySelector("#notificationStatus .status-text"),t=document.querySelector("#enableNotifications"),i=document.querySelector("#disableNotifications");try{if(!("Notification"in window)){e.textContent="Browser tidak mendukung notifikasi",e.className="status-text status-error";return}const a=Notification.permission,o=await b.isSubscribed();this.isSubscribed=o,a==="granted"&&o?(e.textContent="Notifikasi aktif",e.className="status-text status-success",t.style.display="none",i.style.display="inline-block"):a==="granted"&&!o?(e.textContent="Notifikasi diizinkan tapi belum berlangganan",e.className="status-text status-warning",t.style.display="inline-block",i.style.display="none"):a==="denied"?(e.textContent="Notifikasi diblokir. Silakan aktifkan melalui pengaturan browser",e.className="status-text status-error",t.style.display="none",i.style.display="none"):(e.textContent="Notifikasi belum diaktifkan",e.className="status-text status-inactive",t.style.display="inline-block",i.style.display="none")}catch(a){console.error("Error checking notification status:",a),e.textContent="Terjadi kesalahan saat memeriksa status notifikasi",e.className="status-text status-error"}}initEventListeners(){const e=document.querySelector("#enableNotifications"),t=document.querySelector("#disableNotifications"),i=document.querySelector("#testNotification");e&&e.addEventListener("click",()=>this.enableNotifications()),t&&t.addEventListener("click",()=>this.disableNotifications()),i&&i.addEventListener("click",()=>this.sendTestNotification())}async enableNotifications(){try{if(this.showLoading("Mengaktifkan notifikasi..."),!await b.requestPermission()){this.showError("Izin notifikasi ditolak. Silakan aktifkan melalui pengaturan browser.");return}await b.subscribeToPush(),this.showSuccess("Notifikasi berhasil diaktifkan!"),await this.checkNotificationStatus()}catch(e){console.error("Error enabling notifications:",e),this.showError("Gagal mengaktifkan notifikasi: "+e.message)}finally{this.hideLoading()}}async disableNotifications(){try{this.showLoading("Menonaktifkan notifikasi..."),await b.unsubscribeFromPush(),this.showSuccess("Notifikasi berhasil dinonaktifkan!"),await this.checkNotificationStatus()}catch(e){console.error("Error disabling notifications:",e),this.showError("Gagal menonaktifkan notifikasi: "+e.message)}finally{this.hideLoading()}}async sendTestNotification(){try{if(Notification.permission!=="granted"){this.showError("Izin notifikasi belum diberikan. Silakan aktifkan notifikasi terlebih dahulu.");return}await b.showLocalNotification("Test Notification",{body:"Ini adalah notifikasi test dari Dicoding Story. Fitur notifikasi berfungsi dengan baik!",tag:"test-notification"}),this.showSuccess("Test notification berhasil dikirim!")}catch(e){console.error("Error sending test notification:",e),this.showError("Gagal mengirim test notification: "+e.message)}}showLoading(e="Memproses..."){const t=document.querySelector("#notificationMessage");t.innerHTML=`
      <div class="alert info">
        <span class="loading-spinner"></span> ${e}
      </div>
    `}hideLoading(){const e=document.querySelector("#notificationMessage");e.innerHTML=""}showError(e){const t=document.querySelector("#notificationMessage");t.innerHTML=`
      <div class="alert error" role="alert">
        ${e}
      </div>
    `,setTimeout(()=>{this.hideLoading()},5e3)}showSuccess(e){const t=document.querySelector("#notificationMessage");t.innerHTML=`
      <div class="alert success" role="alert">
        ${e}
      </div>
    `,setTimeout(()=>{this.hideLoading()},3e3)}}class ne{constructor(){this.view=new re}async render(){return this.view.getTemplate()}async afterRender(){if(!l.isUserSignedIn()){window.location.href="#/login";return}await this.view.afterRender()}}class se{constructor(){this.storyModel=new T}async render(){return`
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Cerita Tersimpan</h1>
        
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div id="saved-stories" class="stories-container" role="main">
          <div class="stories-list" id="saved-stories-list">
            <p class="loading-text" aria-live="polite">Memuat cerita tersimpan...</p>
          </div>
        </div>
      </section>
    `}async afterRender(){typeof L<"u"&&(L.Icon.Default.prototype.options.iconUrl="/images/leaflet/marker-icon.svg",L.Icon.Default.prototype.options.shadowUrl="/images/leaflet/marker-shadow.svg",L.Icon.Default.prototype.options.iconSize=[25,41],L.Icon.Default.prototype.options.shadowSize=[41,41]);const e=document.querySelector("#saved-stories-list"),t=document.getElementById("main-content");if(t&&setTimeout(()=>{t.focus()},100),!l.isUserSignedIn()){e.innerHTML=`
        <div class="error-state" role="alert">
          <p>Silakan login untuk melihat cerita tersimpan</p>
          <a href="#/login" class="btn btn-primary">Login</a>
        </div>
      `;return}try{e.innerHTML='<p class="loading-text">Memuat cerita tersimpan...</p>';const i=await this.storyModel.getStoriesFromIndexedDB();if(i.error){e.innerHTML=`
          <div class="error-state" role="alert">
            <p>${i.message}</p>
          </div>
        `;return}const a=i.listStory;if(a.length===0){e.innerHTML=`
          <div class="empty-state" role="alert">
            <p>Tidak ada cerita tersimpan</p>
            <a href="#/" class="btn btn-primary">Jelajahi Cerita</a>
          </div>
        `;return}e.innerHTML="",a.forEach(o=>{const n=document.createElement("div");n.classList.add("story-item-container"),n.innerHTML=`
          ${P(o)}
          <button class="btn btn-danger delete-story" data-id="${o.id}" aria-label="Hapus cerita ${o.name}">Hapus</button>
        `,e.appendChild(n)}),this.initDeleteButtons()}catch(i){console.error("Error in SavedPage:",i),e.innerHTML=`
        <div class="error-state" role="alert">
          <p>Terjadi kesalahan saat memuat cerita tersimpan</p>
        </div>
      `}}initDeleteButtons(){document.querySelectorAll(".delete-story").forEach(t=>{t.addEventListener("click",async i=>{const a=i.target.dataset.id,o=i.target.getAttribute("aria-label").replace("Hapus cerita ","");if(confirm(`Apakah Anda yakin ingin menghapus cerita "${o}" dari penyimpanan lokal?`))try{const n=await this.storyModel.deleteStoryFromIndexedDB(a);if(n.error){alert(n.message);return}i.target.closest(".story-item-container").remove();const u=document.querySelector("#saved-stories-list");u.children.length===0&&(u.innerHTML=`
                <div class="empty-state" role="alert">
                  <p>Tidak ada cerita tersimpan</p>
                  <a href="#/" class="btn btn-primary">Jelajahi Cerita</a>
                </div>
              `),alert("Cerita berhasil dihapus dari penyimpanan lokal")}catch(n){console.error("Error deleting story:",n),alert("Terjadi kesalahan saat menghapus cerita")}})})}}const ce={"/":$,"/about":j,"/detail/:id":Q,"/add":ie,"/login":ae,"/register":oe,"/notification":ne,"/saved":se};var g,m,h,C,_;class le{constructor({navigationDrawer:e,drawerButton:t,content:i}){k(this,C);k(this,g,null);k(this,m,null);k(this,h,null);v(this,g,i),v(this,m,t),v(this,h,e),I(this,C,_).call(this)}get content(){return c(this,g)}async renderPage(){if(!c(this,g))if(console.error("CRITICAL: App's content element is null. Cannot render page."),v(this,g,document.querySelector("#main-content")),c(this,g))console.log("Found #main-content element after retry.");else{console.error("CRITICAL: Still cannot find #main-content element after retry.");return}try{const e=J(),t=new ce[e];document.startViewTransition?document.startViewTransition(async()=>{c(this,g).innerHTML=await t.render(),await t.afterRender()}):(c(this,g).innerHTML=await t.render(),await t.afterRender())}catch(e){console.error("Error in App.renderPage:",e)}}}g=new WeakMap,m=new WeakMap,h=new WeakMap,C=new WeakSet,_=function(){c(this,m).addEventListener("click",()=>{const e=c(this,h).classList.toggle("open");c(this,m).setAttribute("aria-expanded",e?"true":"false")}),document.body.addEventListener("click",e=>{!c(this,h).contains(e.target)&&!c(this,m).contains(e.target)&&(c(this,h).classList.remove("open"),c(this,m).setAttribute("aria-expanded","false")),c(this,h).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&(c(this,h).classList.remove("open"),c(this,m).setAttribute("aria-expanded","false"))})}),c(this,m).addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),c(this,m).click())}),document.addEventListener("keydown",e=>{e.key==="Escape"&&c(this,h).classList.contains("open")&&(c(this,h).classList.remove("open"),c(this,m).setAttribute("aria-expanded","false"))})};document.addEventListener("DOMContentLoaded",()=>{typeof L<"u"&&(L.Icon.Default.prototype.options.iconUrl="/images/leaflet/marker-icon.svg",L.Icon.Default.prototype.options.shadowUrl="/images/leaflet/marker-shadow.svg",L.Icon.Default.prototype.options.iconSize=[25,41],L.Icon.Default.prototype.options.shadowSize=[41,41])});const de=()=>{const r=document.querySelector(".skip-link");r&&r.addEventListener("click",e=>{e.preventDefault();const t=document.querySelector("#main-content");t&&(t.focus(),t.scrollIntoView())})};document.addEventListener("DOMContentLoaded",async()=>{const r=document.querySelector("#main-content"),e=document.querySelector("#drawer-button"),t=document.querySelector("#navigation-drawer");if(!r){console.error("CRITICAL: Main content element #main-content not found. App cannot render.");return}(!e||!t)&&console.error("CRITICAL: Navigation elements not found. App may not function properly.");const i=new le({content:r,drawerButton:e,navigationDrawer:t});de();try{await b.initializeNotifications()}catch(a){console.error("Failed to initialize push notifications:",a)}try{await i.renderPage()}catch(a){console.error("Error during initial page render:",a)}window.addEventListener("hashchange",async()=>{try{document.startViewTransition?document.startViewTransition(async()=>{await i.renderPage();const a=document.querySelector("#main-content");a&&a.focus()}):await i.renderPage()}catch(a){console.error("Error during hashchange page render:",a)}})});
