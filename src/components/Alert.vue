<template>
    <div v-if="visible && message.length" class="fixed top-4 right-4 p-4 bg-red-500 text-white transition ease-in-out delay-100 rounded-lg shadow-lg z-50 max-w-sm">
        <p>{{ message }}</p>
    </div>
  </template>
  
<script>
export default {
    props: {
        message: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            default: 5000
        }
    },
    data() {
        return {
            visible: true
        };
    },
    mounted() {
        this.autoClose();
    },
    methods: {
        autoClose() {
        setTimeout(() => {
            this.visible = false;
        }, this.duration);
        }
    }
};
</script>