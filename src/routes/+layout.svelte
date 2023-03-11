<script lang="ts">
    import "@fontsource/poppins"
    import "../styles.css"
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { SunIcon, MoonIcon } from "svelte-feather-icons"

    let theme: string;
    let themeChecked = false;

    onMount(async() => {
        const storedTheme = localStorage.getItem("theme")
        theme = storedTheme === "dark" ? "dark" : "light";
        themeChecked = true;
    })

    $: if (browser && themeChecked) localStorage.setItem("theme", theme)

    export let data;
</script>

{#if theme}
    <header>
        <nav>
            <ul>
                <li>
                    <h1><a href="/">SvelteBan</a></h1>
                </li>
            </ul>
            <ul>
                <li>
                    <label for="light-theme">
                        <div class="icon-wrapper">
                            <SunIcon></SunIcon>
                        </div>
                        <input type="radio" name="theme" value="light" id="light-theme" bind:group={theme}>
                    </label>
                    <label for="dark-theme">
                        <div class="icon-wrapper">
                            <MoonIcon></MoonIcon>
                        </div>
                        <input type="radio" name="theme" value="dark" id="dark-theme" bind:group={theme}>
                    </label>

                </li>
            {#if !data.user}
                <li><a href="/register">Register</a></li>
                <li><a href="/login">Login</a></li>
            {:else}
            <li><a href="/boards">Boards</a></li>
            <li>
                <form action="/logout" method="POST">
                    <button type="submit">Logout</button>
                </form>
            {/if}
            </ul>
        </nav>
    </header>
{/if}


<slot></slot>

<style lang="scss">
    header nav {
        padding-inline: var(--pd-page-inline);
        padding-block: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--bg-surface);
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);

        ul {
            display: flex;
            align-items: center;
            gap: 1em;

            .icon-wrapper {
                display: flex;
            }
        }
    }

    label {
        cursor: pointer;

        &:has(input:checked) {
            display: none
        }

        input {
            display: none
        }
    }

  
</style>