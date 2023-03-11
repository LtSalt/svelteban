<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import AddItem from '$lib/components/AddItem.svelte';
	import { setContext } from 'svelte';
    import { Trash2Icon } from "svelte-feather-icons";

    export let data;
    setContext("data", data)

    $: userId = data.user?.userId;
    $: activeBoardId = data.userPreferences?.activeBoardId
    $: boards = data.userData?.boards

    let editing = false;

    async function setActiveBoard(userId: string, boardId: number) {
        const res = await fetch("/preferences/activeBoard", {
            method: "POST",
            body: JSON.stringify({ userId, boardId } ),
            headers: {
                "content-type": "preferences/json"
            }
        })
    }

    $: console.log(activeBoardId)
</script>

<div id="sidebar">
    <h3>Boards</h3>
    <nav>
        {#if boards && userId}
            <ul>
                {#each boards as board}
                    <li class:active={activeBoardId === board.id}>
                        <form class="edit" action="?/editBoard&boardId={board.id}" method="POST" use:enhance on:mouseup={setActiveBoard(userId, board.id)}>
                            <input type="text" value={board.title} name="boardTitle" readonly={editing === false}
                                on:dblclick={() => editing = true}
                                on:focusout={() => editing = false}>
                        </form>
                        <form class="delete" action="?/removeBoard&userId={userId}" method="POST" use:enhance>
                            <input type="text" name="boardId" value={board.id} hidden>
                            <button type="submit">
                                <Trash2Icon size=16></Trash2Icon>
                            </button>
                        </form>
                    </li>
                {/each}
            </ul>
        {/if}
        {#if userId}
            <AddItem styles="" action="?/createBoard&userId={userId}"></AddItem>
        {/if}
    </nav>
</div>

<style lang="scss">

    .active {
        background-color: var(--bg-accent-1);
        color: var(--clr-on-accent);
    }
    #sidebar {
        background-color: var(--bg-surface);
        width: 12rem;
        // box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
        // z-index: -99;
    }

    li {
        // padding-inline: 12px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;

        input {
            cursor: pointer;
        }

        .delete {

            button {
                padding-inline: 12px;

            }
            // width: 20px;
        }

        .edit {
            flex: 1;

            > input {
                width: 100%;
            }
        }
    }
</style>
    

