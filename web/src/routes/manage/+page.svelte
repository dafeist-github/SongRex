<script>
    import { onMount } from 'svelte';

    let songs = [];

    onMount(async () => {

        //Get required data for this page
        const res = await fetch('http://localhost:3000/reqdata', {
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

        songs = await res.json();

    });


</script>

<main>

    <p class="info">Songwünsche</p>

    <ul>
      {#each songs as item}
      <div class="element">

        <li class="item">
          <p class="songname">{item.name}</p>
          <a href={item.link} target="_blank" class="songlink">{item.link}</a>
        </li>

      </div>
      {/each}
    </ul>

</main>

<style>

  .info {
    font-size: 2.6vw;
    font-family: Arial;
    color: rgb(142, 238, 255);
    text-align: center;
    margin-top: 100px;
    margin-bottom: 0px;
  }

  .element {
    display: inline-block;
    font-size: 1.4vw;
    width: 50vw;
    height: 2vw;
    margin-top: 0vw;
  }

  .songname {
    display: inline-block;
  }

  .songlink {
    display: inline-block;
  }

  @media screen and (max-width: 800px) {
    .info {
      font-size: 10vw;
    }
  }

</style>