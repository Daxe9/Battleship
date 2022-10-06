<script lang="ts" setup>
const props = defineProps({
    color: String,

})
</script>

<template>
    <div class="cell" :class="props.color"/>
</template>

<style scoped>
.cell {
    background-color: rgba(0, 255, 0, 0.03);
    width: 2.5vw;
    height: 2.5vw;
    min-width: 20px;
    min-height: 20px;
    max-width: 40px;
    max-height: 40px;
    border: 1px solid green;
    border-radius: 30%;
    margin: 0.5px;
    font-weight: bold;
}

.red {
    background-color: rgba(255, 0, 0, 0.03);
    border-color: red;
}

.green {
    background-color: rgba(0, 255, 0, 0.03);
    border-color: green;
}

.orange {
    background-color: rgba(255, 165, 0, 0.03);
    border-color: orange;
}

.blue {
    background-color: rgba(0, 0, 255, 0.03);
    border-color: blue;
}

</style>