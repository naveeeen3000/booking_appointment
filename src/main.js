import './assets/main.css'
import 'v-calendar/style.css';
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

const app = createApp(App);

app.use(setupCalendar, {});
app.component('VCalendar', Calendar);
app.component('VDatePicker', DatePicker);

app.use(router);

app.mount('#app')
