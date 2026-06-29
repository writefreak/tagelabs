import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ui/scroll-top";
import Reviews from "@/components/Reviews";
import RecentBlogs from "@/components/recent-blogs";

export default function Home() {
  return (
    <main>
      {/* <Navbar/> */}
      <ScrollToTop />
      <Hero />
      <About />
      <Services />
      <Work />
      <RecentBlogs />
      <Reviews />
      <Contact />
      {/* <Footer/> */}
    </main>
  );
}
