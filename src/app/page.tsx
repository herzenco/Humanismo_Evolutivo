"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import PageWrapper from "@/components/layout/PageWrapper";
import HomeEditorial from "@/components/design/HomeEditorial";
import HeroSection from "@/components/home/HeroSection";
import VideoSection from "@/components/home/VideoSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedBooksCarousel from "@/components/home/FeaturedBooksCarousel";
import PodcastSection from "@/components/home/PodcastSection";
import DownloadSection from "@/components/home/DownloadSection";

const Index = () => {
  const { language } = useLanguage();

  return (
    <PageWrapper>
      {language === "es" ? <HomeEditorial /> : <>
      <HeroSection />
      <AboutSection />
      <VideoSection />
      <FeaturedBooksCarousel />
      <PodcastSection />
      <DownloadSection />
      </>}
    </PageWrapper>
  );
};

export default Index;
