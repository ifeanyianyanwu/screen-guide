import { HeroCarousel } from "./_components/hero-carousel";

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <div className="container mx-auto px-4">
        {[...Array(20)].map((_, i) => (
          <p key={i} className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
            dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed
            auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in
            nulla enim. Phasellus molestie magna non est bibendum non venenatis
            nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris
            iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
            Proin quis tortor orci. Etiam at risus et justo dignissim congue.
            Donec congue lacinia dui, a porttitor lectus condimentum laoreet.
            Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum
            faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla
            at nulla justo, eget luctus tortor.
          </p>
        ))}
      </div>
    </main>
  );
}
