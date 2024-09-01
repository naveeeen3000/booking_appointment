<template>
    <div class="flex flex-row justify-center shadow-xl p-10">
        <div class="info-tab-left basis-1/4 flex flex-col justify-evenly">
            <div class="heading">
                <h1 class="text-lg font-semibold">John's appointment</h1>
                <div class="duration font-semibold">
                    <input type="number" v-model="duration" :min="30" :max="90" class="border-2 rounded-md w-20" :value="duration"> Mins
                </div>
                <div class="selected-date font-semibold">
                    {{ formattedDate }}
                </div>
            </div>
            <RouterLink to="/events" class="p-3 rounded-lg text-center border-2 w-40 border-inherit">Go to Events</RouterLink>
        </div>
        <div class="calendar basis-1/2 flex flex-col justify-between">
            <div class="heading">
                <h2 class="text-xl font-semibold p-5 pt-0">Select Date & time of appointment</h2>
                <VDatePicker
                    v-model="selectedDate"
                    :allowed-dates="disabledDates"
                    expanded
                />
            </div>
            <div class="timezone-picker relative inline-block w-full">
                <select v-model="timezone" class="block w-full px-4 py-2 pr-8
                     bg-white border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 
                     focus:border-indigo-500 appearance-none"
                >
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    <option value="America/New_York">Eastern Standard Time (EST)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="America/Los_Angeles">Pacific Standard Time (PST)</option>
                    <option value="Australia/Sydney">Australian Eastern Standard Time (AEST)</option>
                </select>
            </div>
        </div>
        <div class="basis-1/4 flex felx-col justify-center">
            <Slots :date="selectedDate" :duration="duration" :timezone="timezone" :key="compoundSlotKey" />
        </div>
    </div>
</template>

<script>
import moment from "moment";
import Slots from "./slots.vue";
const DURATION = 30 // mins

export default {
    data(){
        return {
            selectedDate: new Date(),
            disabledDates: [{to: new Date()}],
            duration: 30,
            timezone: "Asia/Kolkata"
        }
    },
    computed: {
        formattedDate() {
            if (!this.selectedDate)
                return "Select a date"
            return moment(this.selectedDate).format("ddd. Do MMM, YYYY")
        },
        compoundSlotKey() {
            return `${moment(this.selectedDate).format("YYYY-MM-DD")}-${this.timezone}`
        }
    },
    components: {
        Slots,
    }
}
</script>
