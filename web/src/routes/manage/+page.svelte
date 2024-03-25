<script>
    import { onMount } from 'svelte';

        onMount(async () => {
        const valres = await fetch('http://localhost:3000/validate', {
            method: 'POST',
            headers: { 
            'Accept': 'application/json',
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": localStorage.getItem('username'),
                "token": localStorage.getItem('token')
            })
            });

        const json = await valres.json();
        console.log(JSON.stringify(json));
    });


</script>

<main>

</main>