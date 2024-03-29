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

          <p class="songname">{item.name}</p>

      </div>

      <div class="element">
        <a href={item.link} target="_blank" class="songlink" style="font-style: italic;">{item.link}</a>
      </div>
      {/each}
    </ul>

</main>

<style>

@media screen and (min-width: 801px) {

  .info {
    font-size: 2.6vw;
    font-family: Arial;
    color: rgb(142, 238, 255);
    text-align: center;
    margin-top: 100px;
    margin-bottom: 0px;
  }

  .element {
    font-size: 1.4vw;
    width: 90vw;
    height: 1.4vw;
    margin-top: 0vw;
    color: rgb(218, 216, 216);
    font-family: Arial;
    display: block;
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }

  .songname {
    display: inline-block;
    margin-left: 6vw;
    width: 50vw;
  }

  .songlink {
    margin-left: 56vw;
    display: inline-block;
    color: inherit;
    width: 40vw;
    color: rgb(94, 145, 223);
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    font-style: italic;
  }

}

  @media screen and (max-width: 800px) {

    .info {
      font-size: 10vw;
      font-family: Arial;
      color: rgb(142, 238, 255);
      text-align: center;
      margin-top: 100px;
      margin-bottom: 0px;
    }

    .element {
      font-size: 7.2vw;
      color: rgb(218, 216, 216);
      font-family: Arial;
      width: 75vw;
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
    }

    .songname {
      margin-left: 0vw;
      height: 10px;
      margin-bottom: 5vw;
    }

    .songlink {
      color: inherit;
      color: rgb(94, 145, 223);
      font-size: 5.6vw;
    }
    

  }

</style>