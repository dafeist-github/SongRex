<script>
  import { onMount } from "svelte";

  let songs = [];

  onMount(async () => {
    //Get required data for this page
    const res = await fetch("http://localhost:3000/reqdata", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        token: localStorage.getItem("token"),
      }),
    });

    songs = await res.json();
  });

  async function deleteSong(name, link) {
    const res = await fetch("http://localhost:3000/deletesong", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        token: localStorage.getItem("token"),
        songname: name,
        songlink: link
      }),
    });

    if ((await res.json()).done) {
      console.log('deleted song: ' + name);
      const res = await fetch("http://localhost:3000/reqdata", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          token: localStorage.getItem("token"),
        }),
      });

      songs = await res.json();
    }
  }
</script>

<main>

  <a href="/" class="back">Zurück</a>

  <p class="info">Songwünsche</p>

  <ul>
    {#each songs as item}
      <hr class="hr" />

      <div class="element">
        <button
          class="delete-button"
          on:click={() => deleteSong(item.name, item.link)}>&#10060;</button
        >
      </div>

      <div class="element">
        <p class="songname">{item.name}</p>
      </div>

      <div class="element">
        <a
          href={item.link}
          target="_blank"
          class="songlink"
          style="font-style: italic;">{item.link}</a
        >
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

    .back {
      font-size: 1.8vw;
      width: 26vw;
      margin-left: 68vw;
      font-family: Arial;
      color: white;
      border-radius: 10px;
      background-color: rgb(57, 117, 233);
      padding-left: 4vw;
      padding-right: 4vw;
      padding-bottom: 1vw;
      padding-top: 1vw;
      text-decoration: none;
    }

    .element {
      font-size: 1.4vw;
      width: 96vw;
      height: 1.4vw;
      margin-top: 0vw;
      color: rgb(218, 216, 216);
      font-family: Arial;
      display: block;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      margin-right: 0;
    }

    .hr {
      margin-bottom: -1.6vw;
      margin-top: 1.6vw;
      margin-left: -6.2vw;
      margin-right: 4vw;
    }

    .delete-button {
      display: inline-block;
      width: 2vw;
      font-size: 1.62vw;
      margin-left: 2.6vw;
      margin-top: 2.34vw;
      background: none;
      border: none;
      cursor: pointer;
    }

    .songname {
      display: inline-block;
      margin-left: 6vw;
      width: 46vw;
      text-overflow: ellipsis;
      text-wrap: nowrap;
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

    .back:hover {
      background-color: rgb(31, 89, 204);
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

    .back {
      font-size: 5vw;
      margin-left: 64.2vw;
    }

    .element {
      font-size: 7.2vw;
      color: rgb(218, 216, 216);
      font-family: Arial;
      width: 85vw;
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      margin-left: -5vw;
    }

    .hr {
      margin-bottom: -5vw;
      margin-top: 5vw;
      margin-left: -6.2vw;
      margin-right: 4vw;
    }

    .delete-button {
      width: 2vw;
      font-size: 8.62vw;
      margin-top: 7.34vw;
      margin-left: -2vw;
      background: none;
      border: none;
      cursor: pointer;
    }

    .songname {
      margin-left: -0vw;
      height: 12px;
      margin-bottom: 5vw;
      margin-top: 1vw;
    }

    .songlink {
      color: inherit;
      color: rgb(94, 145, 223);
      font-size: 5.6vw;
    }
  }
</style>
