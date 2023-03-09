<script>
	import Header from "./Header.svelte";

</script>

<header>
    <nav>
        <ul>
            <li>
                <h1><a href="/">SvelteBan</a></h1>
            </li>
        </ul>
        <ul>
            <li><a href="/register">Register</a></li>
            <li><a href="/login">Login</a></li>
        </ul>
    </nav>
    
</header>


<slot></slot>