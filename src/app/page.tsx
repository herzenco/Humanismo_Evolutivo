"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import PageWrapper from "@/components/layout/PageWrapper";
import HeroSection from "@/components/home/HeroSection";
import VideoSection from "@/components/home/VideoSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedBooksCarousel from "@/components/home/FeaturedBooksCarousel";
import PodcastSection from "@/components/home/PodcastSection";
import DownloadSection from "@/components/home/DownloadSection";
import WelcomeVideoOverlay from "@/components/home/WelcomeVideoOverlay";

const Index = () => {
  useLanguage();

  return (
    <PageWrapper>
      <WelcomeVideoOverlay />
      <HeroSection />
      <AboutSection />
      <VideoSection />
      <FeaturedBooksCarousel />
      <PodcastSection />
      <DownloadSection />
    </PageWrapper>
  );
};

export default Index;
