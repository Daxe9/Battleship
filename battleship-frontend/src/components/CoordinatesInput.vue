<script setup lang="ts">
import {ref} from "vue";

const emit = defineEmits(["coordinates"]);
const x = ref<number>();
const y = ref<number>();

function submit() {
    if (x.value === undefined) return;
    if (y.value === undefined) return;

    emit("coordinates", {x: x.value, y: y.value});
    x.value = undefined;
    y.value = undefined;

}
</script>
<template>
    <div id="container">
        <form @submit.prevent="submit">
            <div class="inner-container">
                <label for="x">X</label>
                <input type="number" id="x" v-model="x" min="0" placeholder="0" max="9">
            </div>
            <div class="inner-container">
                <label for="y">Y</label>
                <input type="number" id="y" v-model="y" min="0" max="9" placeholder="0">
            </div>
            <button type="submit">Submit</button>

        </form>
    </div>
</template>


<style scoped>
#container {
    margin: 10vh
}

.inner-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}


</style>