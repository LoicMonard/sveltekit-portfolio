<script>
  import "../app.css";
</script>

<style>
  .header-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 128px;
    background: linear-gradient(
      to bottom,
      #0e1014 0%,
      #0e1014 60%,
      rgba(14, 16, 20, 0) 100%
    );
    -webkit-mask-image: radial-gradient(
      circle at 2px 2px,
      transparent 1px,
      black 1px
    );
    mask-image: radial-gradient(
      circle at 2px 2px,
      transparent 1px,
      black 1px
    );
    -webkit-mask-size: 4px 4px;
    mask-size: 4px 4px;
    z-index: 40;
  }

  .header-blur {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    backdrop-filter: blur(2px);
    background: linear-gradient(
      to bottom,
      rgba(14, 16, 20, 0.5) 0%,
      rgba(14, 16, 20, 0) 100%
    );
    -webkit-backdrop-filter: blur(5px);
    z-index: 39;
  }

  .header-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: transparent;
  }
</style>

<div class="header-blur"></div>
<div class="header-background"></div>
<header class="header-content">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between h-32 items-center">
      <a href="/" class="text-white font-bold text-xl">
        MonPortfolio
      </a>

      <nav class="flex space-x-8">
        <a href="/" class="text-white hover:text-red-500 px-3 py-2">
          Accueil
        </a>
        <a href="/about" class="text-white hover:text-red-500 px-3 py-2">
          À propos
        </a>
        <a href="/projects" class="text-white hover:text-red-500 px-3 py-2">
          Projets
        </a>
        <a href="/contact" class="text-white hover:text-red-500 px-3 py-2">
          Contact
        </a>
      </nav>
    </div>
  </div>
</header>

<main class="pt-32">
  <slot />
</main>