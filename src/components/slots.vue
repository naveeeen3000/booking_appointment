<template>
    <div class="slot h-80 overflow-y-auto overflow-x-hidden">
        <div v-if="this.slots.length" class="slots flex flex-col justify-evenly overflow-auto w-56">
            <div 
                v-for="time in slots" :key="time"
                class="p-3 rounded-lg text-center border-2 border-inherit"
                :class="{'bg-blue-600 text-white': selectedSlot === time}"
                @click="onSlotClick(time)"
            >
                <span class="text-md font-semibold pr-2 select-none">{{ time }}</span>
                <button 
                    v-if="selectedSlot === time" 
                    class="bg-white text-black pl-2 pr-2 pt-1 pb-1 rounded-lg transition ease-in-out delay-100"
                    @click="onSlotConfirm(time)"
                ><span class="font-semibold">Confirm</span></button>
            </div>
        </div>
        <div v-else>No slots avaiable</div>
    </div>
    <div v-if="isModalOpen" class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-5 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Confirmed Slot</h2>
        <p>Slot confirmed for {{ confirmedSlotData.selectedDateStr }}, at {{ confirmedSlotData.timeStr }}.</p>
        <p>Timezone: {{ confirmedSlotData.timezone }}</p>
        <div class="mt-4 flex justify-end">
          <button @click="closeModal" class="bg-blue-500 text-white px-4 py-2 rounded">close</button>
        </div>
      </div>
    </div>
    <Alert :message="alert" />
</template>

<script>
import {getFreeSlots, bookSlot} from "../api.js";
import moment from "moment-timezone";
import Alert from "./Alert.vue"

export default {
    props: {
        date: Date,
        timezone: String,
        duration: Number
    },
    data() {
        return {
            slots: [],
            selectedSlot: null,
            isModalOpen: false,
            confirmedSlotData: null,
            alert: ""
        }
    },
    created() {
        if (this.date)
            this.fetchSlots();
    },
    components: {
        Alert
    },
    methods: {
        async onSlotConfirm(time){
            try{
                const selectedDateStr = moment(this.date).format("YYYY-MM-DD");
                const timeStr = moment(time, "HH:mm A").format("HH:mm:ss");
                const status = await bookSlot(selectedDateStr, timeStr, this.timezone, this.duration);
                this.isModalOpen = true;
                this.confirmedSlotData = {
                    selectedDateStr,
                    timeStr,
                    timezone: this.timezone
                }
            } catch(err) {
                console.log(err.message ? err.message : err)
                this.alert = err.message ? err.message : "Something went wrong"
            }
        },
        onSlotClick(time){
            this.selectedSlot = this.selectedSlot && this.selectedSlot == time ? null : time
        },
        async fetchSlots(){
            try{
                const selectedDateStr = moment(this.date).format("YYYY-MM-DD");
                const data = await getFreeSlots(selectedDateStr, this.timezone);
                this.slots = data
                if (!data.length)
                    this.alert = "No Slots Available"
            } catch(err){
                console.log(err)
                this.alert = err.message ? err.message : "Something went Wrong";
                return []
            }
        },
        async closeModal(){
            this.isModalOpen = false
            this.confirmedSlotData = null
            await this.fetchSlots()
        }
    }
}

</script>