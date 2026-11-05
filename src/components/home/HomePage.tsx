"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import HomeEditorial from "@/components/design/HomeEditorial";
import WelcomeVideoOverlay from "@/components/home/WelcomeVideoOverlay";

const Index = () => {
  return (
    <PageWrapper>
      <WelcomeVideoOverlay />
      <HomeEditorial />
    </PageWrapper>
  );
};

export default Index;
