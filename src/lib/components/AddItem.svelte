<script lang="ts">
	import { browser } from "$app/environment";
    import { enhance } from "$app/forms";
    import { PlusCircleIcon } from "svelte-feather-icons";

    export let styles: string;
    export let action: string;

    let addingItem = false;
    let input: HTMLElement;

    $: if (input) input.focus();
</script>

{#if browser}
    <div class="addItem" style={styles}>
        {#if addingItem}
            <form class="create-item" action={action} method="POST" use:enhance>
                <input type="text" name="itemTitle" bind:this={input}
                    on:focusout={() => addingItem = false}>
            </form>
        {/if}
        <button on:click={() => addingItem = true}>
            <PlusCircleIcon size="20"></PlusCircleIcon>
        </button>
    </div>
{/if}

<style lang="scss">
    input {
        background-color: var(--bg-input);
        outline: thick double var(--clr-on-accent);
    }
    button {
        margin-top: 8px;
        text-align: left;
        display: flex;
        
        &:focus {
            outline: thick double var(--clr-on-accent);
            }
    }
</style>