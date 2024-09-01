<template>
    <div class="events-container flex flex-row justify-evenly">
        <div class="date-picker flex flex-col justify-evenly">
            <VDatePicker
                v-model.range="range"
            />
            <RouterLink to="/" class="p-3 rounded-lg text-center border-2 border-inherit font-semibold">Go To Book</RouterLink>
        </div>
        <div class="appointments flex flex-col justify-start overflow-auto">
            <h1 class="text-xl font-semibold pb-10">Appointments</h1>
            <div v-if="this.events.length" class="events flex flex-row" v-for="event in events" :key="`${event.startTime}-${event.endTime}`">
                <div class="event flex flex-col rounded pb-10">
                    <div class="heading">
                        <h1 class="text-lg font-semibold">Dr. {{ event.doctor }}</h1>
                    </div>
                    <div class="event-body flex flex-row justify-between">
                        <span class="font-semibold pr-10">Booked For: {{ event.date }}</span>
                        <span class="font-semibold pr-10">SlotTime: {{ event.startTime }} - {{ event.endTime }} ({{ event.timezone }})</span>
                    </div>
                </div>
            </div>
            <div v-else class="text-lg font-semibold">No Appointments for the selected range</div>
        </div>
    </div>
    <Alert :message="alert" />
</template>

<script>
import { ref } from 'vue';
import {getEvents} from "@/api.js";
import Alert from "@/components/Alert.vue";
import moment from "moment";

export default {
    data(){
        return {
            range: {
                start: new Date(),
                end: new Date(),
            },
            events: [],
            alert: ""
        }
    },
    components: {
        Alert
    },
    watch: {
        range(newRange, oldRange){
            this.fetchEvents()
        }
    },
    created(){
        if (this.range)
            this.fetchEvents()
    },
    methods: {
        async fetchEvents(){
            try{
                const {start, end} = this.range;
                const startTimeStr = moment(start).format("YYYY-MM-DD");
                const endTimeStr = moment(end).format("YYYY-MM-DD");
                const data = await getEvents(startTimeStr, endTimeStr);
                const formattedData = [];
                data.forEach(event => {
                    formattedData.push({
                        date: moment(event.date, "YYYY-MM-DD").format("ddd. Do MMM, YYYY"),
                        startTime: moment(event.startTime, "hh:mm:ss").format("hh:mm A"),
                        endTime: moment(event.endTime, "hh:mm:ss").format("hh:mm A"),
                        doctor: event.doctor,
                        timezone: event.timezone
                    })
                });
                this.events = formattedData;
            } catch(err){
                console.log(err)
                this.alert = err.message ? err.message : "Something went wrong";
            }
        }
    }
}
</script>

<style scoped>
.appointments{
    height: 80vh;
}
.events {
    width: 100%;
}
</style>