<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import AddItem from '$lib/components/AddItem.svelte';
	import { createEventDispatcher, getContext } from 'svelte';
    import { Trash2Icon } from "svelte-feather-icons";
	import type { PageData } from './$types';

    let data: PageData = getContext("data")

    $: userId = data.user?.userId;
    $: activeBoardId = data.userPreferences?.activeBoardId
    $: boards = data.userData?.boards

    let editing = false;

    const dispatch =  createEventDispatcher();

    function activeChange(boardId: number) {
        dispatch("activeChange", {
            boardId
            }
        )
    }

    async function setActiveBoard(userId: string, boardId: number) {
        const res = await fetch("/preferences/activeBoard", {
            method: "POST",
            body: JSON.stringify({ userId, boardId } ),
            headers: {
                "content-type": "preferences/json"
            }
        })
    }

    function refresh() {
        return async({ update }) => {
            update({ reset: false })
        }
    }
</script>

<div id="sidebar">
    <h3>Boards</h3>
    <nav>
        {#if boards && userId}
            <ul>
                {#each boards as board}
                    <li class:active={activeBoardId === board.id}>
                        <form class="edit" action="?/editBoard&boardId={board.id}" method="POST" 
                            use:enhance={refresh} on:mouseup={setActiveBoard(userId, board.id)}>
                            <input type="text" value={board.title} name="boardTitle" readonly={editing === false}
                                on:dblclick={() => editing = true}
                                on:focusout={() => editing = false}>
                        </form>
                        <form class="delete" action="?/removeBoard&userId={userId}" method="POST" 
                            use:enhance={refresh}>
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
        transition: background-color 0s;

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
    

