<script>
	import { setContext } from 'svelte';

    export let data;
    $: console.log(data)

    setContext("data", data)
</script>
