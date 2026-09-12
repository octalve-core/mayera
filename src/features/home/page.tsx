import { Hero } from "./components/hero";
import { TrustStrip } from "./components/trust-strip";
import { FeaturedProduct } from "./components/featured-product";
import { Ritual } from "./components/ritual";
import { LengthRetention } from "./components/length-retention";
import { Ingredients } from "./components/ingredients";
import { BrandStory } from "./components/brand-story";
import { JournalPreview } from "./components/journal-preview";
import { Newsletter } from "./components/newsletter";
import { MayeraStories } from "./components/mayera-stories";
import { SocialGallery } from "./components/social-gallery";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedProduct />
      <Ritual />
      <LengthRetention />
      <Ingredients />
      <MayeraStories />
      <BrandStory />
      <JournalPreview />
      <SocialGallery />
      <Newsletter />
    </>
  );
}
